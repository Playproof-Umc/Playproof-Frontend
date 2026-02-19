// src/features/home/hooks/useHomeMatchingLogic.ts

import React from "react";
import { useMatchingDetail } from "@/features/matching/context/MatchingDetailContext";
import { getParties } from "@/services/partyApi";
import { getGameName } from "@/constants/games";
import type { FilterState, MatchingData } from "@/features/matching/types";

export const useHomeMatchingLogic = () => {
  const { openMatchingDetail } = useMatchingDetail();
  const [activeGameTab, setActiveGameTab] = React.useState("리그오브레전드");
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [searchKeyword, setSearchKeyword] = React.useState("");
  const [allMatches, setAllMatches] = React.useState<MatchingData[]>([]);

  React.useEffect(() => {
    (async () => {
      try {
        const data = await getParties({ page: 1, size: 100, sort: 'latest' });
        const mapped: MatchingData[] = data.parties.map(party => ({
          id: party.partyId,
          game: getGameName(party.gameId),
          title: party.title,
          tier: party.tierName,
          tags: party.tags.map(tag => tag.name),
          azit: party.azitName,
          position: party.positions.map(pos => pos.positionName),
          memo: party.memo,
          currentMembers: party.currentParticipants,
          maxMembers: party.participants,
          time: new Date(party.createdAt).toLocaleString('ko-KR'),
          views: party.viewCount,
          likes: party.likeCount ?? 0,
          isLiked: party.isLiked ?? false,
          isApplied: party.isApplied ?? false,
          applicationId: party.applicationId,
          applicationStatus: party.applicationStatus ?? 'none',
          comments: party.commentCount ?? 0,
          tsScore: party.host.trustScore,
          mic: party.isMic,
          hostUser: {
            id: String(party.host.id),
            nickname: party.host.nickname,
            avatarUrl: party.host.avatarUrl ?? undefined,
            isOnline: party.status === 'active',
          }
        }));
        setAllMatches(mapped);
      } catch (e) {
        console.error("Home matching data load fail:", e);
      }
    })();
  }, []);

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
    const matchesByGame = allMatches.filter((m) => m.game === activeGameTab);
    return [...matchesByGame]
      .sort((a, b) => (b.views + b.likes) - (a.views + a.likes))
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
