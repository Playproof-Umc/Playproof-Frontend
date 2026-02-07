// src/features/home/components/MatchingTabs.tsx

import { GAME_TABS, MATCHING_TAB_LABELS } from "@/features/home/constants/matchingTabs";

type MatchingTabsProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onMoreClick?: () => void;
};

export function MatchingTabs({ activeTab, onTabChange, onMoreClick }: MatchingTabsProps) {
  return (
    <section className="space-y-4">
      {/* 타이틀과 전체보기 버튼 등은 필요하면 유지, 여기서는 타이틀만 남김 */}
      <h2 className="text-xl font-bold text-zinc-900">{MATCHING_TAB_LABELS.title}</h2>

      {/* 탭 버튼 영역만 남김 */}
      <div className="flex gap-2 border-b border-zinc-200">
        {GAME_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={[
              "px-4 py-2 text-sm font-medium transition-colors relative",
              activeTab === tab
                ? "text-zinc-900"
                : "text-zinc-500 hover:text-zinc-700",
            ].join(" ")}
          >
            {tab}
            {/* 활성화 탭 하단 바 */}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full bg-zinc-900" />
            )}
          </button>
        ))}
        {/* 우측 '매칭 내역' 버튼 등은 필요시 유지 */}
        <button
          type="button"
          onClick={onMoreClick}
          className="ml-auto text-sm text-zinc-500 hover:text-zinc-900"
        >
          {MATCHING_TAB_LABELS.history}
        </button>
      </div>
      
      
    </section>
  );
}
