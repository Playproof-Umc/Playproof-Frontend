import React from "react";
import { MoreVertical } from "lucide-react";
import type { Comment } from "@/features/community/types";
import { COMMUNITY_SECTION_LABELS } from "@/features/community/constants/labels";

type PostDetailCommentsProps = {
  comments: Comment[];
  newComment: string;
  onCommentChange: (value: string) => void;
  onCommentSubmit: (event: React.FormEvent) => void;
};

export const PostDetailComments = ({
  comments,
  newComment,
  onCommentChange,
  onCommentSubmit,
}: PostDetailCommentsProps) => {
  return (
    <div className="border-t border-gray-200 p-6">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">
        {COMMUNITY_SECTION_LABELS.comments} {comments.length}
      </h3>

      <form onSubmit={onCommentSubmit} className="mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300" />
          <div className="flex flex-1 items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => onCommentChange(e.target.value)}
              placeholder={COMMUNITY_SECTION_LABELS.commentPlaceholder}
              className="flex-1 bg-transparent text-sm focus:outline-none"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="rounded-full bg-black px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-800 disabled:bg-gray-300"
            >
              {COMMUNITY_SECTION_LABELS.commentSubmit}
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">
                    {comment.author}
                  </span>
                  <span className="text-xs text-gray-500">{comment.date}</span>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-700">{comment.content}</p>

              <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                <button className="hover:text-gray-700">좋아요</button>
                {comment.replies > 0 && (
                  <button className="hover:text-gray-700">
                    답글 {comment.replies}개
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
