import type { VercelRequest, VercelResponse } from "@vercel/node";

const API_BASE = "https://api.henrikdev.xyz";

type UnknownRecord = Record<string, unknown>;

function asRecord(v: unknown): UnknownRecord | null {
  return v && typeof v === "object" ? (v as UnknownRecord) : null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // 쿼리 파라미터 가져오기
    const region = String(req.query.region ?? "kr");
    const name = String(req.query.name ?? "");
    const tag = String(req.query.tag ?? "");
    const size = Number(req.query.size ?? 10);
    const offset = Number(req.query.offset ?? 0);

    // 유효성 검사
    if (!name || !tag) {
      return res.status(400).json({ message: "name, tag are required" });
    }

    const apiKey = process.env.HENRIKDEV_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: "HENRIKDEV_API_KEY is not set" });
    }

    /**
     * 1️⃣ Account 조회 (필수)
     * - 이름(REMEMBERHYUN#LOVEU)으로 직접 매치 리스트를 조회하면 
     * API가 한국 계정을 못 찾는 버그가 있습니다.
     * - 따라서 먼저 '계정 정보'를 조회해서 고유 ID(PUUID)를 얻어야 합니다.
     */
    const accountUrl = `${API_BASE}/valorant/v1/account/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`;

    const accountRes = await fetch(accountUrl, {
      headers: { Authorization: apiKey },
    });

    const accountJson: unknown = await accountRes.json();

    // 계정을 못 찾으면 바로 에러 반환
    if (!accountRes.ok) {
      return res.status(accountRes.status).json(accountJson);
    }

    // PUUID와 정확한 리전 추출
    const accountData = asRecord(asRecord(accountJson)?.data);
    const puuid = typeof accountData?.puuid === "string" ? accountData.puuid : "";
    const accountRegion =
      typeof accountData?.region === "string" ? accountData.region : null;
    if (!puuid) {
      return res.status(502).json({ message: "Invalid account response" });
    }
    const targetRegion = accountRegion || region;

    /**
     * 2️⃣ Match List 조회 (by-puuid)
     * - PUUID를 사용하면 100% 확실하게 매치 리스트를 가져옵니다.
     */
    const matchesUrl = `${API_BASE}/valorant/v3/by-puuid/matches/${targetRegion}/${puuid}?size=${size}&offset=${offset}`;

    const matchesRes = await fetch(matchesUrl, {
      headers: { Authorization: apiKey },
    });

    const matchesJson: unknown = await matchesRes.json();

    if (!matchesRes.ok) {
      // 매치 기록이 아예 없는 경우 빈 배열 반환
      return res.status(200).json({ matchIds: [] });
    }

    // 3️⃣ 매치 ID만 추출하여 반환
    const matchData = asRecord(matchesJson)?.data;
    const matchIds: string[] = Array.isArray(matchData)
      ? matchData
          .map((m) => {
            const meta = asRecord(asRecord(m)?.metadata);
            return typeof meta?.matchid === "string" ? meta.matchid : null;
          })
          .filter((v): v is string => typeof v === "string")
      : [];

    return res.status(200).json({ matchIds });

  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown error";
    return res.status(500).json({ message });
  }
}
