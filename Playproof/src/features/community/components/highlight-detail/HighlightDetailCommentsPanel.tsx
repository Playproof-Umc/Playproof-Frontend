// src/features/community/components/highlight-detail/HighlightDetailCommentsPanel.tsx

import React from "react";
import type { Comment } from "@/features/community/types";
import { COMMUNITY_SECTION_LABELS } from "@/features/community/constants/labels";
import { HighlightCommentItem } from "@/features/community/components/highlight-detail/HighlightCommentItem";

interface HighlightDetailCommentsPanelProps {
  comments: Comment[];
  totalCommentCount: number;
  currentUserName: string;
  commentText: string;
  onCommentTextChange: (value: string) => void;
  onCommentKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onCommentSubmit: () => void;
  commentInputRef: React.RefObject<HTMLInputElement>;
  replyingToId: string | null;
  replyText: string;
  onReplyTextChange: (value: string) => void;
  onReplyKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>, commentId: string) => void;
  onReplySubmit: (commentId: string) => void;
  onReplyToggle: (commentId: string) => void;
  replyInputRef: React.RefObject<HTMLTextAreaElement>;
  editingCommentId: string | null;
  editingReplyId: string | null;
  editingParentId: string | null;
  editText: string;
  onEditTextChange: (value: string) => void;
  onEditKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onEditStart: (commentId: string, content: string) => void;
  onReplyEditStart: (commentId: string, replyId: string, content: string) => void;
  onEditCancel: () => void;
  onEditSubmit: () => void;
  onDeleteComment: (commentId: string) => void;
  onDeleteReply: (commentId: string, replyId: string) => void;
  editInputRef: React.RefObject<HTMLTextAreaElement>;
  onMoveToProfile: (event: React.MouseEvent, userId: string) => void;
  profileUserId: string;
}

export function HighlightDetailCommentsPanel({
  comments,
  totalCommentCount,
  currentUserName,
  commentText,
  onCommentTextChange,
  onCommentKeyDown,
  onCommentSubmit,
  commentInputRef,
  replyingToId,
  replyText,
  onReplyTextChange,
  onReplyKeyDown,
  onReplySubmit,
  onReplyToggle,
  replyInputRef,
  editingCommentId,
  editingReplyId,
  editingParentId,
  editText,
  onEditTextChange,
  onEditKeyDown,
  onEditStart,
  onReplyEditStart,
  onEditCancel,
  onEditSubmit,
  onDeleteComment,
  onDeleteReply,
  editInputRef,
  onMoveToProfile,
  profileUserId,
}: HighlightDetailCommentsPanelProps) {
  return (
    <div className="flex w-full md:w-2/5 flex-col border-t border-gray-200 md:border-t-0 md:border-l min-h-0">
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="mb-4 text-sm font-semibold text-gray-900">
          {COMMUNITY_SECTION_LABELS.comments} {totalCommentCount}
        </h3>
        <div className="space-y-4">
          {comments.map((comment) => (
            <HighlightCommentItem
              key={comment.id}
              comment={comment}
              currentUserName={currentUserName}
              replyingToId={replyingToId}
              replyText={replyText}
              onReplyTextChange={onReplyTextChange}
              onReplyKeyDown={onReplyKeyDown}
              onReplySubmit={onReplySubmit}
              onReplyToggle={onReplyToggle}
              replyInputRef={replyInputRef}
              editingCommentId={editingCommentId}
              editingReplyId={editingReplyId}
              editingParentId={editingParentId}
              editText={editText}
              onEditTextChange={onEditTextChange}
              onEditKeyDown={onEditKeyDown}
              onEditStart={onEditStart}
              onReplyEditStart={onReplyEditStart}
              onEditCancel={onEditCancel}
              onEditSubmit={onEditSubmit}
              onDeleteComment={onDeleteComment}
              onDeleteReply={onDeleteReply}
              editInputRef={editInputRef}
              onMoveToProfile={onMoveToProfile}
              profileUserId={profileUserId}
            />
          ))}
        </div>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          onCommentSubmit();
        }}
        className="border-t border-gray-200 p-4 bg-white md:static md:bg-transparent sticky bottom-0"
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            ref={commentInputRef}
            value={commentText}
            onChange={(event) => onCommentTextChange(event.target.value)}
            onKeyDown={onCommentKeyDown}
            placeholder={COMMUNITY_SECTION_LABELS.commentPlaceholder}
            className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="rounded-lg bg-black px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-gray-800"
          >
            작성하기
          </button>
        </div>
      </form>
    </div>
  );
}
