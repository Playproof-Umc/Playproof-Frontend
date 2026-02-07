// src/features/mypage/gameData/hooks/useOverwatchGameData.ts

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import type { GameKey, LinkedAccount } from "@/features/mypage/gameData/types/gameDataTypes";
import { getOverwatchStats, type OverwatchStatsResponse } from "@/features/mypage/gameData/api/overwatchApi";

type OwLoadingView = { kind: "owLoading" };
type OwErrorView = { kind: "owError"; message: string };
type OwView = { kind: "overwatch"; data: OverwatchStatsResponse };

export type OverwatchViewState = OwLoadingView | OwErrorView | OwView;

function findOverwatchAccount(accounts: LinkedAccount[]) {
  return accounts.find((a) => a.game === "overwatch") ?? null;
}

export function useOverwatchGameData(params: {
  linkedAccounts: LinkedAccount[];
  selectedGame: GameKey | null;
}) {
  const { linkedAccounts, selectedGame } = params;

  const overwatchAccount = useMemo(() => findOverwatchAccount(linkedAccounts), [linkedAccounts]);
  const overwatchMeta = overwatchAccount?.meta?.overwatch ?? null;

  const shouldFetchOverwatch = !!overwatchMeta;
  const isOwSelected = selectedGame === "overwatch";

  const overwatchQuery = useQuery({
    queryKey: ["gamedata", "overwatch", "stats", overwatchMeta?.battleTag],
    enabled: shouldFetchOverwatch && isOwSelected,
    queryFn: async () => {
      if (!overwatchMeta?.battleTag) {
        throw new Error("BattleTag가 없습니다.");
      }
      return await getOverwatchStats(overwatchMeta.battleTag);
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });

  const view: OverwatchViewState = useMemo(() => {
    if (!isOwSelected) return { kind: "owLoading" };

    if (!overwatchMeta) return { kind: "owError", message: "BattleTag가 없습니다." };
    if (overwatchQuery.isLoading) return { kind: "owLoading" };
    if (overwatchQuery.isError) {
      return { kind: "owError", message: "통계 정보를 불러오지 못했습니다. (프로필 비공개 가능성)" };
    }
    if (overwatchQuery.data) return { kind: "overwatch", data: overwatchQuery.data };
    return { kind: "owLoading" };
  }, [isOwSelected, overwatchMeta, overwatchQuery.data, overwatchQuery.isError, overwatchQuery.isLoading]);

  const cardOverride = useMemo(() => {
    if (!overwatchAccount) return null;

    const stateValue = overwatchMeta?.battleTag ? "연동됨" : "-";
    return {
      game: "overwatch" as const,
      accounts: [
        { label: "상태", value: stateValue },
        { label: "티어", value: "-" },
      ],
    };
  }, [overwatchAccount, overwatchMeta?.battleTag]);

  return {
    overwatchAccount,
    overwatchMeta,
    shouldFetchOverwatch,
    overwatchQuery,
    view,
    cardOverride,
  };
}
