// src/features/matching/hooks/useMatchingDetailLogic.ts

//src/features/matching/hooks/useMatchingDetailLogic.ts
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMatchingDetail } from '@/features/matching/context/MatchingDetailContext';
import { useAuthStore } from '@/store/authStore';

const FALLBACK_USER_ID = 'user-1';
const FALLBACK_USER_NAME = '사용자';

export const useMatchingDetailLogic = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, selectedPost, closeMatchingDetail } = useMatchingDetail();
  const authUserId = useAuthStore((s) => s.userId);
  const authNickname = useAuthStore((s) => s.nickname);
  const currentUserId = authUserId ? `user-${authUserId}` : FALLBACK_USER_ID;
  const currentUserName = authNickname ?? FALLBACK_USER_NAME;
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const prevPathRef = useRef(location.pathname);
  const fromSource = new URLSearchParams(location.search).get('from');

  // 홈에서도 상세 모달 노출
  const allowPaths = ['/matching', '/home', '/mypage'];
  const shouldRender =
    isOpen &&
    selectedPost &&
    (allowPaths.includes(location.pathname) || location.pathname.startsWith('/mypage'));

  useEffect(() => {
    if (isOpen && prevPathRef.current !== location.pathname) {
      closeMatchingDetail();
    }
    prevPathRef.current = location.pathname;
  }, [isOpen, location.pathname, closeMatchingDetail]);

  const handleClose = () => {
    closeMatchingDetail();
    if (fromSource === 'mypage') {
      navigate(-1);
    }
  };

  const handleMoveToProfile = (userId: string | number) => {
    navigate(`/user/${userId}`);
  };

  return {
    state: {
      shouldRender,
      selectedPost,
      isMenuOpen,
      currentUserId,
      currentUserName,
    },
    setters: { 
      setIsMenuOpen 
    },
    handlers: {
      closeMatchingDetail: handleClose,
      handleMoveToProfile,
    }
  };
};
