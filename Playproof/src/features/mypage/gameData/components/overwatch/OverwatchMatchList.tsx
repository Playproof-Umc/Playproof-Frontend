// src/features/mypage/gameData/components/overwatch/OverwatchMatchList.tsx

import { Button } from "@/components/ui/Button";
import { useOverwatchMatches } from "@/features/mypage/gameData/hooks/useOverwatchMatches";

type Props = {
  battleTag: string;
  visible: boolean;
};

export function OverwatchMatchList({ battleTag, visible }: Props) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useOverwatchMatches(battleTag, visible);

  if (!visible) return null;

  const matches = data?.pages.flat() ?? [];

  return (
    <div className="mt-6 space-y-3">
      {matches.map((m) => (
        <div
          key={m.id}
          className="rounded-lg border bg-white px-4 py-3 text-sm"
        >
          <div className="flex justify-between">
            <span>{m.map} · {m.mode}</span>
            <span className={m.result === "win" ? "text-blue-600" : "text-red-500"}>
              {m.result.toUpperCase()}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {new Date(m.played_at).toLocaleString()}
          </div>
        </div>
      ))}

      {hasNextPage && (
        <Button
          variant="outline"
          fullWidth
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? "불러오는 중..." : "더 보기"}
        </Button>
      )}
    </div>
  );
}