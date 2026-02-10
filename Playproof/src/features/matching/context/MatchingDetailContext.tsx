/* eslint-disable react-refresh/only-export-components */
//src/features/matching/context/MatchingDetailContext.tsx
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { MatchingData } from '@/features/matching/types';
import { likeParty, applyToParty } from '@/services/partyApi';

type LikeState = {
  count: number;
  isLiked: boolean;
};

type RequestState = 'none' | 'pending' | 'accepted';

type RequestStateMap = Record<number, RequestState>;

type CommentCountMap = Record<number, number>;
type RequestStatus = 'pending' | 'accepted';
type RequestMap = Record<number, RequestStatus>;

interface MatchingDetailContextType {
  isOpen: boolean;
  selectedPost: MatchingData | null;
  openMatchingDetail: (post: MatchingData) => void;
  closeMatchingDetail: () => void;
  hydrateLikes: (posts: MatchingData[]) => void;
  hydrateCommentCounts: (posts: MatchingData[]) => void;
  toggleLike: (post: MatchingData) => void;
  getLikeState: (post: MatchingData) => LikeState;
  getCommentCount: (post: MatchingData) => number;
  updateCommentCount: (postId: number, count: number) => void;
  requestMatch: (post: MatchingData) => void;
  cancelMatchRequest: (post: MatchingData) => void;
<<<<<<< HEAD
  getRequestState: (post: MatchingData) => RequestState;
=======
  markMatchAccepted: (postId: number) => void;
  getRequestState: (post: MatchingData) => RequestStatus | 'none';
>>>>>>> develop
}

const MatchingDetailContext = createContext<MatchingDetailContextType | undefined>(undefined);

export const useMatchingDetail = () => {
  const context = useContext(MatchingDetailContext);
  if (!context) {
    throw new Error('useMatchingDetail must be used within a MatchingDetailProvider');
  }
  return context;
};

export const MatchingDetailProvider: React.FC<{ children?: ReactNode }> = ({ children } = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<MatchingData | null>(null);
  const [likeMap, setLikeMap] = useState<Record<number, LikeState>>({});
  const [commentCountMap, setCommentCountMap] = useState<CommentCountMap>({});
<<<<<<< HEAD
  const [requestStateMap, setRequestStateMap] = useState<RequestStateMap>({});
=======
  const [requestMap, setRequestMap] = useState<RequestMap>({});
>>>>>>> develop

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
    document.body.style.overflow = 'unset';
    return undefined;
  }, [isOpen]);

  const getLikeState = useCallback((post: MatchingData): LikeState => {
    return likeMap[post.id] ?? { count: post.likes, isLiked: !!post.isLiked };
  }, [likeMap]);

  const hydrateLikes = useCallback((posts: MatchingData[]) => {
    setLikeMap((prev) => {
      const next = { ...prev };
      posts.forEach((post) => {
        if (!next[post.id]) {
          next[post.id] = { count: post.likes, isLiked: !!post.isLiked };
        }
      });
      return next;
    });
  }, []);

  const hydrateCommentCounts = useCallback((posts: MatchingData[]) => {
    setCommentCountMap((prev) => {
      const next = { ...prev };
      posts.forEach((post) => {
        if (next[post.id] === undefined) {
          next[post.id] = post.comments;
        }
      });
      return next;
    });
  }, []);

  const openMatchingDetail = useCallback(
    (post: MatchingData) => {
      const likeState = getLikeState(post);
      setSelectedPost({ ...post, likes: likeState.count, isLiked: likeState.isLiked });
      setIsOpen(true);
    },
    [getLikeState]
  );

  const closeMatchingDetail = useCallback(() => {
    setIsOpen(false);
    setSelectedPost(null);
  }, []);

  const toggleLike = useCallback((post: MatchingData) => {
    console.log('❤️ 좋아요 토글:', { postId: post.id, currentLikes: post.likes, isLiked: post.isLiked });
    
    // 즉시 UI 업데이트 (Optimistic Update)
    setLikeMap((prev) => {
      const current = prev[post.id] ?? { count: post.likes, isLiked: !!post.isLiked };
      const next = current.isLiked
        ? { count: Math.max(0, current.count - 1), isLiked: false }
        : { count: current.count + 1, isLiked: true };
      console.log('📊 UI 업데이트:', { before: current, after: next });
      return { ...prev, [post.id]: next };
    });

    setSelectedPost((prev) => {
      if (!prev || prev.id !== post.id) return prev;
      const current = { count: prev.likes, isLiked: !!prev.isLiked };
      const next = current.isLiked
        ? { count: Math.max(0, current.count - 1), isLiked: false }
        : { count: current.count + 1, isLiked: true };
      return { ...prev, likes: next.count, isLiked: next.isLiked };
    });

    // API 호출 (백그라운드)
    console.log('🌐 좋아요 API 호출 시작:', { partyId: post.id });
    likeParty(post.id)
      .then(() => {
        console.log('✅ 좋아요 API 호출 성공:', { partyId: post.id });
      })
      .catch((error) => {
        console.error('❌ 좋아요 API 호출 실패:', error);
        // 실패 시 롤백
        setLikeMap((prev) => {
          const current = prev[post.id];
          if (!current) return prev;
          const rollback = current.isLiked
            ? { count: current.count - 1, isLiked: false }
            : { count: current.count + 1, isLiked: true };
          console.log('🔄 롤백:', { rollback });
          return { ...prev, [post.id]: rollback };
        });
      });
  }, []);

  const getCommentCount = useCallback(
    (post: MatchingData) => {
      return commentCountMap[post.id] ?? post.comments;
    },
    [commentCountMap]
  );

  const updateCommentCount = useCallback((postId: number, count: number) => {
    setCommentCountMap((prev) => {
      if (prev[postId] === count) return prev;
      return { ...prev, [postId]: count };
    });
  }, []);

  const getRequestState = useCallback(
<<<<<<< HEAD
    (post: MatchingData): RequestState => {
      return requestStateMap[post.id] ?? 'none';
    },
    [requestStateMap]
  );

  const requestMatch = useCallback((post: MatchingData) => {
    console.log('🎯 매칭 요청:', { postId: post.id, title: post.title });
    
    // 즉시 UI 업데이트 (Optimistic Update)
    setRequestStateMap((prev) => ({ ...prev, [post.id]: 'pending' }));
    
    // API 호출
    console.log('📤 파티 신청 API 호출 시작...');
    applyToParty(post.id)
      .then(() => {
        console.log('✅ 파티 신청 API 호출 성공:', { partyId: post.id });
        alert('파티 신청이 완료되었습니다!');
      })
      .catch((error) => {
        console.error('❌ 파티 신청 API 호출 실패:', error);
        const errorMessage = error.response?.data?.error?.message || '파티 신청에 실패했습니다.';
        alert(errorMessage);
        // 실패 시 롤백
        setRequestStateMap((prev) => ({ ...prev, [post.id]: 'none' }));
      });
  }, []);

  const cancelMatchRequest = useCallback((post: MatchingData) => {
    console.log('❌ 매칭 요청 취소:', { postId: post.id });
    setRequestStateMap((prev) => ({ ...prev, [post.id]: 'none' }));
    // TODO: 취소 API 추가 시 여기서 호출
=======
    (post: MatchingData) => {
      if (post.isMatched) return 'accepted';
      return requestMap[post.id] ?? 'none';
    },
    [requestMap]
  );

  const requestMatch = useCallback((post: MatchingData) => {
    setRequestMap((prev) => {
      if (prev[post.id] === 'pending' || prev[post.id] === 'accepted') return prev;
      return { ...prev, [post.id]: 'pending' };
    });
  }, []);

  const cancelMatchRequest = useCallback((post: MatchingData) => {
    setRequestMap((prev) => {
      if (!prev[post.id]) return prev;
      const next = { ...prev };
      delete next[post.id];
      return next;
    });
  }, []);

  const markMatchAccepted = useCallback((postId: number) => {
    setRequestMap((prev) => ({ ...prev, [postId]: 'accepted' }));
>>>>>>> develop
  }, []);

  const contextValue = useMemo(
    () => ({
      isOpen,
      selectedPost,
      openMatchingDetail,
      closeMatchingDetail,
      hydrateLikes,
      hydrateCommentCounts,
      toggleLike,
      getLikeState,
      getCommentCount,
      updateCommentCount,
      requestMatch,
      cancelMatchRequest,
<<<<<<< HEAD
=======
      markMatchAccepted,
>>>>>>> develop
      getRequestState,
    }),
    [
      isOpen,
      selectedPost,
      openMatchingDetail,
      closeMatchingDetail,
      hydrateLikes,
      hydrateCommentCounts,
      toggleLike,
      getLikeState,
      getCommentCount,
      updateCommentCount,
      requestMatch,
      cancelMatchRequest,
<<<<<<< HEAD
=======
      markMatchAccepted,
>>>>>>> develop
      getRequestState,
    ]
  );

  return (
    <MatchingDetailContext.Provider value={contextValue}>
      {children}
    </MatchingDetailContext.Provider>
  );
};
