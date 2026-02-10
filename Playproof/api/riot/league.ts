import type { VercelRequest, VercelResponse } from "@vercel/node";

type LeagueEntryDto = {
  leagueId?: string;
  queueType?: string;
  tier?: string;
  rank?: string;
  summonerId?: string;
  summonerName?: string;
  leaguePoints?: number;
  wins?: number;
  losses?: number;
  veteran?: boolean;
  inactive?: boolean;
  freshBlood?: boolean;
  hotStreak?: boolean;
  miniSeries?: unknown;
};

function safeJsonParse<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const puuid = typeof req.query.puuid === "string" ? req.query.puuid : "";
  if (!puuid) {
    return res.status(400).json({ message: "puuid is required" });
  }

  const apiKey = process.env.RIOT_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: "RIOT_API_KEY is missing" });
  }

  // 메모리 기준: by-puuid 사용, optional 데이터 취급
  const url = `https://kr.api.riotgames.com/lol/league/v4/entries/by-puuid/${encodeURIComponent(puuid)}`;

  try {
    const upstream = await fetch(url, { headers: { "X-Riot-Token": apiKey } });

    // optional 처리: 403/404면 200 + []
    if (upstream.status === 403 || upstream.status === 404) {
      return res.status(200).json([]);
    }

    const text = await upstream.text();
    const json = safeJsonParse<LeagueEntryDto[]>(text);

    if (json !== null) {
      return res.status(upstream.status).json(json);
    }

    return res.status(upstream.status).json({
      message: "Upstream returned non-JSON response",
      upstreamStatus: upstream.status,
      body: text,
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ message: "Riot league proxy error", detail });
  }
}
