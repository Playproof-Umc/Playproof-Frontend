// src/features/community/hooks/useHighlightFeed.ts

import React from "react";
import type { HighlightPost, CommunityComment } from "@/features/community/types/types";
import { getComments, addComment as addCommentApi, editComment as editCommentApi, deleteComment as deleteCommentApi, toggleLike as toggleLikeApi, deleteHighlight as deleteHighlightApi } from "@/features/community/api/communityApi";
import { useAuthStore } from "@/store/authStore";

type HighlightLikeMap = Record<number, { count: number; isLiked: boolean }>;
type HighlightCommentsMap = Record<number, CommunityComment[]>;
type HighlightMediaMap = Record<number, string[]>;

const LIKED_HIGHLIGHTS_KEY = 'playproof_liked_highlights';

const getLikedHighlightsFromStorage = (): Set<number> => {
  try {
    const stored = localStorage.getItem(LIKED_HIGHLIGHTS_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
};

const saveLikedHighlightsToStorage = (likedSet: Set<number>) => {
  try {
    localStorage.setItem(LIKED_HIGHLIGHTS_KEY, JSON.stringify([...likedSet]));
  } catch {
    // ignore storage errors
  }
};

type UseHighlightFeedArgs = {
  initialPosts?: HighlightPost[];
  userName?: string;
};

export const useHighlightFeed = ({
  initialPosts = [],
  userName,
}: UseHighlightFeedArgs = {}) => {
  const authNickname = useAuthStore((s) => s.nickname);
  const currentUserName = userName ?? authNickname ?? "사용자";

  const [highlights, setHighlights] = React.useState<HighlightPost[]>(initialPosts);
  const [likeMap, setLikeMap] = React.useState<HighlightLikeMap>({});
  const [commentsMap, setCommentsMap] = React.useState<HighlightCommentsMap>({});
  const [, setMediaMap] = React.useState<HighlightMediaMap>({});
  const likedHighlightsRef = React.useRef<Set<number>>(getLikedHighlightsFromStorage());

  const hydrateFromPosts = React.useCallback(
    (posts: HighlightPost[]) => {
      setHighlights(posts);
      const likedSet = likedHighlightsRef.current;
      const newLikeMap: HighlightLikeMap = {};
      posts.forEach((post) => {
        // 로컬 저장소에 있으면 좋아요 상태 유지 (백엔드 is_liked 무시)
        const isLiked = likedSet.has(post.id);
        newLikeMap[post.id] = { count: post.likeCount ?? post.likes ?? 0, isLiked };
      });
      setLikeMap(newLikeMap);
      // MOCK_COMMENTS logic removed; commentsMap is hydrated only from backend
    },
    []
  );

  const getLikeState = React.useCallback(
    (post: HighlightPost) => likeMap[post.id] ?? { count: post.likeCount ?? post.likes ?? 0, isLiked: post.isLiked ?? false },
    [likeMap]
  );

  const getCommentsLocal = React.useCallback(
    (postId: number) => commentsMap[postId] ?? [],
    [commentsMap]
  );

  const fetchComments = React.useCallback(async (postId: number) => {
    const res = await getComments({ highlightId: postId });
    setCommentsMap((prev) => ({ ...prev, [postId]: res }));
  }, []);

  const getCommentCount = React.useCallback(
    (post: HighlightPost) => {
      const comments = commentsMap[post.id];
      if (!comments) return post.commentCount ?? post.comments ?? 0;
      return comments.reduce((sum, comment) => sum + 1 + (comment.replies?.length ?? 0), 0);
    },
    [commentsMap]
  );

  const toggleLike = React.useCallback((postId: number, fallbackLikes: number) => {
    // 먼저 낙관적 업데이트
    let isToggleToLiked = false;
    setLikeMap((prev) => {
      const current = prev[postId] ?? { count: fallbackLikes, isLiked: false };
      isToggleToLiked = !current.isLiked;
      const next = current.isLiked
        ? { count: Math.max(0, current.count - 1), isLiked: false }
        : { count: current.count + 1, isLiked: true };
      
      // localStorage 업데이트
      if (isToggleToLiked) {
        likedHighlightsRef.current.add(postId);
      } else {
        likedHighlightsRef.current.delete(postId);
      }
      saveLikedHighlightsToStorage(likedHighlightsRef.current);
      
      return { ...prev, [postId]: next };
    });
    
    // API 호출하고 응답으로 count만 동기화 (is_liked는 로컬 상태 유지)
    toggleLikeApi({ highlightId: postId })
      .then((res) => {
        const nextCount = res?.like_count ?? res?.likeCount;
        if (typeof nextCount === "number") {
          setLikeMap((prev) => {
            const current = prev[postId];
            if (current) {
              return { ...prev, [postId]: { ...current, count: nextCount } };
            }
            return prev;
          });
        }
      })
      .catch(() => {
        // 실패 시 상태를 원래대로 되돌림
        setLikeMap((prev) => {
          const current = prev[postId] ?? { count: fallbackLikes, isLiked: false };
          const reverted = isToggleToLiked
            ? { count: Math.max(0, current.count - 1), isLiked: false }
            : { count: current.count + 1, isLiked: true };
          
          // localStorage도 되돌림
          if (isToggleToLiked) {
            likedHighlightsRef.current.delete(postId);
          } else {
            likedHighlightsRef.current.add(postId);
          }
          saveLikedHighlightsToStorage(likedHighlightsRef.current);
          
          return { ...prev, [postId]: reverted };
        });
      });
  }, []);

  const addComment = React.useCallback(
    async (postId: number, content: string) => {
      const res = await addCommentApi({ highlightId: postId, content });
      if (!res) {
        await fetchComments(postId);
        return;
      }
      setCommentsMap((prev) => {
        const nextComments = prev[postId] ? [res, ...prev[postId]] : [res];
        return { ...prev, [postId]: nextComments };
      });
    },
    [fetchComments]
  );

  const addReply = React.useCallback(
    async (postId: number, commentId: number, content: string) => {
      const res = await addCommentApi({ highlightId: postId, content, parentId: commentId });
      if (!res) {
        await fetchComments(postId);
        return;
      }
      setCommentsMap((prev) => {
        const current = prev[postId] ?? [];
        const next = current.map((comment) =>
          comment.id === commentId
            ? { ...comment, replies: [...(comment.replies ?? []), res] }
            : comment
        );
        return { ...prev, [postId]: next };
      });
    },
    [fetchComments]
  );

  const editComment = React.useCallback(async (postId: number, commentId: number, content: string) => {
    await editCommentApi({ commentId, content });
    setCommentsMap((prev) => {
      const current = prev[postId] ?? [];
      const next = current.map((comment) =>
        comment.id === commentId ? { ...comment, content } : comment
      );
      return { ...prev, [postId]: next };
    });
  }, []);

  const editReply = React.useCallback(
    async (postId: number, commentId: number, replyId: number, content: string) => {
      await editCommentApi({ commentId: replyId, content });
      setCommentsMap((prev) => {
        const current = prev[postId] ?? [];
        const next = current.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply.id === replyId ? { ...reply, content } : reply
                ),
              }
            : comment
        );
        return { ...prev, [postId]: next };
      });
    },
    []
  );

  const deleteComment = React.useCallback(async (postId: number, commentId: number) => {
    await deleteCommentApi(commentId);
    setCommentsMap((prev) => {
      const current = prev[postId] ?? [];
      const next = current.filter((comment) => comment.id !== commentId);
      return { ...prev, [postId]: next };
    });
  }, []);

  const deleteReply = React.useCallback(
    async (postId: number, commentId: number, replyId: number) => {
      await deleteCommentApi(replyId);
      setCommentsMap((prev) => {
        const current = prev[postId] ?? [];
        const next = current.map((comment) =>
          comment.id === commentId
            ? { ...comment, replies: comment.replies.filter((reply) => reply.id !== replyId) }
            : comment
        );
        return { ...prev, [postId]: next };
      });
    },
    []
  );

  const deletePost = React.useCallback(async (postId: number) => {
    try {
      await deleteHighlightApi(postId);
      setMediaMap((prev) => {
        const urls = prev[postId];
        if (urls) {
          urls.forEach((url) => URL.revokeObjectURL(url));
        }
        const next = { ...prev };
        delete next[postId];
        return next;
      });
      setHighlights((prev) => prev.filter((post) => post.id !== postId));
      setLikeMap((prev) => {
        if (!prev[postId]) return prev;
        const next = { ...prev };
        delete next[postId];
        return next;
      });
      setCommentsMap((prev) => {
        if (!prev[postId]) return prev;
        const next = { ...prev };
        delete next[postId];
        return next;
      });
      // localStorage에서도 제거
      likedHighlightsRef.current.delete(postId);
      saveLikedHighlightsToStorage(likedHighlightsRef.current);
    } catch (error) {
      console.error('Failed to delete highlight:', error);
      throw error;
    }
  }, []);

  const addHighlightPost = React.useCallback(
    ({ title, content, images }: { title?: string; content: string; images: File[] }) => {
      const id = Date.now();
      const imageUrls = images.map((file) => URL.createObjectURL(file));
      const newPost: HighlightPost = {
        id,
        createdAt: new Date().toISOString(),
        title: title ?? "하이라이트",
        content: content || "내용 없음",
        author: currentUserName,
        date: "방금 전",
        likes: 0,
        views: 0,
        comments: 0,
        images: imageUrls.length > 0 ? imageUrls : [],
        mediaType: "photo",
      };
      setHighlights((prev) => [newPost, ...prev]);
      setMediaMap((prev) => ({ ...prev, [id]: imageUrls }));
      setLikeMap((prev) => ({ ...prev, [id]: { count: 0, isLiked: false } }));
      setCommentsMap((prev) => ({ ...prev, [id]: [] }));
    },
    [currentUserName]
  );

  const revokeAllMedia = React.useCallback(() => {
    setMediaMap((prev) => {
      Object.values(prev).forEach((urls) => {
        urls.forEach((url) => URL.revokeObjectURL(url));
      });
      return {};
    });
  }, []);

  React.useEffect(() => {
    return () => {
      revokeAllMedia();
    };
  }, [revokeAllMedia]);

  return {
    state: {
      highlights,
      currentUserName,
    },
    actions: {
      hydrateFromPosts,
      getLikeState,
      getComments: getCommentsLocal,
      fetchComments,
      getCommentCount,
      toggleLike,
      addComment,
      addReply,
      editComment,
      editReply,
      deleteComment,
      deleteReply,
      deletePost,
      addHighlightPost,
      revokeAllMedia,
    },
  };
};
