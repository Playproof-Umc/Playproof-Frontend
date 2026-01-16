//src/features/matching/hooks/useMatchingDetailLogic.ts
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMatchingDetail } from '@/features/matching/context/MatchingDetailContext';

const MOCK_COMMENTS = [
  { id: 1, userId: 'user-2', user: '플루', text: '저랑 듀오하실래요~? 친추할게요', time: '방금 전', isReply: false },
  { id: 2, userId: 'user-3', user: '게이머1', text: '저요저요!', time: '1분 전', isReply: false },
];

export const useMatchingDetailLogic = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, selectedPost, closeMatchingDetail } = useMatchingDetail();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(MOCK_COMMENTS);

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