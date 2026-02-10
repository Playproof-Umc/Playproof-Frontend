import type { VercelRequest, VercelResponse } from "@vercel/node";

type RiotAccountByRiotIdResponse = {
  puuid: string;
  gameName: string;
  tagLine: string;
};

function safeJsonParse<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

async function readUpstreamBody<T>(
  upstream: Response,
): Promise<{ data: T | string; contentType: string | null }> {
  const contentType = upstream.headers.get("content-type");
  const text = await upstream.text();

  if (contentType?.includes("application/json")) {
    const json = safeJsonParse<T>(text);
    if (json !== null) return { data: json, contentType };
  }

  // json이 아닌데도 json 문자열일 수 있어 fallback parse
  const fallbackJson = safeJsonParse<T>(text);
  if (fallbackJson !== null) return { data: fallbackJson, contentType };

  return { data: text, contentType };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const gameName = typeof req.query.gameName === "string" ? req.query.gameName : "";
  const tagLine = typeof req.query.tagLine === "string" ? req.query.tagLine : "";

  if (!gameName || !tagLine) {
    return res.status(400).json({ message: "gameName and tagLine are required" });
  }

  const apiKey = process.env.RIOT_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: "RIOT_API_KEY is missing" });
  }

  const url = `https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
    gameName,
  )}/${encodeURIComponent(tagLine)}`;

  try {
    const upstream = await fetch(url, {
      headers: {
        "X-Riot-Token": apiKey,
      },
    });

    const { data, contentType } = await readUpstreamBody<RiotAccountByRiotIdResponse | { status?: unknown }>(
      upstream,
    );

    if (typeof data === "string") {
      // text면 그대로 내려주되, 프론트(axios)가 기대하는 json과 다를 수 있으니 json 형태로 감싸서 내려줌
      return res.status(upstream.status).json({
        message: "Upstream returned non-JSON response",
        upstreamStatus: upstream.status,
        contentType,
        body: data,
      });
    }

    return res.status(upstream.status).json(data);
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ message: "Riot account proxy error", detail });
  }
}
