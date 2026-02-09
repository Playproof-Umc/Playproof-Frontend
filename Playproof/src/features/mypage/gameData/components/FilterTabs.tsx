// src/features/mypage/gameData/components/FilterTabs.tsx

import type { DashboardTabKey } from "@/features/mypage/gameData/types/gameDataTypes";

type Props = { activeTab: DashboardTabKey; onChangeTab: (tab: DashboardTabKey) => void };

export const FilterTabs = ({ activeTab, onChangeTab }: Props) => {
  const tabClass = (active: boolean) =>
    [
      "rounded-md px-3 py-2 text-xs font-medium",
      active ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200",
    ].join(" ");

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className={tabClass(activeTab === "matches")}
        onClick={() => onChangeTab("matches")}
      >
        경기 기록
      </button>

      <button
        type="button"
        className={tabClass(activeTab === "tier")}
        onClick={() => onChangeTab("tier")}
      >
        피드백기록
      </button>
    </div>
  );
};
