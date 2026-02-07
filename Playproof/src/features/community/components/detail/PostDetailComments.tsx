// src/features/community/components/detail/PostDetailComments.tsx

import React, { useRef } from "react";
import type { Comment } from "@/features/community/types";
import { COMMUNITY_SECTION_LABELS } from "@/features/community/constants/labels";
import { PostDetailCommentForm } from "@/features/community/components/detail/comments/PostDetailCommentForm";
import { PostDetailCommentItem } from "@/features/community/components/detail/comments/PostDetailCommentItem";

type PostDetailCommentsProps = {
  comments: Comment[];
  totalCount: number;
  currentUserName: string;
  commentText: string;
  replyText: string;
  replyingToId: string | null;
  editingCommentId: string | null;
  editingReplyId: string | null;
  editingParentId: string | null;
  editText: string;
  onCommentChange: (value: string) => void;
  onCommentSubmit: () => void;
  onReplyChange: (value: string) => void;
  onReplyToggle: (commentId: string) => void;
  onReplySubmit: (commentId: string) => void;
  onEditTextChange: (value: string) => void;
  onEditCommentStart: (commentId: string, content: string) => void;
  onEditReplyStart: (commentId: string, replyId: string, content: string) => void;
  onEditCancel: () => void;
  onEditSubmit: () => void;
  onDeleteComment: (commentId: string) => void;
  onDeleteReply: (commentId: string, replyId: string) => void;
};

export const PostDetailComments = ({
  comments,
  totalCount,
  currentUserName,
  commentText,
  replyText,
  replyingToId,
  editingCommentId,
  editingReplyId,
  editingParentId,
  editText,
  onCommentChange,
  onCommentSubmit,
  onReplyChange,
  onReplyToggle,
  onReplySubmit,
  onEditTextChange,
  onEditCommentStart,
  onEditReplyStart,
  onEditCancel,
  onEditSubmit,
  onDeleteComment,
  onDeleteReply,
}: PostDetailCommentsProps) => {
  const commentInputRef = useRef<HTMLInputElement | null>(null);
  const replyInputRef = useRef<HTMLTextAreaElement | null>(null);
  const editInputRef = useRef<HTMLTextAreaElement | null>(null);

  const focusCommentInput = () => {
    requestAnimationFrame(() => {
      commentInputRef.current?.focus();
    });
  };

  const handleCommentSubmit = () => {
    onCommentSubmit();
    focusCommentInput();
  };

  const handleReplySubmit = (commentId: string) => {
    onReplySubmit(commentId);
    focusCommentInput();
  };

  const handleCommentKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleCommentSubmit();
    }
  };

  const handleReplyKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
    commentId: string
  ) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleReplySubmit(commentId);
    }
  };

  const handleEditKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onEditSubmit();
    }
  };

  const handleEditCommentStart = (commentId: string, content: string) => {
    onEditCommentStart(commentId, content);
    requestAnimationFrame(() => editInputRef.current?.focus());
  };

  const handleEditReplyStart = (commentId: string, replyId: string, content: string) => {
    onEditReplyStart(commentId, replyId, content);
    requestAnimationFrame(() => editInputRef.current?.focus());
  };

  return (
    <div className="border-t border-gray-200 p-6">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">
        {COMMUNITY_SECTION_LABELS.comments} {totalCount}
      </h3>

      <PostDetailCommentForm
        commentText={commentText}
        onCommentChange={onCommentChange}
        onCommentSubmit={handleCommentSubmit}
        onCommentKeyDown={handleCommentKeyDown}
        commentInputRef={commentInputRef}
      />

      <div className="space-y-4">
        {comments.map((comment) => (
          <PostDetailCommentItem
            key={comment.id}
            comment={comment}
            currentUserName={currentUserName}
            replyingToId={replyingToId}
            replyText={replyText}
            onReplyChange={onReplyChange}
            onReplyToggle={onReplyToggle}
            onReplySubmit={handleReplySubmit}
            onReplyKeyDown={handleReplyKeyDown}
            replyInputRef={replyInputRef}
            editingCommentId={editingCommentId}
            editingReplyId={editingReplyId}
            editingParentId={editingParentId}
            editText={editText}
            onEditTextChange={onEditTextChange}
            onEditKeyDown={handleEditKeyDown}
            onEditCommentStart={handleEditCommentStart}
            onEditReplyStart={handleEditReplyStart}
            onEditCancel={onEditCancel}
            onEditSubmit={onEditSubmit}
            onDeleteComment={onDeleteComment}
            onDeleteReply={onDeleteReply}
            editInputRef={editInputRef}
          />
        ))}
      </div>
    </div>
  );
};
