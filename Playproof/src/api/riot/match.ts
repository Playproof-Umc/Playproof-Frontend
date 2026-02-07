import type { VercelRequest, VercelResponse } from "@vercel/node";

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

  const matchId = typeof req.query.matchId === "string" ? req.query.matchId : "";
  if (!matchId) {
    return res.status(400).json({ message: "matchId is required" });
  }

  const apiKey = process.env.RIOT_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: "RIOT_API_KEY is missing" });
  }

  const url = `https://asia.api.riotgames.com/lol/match/v5/matches/${encodeURIComponent(matchId)}`;

  // 매치 데이터는 불변 가정(메모리 정책)
  res.setHeader("Cache-Control", "s-maxage=31536000, stale-while-revalidate=31536000");

  try {
    const upstream = await fetch(url, { headers: { "X-Riot-Token": apiKey } });
    const text = await upstream.text();

    const json = safeJsonParse<unknown>(text);
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
    return res.status(500).json({ message: "Riot match proxy error", detail });
  }
}
