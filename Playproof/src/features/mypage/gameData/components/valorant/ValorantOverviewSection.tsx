// src/features/mypage/gameData/components/valorant/ValorantOverviewSection.tsx

import { useMemo } from "react";
import { Card } from "@/components/ui/Card";

type Overview = {
  winRatePercent: number;
  avgKills: number;
  avgDeaths: number;
  avgAssists: number;
  matchCount: number;
  wins?: number;
  losses?: number;
  draws?: number;
};

type LegacyDataShape = {
  // 기존 호환: data로 통째로 받는 형태
  overview?: Partial<Overview>;
  avgKd?: number | null;
  matches?: unknown[];
  rows?: unknown[];
};

type Props =
  | { data: LegacyDataShape }
  | { overview: Partial<Overview> };

function safeNumber(v: unknown, fallback = 0) {
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

function safeFixed(v: unknown, digits: number, fallbackText = "-") {
  if (typeof v !== "number" || !Number.isFinite(v)) return fallbackText;
  return v.toFixed(digits);
}

export function ValorantOverviewSection(props: Props) {
  const overview: Overview = useMemo(() => {
    const src =
      "data" in props ? props.data.overview ?? {} : props.overview ?? {};

    return {
      winRatePercent: safeNumber(src.winRatePercent, 0),
      avgKills: safeNumber(src.avgKills, 0),
      avgDeaths: safeNumber(src.avgDeaths, 0),
      avgAssists: safeNumber(src.avgAssists, 0),
      matchCount: safeNumber(src.matchCount, 0),
      wins: typeof src.wins === "number" ? src.wins : undefined,
      losses: typeof src.losses === "number" ? src.losses : undefined,
      draws: typeof src.draws === "number" ? src.draws : undefined,
    };
  }, [props]);

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="p-4 text-center">
        <p className="text-sm text-gray-500">승률</p>
        <p className="mt-1 text-xl font-semibold">
          {safeFixed(overview.winRatePercent, 1, "-")}%
        </p>
      </Card>

      <Card className="p-4 text-center">
        <p className="text-sm text-gray-500">평균 K / D / A</p>
        <p className="mt-1 text-xl font-semibold">
          {safeFixed(overview.avgKills, 1, "-")} / {safeFixed(overview.avgDeaths, 1, "-")} /{" "}
          {safeFixed(overview.avgAssists, 1, "-")}
        </p>
      </Card>

      <Card className="p-4 text-center">
        <p className="text-sm text-gray-500">최근 경기 수</p>
        <p className="mt-1 text-xl font-semibold">
          {Number.isFinite(overview.matchCount) ? `${overview.matchCount}판` : "-"}
        </p>
      </Card>
    </div>
  );
}
