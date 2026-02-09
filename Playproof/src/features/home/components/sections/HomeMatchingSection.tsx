// src/features/home/components/sections/HomeMatchingSection.tsx

import { MatchingTabs } from "@/features/home/components";
import { MatchingSearchBar, PartyRequestBanner } from "@/features/matching/components";
import { PopularMatchList } from "@/features/matching/components/home/PopularMatchList";
import type { HomeMatchingSectionProps } from "@/features/home/components/sections/types";

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
      <PartyRequestBanner />

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

      <PopularMatchList matches={matches} onCardClick={onCardClick} />
    </section>
  );
};
