// src/features/mypage/gameData/components/lol/MatchRow.tsx

import { Card } from "@/components/ui/Card";
import type { LolMatchItem } from "@/features/mypage/gameData/types/gameDataTypes";

type ChampionIcon = {
  name: string;
  iconUrl: string;
};

type MatchRowVM = LolMatchItem & {
  myChampion?: ChampionIcon;
  allies?: ChampionIcon[];
  enemies?: ChampionIcon[];
};

type Props = { match: MatchRowVM };

const ChampionAvatar = ({
  iconUrl,
  name,
  size = 34,
}: {
  iconUrl?: string;
  name?: string;
  size?: number;
}) => {
  if (!iconUrl) {
    return (
      <div
        className="rounded-md border border-gray-200 bg-gray-200"
        style={{ width: size, height: size }}
        aria-label={name ?? "champion"}
      />
    );
  }

  return (
    <div
      className="flex items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-gray-100"
      style={{ width: size, height: size }}
      title={name}
      aria-label={name}
    >
      <img
        src={iconUrl}
        alt={name ?? "champion"}
        className="h-full w-full object-cover"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
    </div>
  );
};

const ChampionsGrid = ({
  allies,
  enemies,
}: {
  allies?: ChampionIcon[];
  enemies?: ChampionIcon[];
}) => {
  const allyList = allies?.slice(0, 5) ?? [];
  const enemyList = enemies?.slice(0, 5) ?? [];

  const renderRow = (list: ChampionIcon[], keyPrefix: string) => {
    const items =
      list.length > 0
        ? list
        : Array.from({ length: 5 }).map(() => ({ name: "", iconUrl: "" }));

    return (
      <div className="flex justify-end gap-1">
        {items.map((c, idx) => (
          <ChampionAvatar
            key={`${keyPrefix}-${c.name || "x"}-${idx}`}
            iconUrl={c.iconUrl}
            name={c.name}
            size={28}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-1">
      {renderRow(allyList, "ally")}
      {renderRow(enemyList, "enemy")}
    </div>
  );
};

export const MatchRow = ({ match }: Props) => {
  const isWin = match.result === "win";
  const resultLabel = isWin ? "승리" : "패배";

  const resultTextClass = isWin ? "text-blue-600" : "text-red-500";
  const thinBarClass = isWin ? "bg-blue-600" : "bg-red-500";

  return (
    <Card className="px-6 py-4">
      <div className="flex items-center justify-between gap-6">
        {/* 왼쪽: 결과 정보(가운데 정렬) + 챔피언 */}
        <div className="flex min-w-[260px] items-center gap-6">
          {/* ✅ 결과 스택 (가운데 정렬 핵심) */}
          <div className="flex flex-col items-center text-center leading-tight">
            <div className={["text-base font-semibold", resultTextClass].join(" ")}>
              {resultLabel}
            </div>

            <div className="mt-1 text-xs text-gray-600">
              {match.durationText}
            </div>

            {/* 얇은 가로 바 */}
            <div
              className={["mt-2 h-[2px] w-8 rounded-full", thinBarClass].join(" ")}
            />

            <div className="mt-2 text-xs text-gray-500">
              {match.queueLabel}
            </div>
          </div>

          {/* 내 챔피언 */}
          <ChampionAvatar
            iconUrl={match.myChampion?.iconUrl}
            name={match.myChampion?.name}
            size={44}
          />
        </div>

        {/* 가운데: KDA */}
        <div className="flex flex-1 flex-col items-center">
          <div className="text-3xl font-extrabold leading-none text-gray-900">
            {match.kdaText}
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {match.kdaRatioText}
          </div>
        </div>

        {/* 오른쪽: 아군 / 적군 */}
        <div className="flex min-w-[240px] justify-end">
          <ChampionsGrid allies={match.allies} enemies={match.enemies} />
        </div>
      </div>
    </Card>
  );
};
