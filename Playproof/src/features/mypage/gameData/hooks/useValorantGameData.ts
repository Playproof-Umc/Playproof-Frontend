// src/features/mypage/gameData/hooks/useValorantGameData.ts

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import type { GameKey, LinkedAccount } from "@/features/mypage/gameData/types/gameDataTypes";
import { valorantApi } from "@/features/mypage/gameData/api/valorantApi";
import {
  computeValorantOverviewFromRows,
  type ValorantMatchRowVM,
} from "@/features/mypage/gameData/utils/valorantHenrikMapper";

/* =========================
 * View Types
 * ========================= */

type ValLoadingView = { kind: "valLoading" };
type ValErrorView = { kind: "valError"; message: string };
type ValView = {
  kind: "valorant";
  data: {
    matches: ValMatchDetail[];
    avgKd: number | null;
    rows: ValorantMatchRowVM[];
    overview: {
      winRatePercent: number;
      avgKills: number;
      avgDeaths: number;
      avgAssists: number;
      matchCount: number;
      wins: number;
      losses: number;
      draws: number;
    };
  };
};

export type ValorantViewState = ValLoadingView | ValErrorView | ValView;

/* =========================
 * Domain Types
 * ========================= */

type ValPlayerStat = {
  name: string;
  tag: string;
  kills: number;
  deaths: number;
};

type ValMatchDetail = {
  matchId: string;
  me: ValPlayerStat;
};

const DEFAULT_VAL_REGION = "kr" as const;

function findValorantAccount(accounts: LinkedAccount[]) {
  return accounts.find((a) => a.game === "valorant") ?? null;
}

/* =========================
 * Proxy DTO (server contract)
 * ========================= */

type ProxyValTeam = {
  has_won: boolean;
  rounds_won: number | null;
  rounds_lost: number | null;
};

type ProxyValPlayer = {
  name: string;
  tag: string;
  team: "Red" | "Blue" | null;
  kills: number;
  deaths: number;
  assists: number;
  agent: string;
  agentIconUrl: string;
};

type ProxyValMatchDto = {
  matchId: string;
  region: string;
  mode: string | null;
  modeId: string | null;
  durationMs: number;
  teams: {
    red: ProxyValTeam;
    blue: ProxyValTeam;
  };
  players: ProxyValPlayer[];
};

/* =========================
 * Type Guards
 * ========================= */

function isProxyValMatchDto(raw: unknown): raw is ProxyValMatchDto {
  if (typeof raw !== "object" || raw === null) return false;
  const r = raw as ProxyValMatchDto;

  return (
    typeof r.matchId === "string" &&
    typeof r.durationMs === "number" &&
    !!r.teams?.red &&
    !!r.teams?.blue &&
    Array.isArray(r.players)
  );
}

/* =========================
 * Helpers
 * ========================= */

function formatDurationMs(ms: number) {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function mapModeToText(mode?: string | null, modeId?: string | null) {
  const key = String(modeId ?? mode ?? "").toLowerCase();

  if (key.includes("competitive")) return "경쟁전";
  if (key.includes("unrated")) return "일반전";
  if (key.includes("swiftplay")) return "스위프트";
  if (key.includes("spikerush")) return "스파이크 러쉬";
  if (key.includes("deathmatch")) return "데스매치";
  if (key.includes("teamdeathmatch")) return "팀 데스매치";
  if (key.includes("escalation")) return "에스컬레이션";
  if (key.includes("replication")) return "레플리케이션";
  if (key.includes("snowball")) return "스노우볼";
  if (key.includes("custom")) return "커스텀";

  return mode ?? "일반전";
}

function buildValorantRowVMFromProxyDto(params: {
  raw: ProxyValMatchDto;
  name: string;
  tag: string;
}): { vm: ValorantMatchRowVM; meKills: number; meDeaths: number; meAssists: number } | null {
  const { raw, name, tag } = params;

  const me = raw.players.find(
    (p) => p.name.toLowerCase() === name.toLowerCase() && p.tag.toLowerCase() === tag.toLowerCase()
  );
  if (!me || !me.team) return null;

  const redWon = raw.teams.red.has_won;
  const blueWon = raw.teams.blue.has_won;
  const isDraw = redWon === blueWon;
  const isWin = isDraw ? false : me.team === "Red" ? redWon : blueWon;

  const result: ValorantMatchRowVM["result"] = isDraw ? "DRAW" : isWin ? "WIN" : "LOSS";

  const toAgent = (p: ProxyValPlayer) => ({
    id: p.agent.toLowerCase().replace(/\s+/g, "-"),
    name: p.agent,
    iconUrl: p.agentIconUrl,
  });

  return {
    vm: {
      result,
      durationText: formatDurationMs(raw.durationMs),
      queueTypeText: mapModeToText(raw.mode, raw.modeId),
      myAgent: toAgent(me),
      allyAgents: raw.players.filter((p) => p.team === me.team).map(toAgent),
      enemyAgents: raw.players.filter((p) => p.team !== me.team).map(toAgent),
      kdaText: `${me.kills} / ${me.deaths} / ${me.assists}`,
    },
    meKills: me.kills,
    meDeaths: me.deaths,
    meAssists: me.assists,
  };
}

/* =========================
 * Hook
 * ========================= */

export function useValorantGameData(params: {
  linkedAccounts: LinkedAccount[];
  selectedGame: GameKey | null;
}) {
  const { linkedAccounts, selectedGame } = params;

  const valorantAccount = useMemo(() => findValorantAccount(linkedAccounts), [linkedAccounts]);
  const valorantMeta = valorantAccount?.meta?.riot ?? null;

  const shouldFetchValorant = !!valorantMeta;
  const isValSelected = selectedGame === "valorant";

  const valorantMmrQuery = useQuery({
    queryKey: ["gamedata", "valorant", "mmr", valorantMeta?.riotId, DEFAULT_VAL_REGION],
    enabled: shouldFetchValorant,
    queryFn: async () => {
      const region = DEFAULT_VAL_REGION;
      const name = valorantMeta!.gameName;
      const tag = valorantMeta!.tagLine;
      return valorantApi.getMmrByRiotId({ region, name, tag });
    },
    retry: 0,
  });

  const valorantStatsQuery = useQuery({
    queryKey: ["gamedata", "valorant", "stats", valorantMeta?.riotId],
    enabled: shouldFetchValorant && isValSelected,
    queryFn: async () => {
      const region = DEFAULT_VAL_REGION;
      const name = valorantMeta!.gameName;
      const tag = valorantMeta!.tagLine;

      const list = await valorantApi.getMatchesByRiotId({ region, name, tag, size: 10, offset: 0 });
      const detailsRaw = await Promise.all(
        list.matchIds.map((id) => valorantApi.getMatchDetail({ region, matchId: id }).catch(() => null))
      );

      const rows: ValorantMatchRowVM[] = [];
      const matches: ValMatchDetail[] = [];

      let sumKills = 0;
      let sumDeaths = 0;
      let sumAssists = 0;

      detailsRaw.forEach((raw) => {
        if (!isProxyValMatchDto(raw)) return;
        const built = buildValorantRowVMFromProxyDto({ raw, name, tag });
        if (!built) return;

        rows.push(built.vm);
        matches.push({
          matchId: raw.matchId,
          me: { name, tag, kills: built.meKills, deaths: built.meDeaths },
        });

        sumKills += built.meKills;
        sumDeaths += built.meDeaths;
        sumAssists += built.meAssists;
      });

      const denom = Math.max(1, rows.length);
      const overviewFromRows = computeValorantOverviewFromRows(rows);

      return {
        avgKd: sumDeaths === 0 ? sumKills : sumKills / sumDeaths,
        matches,
        rows,
        overview: {
          winRatePercent: overviewFromRows.winRatePercent,
          avgKills: sumKills / denom,
          avgDeaths: sumDeaths / denom,
          avgAssists: sumAssists / denom,
          matchCount: rows.length,
          wins: overviewFromRows.wins,
          losses: overviewFromRows.losses,
          draws: overviewFromRows.draws,
        },
      };
    },
  });

  const valAvgKd = useMemo(() => valorantStatsQuery.data?.avgKd ?? null, [valorantStatsQuery.data]);

  const view: ValorantViewState = useMemo(() => {
    if (!isValSelected) return { kind: "valLoading" };
    if (!valorantMeta) return { kind: "valError", message: "Riot ID가 없습니다." };
    if (valorantStatsQuery.isLoading) return { kind: "valLoading" };
    if (valorantStatsQuery.isError || !valorantStatsQuery.data)
      return { kind: "valError", message: "매치 정보를 불러오지 못했습니다." };

    return { kind: "valorant", data: valorantStatsQuery.data };
  }, [isValSelected, valorantMeta, valorantStatsQuery]);

  return {
    valorantAccount,
    valorantMeta,
    shouldFetchValorant,
    view,
    valorantMmrQuery,
    valorantStatsQuery,
    valAvgKd,
  };
}
