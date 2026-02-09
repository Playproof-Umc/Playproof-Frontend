//src/features/matching/hooks/useMatchingDetailLogic.ts
import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMatchingDetail } from '@/features/matching/context/MatchingDetailContext';
import { useQuery } from '@tanstack/react-query';
import { getParties } from '@/services/partyApi';
import { getGameName } from '@/constants/games';
import type { MatchingData } from '@/features/matching/types';

const MOCK_COMMENTS = [
  { id: 1, userId: 'user-2', user: '플루', text: '저랑 듀오하실래요~? 친추할게요', time: '방금 전', isReply: false },
  { id: 2, userId: 'user-3', user: '게이머1', text: '저요저요!', time: '1분 전', isReply: false },
];

export const useMatchingDetailLogic = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, selectedPartyId, closeMatchingDetail } = useMatchingDetail();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(MOCK_COMMENTS);

  // React Query에서 파티 목록 가져오기
  const { data: partyData } = useQuery({
    queryKey: ['parties', { sort: 'latest' }],
    queryFn: () => getParties({ page: 1, size: 100, sort: 'latest' }),
    staleTime: 30 * 1000,
  });

  // 선택된 파티 데이터 찾기
  const selectedPost = useMemo<MatchingData | null>(() => {
    if (!selectedPartyId || !partyData?.parties) return null;
    
    const party = partyData.parties.find(p => p.partyId === selectedPartyId);
    if (!party) return null;

    return {
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
      liked: party.isLike ?? false,
      comments: party.commentCount ?? 0,
      tsScore: party.host.trustScore,
      mic: party.isMic,
      hostUser: {
        id: String(party.host.id),
        nickname: party.host.nickname,
        avatarUrl: party.host.avatarUrl,
        isOnline: party.status === 'active',
      }
    };
  }, [selectedPartyId, partyData]);

  // 현재 경로가 /matching이 아니면 모달을 숨김
  const shouldRender = isOpen && selectedPost && location.pathname === '/matching';

  const handleMoveToProfile = (userId: string | number) => {
    navigate(`/user/${userId}`);
  };

  const handleCommentSubmit = () => {
    if (!commentText.trim()) return;
    const newComment = { 
        id: Date.now(), 
        userId: 'me', 
        user: '나(Player)', 
        text: commentText, 
        time: '방금 전', 
        isReply: false 
    };
    setComments([newComment, ...comments]);
    setCommentText('');
  };

  return {
    state: { shouldRender, selectedPost, isMenuOpen, commentText, comments },
    setters: { setIsMenuOpen, setCommentText },
    handlers: { closeMatchingDetail, handleMoveToProfile, handleCommentSubmit }
  };
};