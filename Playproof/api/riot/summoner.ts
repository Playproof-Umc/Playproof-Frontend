import type { VercelRequest, VercelResponse } from "@vercel/node";

type SummonerByPuuidResponse = {
  id?: string; // encryptedSummonerId (optional로 방어)
  accountId?: string;
  puuid: string;
  name: string;
  profileIconId?: number;
  revisionDate?: number;
  summonerLevel?: number;
};

function safeJsonParse<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

async function readUpstreamJson<T>(upstream: Response): Promise<T | null> {
  const text = await upstream.text();
  const json = safeJsonParse<T>(text);
  return json;
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

  const url = `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${encodeURIComponent(puuid)}`;

  try {
    const upstream = await fetch(url, {
      headers: { "X-Riot-Token": apiKey },
    });

    const json = await readUpstreamJson<SummonerByPuuidResponse | { status?: unknown }>(upstream);
    if (json) {
      return res.status(upstream.status).json(json);
    }

    // json 파싱 실패 시에도 axios 파싱 문제 방지 위해 json으로 감싸서 반환
    return res.status(upstream.status).json({
      message: "Upstream returned non-JSON response",
      upstreamStatus: upstream.status,
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ message: "Riot summoner proxy error", detail });
  }
}
