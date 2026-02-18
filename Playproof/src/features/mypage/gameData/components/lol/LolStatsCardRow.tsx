// src/features/mypage/gameData/components/lol/LolStatsCardRow.tsx

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import type { LolAggregateStats } from "@/features/mypage/gameData/types/gameDataTypes";
import { getChampionIconUrl } from "@/features/mypage/gameData/utils/lolViewModel";

type Props = { stats: LolAggregateStats };

function clampPercent(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

function WinLossDonut({
  wins,
  losses,
  size = 72,
  stroke = 10,
}: {
  wins: number;
  losses: number;
  size?: number;
  stroke?: number;
}) {
  const total = Math.max(0, wins) + Math.max(0, losses);
  const winRatio = total === 0 ? 0 : wins / total;

  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  const winDash = c * winRatio;
  const lossDash = c - winDash;

  const gap = 1.2;
  const winDashAdj = Math.max(0, winDash - gap);
  const lossDashAdj = Math.max(0, lossDash - gap);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label="winloss-donut">
        <g transform={`translate(${size / 2},${size / 2}) rotate(-90)`}>
          <circle r={r} fill="none" strokeWidth={stroke} className="text-gray-200" stroke="currentColor" />

          <circle
            r={r}
            fill="none"
            strokeWidth={stroke}
            className="text-indigo-500"
            stroke="currentColor"
            strokeLinecap="round"
            strokeDasharray={`${winDashAdj} ${c - winDashAdj}`}
            strokeDashoffset={0}
          />

          <circle
            r={r}
            fill="none"
            strokeWidth={stroke}
            className="text-rose-400"
            stroke="currentColor"
            strokeLinecap="round"
            strokeDasharray={`${lossDashAdj} ${c - lossDashAdj}`}
            strokeDashoffset={-(winDash)}
          />
        </g>
      </svg>
    </div>
  );
}

function ChampionIcon({ name }: { name: string }) {
  const safeName = (name ?? "").trim();
  const [broken, setBroken] = useState(false);

  const url = useMemo(() => {
    // ✅ name이 비어있으면 URL을 만들지 않는다 (undefined.png 방지)
    if (!safeName) return null;
    try {
      return getChampionIconUrl(safeName);
    } catch {
      return null;
    }
  }, [safeName]);

  const showFallback = broken || !url;

  return (
    <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gray-200">
      {!showFallback && (
        <img
          src={url}
          alt={safeName}
          className="h-full w-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setBroken(true)}
        />
      )}

      {showFallback && (
        <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-gray-500">
          ?
        </div>
      )}
    </div>
  );
}

export const LolStatsCardRow = ({ stats }: Props) => {
  const winRate = clampPercent(stats.winRatePercent);

  const most3 = useMemo(() => {
    const arr = stats.mostChampions ?? [];
    return arr.slice(0, 3).map((c, idx) => ({
      // ✅ name이 비면 표시용 텍스트를 강제
      name: (c?.name ?? "").trim() || "Unknown",
      // ✅ key 안정화
      key: `${(c?.name ?? "").trim() || "unknown"}-${idx}`,
    }));
  }, [stats.mostChampions]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* 승률 */}
      <Card className="p-6">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3">
            <div className="min-w-[42px] text-right text-xs font-semibold text-gray-500">
              {stats.losses}L
            </div>

            <WinLossDonut wins={stats.wins} losses={stats.losses} />

            <div className="min-w-[42px] text-left text-xs font-semibold text-gray-500">
              {stats.wins}W
            </div>
          </div>

          <div className="min-w-[110px]">
            <div className="text-[11px] text-gray-500">승률</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">{winRate}%</div>
            <div className="mt-1 text-xs text-gray-500">
              {stats.wins}W {stats.losses}L
            </div>
          </div>
        </div>
      </Card>

      {/* 평균 KDA */}
      <Card className="p-6">
        <div className="text-[11px] text-gray-500">평균 K/D/A</div>
        <div className="mt-2 text-2xl font-semibold text-gray-900">
          {stats.avgKdaRatio.toFixed(2)}
        </div>
        <div className="mt-1 text-xs text-gray-500">
          {stats.avgKills.toFixed(1)} / {stats.avgDeaths.toFixed(1)} / {stats.avgAssists.toFixed(1)}
        </div>
      </Card>

      {/* 모스트 챔피언 */}
      <Card className="p-6">
        <div className="text-[11px] text-gray-500">모스트 챔피언</div>

        <div className="mt-4 flex items-center gap-6">
          {most3.map((c) => (
            <div key={c.key} className="flex flex-col items-center gap-2">
              <ChampionIcon name={c.name} />
              <div className="text-[11px] text-gray-600">{c.name}</div>
            </div>
          ))}

          {(stats.mostChampions?.length ?? 0) === 0 && (
            <div className="text-xs text-gray-400">데이터가 부족합니다.</div>
          )}
        </div>
      </Card>
    </div>
  );
};
