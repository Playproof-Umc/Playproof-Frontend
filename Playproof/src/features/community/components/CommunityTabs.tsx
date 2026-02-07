// src/features/community/components/CommunityTabs.tsx


import { COMMUNITY_PAGE_LABELS } from "@/features/community/constants/labels";

const COMMUNITY_TABS = [COMMUNITY_PAGE_LABELS.highlightTab, COMMUNITY_PAGE_LABELS.freeTab] as const;

type CommunityTab = (typeof COMMUNITY_TABS)[number];

type CommunityTabsProps = {
  activeTab: CommunityTab;
  onTabChange: (tab: CommunityTab) => void;
};

export function CommunityTabs({ activeTab, onTabChange }: CommunityTabsProps) {
  return (
    <div className="flex items-center gap-6 border-b border-zinc-200">
      {COMMUNITY_TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={[
            "pb-3 text-base font-medium transition-colors relative",
            activeTab === tab
              ? "text-zinc-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-zinc-900"
              : "text-zinc-500 hover:text-zinc-700",
          ].join(" ")}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export type { CommunityTab };
