// src/features/mypage/gameData/api/overfastApi.ts

import axios from "axios";

const overwatchClient = axios.create({
  baseURL: "/api/overwatch",
  timeout: 15_000,
});

export type OverfastPlayerSummary = {
  player_id: string;
  name: string;
  avatar?: string | null;
  namecard?: string | null;
  title?: string | null;

  endorsement?: {
    level?: number | null;
    [k: string]: unknown;
  } | null;

  competitive?: Record<string, unknown> | null;

  [k: string]: unknown;
};

export async function getOverwatchSummaryByBattleTag(battleTag: string): Promise<OverfastPlayerSummary> {
  const res = await overwatchClient.get<OverfastPlayerSummary>("/summary", {
    params: { battleTag },
  });
  return res.data;
}

export const overfastApi = {
  getOverwatchSummaryByBattleTag,
};