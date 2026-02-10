// src/features/mypage/gameData/api/overwatchApi.ts

import { overwatchClient } from "@/services/axios"; // default import 아님 주의

export type OverwatchRoleDetail = {
  division: string; // "diamond", "gold" ...
  tier: number;     // 1, 2, 3 ...
  rank_icon: string;
};

export type OverwatchRoles = {
  tank?: OverwatchRoleDetail;
  damage?: OverwatchRoleDetail;
  support?: OverwatchRoleDetail;
};

export type OverwatchTopHero = {
  hero: string;
  playtimeSeconds: number;
};

export type OverwatchStatsResponse = {
  roles: OverwatchRoles;
  top3Heroes: OverwatchTopHero[];
};

export type OverwatchMatch = {
  id: string;
  map: string;
  mode: string;
  result: "win" | "loss";
  played_at: string;
};

export async function getOverwatchStats(battleTag: string) {
  // 호출 URL: /api/overwatch/stats?battleTag=...
  const res = await overwatchClient.get<OverwatchStatsResponse>("/stats", {
    params: { battleTag },
  });
  return res.data;
}

export async function getOverwatchMatches(params: {
  battleTag: string;
  offset: number;
  limit: number;
}): Promise<OverwatchMatch[]> {
  const res = await overwatchClient.get<OverwatchMatch[]>("/matches", {
    params,
  });
  return Array.isArray(res.data) ? res.data : [];
}
