// src/features/mypage/gameData/hooks/useOverwatchHeroStats.ts

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { overwatchClient } from "@/services/axios";

export type OverwatchHeroStatRow = {
  hero: string;
  playtimeSeconds: number;
  gamesPlayed: number;
  gamesWon: number;
  winRatePercent: number | null;

  eliminationsPer10: number | null;
  deathsPer10: number | null;
  heroDamagePer10: number | null;
  healingPer10: number | null;
};

type OverwatchStatsResponse = {
  heroStatsTop: OverwatchHeroStatRow[];
};

async function fetchHeroStats(params: {
  battleTag: string;
  limit: number;
  gamemode: "competitive" | "quickplay";
}): Promise<OverwatchHeroStatRow[]> {
  const res = await overwatchClient.get<OverwatchStatsResponse>("/stats", {
    params,
  });

  const rows = res.data?.heroStatsTop ?? [];
  return Array.isArray(rows) ? rows : [];
}

export function useOverwatchHeroStats(input: {
  battleTag: string;
  enabled?: boolean;
  limit?: number;
  gamemode?: "competitive" | "quickplay";
}) {
  const battleTag = input.battleTag.trim();
  const enabled = (input.enabled ?? true) && battleTag.length > 0;
  const limit = input.limit ?? 10;
  const gamemode = input.gamemode ?? "competitive";

  const q = useQuery({
    queryKey: ["overwatchHeroStats", battleTag, limit, gamemode],
    queryFn: () => fetchHeroStats({ battleTag, limit, gamemode }),
    enabled,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const rows = useMemo(() => q.data ?? [], [q.data]);

  return {
    rows,
    isLoading: q.isLoading,
    isError: q.isError,
    error: q.error,
    refetch: () => void q.refetch(),
  };
}
