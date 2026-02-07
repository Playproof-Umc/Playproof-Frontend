// src/features/community/components/highlight-detail/HighlightDetailMediaPanel.tsx

import React from "react";
import type { HighlightPost } from "@/features/community/types";

interface HighlightDetailMediaPanelProps {
  post: HighlightPost;
  currentImageIndex: number;
  onNextImage: () => void;
  onPrevImage: () => void;
  onToggleLike: (postId: number) => void;
  likeCount: number;
  isLiked: boolean;
  totalCommentCount: number;
  onMoveToProfile: (event: React.MouseEvent, userId: string) => void;
  profileUserId: string;
}

export function HighlightDetailMediaPanel({
  post,
  currentImageIndex,
  onNextImage,
  onPrevImage,
  onToggleLike,
  likeCount,
  isLiked,
  totalCommentCount,
  onMoveToProfile,
  profileUserId,
}: HighlightDetailMediaPanelProps) {
  return (
    <div className="relative flex w-full md:w-3/5 flex-col bg-white min-h-0">
      <div className="border-b border-gray-200 p-5">
        <div className="flex items-center gap-3">
          <div
            onClick={(event) => onMoveToProfile(event, profileUserId)}
            className="h-10 w-10 cursor-pointer rounded-full bg-gray-300 transition-colors hover:bg-gray-400"
          />
          <div>
            <p
              onClick={(event) => onMoveToProfile(event, profileUserId)}
              className="cursor-pointer text-sm font-semibold text-gray-900 hover:underline"
            >
              {post.author}
            </p>
            <p className="text-xs text-gray-500">{post.date}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden bg-zinc-900">
        {post.images.length > 0 ? (
          <>
            <img
              src={post.images[currentImageIndex]}
              alt={post.content}
              className="h-full w-full object-contain"
            />

            {post.images.length > 1 && (
              <>
                <button
                  onClick={onPrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 hover:bg-white"
                >
                  ←
                </button>
                <button
                  onClick={onNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 hover:bg-white"
                >
                  →
                </button>
                <div className="absolute bottom-20 right-4 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
                  {currentImageIndex + 1} / {post.images.length}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-4xl text-gray-400">이미지 없음</span>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 p-5">
        <p className="text-sm text-gray-800">{post.content}</p>
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
          <button
            onClick={() => onToggleLike(post.id)}
            className={`flex items-center gap-2 font-medium transition ${
              isLiked ? "text-red-600" : "text-gray-700 hover:text-gray-900"
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                stroke={isLiked ? "currentColor" : "currentColor"}
                fill={isLiked ? "currentColor" : "none"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {likeCount}
          </button>
          <div className="flex items-center gap-2 font-medium text-gray-700">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {totalCommentCount}
          </div>
        </div>
      </div>
    </div>
  );
}
