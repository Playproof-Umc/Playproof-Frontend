// src/features/home/hooks/useHomeMatchingLogic.ts

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useMatchingDetail } from "@/features/matching/context/MatchingDetailContext";
import type { FilterState, MatchingData } from "@/features/matching/types";
import { getParties } from "@/services/partyApi";
import { getGameName } from "@/constants/games";

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

  const { data: partyData } = useQuery({
    queryKey: ["home-parties", { sort: "latest" }],
    queryFn: () => getParties({ page: 1, size: 100, sort: "latest" }),
    staleTime: 30 * 1000,
  });

  const allMatches = React.useMemo<MatchingData[]>(() => {
    if (!partyData?.parties) return [];

    return partyData.parties.map((party) => ({
      id: party.partyId,
      game: getGameName(party.gameId),
      title: party.title,
      tier: party.tierName,
      tags: party.tags.map((tag) => tag.name),
      azit: party.azitName,
      position: party.positions.map((pos) => pos.positionName),
      memo: party.memo,
      currentMembers: party.currentParticipants,
      maxMembers: party.participants,
      time: new Date(party.createdAt).toLocaleString("ko-KR"),
      views: party.viewCount,
      likes: party.likeCount ?? 0,
      liked: party.isLike ?? false,
      comments: party.commentCount ?? 0,
      tsScore: party.host.trustScore,
      mic: party.isMic,
      hostUser: {
        id: String(party.host.id),
        nickname: party.host.nickname,
        avatarUrl: party.host.avatarUrl ?? undefined,
        isOnline: party.status === "active",
      },
    }));
  }, [partyData]);

  const filteredPopularMatches = React.useMemo(() => {
    const matchesByGame = allMatches.filter((m) => m.game === activeGameTab);
    return [...matchesByGame]
      .sort((a, b) => b.views + b.likes - (a.views + a.likes))
      .slice(0, 10);
  }, [allMatches, activeGameTab]);

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
