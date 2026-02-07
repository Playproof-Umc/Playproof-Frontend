// src/features/community/components/detail/comments/PostDetailCommentForm.tsx

import React from "react";
import { User } from "lucide-react";
import { COMMUNITY_SECTION_LABELS } from "@/features/community/constants/labels";

type PostDetailCommentFormProps = {
  commentText: string;
  onCommentChange: (value: string) => void;
  onCommentSubmit: () => void;
  onCommentKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  commentInputRef: React.RefObject<HTMLInputElement>;
};

export function PostDetailCommentForm({
  commentText,
  onCommentChange,
  onCommentSubmit,
  onCommentKeyDown,
  commentInputRef,
}: PostDetailCommentFormProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onCommentSubmit();
      }}
      className="mb-6"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-300 text-gray-600">
          <User className="h-5 w-5" />
        </div>
        <div className="flex flex-1 items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2">
          <input
            type="text"
            ref={commentInputRef}
            value={commentText}
            onChange={(event) => onCommentChange(event.target.value)}
            onKeyDown={onCommentKeyDown}
            placeholder={COMMUNITY_SECTION_LABELS.commentPlaceholder}
            className="flex-1 bg-transparent text-sm focus:outline-none"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="rounded-lg bg-black px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-gray-800"
          >
            작성하기
          </button>
        </div>
      </div>
    </form>
  );
}
