import type { VercelRequest, VercelResponse } from "@vercel/node";

const API_BASE = "https://api.henrikdev.xyz";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const name = String(req.query.name ?? "");
  const tag = String(req.query.tag ?? "");

  if (!name || !tag) {
    return res.status(400).json({ message: "name, tag required" });
  }

  const apiKey = process.env.HENRIKDEV_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: "HENRIKDEV_API_KEY missing" });
  }

  const url = `${API_BASE}/valorant/v1/account/${encodeURIComponent(
    name
  )}/${encodeURIComponent(tag)}`;

  const r = await fetch(url, {
    headers: { Authorization: apiKey },
  });

  const json = await r.json();

  if (!r.ok) {
    return res.status(r.status).json(json);
  }

  return res.status(200).json({
    puuid: json.data.puuid,
    region: json.data.region,
    accountLevel: json.data.account_level,
  });
}