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

type LeagueEntryLike = {
  queueType: string;
  tier: string;
  rank: string;
  wins: number;
  losses: number;
};

function pickSoloQueueEntry(entries: LeagueEntryLike[]) {
  return entries.find((e) => e.queueType === "RANKED_SOLO_5x5") ?? null;
}

function computeTierTextFromLeagueEntries(entries: LeagueEntryLike[]) {
  const solo = pickSoloQueueEntry(entries);
  return solo ? `${solo.tier} ${solo.rank}` : "-";
}

function computeWinRateFromLeagueEntries(entries: LeagueEntryLike[]) {
  const solo = pickSoloQueueEntry(entries);
  if (!solo) return null;
  const total = (solo.wins ?? 0) + (solo.losses ?? 0);
  if (total <= 0) return null;
  return Math.round((solo.wins / total) * 100);
}

function ensureLolLinkedProfileFields(args: {
  linkedProfile: any; // buildLolLinkedProfile의 리턴 shape가 프로젝트마다 다를 수 있어 방어적으로 처리
  leagueEntries: LeagueEntryLike[];
}) {
  const { linkedProfile, leagueEntries } = args;

  const tierText = computeTierTextFromLeagueEntries(leagueEntries);

  // currentTier가 없으면 tierText로 채워준다.
  const currentTier =
    linkedProfile?.currentTier ??
    linkedProfile?.tierText ??
    linkedProfile?.tier ??
    (tierText !== "-" ? tierText : null) ??
    "-";

  // winRatePercent가 없으면 leagueEntries 기반으로 채울 수 있는 만큼 채운다(없으면 null 유지)
  const winRateFromLeague = computeWinRateFromLeagueEntries(leagueEntries);
  const winRatePercent =
    typeof linkedProfile?.winRatePercent === "number" ? linkedProfile.winRatePercent : winRateFromLeague;

  // mainPosition은 UI에서 "미정" fallback이 있지만, 가능하면 여기서도 보정
  const mainPosition = linkedProfile?.mainPosition ?? "미정";

  return {
    ...linkedProfile,
    currentTier,
    winRatePercent,
    mainPosition,
  };
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
  // ✅ leagueEntries까지 함께 반환해서 카드에서 “직접 계산”하도록 한다.
  const lolSummaryQuery = useQuery({
    queryKey: ["gamedata", "lol", "summary", riotMeta?.riotId],
    enabled: shouldFetchLol,
    queryFn: async () => {
      const account = await riotApi.getPuuidByRiotId(riotMeta!.gameName, riotMeta!.tagLine);

      const [summoner, leagueEntries] = await Promise.all([
        riotApi.getSummonerByPuuid(account.puuid).catch(() => null),
        riotApi.getLeagueEntriesByPuuid(account.puuid).catch(() => []),
      ]);

      const baseLinkedProfile = buildLolLinkedProfile(account, summoner, leagueEntries);

      // ✅ 핵심: currentTier / winRatePercent / mainPosition 보정
      const linkedProfile = ensureLolLinkedProfileFields({
        linkedProfile: baseLinkedProfile,
        leagueEntries: leagueEntries as unknown as LeagueEntryLike[],
      });

      return { account, linkedProfile, leagueEntries };
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
        summary?.account ?? (await riotApi.getPuuidByRiotId(riotMeta!.gameName, riotMeta!.tagLine));

      const matchIds = await riotApi.getMatchIdsByPuuid(account.puuid, {
        start: (page - 1) * pageSize,
        count: pageSize,
      });

      const details = await mapWithConcurrency(matchIds, 8, async (id) => await riotApi.getMatchDetail(id));
      console.log("첫 매치 participants", details[0]?.info?.participants);
      const aggregate = buildLolAggregateStats(details as never, account.puuid);
      const matches = buildLolMatchList(details as never, account.puuid);

      // ✅ 주 포지션: 최근 N판에서 "내 participant"만 모아 계산
      const myParticipants = details
        .flatMap((m) => m.info.participants)
        .filter((p) => p.puuid === account.puuid);

      const mainPosition = computeMainPosition(myParticipants);

      const leagueEntries =
        (summary?.leagueEntries ?? (await riotApi.getLeagueEntriesByPuuid(account.puuid).catch(() => []))) as unknown as
          | LeagueEntryLike[]
          | [];

      // ✅ linkedProfile: 요약 + 전적 기반 승률/포지션 override + 티어(currentTier) 보정
      const baseLinkedProfile =
        summary?.linkedProfile ??
        buildLolLinkedProfile(
          account,
          await riotApi.getSummonerByPuuid(account.puuid).catch(() => null),
          leagueEntries as never
        );

      const ensured = ensureLolLinkedProfileFields({
        linkedProfile: baseLinkedProfile,
        leagueEntries: leagueEntries as LeagueEntryLike[],
      });

      const linkedProfile = {
        ...ensured,
        winRatePercent: aggregate.winRatePercent,
        mainPosition,
      };

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
   * - 그 전: leagueEntries 기반(티어/승률) + summaryProfile 기반(포지션)
   *
   * 핵심: linkedProfile의 필드명(tierText/currentTier 등)에 의존하지 않고
   *      leagueEntries로 카드 표시값을 직접 계산한다.
   */
  const cardOverride = useMemo(() => {
    if (!lolAccount) return null;

    const leagueEntries = (lolSummaryQuery.data?.leagueEntries ?? []) as unknown as LeagueEntryLike[];
    const solo = leagueEntries.find((e) => e.queueType === "RANKED_SOLO_5x5") ?? null;

    // 티어(카드): leagueEntries 기반
    const tierForCards = solo ? `${solo.tier} ${solo.rank}` : "-";

    // 주 포지션(카드): match 선택 후(mainPosition) → summary(mainPosition) → 미정
    const posForCards =
      (lolMatchesQuery.data?.linkedProfile?.mainPosition ?? lolSummaryQuery.data?.linkedProfile?.mainPosition) ??
      "미정";

    // 승률(카드): match aggregate 우선 → leagueEntries 기반 승률 → "-"
    const winRateFromLeague =
      solo && solo.wins + solo.losses > 0 ? Math.round((solo.wins / (solo.wins + solo.losses)) * 100) : null;

    const winRateFromMatches = lolMatchesQuery.data?.aggregate?.winRatePercent;

    const winRateForCards =
      typeof winRateFromMatches === "number"
        ? winRateFromMatches
        : typeof winRateFromLeague === "number"
        ? winRateFromLeague
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
