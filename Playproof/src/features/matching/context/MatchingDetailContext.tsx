// src/features/matching/context/MatchingDetailContext.tsx

/* eslint-disable react-refresh/only-export-components */
//src/features/matching/context/MatchingDetailContext.tsx
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { MatchingData } from '@/features/matching/types';

type LikeState = {
  count: number;
  isLiked: boolean;
};

type CommentCountMap = Record<number, number>;

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
    setLikeMap((prev) => {
      const current = prev[post.id] ?? { count: post.likes, isLiked: !!post.isLiked };
      const next = current.isLiked
        ? { count: Math.max(0, current.count - 1), isLiked: false }
        : { count: current.count + 1, isLiked: true };
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
    ]
  );

  return (
    <MatchingDetailContext.Provider
      value={contextValue}
    >
      {children}
    </MatchingDetailContext.Provider>
  );
};
