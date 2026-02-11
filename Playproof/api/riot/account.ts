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
  upstream: Response
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

  // ✅ 캐시로 인한 혼동 방지 (특히 배포 후 디버깅)
  res.setHeader("Cache-Control", "no-store");

  const gameName = typeof req.query.gameName === "string" ? req.query.gameName : "";
  const tagLine = typeof req.query.tagLine === "string" ? req.query.tagLine : "";

  // ✅ Health-check 모드: 쿼리 없으면 200 OK 반환
  // (Hobby 플랜 함수 12개 제한 때문에 /api/health를 추가할 수 없어서 여기에 합침)
  if (!gameName && !tagLine) {
    return res.status(200).json({
      ok: true,
      service: "playproof-api",
      route: "/api/riot/account",
    });
  }

  // ✅ 둘 중 하나만 온 경우는 기존 정책대로 400
  if (!gameName || !tagLine) {
    return res.status(400).json({ message: "gameName and tagLine are required" });
  }

  const apiKey = process.env.RIOT_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: "RIOT_API_KEY is missing" });
  }

  const url = `https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
    gameName
  )}/${encodeURIComponent(tagLine)}`;

  try {
    const upstream = await fetch(url, {
      headers: {
        "X-Riot-Token": apiKey,
      },
    });

    const { data, contentType } = await readUpstreamBody<
      RiotAccountByRiotIdResponse | { status?: unknown }
    >(upstream);

    if (typeof data === "string") {
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
