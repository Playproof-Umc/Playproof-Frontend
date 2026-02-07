// src/features/community/hooks/useCommunityDetailLogic.ts

import { useCallback, useMemo, useState } from "react";
import type { BoardPost, Comment, CommentReply } from "@/features/community/types";
import { MOCK_COMMENTS } from "@/features/community/data/mockCommunityData";
import { useAuthStore } from "@/store/authStore";

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
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editingParentId, setEditingParentId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [likeState, setLikeState] = useState<LikeState>({
    count: post?.likes ?? 0,
    isLiked: false,
  });

  const totalCommentCount = useMemo(
    () => comments.reduce((sum, comment) => sum + 1 + comment.replies.length, 0),
    [comments]
  );

  const handleCommentSubmit = useCallback(() => {
    if (!commentText.trim()) return;
    const newComment: Comment = {
      id: String(Date.now()),
      author: currentUserName,
      avatarUrl: "",
      content: commentText.trim(),
      date: "방금 전",
      replies: [],
    };
    setComments((prev) => [newComment, ...prev]);
    setCommentText("");
  }, [commentText, currentUserName]);

  const handleReplyToggle = useCallback((commentId: string) => {
    setReplyingToId((prev) => (prev === commentId ? null : commentId));
    setReplyText("");
  }, []);

  const handleReplySubmit = useCallback(
    (commentId: string) => {
      if (!replyText.trim()) return;
      const newReply: CommentReply = {
        id: String(Date.now()),
        author: currentUserName,
        avatarUrl: "",
        content: replyText.trim(),
        date: "방금 전",
        parentId: commentId,
      };
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? { ...comment, replies: [...comment.replies, newReply] }
            : comment
        )
      );
      setReplyText("");
      setReplyingToId(null);
    },
    [replyText, currentUserName]
  );

  const handleEditCommentStart = useCallback((commentId: string, content: string) => {
    setEditingCommentId(commentId);
    setEditingReplyId(null);
    setEditingParentId(null);
    setEditText(content);
  }, []);

  const handleEditReplyStart = useCallback(
    (commentId: string, replyId: string, content: string) => {
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

  const handleEditSubmit = () => {
    const nextText = editText.trim();
    if (!nextText) return;
    if (editingCommentId) {
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === editingCommentId ? { ...comment, content: nextText } : comment
        )
      );
      handleEditCancel();
      return;
    }
    if (editingReplyId && editingParentId) {
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === editingParentId
            ? {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply.id === editingReplyId ? { ...reply, content: nextText } : reply
                ),
              }
            : comment
        )
      );
      handleEditCancel();
    }
  };

  const handleDeleteComment = useCallback((commentId: string) => {
    setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    if (editingCommentId === commentId) {
      handleEditCancel();
    }
  }, [editingCommentId, handleEditCancel]);

  const handleDeleteReply = useCallback(
    (commentId: string, replyId: string) => {
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

  const handleLikeToggle = useCallback(() => {
    setLikeState((prev) => {
      const next = prev.isLiked
        ? { count: Math.max(0, prev.count - 1), isLiked: false }
        : { count: prev.count + 1, isLiked: true };
      return next;
    });
  }, []);

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
