import type { VercelRequest, VercelResponse } from "@vercel/node";

async function fetchJson(url: string) {
  const resp = await fetch(url, {
    headers: {
      Accept: "application/json",
      "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
      "User-Agent": "PlayProof/1.0 (+http://localhost)",
    },
  });

  const text = await resp.text();
  const contentType = resp.headers.get("content-type") ?? "";

  let json: unknown = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }

  return { ok: resp.ok, status: resp.status, contentType, text, json };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

    // 영웅 목록은 자주 안 바뀜 → 캐시 강하게
    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=604800");

    const base = "https://overfast-api.tekrop.fr";
    const locale = (req.query.locale as string | undefined) ?? "ko-kr";

    const url = `${base}/heroes?locale=${encodeURIComponent(locale)}`;
    const r = await fetchJson(url);

    if (r.status === 429) {
      return res.status(429).json({
        message: "Overwatch heroes upstream rate limited",
        upstreamStatus: r.status,
        upstreamBodyPreview: r.text.slice(0, 200),
      });
    }

    if (!r.ok || !r.json) {
      return res.status(r.status).json({
        message: "Overwatch heroes upstream error",
        upstreamStatus: r.status,
        upstreamContentType: r.contentType,
        upstreamBodyPreview: r.text.slice(0, 300),
      });
    }

    return res.status(200).json(r.json);
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ message: "Overwatch heroes proxy error", detail });
  }
}
