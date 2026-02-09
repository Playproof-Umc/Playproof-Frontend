// src/features/community/components/detail/PostDetailComments.tsx

import React, { useRef } from "react";
import type { CommunityComment } from "@/features/community/types/types";
import { COMMUNITY_SECTION_LABELS } from "@/features/community/constants/labels";
import { PostDetailCommentForm } from "@/features/community/components/detail/comments/PostDetailCommentForm";
import { PostDetailCommentItem } from "@/features/community/components/detail/comments/PostDetailCommentItem";

type PostDetailCommentsProps = {
  comments: CommunityComment[];
  totalCount: number;
  currentUserName: string;
  commentText: string;
  replyText: string;
  replyingToId: number | null;
  editingCommentId: number | null;
  editingReplyId: number | null;
  editingParentId: number | null;
  editText: string;
  onCommentChange: (value: string) => void;
  onCommentSubmit: () => void;
  onReplyChange: (value: string) => void;
  onReplyToggle: (commentId: number) => void;
  onReplySubmit: (commentId: number) => void;
  onEditTextChange: (value: string) => void;
  onEditCommentStart: (commentId: number, content: string) => void;
  onEditReplyStart: (commentId: number, replyId: number, content: string) => void;
  onEditCancel: () => void;
  onEditSubmit: () => void;
  onDeleteComment: (commentId: number) => void;
  onDeleteReply: (commentId: number, replyId: number) => void;
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

  const handleReplySubmit = (commentId: number) => {
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
    commentId: number
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

  const handleEditCommentStart = (commentId: number, content: string) => {
    onEditCommentStart(commentId, content);
    requestAnimationFrame(() => editInputRef.current?.focus());
  };

  const handleEditReplyStart = (commentId: number, replyId: number, content: string) => {
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
