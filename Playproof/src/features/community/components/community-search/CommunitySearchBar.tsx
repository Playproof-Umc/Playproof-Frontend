// src/features/community/components/community-search/CommunitySearchBar.tsx

import type { CommunityFilterState } from "@/features/community/components/community-filter/CommunityFilterModal";
import { CommunitySearchInput } from "@/features/community/components/community-search/CommunitySearchInput";
import { CommunityFilterButton } from "@/features/community/components/community-search/CommunityFilterButton";
import { CommunityWriteButton } from "@/features/community/components/community-search/CommunityWriteButton";

type CommunitySearchBarProps = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch?: (query: string) => void;
  onWritePost?: () => void;
  activeTab: string;
  userId?: string;
  isFilterOpen?: boolean;
  onFilterToggle?: () => void;
  onFilterClose?: () => void;
  onFilterApply?: (filters: CommunityFilterState) => void;
};

export function CommunitySearchBar({
  searchQuery,
  onSearchChange,
  onSearch,
  onWritePost,
  activeTab,
  userId,
  isFilterOpen,
  onFilterToggle,
  onFilterClose,
  onFilterApply,
}: CommunitySearchBarProps) {
  return (
    <div className="relative z-40 flex w-full gap-2">
      <CommunitySearchInput
        activeTab={activeTab}
        userId={userId}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onSearch={onSearch}
      />

      <CommunityFilterButton
        isOpen={isFilterOpen}
        onToggle={onFilterToggle}
        onClose={onFilterClose}
        onApply={onFilterApply}
      />

      <CommunityWriteButton onClick={onWritePost} />
    </div>
  );
}
