// src/features/mypage/gameData/utils/valorantViewModel.ts

export type ValorantTeamSide = "ally" | "enemy";

export interface ValorantAgent {
  id: string;
  name: string;
  iconUrl: string;
}

export interface ValorantMatchRowVM {
  result: "WIN" | "LOSS" | "DRAW";
  durationText: string; // "22m 3s"
  queueTypeText: string; // "경쟁전", "일반전", ...
  myAgent: ValorantAgent;
  allyAgents: ValorantAgent[];
  enemyAgents: ValorantAgent[];
  kdaText: string; // "18 / 12 / 6"
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

export function buildValorantMatchRowVM(params: {
  durationSeconds: number;
  isWin: boolean;
  isDraw: boolean;
  queueType: string;
  myAgent: ValorantAgent;
  allyAgents: ValorantAgent[];
  enemyAgents: ValorantAgent[];
  kills: number;
  deaths: number;
  assists: number;
}): ValorantMatchRowVM {
  return {
    result: params.isDraw
      ? "DRAW"
      : params.isWin
      ? "WIN"
      : "LOSS",
    durationText: formatDuration(params.durationSeconds),
    queueTypeText: params.queueType,
    myAgent: params.myAgent,
    allyAgents: params.allyAgents,
    enemyAgents: params.enemyAgents,
    kdaText: `${params.kills} / ${params.deaths} / ${params.assists}`,
  };
}
