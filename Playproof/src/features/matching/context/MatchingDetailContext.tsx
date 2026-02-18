/* eslint-disable react-refresh/only-export-components */
//src/features/matching/context/MatchingDetailContext.tsx
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { MatchingData } from '@/features/matching/types';
import { likeParty, applyToParty, cancelApplication } from '@/services/partyApi';
import { useToast } from '@/features/notification/context/ToastContext';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

type LikeState = {
  count: number;
  isLiked: boolean;
};

type RequestState = 'none' | 'pending' | 'accepted';

type RequestStateMap = Record<number, RequestState>;
type ApplicationIdMap = Record<number, number>;

type CommentCountMap = Record<number, number>;

interface MatchingDetailContextType {
  isOpen: boolean;
  selectedPost: MatchingData | null;
  openMatchingDetail: (post: MatchingData) => void;
  closeMatchingDetail: () => void;
  hydrateLikes: (posts: MatchingData[]) => void;
  hydrateCommentCounts: (posts: MatchingData[]) => void;
  hydrateRequestStates: (posts: MatchingData[]) => void;
  toggleLike: (post: MatchingData) => void;
  getLikeState: (post: MatchingData) => LikeState;
  getCommentCount: (post: MatchingData) => number;
  updateCommentCount: (postId: number, count: number) => void;
  requestMatch: (post: MatchingData) => void;
  cancelMatchRequest: (post: MatchingData) => void;
  getRequestState: (post: MatchingData) => RequestState;
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
  const [requestStateMap, setRequestStateMap] = useState<RequestStateMap>({});
  const [applicationIdMap, setApplicationIdMap] = useState<ApplicationIdMap>({});
  
  // 모달 상태
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    post: MatchingData | null;
  }>({ isOpen: false, post: null });
  
  const { success, error: toastError } = useToast();

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

  const hydrateRequestStates = useCallback((posts: MatchingData[]) => {
    setRequestStateMap((prev) => {
      const next = { ...prev };
      posts.forEach((post) => {
        if (next[post.id] === undefined && post.applicationStatus) {
          next[post.id] = post.applicationStatus;
        }
      });
      return next;
    });

    setApplicationIdMap((prev) => {
      const next = { ...prev };
      posts.forEach((post) => {
        if (next[post.id] === undefined && post.applicationId) {
          next[post.id] = post.applicationId;
        }
      });
      return next;
    });
  }, []);

  const openMatchingDetail = useCallback(
    (post: MatchingData) => {
      const likeState = getLikeState(post);
      const requestState = requestStateMap[post.id] ?? post.applicationStatus ?? 'none';
      const applicationId = applicationIdMap[post.id] ?? post.applicationId;

      setSelectedPost({ 
        ...post, 
        likes: likeState.count, 
        isLiked: likeState.isLiked,
        applicationStatus: requestState,
        isApplied: requestState !== 'none',
        applicationId
      });
      setIsOpen(true);
    },
    [getLikeState, requestStateMap, applicationIdMap]
  );

  const closeMatchingDetail = useCallback(() => {
    setIsOpen(false);
    setSelectedPost(null);
  }, []);

  const toggleLike = useCallback((post: MatchingData) => {
    console.log('❤️ 좋아요 토글:', { postId: post.id, currentLikes: post.likes, isLiked: post.isLiked });
    const prev = likeMap[post.id] ?? { count: post.likes, isLiked: !!post.isLiked };
    
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
      .then((data) => {
        console.log('✅ 좋아요 API 호출 성공:', { partyId: post.id, response: data });
        if (typeof data?.isLiked === 'boolean') {
          const correctedCount =
            prev.count + (data.isLiked ? 1 : 0) - (prev.isLiked ? 1 : 0);
          const next = { count: Math.max(0, correctedCount), isLiked: data.isLiked };

          setLikeMap((prevMap) => ({ ...prevMap, [post.id]: next }));
          setSelectedPost((prevPost) => {
            if (!prevPost || prevPost.id !== post.id) return prevPost;
            return { ...prevPost, likes: next.count, isLiked: next.isLiked };
          });
          
          if (data.isLiked) {
            success('좋아요가 저장되었습니다.');
          }
        }
      })
      .catch((error) => {
        console.error('❌ 좋아요 API 호출 실패:', error);
        toastError('좋아요 처리에 실패했습니다.');
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
  }, [likeMap, success, toastError]);

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
    (post: MatchingData): RequestState => {
      return requestStateMap[post.id] ?? post.applicationStatus ?? 'none';
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
      .then((data) => {
        console.log('✅ 파티 신청 API 호출 성공:', { partyId: post.id, applicationId: data.applicationId });
        setApplicationIdMap(prev => ({ ...prev, [post.id]: data.applicationId }));
        success('파티 신청이 완료되었습니다!');
      })
      .catch((error) => {
        console.error('❌ 파티 신청 API 호출 실패:', error);
        const errorMessage = error.response?.data?.error?.message || '파티 신청에 실패했습니다.';
        toastError(errorMessage);
        // 실패 시 롤백
        setRequestStateMap((prev) => ({ ...prev, [post.id]: 'none' }));
      });
  }, [success, toastError]);

  const executeCancelRequest = useCallback((post: MatchingData) => {
    const applicationId = applicationIdMap[post.id] ?? post.applicationId;
    
    if (!applicationId) {
      toastError('취소할 수 있는 신청 내역 정보를 찾을 수 없습니다.');
      return;
    }

    console.log('❌ 매칭 요청 취소 시작:', { postId: post.id, applicationId });
    
    // 즉시 UI 업데이트
    setRequestStateMap((prev) => ({ ...prev, [post.id]: 'none' }));

    cancelApplication(applicationId)
      .then(() => {
        console.log('✅ 파티 신청 취소 성공');
        success('신청이 취소되었습니다.');
        setApplicationIdMap(prev => {
          const next = { ...prev };
          delete next[post.id];
          return next;
        });
      })
      .catch((error) => {
        console.error('❌ 파티 신청 취소 실패:', error);
        toastError('신청 취소에 실패했습니다.');
        // 실패 시 롤백
        setRequestStateMap((prev) => ({ ...prev, [post.id]: 'pending' }));
      });
  }, [applicationIdMap, success, toastError]);

  const cancelMatchRequest = useCallback((post: MatchingData) => {
    setConfirmModal({ isOpen: true, post });
  }, []);

  const contextValue = useMemo(
    () => ({
      isOpen,
      selectedPost,
      openMatchingDetail,
      closeMatchingDetail,
      hydrateLikes,
      hydrateCommentCounts,
      hydrateRequestStates,
      toggleLike,
      getLikeState,
      getCommentCount,
      updateCommentCount,
      requestMatch,
      cancelMatchRequest,
      getRequestState,
    }),
    [
      isOpen,
      selectedPost,
      openMatchingDetail,
      closeMatchingDetail,
      hydrateLikes,
      hydrateCommentCounts,
      hydrateRequestStates,
      toggleLike,
      getLikeState,
      getCommentCount,
      updateCommentCount,
      requestMatch,
      cancelMatchRequest,
      getRequestState,
    ]
  );

  return (
    <MatchingDetailContext.Provider value={contextValue}>
      {children}
      
      {/* 파티 신청 취소 확인 모달 */}
      <ConfirmModal 
        isOpen={confirmModal.isOpen}
        title="파티 신청 취소"
        message="정말 파티 신청을 취소하시겠습니까?"
        confirmText="신청 취소"
        cancelText="돌아가기"
        isDangerous={true}
        onConfirm={() => {
          if (confirmModal.post) executeCancelRequest(confirmModal.post);
        }}
        onClose={() => setConfirmModal({ isOpen: false, post: null })}
      />
    </MatchingDetailContext.Provider>
  );
};
