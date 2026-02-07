// src/features/mypage/gameData/hooks/useOverwatchMatches.tsx

import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { getOverwatchMatches, type OverwatchMatch } from "@/features/mypage/gameData/api/overwatchApi";

const PAGE_SIZE = 10;

export function useOverwatchMatches(battleTag: string, enabled: boolean) {
  return useInfiniteQuery<
    OverwatchMatch[],
    Error,
    InfiniteData<OverwatchMatch[]>,
    string[],
    number
  >({
    queryKey: ["overwatch-matches", battleTag],
    enabled: enabled && !!battleTag,
    initialPageParam: 0,
    queryFn: ({ pageParam = 0 }) =>
      getOverwatchMatches({
        battleTag,
        offset: pageParam,
        limit: PAGE_SIZE,
      }),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      return pages.length * PAGE_SIZE;
    },
    staleTime: 60_000,
  });
}
