// src/features/community/components/CommentSection.tsx

import React, { useState } from "react";
import { COMMUNITY_SECTION_LABELS } from "@/features/community/constants/labels";
import type { Comment } from "@/features/community/types";

interface CommentSectionProps {
  comments: Comment[];
  totalCount: number;
}

export function CommentSection({ comments, totalCount }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit comment:", newComment);
    setNewComment("");
  };

  return (
    <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <h2 className="mb-4 text-lg font-semibold">
        {COMMUNITY_SECTION_LABELS.comments} {totalCount}
      </h2>

      {/* 댓글 작성 */}
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={COMMUNITY_SECTION_LABELS.commentPlaceholderShort}
          className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          rows={3}
        />
        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="bg-black text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors"
          >
            작성하기
          </button>
        </div>
      </form>

      {/* 댓글 목록 */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-0">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{comment.author}</span>
                  <span className="text-xs text-gray-500">{comment.date}</span>
                </div>
                <p className="mt-1 text-sm text-gray-700">{comment.content}</p>
                {comment.replies.length > 0 && (
                  <button className="mt-2 text-xs text-blue-600 hover:underline">
                    답글 {comment.replies.length}개 보기
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
