import type { VercelRequest, VercelResponse } from "@vercel/node";

const API_BASE = "https://api.henrikdev.xyz";
const PLATFORM = "pc";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const region = String(req.query.region ?? "kr");
    const name = String(req.query.name ?? "");
    const tag = String(req.query.tag ?? "");

    if (!name || !tag) {
      return res.status(400).json({ message: "name, tag are required" });
    }

    const apiKey = process.env.HENRIKDEV_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: "HENRIKDEV_API_KEY is not set" });
    }

    // 1️⃣ Account 조회
    const accountUrl = `${API_BASE}/valorant/v1/account/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`;
    
    const accountRes = await fetch(accountUrl, {
      headers: { Authorization: apiKey },
    });

    const accountJson = await accountRes.json();

    if (!accountRes.ok) {
      return res.status(accountRes.status).json(accountJson);
    }

    // ✅ 여기서 account_level을 꺼냅니다.
    const { puuid, region: accountRegion, account_level } = accountJson.data;

    const targetRegion = accountRegion || region;

    // 2️⃣ MMR 조회
    const mmrUrl = `${API_BASE}/valorant/v3/mmr/${targetRegion}/${PLATFORM}/by-puuid/${puuid}`;

    const mmrRes = await fetch(mmrUrl, {
      headers: { Authorization: apiKey },
    });

    const mmrJson = await mmrRes.json();

    if (!mmrRes.ok) {
      return res.status(200).json({
        tierText: "Unranked",
        rr: null,
        accountLevel: account_level, // ✅ Unranked여도 레벨은 반환
        needsGame: true,
        reason: mmrJson?.errors?.[0]?.message ?? "No rank data",
      });
    }

    const tierText: string =
      mmrJson?.data?.currenttierpatched ?? 
      mmrJson?.data?.currenttier_patched ?? 
      "Unranked";

    const rrRaw =
      mmrJson?.data?.ranking_in_tier ??
      mmrJson?.data?.current?.rr ??
      null;

    const rr = typeof rrRaw === "number" ? rrRaw : null;

    return res.status(200).json({
      tierText,
      rr,
      accountLevel: account_level, // ✅ 정상 응답에도 레벨 포함
      needsGame: false,
    });

  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown error";
    return res.status(500).json({ message });
  }
}