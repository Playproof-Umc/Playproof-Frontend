import React from "react";
import { MatchingTabs } from "@/features/home/components";
import { MatchingSearchBar, PartyRequestBanner } from "@/features/matching/components";
import { PopularMatchList } from "@/features/matching/components/home/PopularMatchList";
import type { HomeMatchingSectionProps } from "@/features/home/components/sections/types";

const MOCK_REQUESTS = [
  { id: 1, user: { nickname: "뉴비1", mannerTier: "TS 50" }, message: "껴주세요!" },
  { id: 2, user: { nickname: "고수2", mannerTier: "TS 99" }, message: "캐리해드림" },
];

export const HomeMatchingSection = ({
  activeGameTab,
  searchKeyword,
  isFilterOpen,
  onTabChange,
  onMoreClick,
  onSearchChange,
  onSearchSubmit,
  onWriteClick,
  onFilterToggle,
  onFilterClose,
  onFilterApply,
  matches,
  onCardClick,
}: HomeMatchingSectionProps) => {
  return (
    <section className="space-y-4">
      <PartyRequestBanner count={MOCK_REQUESTS.length} />

      <div className="flex flex-col gap-4">
        <MatchingTabs activeTab={activeGameTab} onTabChange={onTabChange} onMoreClick={onMoreClick} />

        <MatchingSearchBar
          searchText={searchKeyword}
          onSearchChange={onSearchChange}
          onSearchSubmit={onSearchSubmit}
          onWriteClick={onWriteClick}
          isFilterOpen={isFilterOpen}
          onFilterToggle={onFilterToggle}
          onFilterClose={onFilterClose}
          onFilterApply={onFilterApply}
          activeGame={activeGameTab}
          userId="user-1"
        />
      </div>

      {/* @ts-expect-error : Mock 데이터 타입 호환용 */}
      <PopularMatchList matches={matches} onCardClick={onCardClick} />
    </section>
  );
};
