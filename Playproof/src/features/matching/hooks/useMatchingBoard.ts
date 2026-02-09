// src/features/matching/hooks/useMatchingBoard.ts
import { useState, useMemo, useCallback } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import type { MatchingData, FilterState } from '@/features/matching/types';
import { getParties, createParty, type CreatePartyRequest } from '@/services/partyApi';
import { filterMatches } from '@/features/matching/utils/matchingUtils';
import { getGameName } from '@/constants/games';

export const useMatchingBoard = () => {
  const queryClient = useQueryClient();
  const [activeGame, setActiveGame] = useState('리그오브레전드');
  const [searchText, setSearchText] = useState('');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isProUser, setIsProUser] = useState(false);
  
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterConditions, setFilterConditions] = useState<FilterState | null>(null);

  // API에서 파티 목록 가져오기
  const { data: partyData, isLoading } = useQuery({
    queryKey: ['parties', { sort: 'latest' }],
    queryFn: () => getParties({ page: 1, size: 100, sort: 'latest' }),
    staleTime: 30 * 1000, // 30초간 캐시 유지
  });

  // 파티 생성 Mutation
  const createPartyMutation = useMutation({
    mutationFn: (data: CreatePartyRequest) => createParty(data),
    onSuccess: () => {
      // 파티 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['parties'] });
      closeWriteModal();
    },
    onError: (error: any) => {
      console.error('파티 생성 실패:', error);
      console.error('응답 데이터:', error.response?.data);
      console.error('응답 상태:', error.response?.status);
      console.error('요청 URL:', error.config?.url);
      console.error('요청 데이터:', error.config?.data);
      alert(`파티 생성에 실패했습니다.\n${error.response?.data?.message || error.message}`);
    }
  });

  // API 데이터를 MatchingData 형식으로 변환
  const allMatches = useMemo<MatchingData[]>(() => {
    if (!partyData?.parties) return [];
    
    return partyData.parties.map(party => ({
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
      comments: party.commentCount ?? 0,
      tsScore: party.host.trustScore,
      mic: party.isMic,
      hostUser: {
        id: String(party.host.id),
        nickname: party.host.nickname,
        avatarUrl: party.host.avatarUrl,
        isOnline: party.status === 'active',
      }
    }));
  }, [partyData]);

  const openWriteModal = useCallback(() => {
    setIsWriteModalOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeWriteModal = useCallback(() => {
    setIsWriteModalOpen(false);
    document.body.style.overflow = 'unset';
  }, []);

  const openFilterModal = useCallback(() => setIsFilterModalOpen(true), []);
  const closeFilterModal = useCallback(() => setIsFilterModalOpen(false), []);

  const handleApplyFilter = useCallback((filters: FilterState) => {
    setFilterConditions(filters);
  }, []);

  const handleNewPost = useCallback((newPost: MatchingData, action: 'new' | 'replace' | 'bump') => {
    console.log('새 파티 생성:', newPost, action);
    
    // MatchingData를 CreatePartyRequest로 변환
    // TODO: 실제 게임ID, 티어ID, 포지션ID 매핑 필요
    const partyData: CreatePartyRequest = {
      gameId: 1, // 임시: 게임 이름 → ID 매핑 필요
      title: newPost.title,
      memo: newPost.memo,
      recruitmentPeople: newPost.maxMembers,
      tierId: 1, // 임시: 티어 이름 → ID 매핑 필요
      positionIds: [1], // 임시: 포지션 이름 → ID 매핑 필요
      isMicUse: newPost.mic ?? false,
      azitId: 1, // 임시: 아지트 이름 → ID 매핑 필요
    };

    createPartyMutation.mutate(partyData);
  }, [createPartyMutation]);

  const matchesByGame = useMemo(() => {
    return allMatches.filter(item => item.game === activeGame);
  }, [allMatches, activeGame]);

  const popularMatches = useMemo(() => {
    return [...matchesByGame]
      .sort((a, b) => (b.views + b.likes) - (a.views + a.likes))
      .slice(0, 10);
  }, [matchesByGame]);

  const filteredMatches = useMemo(() => {
    return filterMatches(matchesByGame, searchText, filterConditions);
  }, [matchesByGame, searchText, filterConditions]);

  return {
    state: { 
      allMatches, 
      activeGame, 
      searchText, 
      isWriteModalOpen, 
      isProUser, 
      matchesByGame, 
      popularMatches, 
      filteredMatches, 
      isFilterModalOpen,
      isLoading
    },
    setters: { setActiveGame, setSearchText, setIsProUser },
    actions: { 
      openWriteModal, closeWriteModal, handleNewPost,
      openFilterModal, closeFilterModal, handleApplyFilter 
    }
  };
};