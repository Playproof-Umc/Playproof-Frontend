// src/features/community/components/highlight-detail/useHighlightDetailState.ts

import React, { useRef } from "react";
import type { HighlightPost } from "@/features/community/types";

export function useHighlightDetailState(post: HighlightPost) {
  const [commentText, setCommentText] = React.useState("");
  const [replyText, setReplyText] = React.useState("");
  const [replyingToId, setReplyingToId] = React.useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = React.useState<string | null>(null);
  const [editingReplyId, setEditingReplyId] = React.useState<string | null>(null);
  const [editingParentId, setEditingParentId] = React.useState<string | null>(null);
  const [editText, setEditText] = React.useState("");
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const commentInputRef = useRef<HTMLInputElement | null>(null);
  const replyInputRef = useRef<HTMLTextAreaElement | null>(null);
  const editInputRef = useRef<HTMLTextAreaElement | null>(null);

  const focusCommentInput = () => {
    requestAnimationFrame(() => {
      commentInputRef.current?.focus();
    });
  };

  const handleReplyToggle = (commentId: string) => {
    setReplyingToId((prev) => (prev === commentId ? null : commentId));
  };

  const handleEditStart = (commentId: string, content: string) => {
    setEditingCommentId(commentId);
    setEditingReplyId(null);
    setEditingParentId(null);
    setEditText(content);
    requestAnimationFrame(() => {
      editInputRef.current?.focus();
    });
  };

  const handleReplyEditStart = (commentId: string, replyId: string, content: string) => {
    setEditingCommentId(null);
    setEditingReplyId(replyId);
    setEditingParentId(commentId);
    setEditText(content);
    requestAnimationFrame(() => {
      editInputRef.current?.focus();
    });
  };

  const handleEditCancel = () => {
    setEditingCommentId(null);
    setEditingReplyId(null);
    setEditingParentId(null);
    setEditText("");
  };

  const handleCommentKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    onSubmit: () => void
  ) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  };

  const handleReplyKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
    onSubmit: () => void
  ) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  };

  const handleEditKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
    onSubmit: () => void
  ) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === post.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? post.images.length - 1 : prev - 1
    );
  };

  return {
    state: {
      commentText,
      replyText,
      replyingToId,
      editingCommentId,
      editingReplyId,
      editingParentId,
      editText,
      currentImageIndex,
    },
    refs: {
      commentInputRef,
      replyInputRef,
      editInputRef,
    },
    actions: {
      setCommentText,
      setReplyText,
      setEditText,
      setReplyingToId,
      focusCommentInput,
      handleReplyToggle,
      handleEditStart,
      handleReplyEditStart,
      handleEditCancel,
      handleCommentKeyDown,
      handleReplyKeyDown,
      handleEditKeyDown,
      nextImage,
      prevImage,
    },
  };
}
