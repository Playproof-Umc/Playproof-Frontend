// src/features/community/hooks/useHighlightFeed.ts

import React from "react";
import type { HighlightPost, Comment } from "@/features/community/types";
import { MOCK_COMMENTS } from "@/features/community/data/mockCommunityData";
import { useAuthStore } from "@/store/authStore";

type HighlightLikeMap = Record<number, { count: number; isLiked: boolean }>;
type HighlightCommentsMap = Record<number, Comment[]>;
type HighlightMediaMap = Record<number, string[]>;

type UseHighlightFeedArgs = {
  initialPosts?: HighlightPost[];
  seedComments?: boolean;
  userName?: string;
};

export const useHighlightFeed = ({
  initialPosts = [],
  seedComments = true,
  userName,
}: UseHighlightFeedArgs = {}) => {
  const authNickname = useAuthStore((s) => s.nickname);
  const currentUserName = userName ?? authNickname ?? "사용자";

  const [highlights, setHighlights] = React.useState<HighlightPost[]>(initialPosts);
  const [likeMap, setLikeMap] = React.useState<HighlightLikeMap>({});
  const [commentsMap, setCommentsMap] = React.useState<HighlightCommentsMap>({});
  const [, setMediaMap] = React.useState<HighlightMediaMap>({});

  const hydrateFromPosts = React.useCallback(
    (posts: HighlightPost[]) => {
      setHighlights(posts);
      setLikeMap((prev) => {
        const next = { ...prev };
        posts.forEach((post) => {
          if (!next[post.id]) {
            next[post.id] = { count: post.likes, isLiked: false };
          }
        });
        return next;
      });
      if (!seedComments) return;
      setCommentsMap((prev) => {
        const next = { ...prev };
        posts.forEach((post) => {
          if (!next[post.id]) {
            next[post.id] = MOCK_COMMENTS.map((comment) => ({
              ...comment,
              replies: comment.replies.map((reply) => ({ ...reply })),
            }));
          }
        });
        return next;
      });
    },
    [seedComments]
  );

  const getLikeState = React.useCallback(
    (post: HighlightPost) => likeMap[post.id] ?? { count: post.likes, isLiked: false },
    [likeMap]
  );

  const getComments = React.useCallback(
    (postId: number) => commentsMap[postId] ?? [],
    [commentsMap]
  );

  const getCommentCount = React.useCallback(
    (post: HighlightPost) => {
      const comments = commentsMap[post.id];
      if (!comments) return post.comments;
      return comments.reduce((sum, comment) => sum + 1 + comment.replies.length, 0);
    },
    [commentsMap]
  );

  const toggleLike = React.useCallback((postId: number, fallbackLikes: number) => {
    setLikeMap((prev) => {
      const current = prev[postId] ?? { count: fallbackLikes, isLiked: false };
      const next = current.isLiked
        ? { count: Math.max(0, current.count - 1), isLiked: false }
        : { count: current.count + 1, isLiked: true };
      return { ...prev, [postId]: next };
    });
  }, []);

  const addComment = React.useCallback(
    (postId: number, content: string) => {
      const newComment: Comment = {
        id: String(Date.now()),
        author: currentUserName,
        avatarUrl: "",
        content,
        date: "방금 전",
        replies: [],
      };
      setCommentsMap((prev) => {
        const nextComments = prev[postId] ? [newComment, ...prev[postId]] : [newComment];
        return { ...prev, [postId]: nextComments };
      });
    },
    [currentUserName]
  );

  const addReply = React.useCallback(
    (postId: number, commentId: string, content: string) => {
      setCommentsMap((prev) => {
        const current = prev[postId] ?? [];
        const next = current.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                replies: [
                  ...comment.replies,
                  {
                    id: String(Date.now()),
                    author: currentUserName,
                    avatarUrl: "",
                    content,
                    date: "방금 전",
                    parentId: commentId,
                  },
                ],
              }
            : comment
        );
        return { ...prev, [postId]: next };
      });
    },
    [currentUserName]
  );

  const editComment = React.useCallback((postId: number, commentId: string, content: string) => {
    setCommentsMap((prev) => {
      const current = prev[postId] ?? [];
      const next = current.map((comment) =>
        comment.id === commentId ? { ...comment, content } : comment
      );
      return { ...prev, [postId]: next };
    });
  }, []);

  const editReply = React.useCallback(
    (postId: number, commentId: string, replyId: string, content: string) => {
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

  const deleteComment = React.useCallback((postId: number, commentId: string) => {
    setCommentsMap((prev) => {
      const current = prev[postId] ?? [];
      const next = current.filter((comment) => comment.id !== commentId);
      return { ...prev, [postId]: next };
    });
  }, []);

  const deleteReply = React.useCallback(
    (postId: number, commentId: string, replyId: string) => {
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

  const deletePost = React.useCallback((postId: number) => {
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
  }, []);

  const addHighlightPost = React.useCallback(
    ({ title, content, images }: { title?: string; content: string; images: File[] }) => {
      const id = Date.now();
      const imageUrls = images.map((file) => URL.createObjectURL(file));
      const newPost: HighlightPost = {
        id,
        author: currentUserName,
        date: "방금 전",
        createdAt: new Date().toISOString(),
        title: title ?? "하이라이트",
        content: content || "내용 없음",
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
      getComments,
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
