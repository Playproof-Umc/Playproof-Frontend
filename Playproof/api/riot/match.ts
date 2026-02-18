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
    res.setHeader("Cache-Control", "no-store");
    return res.status(400).json({ message: "matchId is required" });
  }

  const apiKey = process.env.RIOT_API_KEY;
  if (!apiKey) {
    res.setHeader("Cache-Control", "no-store");
    return res.status(500).json({ message: "RIOT_API_KEY is missing" });
  }

  const url = `https://asia.api.riotgames.com/lol/match/v5/matches/${encodeURIComponent(matchId)}`;

  // ✅ 기본은 캐시 금지 (에러 응답이 캐시되는 걸 막기 위함)
  res.setHeader("Cache-Control", "no-store");

  try {
    const upstream = await fetch(url, {
      headers: { "X-Riot-Token": apiKey },
    });

    const text = await upstream.text();
    const json = safeJsonParse<unknown>(text);

    // ✅ 성공(200)일 때만 “매치 불변” 가정 기반 장기 캐시
    if (upstream.status === 200) {
      res.setHeader("Cache-Control", "s-maxage=31536000, stale-while-revalidate=31536000");
    }

    // 디버깅에 도움되는 헤더 (프론트에서 Network 탭으로 바로 확인 가능)
    res.setHeader("x-upstream-status", String(upstream.status));

    if (json !== null) {
      return res.status(upstream.status).json(json);
    }

    // JSON이 아닌 응답인 경우도 캐시하지 않음
    res.setHeader("Cache-Control", "no-store");
    return res.status(upstream.status).json({
      message: "Upstream returned non-JSON response",
      upstreamStatus: upstream.status,
      body: text,
    });
  } catch (err) {
    // fetch 자체 실패 (네트워크/런타임)
    res.setHeader("Cache-Control", "no-store");
    const detail = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ message: "Riot match proxy error", detail });
  }
}
