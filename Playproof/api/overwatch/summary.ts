import type { VercelRequest, VercelResponse } from "@vercel/node";

type PlayerSearchResult = {
  player_id: string;
  name?: string;
  last_updated_at?: string;
  [k: string]: unknown;
};

type PlayerSearchResponse = {
  total: number;
  results: PlayerSearchResult[];
};

function normalizeQueryName(input: string): string {
  // OverFast 검색(name=)은 username 또는 battletag(# -> - 치환) 모두를 받는다고 문서에 있음.
  // 우린 통일해서 # -> - 로만 바꿔준다.
  return input.includes("#") ? input.replace("#", "-") : input;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "GET") {
      res.setHeader("Allow", "GET");
      return res.status(405).json({ message: "Method Not Allowed" });
    }

    const battleTagRaw = req.query.battleTag;
    const battleTag = typeof battleTagRaw === "string" ? battleTagRaw.trim() : "";

    if (!battleTag) {
      return res.status(400).json({
        message: "battleTag query param is required. Example: ?battleTag=Name#1234 or Name-1234",
      });
    }

    const nameQuery = normalizeQueryName(battleTag);

    // 1) ✅ 먼저 /players 검색으로 정확한 player_id를 찾는다 (Cache TTL 10 min)
    const searchUrl = `https://overfast-api.tekrop.fr/players?name=${encodeURIComponent(
      nameQuery
    )}&order_by=name:asc&offset=0&limit=1`;

    const searchRes = await fetch(searchUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "PlayProof (GameData Overwatch proxy)",
      },
    });

    const searchText = await searchRes.text();

    if (!searchRes.ok) {
      let upstreamBody: unknown = searchText;
      try {
        upstreamBody = JSON.parse(searchText);
      } catch {
        // ignore
      }

      return res.status(searchRes.status).json({
        message: "Overwatch player search upstream error",
        battleTag,
        nameQuery,
        upstreamStatus: searchRes.status,
        upstreamBody,
      });
    }

    let searchJson: PlayerSearchResponse | null = null;
    try {
      searchJson = JSON.parse(searchText) as PlayerSearchResponse;
    } catch {
      searchJson = null;
    }

    const resolved = searchJson?.results?.[0] ?? null;

    if (!resolved?.player_id) {
      // 검색 결과가 없는 케이스 (지금 너가 ryobbak에서 본 그 상태)
      res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
      return res.status(404).json({
        message: "Player not found (search returned empty)",
        battleTag,
        nameQuery,
        searchTotal: searchJson?.total ?? 0,
      });
    }

    const playerId = resolved.player_id;

    // 2) ✅ resolve된 player_id로 summary 조회
    const summaryUrl = `https://overfast-api.tekrop.fr/players/${encodeURIComponent(playerId)}/summary`;

    const summaryRes = await fetch(summaryUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "PlayProof (GameData Overwatch proxy)",
      },
    });

    const summaryText = await summaryRes.text();

    // 캐시: summary는 1분 + SWR
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");

    if (!summaryRes.ok) {
      let upstreamBody: unknown = summaryText;
      try {
        upstreamBody = JSON.parse(summaryText);
      } catch {
        // ignore
      }

      return res.status(summaryRes.status).json({
        message: "Overwatch summary upstream error",
        battleTag,
        nameQuery,
        resolvedPlayerId: playerId,
        upstreamStatus: summaryRes.status,
        upstreamBody,
      });
    }

    res.status(200);
    res.setHeader("Content-Type", summaryRes.headers.get("content-type") ?? "application/json");
    return res.send(summaryText);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return res.status(500).json({ message: "Overwatch proxy error", detail: msg });
  }
}