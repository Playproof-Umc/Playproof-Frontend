// src/features/community/hooks/useCommunityFilters.ts

import React from "react";
import type { BoardPost, HighlightPost } from "@/features/community/types";
import type { CommunityFilterState } from "@/features/community/components/community-filter/CommunityFilterModal";
import { filterBoardPosts, filterHighlights } from "@/features/community/hooks/communityFilterUtils";

const DEFAULT_FILTERS: CommunityFilterState = {
  mediaType: "photo",
  startDate: "",
  endDate: "",
};

type UseCommunityFiltersArgs = {
  highlights: HighlightPost[];
  boardPosts: BoardPost[];
  itemsPerPage?: number;
};

export const useCommunityFilters = ({
  highlights,
  boardPosts,
  itemsPerPage = 10,
}: UseCommunityFiltersArgs) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [filters, setFilters] = React.useState<CommunityFilterState>(DEFAULT_FILTERS);
  const [boardGame, setBoardGame] = React.useState("전체글");

  const filteredHighlights = React.useMemo(
    () => filterHighlights(highlights, filters, searchQuery),
    [highlights, filters, searchQuery]
  );

  const filteredBoardPosts = React.useMemo(
    () => filterBoardPosts(boardPosts, filters, searchQuery, boardGame),
    [boardPosts, filters, searchQuery, boardGame]
  );

  const totalPages = Math.ceil(filteredBoardPosts.length / itemsPerPage);

  return {
    searchQuery,
    setSearchQuery,
    handleSearch: (query: string) => {
      console.log("검색:", query, "filters:", filters);
    },
    isFilterOpen,
    setIsFilterOpen,
    filters,
    setFilters,
    boardGame,
    setBoardGame,
    filteredHighlights,
    filteredBoardPosts,
    totalPages,
  };
};
