// src/features/mypage/gameData/hooks/useOverwatchSummary.ts

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { overfastApi, type OverfastPlayerSummary } from "../api/overfastApi";

type Params = {
  battleTag: string;
  enabled?: boolean;
};

type Return = {
  data: OverfastPlayerSummary | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  refetch: () => void;
};

export function useOverwatchSummary({ battleTag, enabled = true }: Params): Return {
  const q = useQuery({
    queryKey: ["overwatchSummary", battleTag],
    queryFn: () => overfastApi.getOverwatchSummaryByBattleTag(battleTag),
    enabled: enabled && !!battleTag,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 1,
  });

  const errorMessage = useMemo(() => {
    if (!q.error) return null;
    if (q.error instanceof Error) return q.error.message;
    return "오버워치 데이터를 불러오지 못했습니다.";
  }, [q.error]);

  return {
    data: q.data ?? null,
    isLoading: q.isLoading,
    isError: q.isError,
    errorMessage,
    refetch: () => void q.refetch(),
  };
}