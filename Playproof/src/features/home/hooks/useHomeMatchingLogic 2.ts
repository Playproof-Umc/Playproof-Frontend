// src/features/home/hooks/useHomeMatchingLogic.ts

import React from "react";
import { useMatchingDetail } from "@/features/matching/context/MatchingDetailContext";
import { MOCK_MATCHING_DATA } from "@/features/matching/data/mockMatchingData";
import type { FilterState, MatchingData } from "@/features/matching/types";

export const useHomeMatchingLogic = () => {
  const { openMatchingDetail } = useMatchingDetail();
  const [activeGameTab, setActiveGameTab] = React.useState("리그오브레전드");
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [searchKeyword, setSearchKeyword] = React.useState("");

  const handleSearchSubmit = (text: string) => {
    console.log("홈 검색 실행:", text);
  };

  const handleFilterApply = (filters: FilterState) => {
    console.log("홈 필터 적용:", filters);
    setIsFilterOpen(false);
  };

  const handleHomeMatchClick = (match: MatchingData) => {
    openMatchingDetail(match);
  };

  const filteredPopularMatches = React.useMemo(() => {
    const matchesByGame = MOCK_MATCHING_DATA.filter((m) => m.game === activeGameTab);
    return [...matchesByGame]
      .sort((a, b) => b.views + b.likes - (a.views + a.likes))
      .slice(0, 10);
  }, [activeGameTab]);

  return {
    state: {
      activeGameTab,
      isFilterOpen,
      searchKeyword,
      filteredPopularMatches,
    },
    handlers: {
      setActiveGameTab,
      setIsFilterOpen,
      setSearchKeyword,
      handleSearchSubmit,
      handleFilterApply,
      handleHomeMatchClick,
    },
  };
};
