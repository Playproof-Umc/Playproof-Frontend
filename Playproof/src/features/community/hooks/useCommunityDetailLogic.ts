// src/features/community/hooks/useCommunityDetailLogic.ts

import { useCallback, useMemo, useState, useEffect } from "react";
import type { BoardPost } from "@/features/community/types/types";
import type { CommunityComment } from "@/features/community/types/types";
import { useAuthStore } from "@/store/authStore";
import { getComments, addComment, editComment, deleteComment, toggleLike } from "@/features/community/api/communityApi";

const FALLBACK_USER_ID = "user-1";
const FALLBACK_USER_NAME = "사용자";

type LikeState = {
  count: number;
  isLiked: boolean;
};

export const useCommunityDetailLogic = (post?: BoardPost) => {
  const authUserId = useAuthStore((s) => s.userId);
  const authNickname = useAuthStore((s) => s.nickname);
  const currentUserId = authUserId ? `user-${authUserId}` : FALLBACK_USER_ID;
  const currentUserName = authNickname ?? FALLBACK_USER_NAME;

  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [comments, setComments] = useState<CommunityComment[]>([]);

  // 댓글 목록 불러오기
  useEffect(() => {
    if (!post) return;
    const fetchComments = async () => {
      const res = await getComments({ postId: post.id });
      setComments(res);
    };
    fetchComments();
  }, [post]);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingReplyId, setEditingReplyId] = useState<number | null>(null);
  const [editingParentId, setEditingParentId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [likeState, setLikeState] = useState<LikeState>({
    count: post?.likes ?? 0,
    isLiked: post?.isLiked ?? false,
  });

  useEffect(() => {
    if (!post) return;
    setLikeState({
      count: post.likes ?? 0,
      isLiked: post.isLiked ?? false,
    });
  }, [post]);

  const totalCommentCount = useMemo(
    () => comments.reduce((sum, comment) => sum + 1 + comment.replies.length, 0),
    [comments]
  );

  const handleCommentSubmit = useCallback(async () => {
    if (!commentText.trim() || !post) return;
    const res = await addComment({ postId: post.id, content: commentText.trim() });
    if (res) {
      // 새로고침 없이 추가
      setComments((prev) => [res, ...prev]);
    } else {
      const refreshed = await getComments({ postId: post.id });
      setComments(refreshed);
    }
    setCommentText("");
  }, [commentText, post]);

  const handleReplyToggle = useCallback((commentId: number) => {
    setReplyingToId((prev) => (prev === commentId ? null : commentId));
    setReplyText("");
  }, []);

  const handleReplySubmit = useCallback(
    async (commentId: number) => {
      if (!replyText.trim() || !post) return;
      const res = await addComment({ postId: post.id, content: replyText.trim(), parentId: commentId });
      if (res) {
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === commentId
              ? { ...comment, replies: [...(comment.replies || []), res] }
              : comment
          )
        );
      } else {
        const refreshed = await getComments({ postId: post.id });
        setComments(refreshed);
      }
      setReplyText("");
      setReplyingToId(null);
    },
    [replyText, post]
  );

  const handleEditCommentStart = useCallback((commentId: number, content: string) => {
    setEditingCommentId(commentId);
    setEditingReplyId(null);
    setEditingParentId(null);
    setEditText(content);
  }, []);

  const handleEditReplyStart = useCallback(
    (commentId: number, replyId: number, content: string) => {
      setEditingCommentId(null);
      setEditingReplyId(replyId);
      setEditingParentId(commentId);
      setEditText(content);
    },
    []
  );

  const handleEditCancel = useCallback(() => {
    setEditingCommentId(null);
    setEditingReplyId(null);
    setEditingParentId(null);
    setEditText("");
  }, []);

  const handleEditSubmit = async () => {
    const nextText = editText.trim();
    if (!nextText) return;
    if (editingCommentId) {
      await editComment({ commentId: Number(editingCommentId), content: nextText });
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === Number(editingCommentId) ? { ...comment, content: nextText } : comment
        )
      );
      handleEditCancel();
      return;
    }
    if (editingReplyId && editingParentId) {
      await editComment({ commentId: Number(editingReplyId), content: nextText });
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === Number(editingParentId)
            ? {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply.id === Number(editingReplyId) ? { ...reply, content: nextText } : reply
                ),
              }
            : comment
        )
      );
      handleEditCancel();
    }
  };

  const handleDeleteComment = useCallback(async (commentId: number) => {
    await deleteComment(commentId);
    setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    if (editingCommentId === commentId) {
      handleEditCancel();
    }
  }, [editingCommentId, handleEditCancel]);

  const handleDeleteReply = useCallback(
    async (commentId: number, replyId: number) => {
      await deleteComment(replyId);
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? { ...comment, replies: comment.replies.filter((reply) => reply.id !== replyId) }
            : comment
        )
      );
      if (editingReplyId === replyId) {
        handleEditCancel();
      }
    },
    [editingReplyId, handleEditCancel]
  );

  const handleLikeToggle = useCallback(async () => {
    if (!post) return;
    try {
      const res = await toggleLike({ postId: post.id });
      const nextCount = res?.like_count ?? res?.likeCount;
      const nextLiked = res?.is_liked ?? res?.isLiked;
      if (typeof nextCount === "number" && typeof nextLiked === "boolean") {
        setLikeState({ count: nextCount, isLiked: nextLiked });
        return;
      }
    } catch {
      // ignore and fall back to optimistic toggle
    }
    setLikeState((prev) => {
      const next = prev.isLiked
        ? { count: Math.max(0, prev.count - 1), isLiked: false }
        : { count: prev.count + 1, isLiked: true };
      return next;
    });
  }, [post]);

  return {
    state: {
      commentText,
      replyText,
      replyingToId,
      comments,
      currentUserId,
      currentUserName,
      editingCommentId,
      editingReplyId,
      editingParentId,
      editText,
      likeState,
      totalCommentCount,
    },
    setters: {
      setCommentText,
      setReplyText,
      setEditText,
    },
    handlers: {
      handleCommentSubmit,
      handleReplyToggle,
      handleReplySubmit,
      handleEditCommentStart,
      handleEditReplyStart,
      handleEditCancel,
      handleEditSubmit,
      handleDeleteComment,
      handleDeleteReply,
      handleLikeToggle,
    },
  };
};
