// src/features/mypage/pages/GameDataPageView.tsx

import { Card } from "@/components/ui/Card";
import {
  UserProfileCard,
  LinkedAccountsRow,
  LolOverviewSection,
  ValorantOverviewSection,
  ValorantMatchRow,
  OverwatchOverviewSection,
  OverwatchHeroStatsSection,
} from "@/features/mypage/gameData/components";
import { useOverwatchHeroStats } from "@/features/mypage/gameData/hooks/useOverwatchHeroStats";
import { useGameDataDashboard } from "@/features/mypage/gameData/hooks/useGameDataDashboard";
import type { LinkedAccount } from "@/features/mypage/gameData/types/gameDataTypes";

function getOverwatchBattleTag(accounts: LinkedAccount[]): string {
  const ow = accounts.find((a) => a.game === "overwatch");
  const meta = ow?.meta as Record<string, unknown> | undefined;

  const overwatch = meta?.["overwatch"];
  if (overwatch && typeof overwatch === "object") {
    const bt = (overwatch as Record<string, unknown>)["battleTag"];
    if (typeof bt === "string") return bt.trim();
  }

  return "";
}

export const GameDataPageView = () => {
  const dashboard = useGameDataDashboard();
console.log("DEBUG linkedAccounts", dashboard.data.linkedAccounts);

  const battleTag = getOverwatchBattleTag(dashboard.data.linkedAccounts);

  const heroStats = useOverwatchHeroStats({
    battleTag,
    enabled: dashboard.view.kind === "overwatch",
    limit: 10,
    gamemode: "competitive",
  });

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="mx-auto w-full max-w-[1280px] px-6 py-10">
        <UserProfileCard profile={dashboard.data.userProfile} />

        <div className="mt-10">
          <div className="mb-4 text-sm font-semibold text-gray-700">연동된 게임 계정</div>

          <LinkedAccountsRow
            accounts={dashboard.data.linkedAccounts}
            selectedGame={dashboard.selectedGame}
            onSelectGame={dashboard.actions.onSelectGame}
          />
        </div>

        <div className="mt-8">
          {/* --- LoL States --- */}
          {dashboard.view.kind === "lolLoading" && (
            <Card className="p-8">
              <div className="text-sm font-semibold text-gray-900">리그오브레전드 불러오는 중...</div>
              <div className="mt-2 text-xs text-gray-500">전적 데이터를 가져오고 있어요.</div>
            </Card>
          )}

          {dashboard.view.kind === "lolError" && (
            <Card className="p-8">
              <div className="text-sm font-semibold text-gray-900">일시적인 오류</div>
              <div className="mt-2 text-xs text-gray-500">{dashboard.view.message}</div>
            </Card>
          )}

          {dashboard.view.kind === "lol" && (
            <LolOverviewSection
              linkedProfile={dashboard.view.lol.linkedProfile}
              aggregate={dashboard.view.lol.aggregate}
              matches={dashboard.view.lol.matches}
              pagination={dashboard.view.lol.pagination}
              activeTab={dashboard.activeTab}
              onChangeTab={dashboard.actions.onChangeTab}
              onChangePage={dashboard.actions.onChangeLolPage}
            />
          )}

          {/* --- Valorant States --- */}
          {dashboard.view.kind === "valLoading" && (
            <Card className="p-8">
              <div className="text-sm font-semibold text-gray-900">발로란트 데이터 불러오는 중...</div>
              <div className="mt-2 text-xs text-gray-500">최근 매치 기록을 분석하고 있어요.</div>
            </Card>
          )}

          {dashboard.view.kind === "valError" && (
            <Card className="p-8">
              <div className="text-sm font-semibold text-gray-900">데이터 로드 실패</div>
              <div className="mt-2 text-xs text-gray-500">{dashboard.view.message}</div>
            </Card>
          )}

          {dashboard.view.kind === "valorant" && (
            <>
              <ValorantOverviewSection data={dashboard.view.data} />

              <div className="mt-6 space-y-3">
                {(dashboard.view.data.rows ?? []).map((vm, idx) => (
                  <ValorantMatchRow key={idx} vm={vm} />
                ))}

                {(dashboard.view.data.rows ?? []).length === 0 && (
                  <Card className="p-6">
                    <div className="text-sm font-semibold text-gray-900">표시할 전적이 없습니다.</div>
                    <div className="mt-1 text-xs text-gray-500">
                      매치 데이터가 없거나, match detail에서 내 플레이어 매칭에 실패했을 수 있어요.
                    </div>
                  </Card>
                )}
              </div>
            </>
          )}

          {/* --- Overwatch States --- */}
          {dashboard.view.kind === "owLoading" && (
            <Card className="p-8">
              <div className="text-sm font-semibold text-gray-900">오버워치 데이터 불러오는 중...</div>
              <div className="mt-2 text-xs text-gray-500">최근 경쟁전 기록을 분석하고 있어요.</div>
            </Card>
          )}

          {dashboard.view.kind === "owError" && (
            <Card className="p-8">
              <div className="text-sm font-semibold text-gray-900">데이터 로드 실패</div>
              <div className="mt-2 text-xs text-gray-500">{dashboard.view.message}</div>
            </Card>
          )}

          {dashboard.view.kind === "overwatch" && (
            <>
              <OverwatchOverviewSection data={dashboard.view.data} />

              {heroStats.isLoading ? (
                <Card className="mt-6 p-6">
                  <div className="text-sm font-semibold text-gray-900">영웅 통계 불러오는 중...</div>
                  <div className="mt-2 text-xs text-gray-500">영웅별 전적 데이터를 가져오고 있어요.</div>
                </Card>
              ) : heroStats.isError ? (
                <Card className="mt-6 p-6">
                  <div className="text-sm font-semibold text-gray-900">영웅 통계 로드 실패</div>
                  <div className="mt-2 text-xs text-gray-500">
                    일시적인 오류입니다. (레이트리밋일 수 있어요)
                  </div>
                </Card>
              ) : (
                <OverwatchHeroStatsSection rows={heroStats.rows} />
              )}
            </>
          )}

          {/* --- Fallbacks --- */}
          {dashboard.view.kind === "placeholder" && (
            <Card className="p-8">
              <div className="text-lg font-semibold">{dashboard.view.title}</div>
              <div className="mt-2 text-sm text-gray-600">{dashboard.view.subtitle}</div>
            </Card>
          )}

          {dashboard.view.kind === "empty" && (
            <Card className="p-8">
              <div className="text-sm text-gray-600">연동된 게임이 없습니다.</div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};
