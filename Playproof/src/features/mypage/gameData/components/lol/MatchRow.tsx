import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/Card";
import type { LolMatchItem } from "@/features/mypage/gameData/types/gameDataTypes";
import { getChampionIconUrl } from "@/features/mypage/gameData/utils/lolViewModel";

type Props = { match: LolMatchItem };

function useInView<T extends Element>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        obs.disconnect();
      }
    }, options);

    obs.observe(el);
    return () => obs.disconnect();
  }, [options]);

  return { ref, inView };
}

type ChampIconProps = {
  name: string;
  size: number; // px
  className?: string;
  borderClassName?: string;
  title?: string;
};

function ChampIcon({ name, size, className = "", borderClassName = "", title }: ChampIconProps) {
  const url = useMemo(() => getChampionIconUrl(name), [name]);

  // ✅ url이 비어있으면 img 자체를 만들지 않음 (요청/에러 방지)
  if (!url) {
    return (
      <div
        className={[
          "bg-gray-100",
          borderClassName,
          className,
        ].join(" ")}
        style={{ width: size, height: size, borderRadius: 6 }}
        title={title ?? name}
      />
    );
  }

  return (
    <div
      className={["relative", className].join(" ")}
      style={{ width: size, height: size }}
      title={title ?? name}
    >
      {/* placeholder는 항상 깔아두고 */}
      <div
        className={["absolute inset-0 bg-gray-100", borderClassName].join(" ")}
        style={{ borderRadius: 6 }}
      />
      {/* img는 성공 시에만 위에 보이게 */}
      <img
        src={url}
        alt={name}
        className={["absolute inset-0 object-cover", borderClassName].join(" ")}
        style={{ width: size, height: size, borderRadius: 6 }}
        loading="lazy"
        decoding="async"
        fetchPriority="low"
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        onError={(e) => {
          // ✅ 실패하면 img만 숨겨서 placeholder만 보이게 (무한 루프 없음)
          e.currentTarget.style.display = "none";
        }}
      />
    </div>
  );
}

export const MatchRow = ({ match }: Props) => {
  const isWin = match.result === "win";
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "200px" });

  const cardStyle = isWin
    ? "border-l-4 border-l-blue-500 bg-blue-50/30 hover:bg-blue-50/60"
    : "border-l-4 border-l-red-500 bg-red-50/30 hover:bg-red-50/60";

  const textStyle = isWin ? "text-blue-600" : "text-red-600";
  const bgBadge = isWin ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700";

  return (
    <Card className={`px-4 py-3 transition-colors ${cardStyle}`}>
      <div ref={ref} className="flex items-center gap-3 md:gap-6">
        {/* 1) 왼쪽 */}
        <div className="flex w-[80px] shrink-0 flex-col gap-1">
          <div className={`text-sm font-bold ${textStyle}`}>{isWin ? "승리" : "패배"}</div>
          <div className="text-[11px] text-gray-500">{match.durationText}</div>
          <div className={`my-1 h-[2px] w-6 ${isWin ? "bg-blue-200" : "bg-red-200"}`} />
          <div className="text-[11px] font-medium text-gray-600">{match.queueLabel}</div>
        </div>

        {/* 2) 내 챔피언 + KDA */}
        <div className="flex w-[160px] shrink-0 items-center gap-3">
          <div className="relative">
            <ChampIcon name={match.myChampionName} size={48} />

            {/* 아이템 개수 뱃지 */}
            <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-800 text-[10px] text-white">
              {match.itemsCount}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="text-sm font-bold tracking-tight text-gray-900">{match.kdaText}</div>
            <div className="text-[11px] text-gray-500">{match.kdaRatioText}</div>
          </div>
        </div>

        {/* 3) Pills */}
        <div className="hidden w-[80px] shrink-0 flex-col gap-1 sm:flex">
          {match.pills.map((p) => (
            <span key={p} className={`w-fit rounded px-1.5 py-0.5 text-[10px] font-medium ${bgBadge}`}>
              {p}
            </span>
          ))}
        </div>

        {/* 4) 팀/상대 아이콘 */}
        <div className="hidden flex-1 items-center justify-end gap-6 md:flex">
          <div className="flex gap-0.5">
            {inView
              ? match.teamChampions.map((champ, i) => (
                  <ChampIcon
                    key={`${match.id}-team-${i}`}
                    name={champ}
                    size={24}
                    borderClassName="border border-gray-300"
                  />
                ))
              : Array.from({ length: 5 }).map((_, i) => (
                  <div key={`${match.id}-team-skel-${i}`} className="h-6 w-6 rounded bg-gray-100" />
                ))}
          </div>

          <div className="text-[10px] font-bold text-gray-400">VS</div>

          <div className="flex gap-0.5">
            {inView
              ? match.opponentChampions.map((champ, i) => (
                  <ChampIcon
                    key={`${match.id}-enemy-${i}`}
                    name={champ}
                    size={24}
                    borderClassName="border border-red-200"
                    className="bg-red-50"
                  />
                ))
              : Array.from({ length: 5 }).map((_, i) => (
                  <div key={`${match.id}-enemy-skel-${i}`} className="h-6 w-6 rounded bg-gray-100" />
                ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
