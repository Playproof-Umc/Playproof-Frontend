import * as React from "react";
import { GAME_TABS, MATCHING_TAB_LABELS } from "@/features/home/constants/matchingTabs";

type MatchingTabsProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSearch?: (query: string) => void;
};

export function MatchingTabs({ activeTab, onTabChange, onSearch }: MatchingTabsProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-zinc-900">{MATCHING_TAB_LABELS.title}</h2>

      {/* 탭 */}
      <div className="flex gap-2 border-b border-zinc-200">
        {GAME_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={[
              "px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab
                ? "border-b-2 border-zinc-900 text-zinc-900"
                : "text-zinc-500 hover:text-zinc-700",
            ].join(" ")}
          >
            {tab}
          </button>
        ))}
        <button className="ml-auto text-sm text-zinc-500 hover:text-zinc-900">
          {MATCHING_TAB_LABELS.history}
        </button>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex gap-3">
        {/* 검색 */}
        <div className="relative flex-1">
          <SearchIcon />
          <input
            type="text"
            placeholder={MATCHING_TAB_LABELS.placeholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              onSearch?.(e.target.value);
            }}
            className="w-full rounded-lg border border-zinc-300 py-2 pl-10 pr-4 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          />
        </div>

        {/* 필터 버튼들 */}
        <div className="relative flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
            <FilterIcon />
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-semibold text-white">
              2
            </span>
          </button>
        </div>

        <button className="rounded-lg bg-zinc-900 px-6 py-2 text-sm font-medium text-white hover:bg-zinc-800">
          {MATCHING_TAB_LABELS.reset}
        </button>

        <button className="rounded-lg bg-zinc-900 px-6 py-2 text-sm font-medium text-white hover:bg-zinc-800">
          {MATCHING_TAB_LABELS.search}
        </button>
      </div>
    </section>
  );
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
    >
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="m21 21-4.35-4.35"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 6h16M7 12h10M10 18h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
