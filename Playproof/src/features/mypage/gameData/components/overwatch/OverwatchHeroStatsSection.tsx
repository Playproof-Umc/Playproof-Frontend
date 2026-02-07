// src/features/mypage/gameData/components/overwatch/OverwatchHeroStatsSection.tsx

import { Card } from "@/components/ui/Card";
import type { OverwatchHeroStatRow } from "@/features/mypage/gameData/hooks/useOverwatchHeroStats";
import { useOverwatchHeroes } from "@/features/mypage/gameData/hooks/useOverwatchHeros";

function formatPlaytimeSeconds(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function fmt(v: number | null) {
  if (v === null || !Number.isFinite(v)) return "-";
  return String(Math.round(v));
}

function HeroIcon({ url, alt }: { url: string | null; alt: string }) {
  return (
    <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-100">
      {url ? <img src={url} alt={alt} className="h-full w-full object-cover" /> : null}
    </div>
  );
}

export function OverwatchHeroStatsSection(props: {
  rows: OverwatchHeroStatRow[];
  title?: string;
}) {
  const { rows, title = "영웅별 통계" } = props;

  // 영웅 메타(아이콘/이름) 로드
  const heroes = useOverwatchHeroes({ locale: "ko-kr", enabled: rows.length > 0 });

  return (
    <div className="mt-6 space-y-3">
      <div className="px-1 text-sm font-semibold text-gray-900">{title}</div>

      <Card className="p-4">
        {rows.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-500">
            표시할 영웅 통계가 없어요.
          </div>
        ) : (
          <div className="space-y-2">
            {rows.map((r, idx) => {
              const key = r.hero.toLowerCase();
              const meta = heroes.map.get(key);

              const heroName = meta?.name ?? r.hero;
              const iconUrl = meta?.iconUrl ?? null;

              return (
                <div
                  key={`${r.hero}-${idx}`}
                  className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 px-4 py-3"
                >
                  {/* 좌측: 아이콘 + 이름 */}
                  <div className="flex min-w-0 items-center gap-3">
                    <HeroIcon url={iconUrl} alt={heroName} />

                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-gray-900">
                        {heroName}
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
                        <span>{formatPlaytimeSeconds(r.playtimeSeconds)}</span>
                        <span className="text-gray-300">•</span>
                        <span>
                          {r.gamesPlayed > 0 ? `${r.gamesPlayed}판 / ${r.gamesWon}승` : "기록 없음"}
                        </span>
                        {r.winRatePercent !== null ? (
                          <>
                            <span className="text-gray-300">•</span>
                            <span>{r.winRatePercent}%</span>
                          </>
                        ) : null}
                      </div>

                      {heroes.isLoading ? (
                        <div className="mt-1 text-[11px] text-gray-400">
                          영웅 아이콘 불러오는 중…
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* 우측: 통계 */}
                  <div className="flex shrink-0 items-center gap-4 text-right">
                    <div>
                      <div className="text-[10px] font-semibold text-gray-500">ELIM</div>
                      <div className="text-sm font-semibold text-gray-900">{fmt(r.eliminationsPer10)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold text-gray-500">DEATH</div>
                      <div className="text-sm font-semibold text-gray-900">{fmt(r.deathsPer10)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold text-gray-500">DMG</div>
                      <div className="text-sm font-semibold text-gray-900">{fmt(r.heroDamagePer10)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold text-gray-500">HEAL</div>
                      <div className="text-sm font-semibold text-gray-900">{fmt(r.healingPer10)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
