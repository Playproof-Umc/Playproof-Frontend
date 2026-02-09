// src/features/mypage/gameData/hooks/useGameDataDashboard.ts

import { useMemo, useState } from "react";

import type {
  DashboardTabKey,
  GameDataDashboardData,
  GameKey,
  LinkedAccount,
} from "@/features/mypage/gameData/types/gameDataTypes";
import type { OverwatchStatsResponse } from "@/features/mypage/gameData/api/overwatchApi";
import { MOCK_GAME_DATA_DASHBOARD } from "@/features/mypage/gameData/data/mock";

import { useLolGameData } from "@/features/mypage/gameData/hooks/useLolGameData";
import { useValorantGameData } from "@/features/mypage/gameData/hooks/useValorantGameData";
import { useOverwatchGameData } from "@/features/mypage/gameData/hooks/useOverwatchGameData";
import type { ValorantMatchRowVM } from "@/features/mypage/gameData/utils/valorantHenrikMapper";

type EmptyView = { kind: "empty" };
type PlaceholderView = { kind: "placeholder"; title: string; subtitle: string };

type LolLoadingView = { kind: "lolLoading" };
type LolErrorView = { kind: "lolError"; message: string };
type LolView = { kind: "lol"; lol: GameDataDashboardData["lol"] };

type ValLoadingView = { kind: "valLoading" };
type ValErrorView = { kind: "valError"; message: string };
type ValView = {
  kind: "valorant";
  data: {
    matches: Array<{ matchId: string; me: { name: string; tag: string; kills: number; deaths: number } }>;
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

type OwLoadingView = { kind: "owLoading" };
type OwErrorView = { kind: "owError"; message: string };
type OwView = { kind: "overwatch"; data: OverwatchStatsResponse };

type DashboardView =
  | EmptyView
  | PlaceholderView
  | LolLoadingView
  | LolErrorView
  | LolView
  | ValLoadingView
  | ValErrorView
  | ValView
  | OwLoadingView
  | OwErrorView
  | OwView;

function applyCardOverrides(base: LinkedAccount[], overrides: Array<{ game: GameKey; accounts: LinkedAccount["accounts"] }>) {
  let next = base;
  for (const ov of overrides) {
    next = next.map((a) => (a.game === ov.game ? { ...a, accounts: ov.accounts } : a));
  }
  return next;
}

export const useGameDataDashboard = () => {
  const baseData = MOCK_GAME_DATA_DASHBOARD;

  const defaultSelected = useMemo(() => {
    const firstRealGame = baseData.linkedAccounts.find((a) => typeof a.game === "string" && a.game.length > 0)?.game;
    return (firstRealGame ?? null) as GameKey | null;
  }, [baseData.linkedAccounts]);

  const [selectedGame, setSelectedGame] = useState<GameKey | null>(defaultSelected);
  const [activeTab, setActiveTab] = useState<DashboardTabKey>("matches");

  // ✅ LoL pagination state (기존 유지)
  const [page, setPage] = useState<number>(baseData.lol.pagination.page);
  const pageSize = baseData.lol.pagination.pageSize;
  const totalPages = baseData.lol.pagination.totalPages;

  // --- Domain hooks ---
  const lol = useLolGameData({
    linkedAccounts: baseData.linkedAccounts,
    isSelected: selectedGame === "lol",
    page,
    pageSize,
    totalPages,
  });

  const valorant = useValorantGameData({
    linkedAccounts: baseData.linkedAccounts,
    selectedGame,
  });

  const overwatch = useOverwatchGameData({
    linkedAccounts: baseData.linkedAccounts,
    selectedGame,
  });

  // --- linkedAccounts override (연동 카드 데이터 유지 핵심) ---
  const linkedAccounts = useMemo(() => {
    const overrides = [lol.cardOverride, overwatch.cardOverride].filter(Boolean) as Array<{
      game: GameKey;
      accounts: LinkedAccount["accounts"];
    }>;

    return applyCardOverrides(baseData.linkedAccounts, overrides);
  }, [baseData.linkedAccounts, lol.cardOverride, overwatch.cardOverride]);

  const data: GameDataDashboardData = useMemo(() => {
    // LoL 전적 로드 시 baseData.lol을 최신으로 주입(기존 동작 유지)
    if (lol.status.kind === "success") {
      return { ...baseData, linkedAccounts, lol: lol.status.lol };
    }
    return { ...baseData, linkedAccounts };
  }, [baseData, linkedAccounts, lol.status]);

  // --- view state machine (GameData.tsx 계약 유지) ---
  const view: DashboardView = useMemo(() => {
    if (!selectedGame) return { kind: "empty" };

    if (selectedGame === "lol") {
      if (!lol.riotMeta) return { kind: "lolError", message: "Riot ID가 없습니다." };
      if (lol.status.kind === "loading") return { kind: "lolLoading" };
      if (lol.status.kind === "error") return { kind: "lolError", message: lol.status.message };
      if (lol.status.kind === "success") return { kind: "lol", lol: lol.status.lol };
      return { kind: "lolLoading" };
    }

    if (selectedGame === "valorant") {
      // useValorantGameData의 view는 이미 kind를 맞춰줌
      if (valorant.view.kind === "valLoading") return { kind: "valLoading" };
      if (valorant.view.kind === "valError") return { kind: "valError", message: valorant.view.message };
      return { kind: "valorant", data: valorant.view.data };
    }

    if (selectedGame === "overwatch") {
      if (overwatch.view.kind === "owLoading") return { kind: "owLoading" };
      if (overwatch.view.kind === "owError") return { kind: "owError", message: overwatch.view.message };
      return { kind: "overwatch", data: overwatch.view.data };
    }

    return { kind: "placeholder", title: "준비중", subtitle: "준비 중입니다." };
  }, [lol.riotMeta, lol.status, overwatch.view, selectedGame, valorant.view]);

  // --- actions (GameData.tsx가 직접 씀) ---
  const actions = useMemo(
    () => ({
      onSelectGame: (game: GameKey) => {
        setSelectedGame(game);
        setActiveTab("matches");
        if (game === "lol") setPage(1);
      },
      onChangeTab: (tab: DashboardTabKey) => setActiveTab(tab),
      onChangeLolPage: (nextPage: number) => setPage(nextPage),
    }),
    []
  );

  // --- valorant panel return (기존 return shape 유지) ---
  return {
    data,
    selectedGame,
    activeTab,
    view,
    actions,
  };
};
