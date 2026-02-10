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

  const puuid = typeof req.query.puuid === "string" ? req.query.puuid : "";
  if (!puuid) {
    return res.status(400).json({ message: "puuid is required" });
  }

  const startRaw = typeof req.query.start === "string" ? req.query.start : undefined;
  const countRaw = typeof req.query.count === "string" ? req.query.count : undefined;

  const start = startRaw ? Number(startRaw) : 0;
  const count = countRaw ? Number(countRaw) : 10;

  const apiKey = process.env.RIOT_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: "RIOT_API_KEY is missing" });
  }

  const url = `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${encodeURIComponent(
    puuid,
  )}/ids?start=${Number.isFinite(start) ? start : 0}&count=${Number.isFinite(count) ? count : 10}`;

  try {
    const upstream = await fetch(url, { headers: { "X-Riot-Token": apiKey } });
    const text = await upstream.text();

    const json = safeJsonParse<string[]>(text);
    if (json) {
      return res.status(upstream.status).json(json);
    }

    // 파싱 실패해도 json 반환으로 통일
    return res.status(upstream.status).json({
      message: "Upstream returned non-JSON response",
      upstreamStatus: upstream.status,
      body: text,
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ message: "Riot match ids proxy error", detail });
  }
}
