// src/features/mypage/gameData/hooks/useLolGameData.ts

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import type { GameDataDashboardData, LinkedAccount } from "@/features/mypage/gameData/types/gameDataTypes";
import { riotApi } from "@/features/mypage/gameData/api/riotApi";
import {
  buildLolAggregateStats,
  buildLolLinkedProfile,
  buildLolMatchList,
  computeMainPosition,
} from "@/features/mypage/gameData/utils/lolViewModel";

type LolStatus =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "success"; lol: GameDataDashboardData["lol"] };

function findLolAccount(accounts: LinkedAccount[]) {
  return accounts.find((a) => a.game === "lol") ?? null;
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  mapper: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  const queue = [...items];

  const workers = Array.from({ length: Math.max(1, concurrency) }).map(async () => {
    while (queue.length > 0) {
      const item = queue.shift();
      if (item === undefined) break;

      const settled = await Promise.allSettled([mapper(item)]);
      const one = settled[0];
      if (one.status === "fulfilled") results.push(one.value);
    }
  });

  await Promise.all(workers);
  return results;
}

export function useLolGameData(params: {
  linkedAccounts: LinkedAccount[];
  isSelected: boolean;
  page: number;
  pageSize: number;
  totalPages: number;
}) {
  const { linkedAccounts, isSelected, page, pageSize, totalPages } = params;

  const lolAccount = useMemo(() => findLolAccount(linkedAccounts), [linkedAccounts]);
  const riotMeta = lolAccount?.meta?.riot ?? null;
  const shouldFetchLol = !!riotMeta;

  // 1) Summary (가벼움)
  const lolSummaryQuery = useQuery({
    queryKey: ["gamedata", "lol", "summary", riotMeta?.riotId],
    enabled: shouldFetchLol,
    queryFn: async () => {
      const account = await riotApi.getPuuidByRiotId(riotMeta!.gameName, riotMeta!.tagLine);

      const [summoner, leagueEntries] = await Promise.all([
        riotApi.getSummonerByPuuid(account.puuid).catch(() => null),
        riotApi.getLeagueEntriesByPuuid(account.puuid).catch(() => []),
      ]);

      const linkedProfile = buildLolLinkedProfile(account, summoner, leagueEntries);
      return { account, linkedProfile };
    },
    staleTime: 1000 * 60 * 10,
  });

  // 2) Matches (무거움, LoL 선택 시만)
  const lolMatchesQuery = useQuery({
    queryKey: ["gamedata", "lol", "matches", riotMeta?.riotId, page, pageSize],
    enabled: shouldFetchLol && isSelected,
    queryFn: async (): Promise<GameDataDashboardData["lol"]> => {
      const summary = lolSummaryQuery.data;

      const account =
        summary?.account ??
        (await riotApi.getPuuidByRiotId(riotMeta!.gameName, riotMeta!.tagLine));

      const matchIds = await riotApi.getMatchIdsByPuuid(account.puuid, {
        start: (page - 1) * pageSize,
        count: pageSize,
      });

      const details = await mapWithConcurrency(matchIds, 8, async (id) => await riotApi.getMatchDetail(id));

      const aggregate = buildLolAggregateStats(details as never, account.puuid);
      const matches = buildLolMatchList(details as never, account.puuid);

      // ✅ 주 포지션: 최근 N판 기반
      const mainPosition = computeMainPosition(details as never, account.puuid);

      // ✅ linkedProfile: 요약 + 전적 기반 승률/포지션 override
      const baseLinkedProfile = summary?.linkedProfile;
      const linkedProfile = baseLinkedProfile
        ? {
            ...baseLinkedProfile,
            winRatePercent: aggregate.winRatePercent,
            mainPosition,
          }
        : buildLolLinkedProfile(
            account,
            await riotApi.getSummonerByPuuid(account.puuid).catch(() => null),
            await riotApi.getLeagueEntriesByPuuid(account.puuid).catch(() => []),
            {
              fallbackWinRatePercent: aggregate.winRatePercent,
              fallbackMainPosition: mainPosition,
            }
          );

      return {
        linkedProfile,
        aggregate,
        matches,
        pagination: { page, pageSize, totalPages: Math.max(1, totalPages) },
      };
    },
    staleTime: 1000 * 60 * 5,
  });

  const status: LolStatus = useMemo(() => {
    if (!shouldFetchLol) return { kind: "idle" };

    if (isSelected) {
      if (lolMatchesQuery.isLoading) return { kind: "loading" };
      if (lolMatchesQuery.isError) return { kind: "error", message: "오류 발생" };
      if (lolMatchesQuery.data) return { kind: "success", lol: lolMatchesQuery.data };
      return { kind: "loading" };
    }

    // 선택 전에는 summary만 있어도 카드 표시엔 충분
    return { kind: "idle" };
  }, [isSelected, lolMatchesQuery.data, lolMatchesQuery.isError, lolMatchesQuery.isLoading, shouldFetchLol]);

  /**
   * ✅ 연동 카드(LinkedAccountsRow)용 override 값
   * - LoL 클릭 후: matchesQuery 기반 승률/포지션으로 갱신
   * - 그 전: summaryProfile 기반(가능한 범위)
   */
  const cardOverride = useMemo(() => {
    if (!lolAccount) return null;

    const summaryProfile = lolSummaryQuery.data?.linkedProfile;
    const matchProfile = lolMatchesQuery.data?.linkedProfile;
    const matchAgg = lolMatchesQuery.data?.aggregate;

    const tierForCards = (matchProfile?.currentTier ?? summaryProfile?.currentTier) ?? "-";
    const posForCards = (matchProfile?.mainPosition ?? summaryProfile?.mainPosition) ?? "미정";

    const winRateForCards =
      typeof matchAgg?.winRatePercent === "number"
        ? matchAgg.winRatePercent
        : typeof (matchProfile?.winRatePercent ?? summaryProfile?.winRatePercent) === "number"
        ? (matchProfile?.winRatePercent ?? summaryProfile?.winRatePercent)
        : null;

    const winRateLabel = winRateForCards === null ? "-" : `${winRateForCards}%`;

    return {
      game: "lol" as const,
      accounts: [
        { label: "티어", value: tierForCards },
        { label: "주 포지션", value: posForCards },
        { label: "승률", value: winRateLabel },
      ],
    };
  }, [lolAccount, lolMatchesQuery.data, lolSummaryQuery.data]);

  return {
    lolAccount,
    riotMeta,
    shouldFetchLol,
    status,
    lolSummaryQuery,
    lolMatchesQuery,
    cardOverride,
  };
}
