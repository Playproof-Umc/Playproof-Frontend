import type { VercelRequest, VercelResponse } from "@vercel/node";

const HENRIK_BASE = "https://api.henrikdev.xyz";
const VALORANT_API_AGENTS =
  "https://valorant-api.com/v1/agents?isPlayableCharacter=true";

// --------------------
// Utilities
// --------------------
function safeNum(v: unknown, fallback = 0) {
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

function pickBoolOrNull(v: unknown): boolean | null {
  return typeof v === "boolean" ? v : null;
}

function toLowerKey(v: unknown) {
  return String(v ?? "").trim().toLowerCase();
}

function normalizeTeamFromUnknown(v: unknown): "Red" | "Blue" | null {
  if (v === "Red" || v === "Blue") return v;

  const s = toLowerKey(v);
  if (s === "red") return "Red";
  if (s === "blue") return "Blue";
  return null;
}

function pickCharacterName(raw: unknown): string {
  if (typeof raw === "string") return raw;

  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    const c =
      (typeof obj.displayName === "string" && obj.displayName) ||
      (typeof obj.name === "string" && obj.name) ||
      (typeof obj.id === "string" && obj.id) ||
      (typeof obj.uuid === "string" && obj.uuid);

    if (c) return c;
  }

  return "Unknown";
}

type UnknownRecord = Record<string, unknown>;

function asRecord(v: unknown): UnknownRecord | null {
  return v && typeof v === "object" ? (v as UnknownRecord) : null;
}

function pickAgentIconUrlFromAssets(p: UnknownRecord): string {
  const assets = asRecord(p.assets);
  const agent = assets ? asRecord(assets.agent) : null;
  return (
    (typeof agent?.small === "string" && agent.small) ||
    (typeof agent?.killfeed === "string" && agent.killfeed) ||
    (typeof agent?.bust === "string" && agent.bust) ||
    (typeof agent?.full === "string" && agent.full) ||
    (typeof agent?.displayicon === "string" && agent.displayicon) ||
    (typeof agent?.displayIcon === "string" && agent.displayIcon) ||
    ""
  );
}

async function fetchJson(url: string, headers?: Record<string, string>) {
  const r = await fetch(url, { headers });
  const json: unknown = await r.json();
  return { ok: r.ok, status: r.status, json };
}

function pickMetadata(json: unknown): UnknownRecord {
  // HenrikDev 응답은 보통 { status, data: {...} }
  const root = asRecord(json);
  const data = root ? asRecord(root.data) : null;
  return (data ? asRecord(data.metadata) : null) ?? (root ? asRecord(root.metadata) : null) ?? {};
}

function pickTeamsRoot(json: unknown): unknown {
  const root = asRecord(json);
  const data = root ? asRecord(root.data) : null;
  return data?.teams ?? root?.teams ?? null;
}

function pickPlayersRoot(json: unknown): unknown {
  const root = asRecord(json);
  const data = root ? asRecord(root.data) : null;
  return data?.players ?? root?.players ?? null;
}

/**
 * teams 형태가 (1) 객체(red/blue) or (2) 배열 로 올 수 있어서 둘 다 처리
 */
function extractTeams(teamsRoot: unknown): {
  redHasWon: boolean | null;
  blueHasWon: boolean | null;
  redRoundsWon: number | null;
  redRoundsLost: number | null;
  blueRoundsWon: number | null;
  blueRoundsLost: number | null;
} {
  // (1) 객체형
  if (teamsRoot && typeof teamsRoot === "object" && !Array.isArray(teamsRoot)) {
    const root = teamsRoot as UnknownRecord;
    const red = root.red ?? root.Red;
    const blue = root.blue ?? root.Blue;

    return {
      redHasWon: pickBoolOrNull(asRecord(red)?.has_won),
      blueHasWon: pickBoolOrNull(asRecord(blue)?.has_won),
      redRoundsWon:
        typeof asRecord(red)?.rounds_won === "number"
          ? (asRecord(red)?.rounds_won as number)
          : null,
      redRoundsLost:
        typeof asRecord(red)?.rounds_lost === "number"
          ? (asRecord(red)?.rounds_lost as number)
          : null,
      blueRoundsWon:
        typeof asRecord(blue)?.rounds_won === "number"
          ? (asRecord(blue)?.rounds_won as number)
          : null,
      blueRoundsLost:
        typeof asRecord(blue)?.rounds_lost === "number"
          ? (asRecord(blue)?.rounds_lost as number)
          : null,
    };
  }

  // (2) 배열형: [{team_id:"Red", has_won:true, ...}, ...]
  if (Array.isArray(teamsRoot)) {
    const findTeam = (name: "Red" | "Blue") =>
      teamsRoot.find(
        (t) =>
          toLowerKey(t?.team_id ?? t?.teamId ?? t?.team ?? t?.id) ===
          name.toLowerCase()
      );

    const red = findTeam("Red");
    const blue = findTeam("Blue");

    return {
      redHasWon: pickBoolOrNull(red?.has_won),
      blueHasWon: pickBoolOrNull(blue?.has_won),
      redRoundsWon: typeof red?.rounds_won === "number" ? red.rounds_won : null,
      redRoundsLost:
        typeof red?.rounds_lost === "number" ? red.rounds_lost : null,
      blueRoundsWon:
        typeof blue?.rounds_won === "number" ? blue.rounds_won : null,
      blueRoundsLost:
        typeof blue?.rounds_lost === "number" ? blue.rounds_lost : null,
    };
  }

  return {
    redHasWon: null,
    blueHasWon: null,
    redRoundsWon: null,
    redRoundsLost: null,
    blueRoundsWon: null,
    blueRoundsLost: null,
  };
}

/**
 * players를 최대한 “팀이 살아있는” 배열로 뽑는다.
 * - 1순위: players.red / players.blue (있으면 team 강제)
 * - 2순위: players.all_players
 * - 3순위: players (배열)
 */
function pickPlayersWithTeam(playersRoot: unknown): UnknownRecord[] {
  if (!playersRoot) return [];

  const root = playersRoot as UnknownRecord;
  const redArr = root.red;
  const blueArr = root.blue;

  if (Array.isArray(redArr) && Array.isArray(blueArr)) {
    return [
      ...redArr.map((p) => ({
        ...p,
        team: p?.team ?? p?.team_id ?? p?.teamId ?? "Red",
      })),
      ...blueArr.map((p) => ({
        ...p,
        team: p?.team ?? p?.team_id ?? p?.teamId ?? "Blue",
      })),
    ];
  }

  const allPlayers = root.all_players;
  if (Array.isArray(allPlayers)) return allPlayers;

  if (Array.isArray(playersRoot)) return playersRoot;

  return [];
}

// --------------------
// Agent Icon URL cache via valorant-api.com
// --------------------
declare global {
  var __pp_val_agents_cache:
    | { fetchedAt: number; byName: Record<string, string> }
    | undefined;
}

async function getAgentIconUrlByName(agentName: string): Promise<string> {
  const key = String(agentName ?? "").trim().toLowerCase();
  if (!key || key === "unknown") return "";

  const now = Date.now();
  const cache = globalThis.__pp_val_agents_cache;

  // 24시간 캐시
  if (cache && now - cache.fetchedAt < 1000 * 60 * 60 * 24) {
    return cache.byName[key] ?? "";
  }

  try {
    const r = await fetch(VALORANT_API_AGENTS);
    if (!r.ok) return "";

    const json = await r.json();
    const jsonRecord = asRecord(json);
    const list = Array.isArray(jsonRecord?.data) ? jsonRecord?.data : [];

    const byName: Record<string, string> = {};
    for (const a of list) {
      const displayName =
        typeof a?.displayName === "string" ? a.displayName : "";
      const uuid = typeof a?.uuid === "string" ? a.uuid : "";
      if (!displayName || !uuid) continue;

      byName[displayName.toLowerCase()] =
        `https://media.valorant-api.com/agents/${uuid}/displayicon.png`;
    }

    globalThis.__pp_val_agents_cache = { fetchedAt: now, byName };
    return byName[key] ?? "";
  } catch {
    return "";
  }
}

// --------------------
// Handler
// --------------------
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const region = String(req.query.region ?? "kr");
    const matchId = String(req.query.matchId ?? "");
    const debug = String(req.query.debug ?? "") === "1";

    if (!matchId) {
      return res.status(400).json({ message: "matchId is required" });
    }

    const apiKey = process.env.HENRIKDEV_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: "HENRIKDEV_API_KEY is not set" });
    }

    // v4 우선(권장), 실패 시 v2 fallback
    const v4Url = `${HENRIK_BASE}/valorant/v4/match/${encodeURIComponent(
      region
    )}/${encodeURIComponent(matchId)}`;
    const v2Url = `${HENRIK_BASE}/valorant/v2/match/${encodeURIComponent(
      matchId
    )}`;

    let used: "v4" | "v2" = "v4";
    let upstream = await fetchJson(v4Url, { Authorization: apiKey });

    if (!upstream.ok) {
      used = "v2";
      upstream = await fetchJson(v2Url, { Authorization: apiKey });
    }

    if (!upstream.ok) {
      return res.status(upstream.status).json(upstream.json);
    }

    const json = upstream.json;

    const metadata = pickMetadata(json);
    const teamsRoot = pickTeamsRoot(json);
    const playersRoot = pickPlayersRoot(json);

    const durationMs = safeNum(
      metadata?.game_length_in_ms,
      safeNum(metadata?.game_length, 0)
    );

    const t = extractTeams(teamsRoot);
    const rawPlayers = pickPlayersWithTeam(playersRoot);

    const players = await Promise.all(
      rawPlayers.map(async (p: UnknownRecord) => {
        const name = String(p.name ?? "");
        const tag = String(p.tag ?? "");
        if (!name || !tag) return null;

        // team 후보 키를 넓게 커버
        const team =
          normalizeTeamFromUnknown(p.team) ??
          normalizeTeamFromUnknown(p.team_id) ??
          normalizeTeamFromUnknown(p.teamId) ??
          normalizeTeamFromUnknown(asRecord(p.team)?.team_id) ??
          normalizeTeamFromUnknown(asRecord(p.team)?.teamId) ??
          normalizeTeamFromUnknown(asRecord(p.team)?.name) ??
          null;

        const agent = pickCharacterName(p.character ?? p.agent ?? p.agent_name);

        const stats = asRecord(p.stats);
        const kills = safeNum(stats?.kills, safeNum(p.kills, 0));
        const deaths = safeNum(stats?.deaths, safeNum(p.deaths, 0));
        const assists = safeNum(stats?.assists, safeNum(p.assists, 0));

        // 1) Henrik assets 우선
        let agentIconUrl = pickAgentIconUrlFromAssets(p);

        // 2) 없으면 Valorant-API에서 agentName→uuid 매핑 후 URL 생성
        if (!agentIconUrl) {
          agentIconUrl = await getAgentIconUrlByName(agent);
        }

        return {
          name,
          tag,
          team,
          kills,
          deaths,
          assists,
          agent,
          agentIconUrl,
        };
      })
    );

    const normalizedPlayers = players.filter(Boolean) as Array<{
      name: string;
      tag: string;
      team: "Red" | "Blue" | null;
      kills: number;
      deaths: number;
      assists: number;
      agent: string;
      agentIconUrl: string;
    }>;

    const out: {
      matchId: string;
      region: string;
      mode: string | null;
      modeId: string | null;
      durationMs: number;
      teams: {
        red: { has_won: boolean | null; rounds_won: number | null; rounds_lost: number | null };
        blue: { has_won: boolean | null; rounds_won: number | null; rounds_lost: number | null };
      };
      players: typeof normalizedPlayers;
      _debug?: {
        usedEndpoint: "v4" | "v2";
        metadataKeys: string[];
        teamsType: string;
        playersRootType: string;
        playersRootKeys: string[];
        firstPlayerKeys: string[];
        firstPlayer_team_raw: unknown;
        firstPlayer_has_assets_agent: boolean;
        cacheState:
          | { ageMs: number; size: number }
          | null;
      };
    } = {
      matchId,
      region,
      mode: typeof metadata?.mode === "string" ? metadata.mode : null,
      modeId: typeof metadata?.mode_id === "string" ? metadata.mode_id : null,
      durationMs,
      teams: {
        red: {
          has_won: t.redHasWon,
          rounds_won: t.redRoundsWon,
          rounds_lost: t.redRoundsLost,
        },
        blue: {
          has_won: t.blueHasWon,
          rounds_won: t.blueRoundsWon,
          rounds_lost: t.blueRoundsLost,
        },
      },
      players: normalizedPlayers,
    };

    if (debug) {
      const first = rawPlayers?.[0] as UnknownRecord | undefined;
      out._debug = {
        usedEndpoint: used,
        metadataKeys:
          metadata && typeof metadata === "object" ? Object.keys(metadata) : [],
        teamsType: Array.isArray(teamsRoot) ? "array" : typeof teamsRoot,
        playersRootType: Array.isArray(playersRoot) ? "array" : typeof playersRoot,
        playersRootKeys:
          playersRoot && typeof playersRoot === "object" && !Array.isArray(playersRoot)
            ? Object.keys(playersRoot)
            : [],
        firstPlayerKeys:
          first && typeof first === "object" ? Object.keys(first) : [],
        firstPlayer_team_raw: first?.team ?? null,
        firstPlayer_has_assets_agent: !!asRecord(first?.assets)?.agent,
        cacheState: globalThis.__pp_val_agents_cache
          ? {
              ageMs: Date.now() - globalThis.__pp_val_agents_cache.fetchedAt,
              size: Object.keys(globalThis.__pp_val_agents_cache.byName).length,
            }
          : null,
      };
    }

    return res.status(200).json(out);
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown error";
    return res.status(500).json({ message });
  }
}
