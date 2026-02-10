import type { VercelRequest, VercelResponse } from "@vercel/node";

type HeroStatRow = {
  hero: string;
  playtimeSeconds: number;
  gamesPlayed: number;
  gamesWon: number;
  winRatePercent: number | null;

  eliminationsPer10: number | null;
  deathsPer10: number | null;
  heroDamagePer10: number | null;
  healingPer10: number | null;
};

type PlayerSearchRow = {
  player_id?: string;
  name?: string;
  title?: string | null;
  avatar?: string | null;
  namecard?: string | null;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function safeObj(v: unknown): Record<string, unknown> {
  return isRecord(v) ? v : {};
}

function toNumberOrNull(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function toInt(v: unknown, fallback = 0): number {
  const n = toNumberOrNull(v);
  if (n === null) return fallback;
  return Math.floor(n);
}

function getByAnyKey(obj: Record<string, unknown>, keys: string[]): unknown {
  for (const k of keys) {
    if (k in obj) return obj[k];
  }
  return undefined;
}

function normalizeGamemode(v: unknown): "competitive" | "quickplay" {
  const s = typeof v === "string" ? v.trim().toLowerCase() : "";
  return s === "quickplay" ? "quickplay" : "competitive";
}

/**
 * ✅ 핵심: OverFast /players 응답이
 *  - [ ... ] 배열일 수도 있고
 *  - { total, results: [...] } 객체일 수도 있음
 */
function parsePlayersResponse(json: unknown): PlayerSearchRow[] {
  if (Array.isArray(json)) return json as PlayerSearchRow[];

  const obj = safeObj(json);
  const results = obj["results"];
  if (Array.isArray(results)) return results as PlayerSearchRow[];

  return [];
}

function pickPlayerId(args: {
  candidates: PlayerSearchRow[];
  originalHashTag: string; // limuzene#3992
  dashTag: string; // limuzene-3992
}): string | null {
  const { candidates, originalHashTag, dashTag } = args;

  const exactByName = candidates.find(
    (c) => typeof c?.name === "string" && c.name.toLowerCase() === originalHashTag.toLowerCase()
  );
  if (exactByName?.player_id) return exactByName.player_id;

  const exactById = candidates.find(
    (c) => typeof c?.player_id === "string" && c.player_id.toLowerCase() === dashTag.toLowerCase()
  );
  if (exactById?.player_id) return exactById.player_id;

  // ✅ 요즘은 total=1 + nameOnly + hashed player_id 케이스가 많아서 단일 후보면 채택
  if (candidates.length === 1 && candidates[0]?.player_id) return candidates[0].player_id;

  return null;
}

async function fetchTextWithMeta(url: string, headers: Record<string, string>) {
  const resp = await fetch(url, { headers });
  const text = await resp.text();
  const contentType = resp.headers.get("content-type") ?? "";
  return {
    ok: resp.ok,
    status: resp.status,
    contentType,
    text,
  };
}

// ---------- hero extraction (현재 네 stats.ts에서 성공하던 방식 유지) ----------

function looksLikeHeroKey(key: string): boolean {
  const k = key.trim();
  if (k.length < 2 || k.length > 32) return false;
  return /^[a-z0-9\-_]+$/.test(k);
}

function scoreStatsLeaf(obj: Record<string, unknown>): number {
  const hasTime =
    getByAnyKey(obj, ["time_played", "timePlayed", "time", "playtime", "playtime_seconds"]) !== undefined;
  const hasGames = getByAnyKey(obj, ["games_played", "gamesPlayed", "played", "games"]) !== undefined;
  const hasWon = getByAnyKey(obj, ["games_won", "gamesWon", "won", "wins"]) !== undefined;

  let score = 0;
  if (hasTime) score += 5;
  if (hasGames) score += 3;
  if (hasWon) score += 2;
  return score;
}

function findBestStatsLeaf(
  root: unknown,
  maxDepth = 6
): { leaf: Record<string, unknown> | null; path: string; score: number } {
  let best: { leaf: Record<string, unknown> | null; path: string; score: number } = {
    leaf: null,
    path: "",
    score: 0,
  };

  function walk(node: unknown, depth: number, path: string) {
    if (depth > maxDepth) return;
    if (!isRecord(node)) return;

    const obj = node as Record<string, unknown>;
    const score = scoreStatsLeaf(obj);
    if (score > best.score) best = { leaf: obj, path, score };

    for (const [k, v] of Object.entries(obj)) {
      const next = path ? `${path}.${k}` : k;
      walk(v, depth + 1, next);
    }
  }

  walk(root, 0, "");
  return best;
}

function extractPlaytimeSecondsFromLeaf(leaf: Record<string, unknown>): number {
  const raw = getByAnyKey(leaf, ["time_played", "timePlayed", "playtime_seconds", "playtime", "time"]);
  if (isRecord(raw)) return toInt((raw as Record<string, unknown>)["value"], 0);
  return toInt(raw, 0);
}

function extractGamesFromLeaf(leaf: Record<string, unknown>): { played: number; won: number } {
  const playedDirect = toInt(getByAnyKey(leaf, ["games_played", "gamesPlayed", "played"]), 0);
  const wonDirect = toInt(getByAnyKey(leaf, ["games_won", "gamesWon", "won", "wins"]), 0);

  const games = getByAnyKey(leaf, ["games"]);
  if (isRecord(games)) {
    const g = games as Record<string, unknown>;
    const p = toInt(getByAnyKey(g, ["played", "games_played", "gamesPlayed"]), playedDirect);
    const w = toInt(getByAnyKey(g, ["won", "wins", "games_won", "gamesWon"]), wonDirect);
    return { played: p, won: w };
  }

  return { played: playedDirect, won: wonDirect };
}

type Per10Like = {
  eliminationsPer10: number | null;
  deathsPer10: number | null;
  heroDamagePer10: number | null;
  healingPer10: number | null;
};

function scorePer10Object(obj: Record<string, unknown>): { score: number; parsed: Per10Like } {
  const elim = toNumberOrNull(
    getByAnyKey(obj, ["eliminations", "elim", "elims", "eliminations_per_10", "eliminations_per10", "eliminations_avg"])
  );
  const deaths = toNumberOrNull(
    getByAnyKey(obj, ["deaths", "death", "deaths_per_10", "deaths_per10", "deaths_avg"])
  );
  const dmg = toNumberOrNull(
    getByAnyKey(obj, [
      "hero_damage",
      "damage",
      "heroDamage",
      "damage_per_10",
      "damage_per10",
      "damage_avg",
      "damage_done",
      "damage_done_avg",
      "damage_done_per_10",
      "hero_damage_done",
      "all_damage_done",
    ])
  );
  const heal = toNumberOrNull(
    getByAnyKey(obj, [
      "healing",
      "heal",
      "heals",
      "healing_per_10",
      "healing_per10",
      "healing_avg",
      "healing_done",
      "healing_done_avg",
      "healing_done_per_10",
      "heals_done",
    ])
  );

  const present = [elim, deaths, dmg, heal].filter((v) => v !== null).length;
  const score = present >= 2 ? present * 10 : 0;

  return {
    score,
    parsed: {
      eliminationsPer10: elim,
      deathsPer10: deaths,
      heroDamagePer10: dmg,
      healingPer10: heal,
    },
  };
}

function findBestPer10Like(root: unknown, maxDepth = 7): { per10: Per10Like } {
  let bestScore = 0;
  let best: Per10Like = {
    eliminationsPer10: null,
    deathsPer10: null,
    heroDamagePer10: null,
    healingPer10: null,
  };

  function walk(node: unknown, depth: number) {
    if (depth > maxDepth) return;
    if (!isRecord(node)) return;

    const obj = node as Record<string, unknown>;

    const per10Container = getByAnyKey(obj, ["per_10_min", "per10", "per10_min", "per10min", "average", "avg"]);
    if (isRecord(per10Container)) {
      const scored = scorePer10Object(per10Container as Record<string, unknown>);
      if (scored.score > bestScore) {
        bestScore = scored.score;
        best = scored.parsed;
      }
    }

    const scoredHere = scorePer10Object(obj);
    if (scoredHere.score > bestScore) {
      bestScore = scoredHere.score;
      best = scoredHere.parsed;
    }

    for (const v of Object.values(obj)) {
      walk(v, depth + 1);
    }
  }

  walk(root, 0);
  return { per10: best };
}

function buildHeroRowFromHeroNode(heroKey: string, heroNode: unknown): HeroStatRow {
  const bestLeaf = findBestStatsLeaf(heroNode, 6);
  const leaf = bestLeaf.leaf ?? safeObj(heroNode);

  const playtimeSeconds = extractPlaytimeSecondsFromLeaf(leaf);
  const games = extractGamesFromLeaf(leaf);
  const per10 = findBestPer10Like(heroNode, 7).per10;

  const winRatePercent =
    games.played > 0 ? Math.round((games.won / games.played) * 1000) / 10 : null;

  return {
    hero: heroKey,
    playtimeSeconds,
    gamesPlayed: games.played,
    gamesWon: games.won,
    winRatePercent,
    eliminationsPer10: per10.eliminationsPer10,
    deathsPer10: per10.deathsPer10,
    heroDamagePer10: per10.heroDamagePer10,
    healingPer10: per10.healingPer10,
  };
}

function pickTopHeroes(rows: HeroStatRow[], limit: number): HeroStatRow[] {
  const filtered = rows.filter((r) => r.playtimeSeconds > 0 || r.gamesPlayed > 0);
  filtered.sort((a, b) => b.playtimeSeconds - a.playtimeSeconds);
  return filtered.slice(0, Math.max(0, limit));
}

// ---------- handler ----------

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const battleTagRaw = (req.query.battleTag as string | undefined) ?? "";
    if (!battleTagRaw.trim()) {
      return res.status(400).json({ message: "battleTag query is required" });
    }

    const originalHashTag = battleTagRaw.trim(); // limuzene#3992
    const dashTag = originalHashTag.replace("#", "-").trim(); // limuzene-3992
    const nameOnly = dashTag.includes("-") ? dashTag.split("-")[0].trim() : dashTag;

    const gamemode = normalizeGamemode(req.query.gamemode);
    const limit = toInt(req.query.limit, 10);

    const base = "https://overfast-api.tekrop.fr";
    const headers: Record<string, string> = {
      Accept: "application/json",
      "Accept-Language": "en-US,en;q=0.9",
      "User-Agent": "PlayProof/1.0 (+http://localhost)",
    };

    // ✅ 캐시(레이트리밋 방지)
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");

    // 1) player search
    const searchUrl = `${base}/players?name=${encodeURIComponent(nameOnly)}&limit=20`;
    const searchMeta = await fetchTextWithMeta(searchUrl, headers);

    let candidates: PlayerSearchRow[] = [];
    let parseError: string | null = null;

    if (searchMeta.ok) {
      try {
        const json = JSON.parse(searchMeta.text);
        candidates = parsePlayersResponse(json);
      } catch (e) {
        parseError = e instanceof Error ? e.message : String(e);
      }
    }

    const playerId = pickPlayerId({ candidates, originalHashTag, dashTag });
    if (!playerId) {
      return res.status(404).json({
        message: "Overwatch player not found",
        battleTag: dashTag,
        nameOnly,
        debug: {
          searchUrl,
          upstreamStatus: searchMeta.status,
          upstreamContentType: searchMeta.contentType,
          parseError,
          bodyPreview: searchMeta.text.slice(0, 300),
        },
      });
    }

    // 2) summary + career (gamemode 필수)
    const summaryUrl = `${base}/players/${encodeURIComponent(playerId)}/summary`;
    const careerUrl = `${base}/players/${encodeURIComponent(
      playerId
    )}/stats/career?gamemode=${encodeURIComponent(gamemode ?? "competitive")}`;

    const [summaryMeta, careerMeta] = await Promise.all([
      fetchTextWithMeta(summaryUrl, headers),
      fetchTextWithMeta(careerUrl, headers),
    ]);

    if (!summaryMeta.ok) {
      return res.status(summaryMeta.status).json({
        message: "Overwatch summary upstream error",
        battleTag: dashTag,
        resolvedPlayerId: playerId,
        upstreamStatus: summaryMeta.status,
        upstreamContentType: summaryMeta.contentType,
        upstreamBodyPreview: summaryMeta.text.slice(0, 300),
      });
    }

    if (!careerMeta.ok) {
      return res.status(careerMeta.status).json({
        message: "Overwatch career upstream error",
        battleTag: dashTag,
        resolvedPlayerId: playerId,
        upstreamStatus: careerMeta.status,
        upstreamContentType: careerMeta.contentType,
        upstreamBodyPreview: careerMeta.text.slice(0, 500),
        debug: { careerUrl, gamemode: gamemode ?? "competitive" },
      });
    }

    const summary = JSON.parse(summaryMeta.text) as Record<string, unknown>;
    const career = JSON.parse(careerMeta.text) as unknown;

    // roles/top3Heroes(있으면)
    const competitive = safeObj(summary["competitive"]);
    const pc = safeObj(competitive["pc"]);
    const roles = safeObj(pc["roles"]);

    const heroesObj = safeObj(pc["heroes"]);
    const top3Heroes = Object.entries(heroesObj)
      .map(([hero, v]) => {
        const obj = safeObj(v);
        const tp = safeObj(obj["time_played"]);
        const playtimeSeconds = toInt(tp["value"], 0);
        return { hero, playtimeSeconds };
      })
      .filter((x) => x.playtimeSeconds > 0)
      .sort((a, b) => b.playtimeSeconds - a.playtimeSeconds)
      .slice(0, 3);

    // career 최상위 hero map
    const careerRoot = safeObj(career);
    const heroEntries = Object.entries(careerRoot).filter(([k, v]) => {
      if (!looksLikeHeroKey(k)) return false;
      if (k === "all-heroes") return false;
      return isRecord(v);
    });

    const heroRows = heroEntries.map(([heroKey, heroNode]) =>
      buildHeroRowFromHeroNode(heroKey, heroNode)
    );

    const heroStatsTop = pickTopHeroes(heroRows, limit);

    return res.status(200).json({
      roles,
      top3Heroes,
      heroStatsTop,
      resolvedPlayerId: playerId,
      gamemode: gamemode ?? "competitive",
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ message: "Overwatch stats proxy error", detail });
  }
}
