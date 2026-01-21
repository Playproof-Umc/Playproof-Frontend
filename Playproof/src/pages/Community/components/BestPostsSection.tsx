import * as React from "react";
import type { Post } from "./CommunityPostList";

type BestPostsSectionProps = {
  posts: Post[];
};

export function BestPostsSection({ posts }: BestPostsSectionProps) {
  if (posts.length === 0) return null;

  return (
    <div className="mb-6">
      {/* 베스트 게시글 헤더 */}
      <div className="mb-4 flex items-center gap-2">
        <BestIcon />
        <h2 className="text-lg font-bold text-zinc-900">베스트 게시글</h2>
      </div>

      {/* 베스트 게시글 리스트 */}
      <div className="space-y-0 rounded-lg border border-zinc-300 bg-zinc-50 overflow-hidden">
        {posts.map((post, index) => (
          <div
            key={post.id}
            className="flex items-center gap-4 border-b border-zinc-200 last:border-b-0 py-4 px-4 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            {/* 순위 배지 */}
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-zinc-700 text-white font-bold text-sm shadow-sm">
              {index + 1}
            </div>

            {/* 좋아요 */}
            <div className="flex flex-col items-center gap-1 px-2">
              <button className="flex items-center justify-center text-zinc-400 hover:text-zinc-600 transition-colors">
                <ThumbsUpIcon />
              </button>
              <span className="text-sm font-medium text-zinc-600">{post.likes}</span>
            </div>

            {/* 썸네일 */}
            {post.thumbnail && (
              <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-zinc-100">
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* 게시글 정보 */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-zinc-900 truncate">
                {post.title}
              </h3>
              <div className="mt-1 flex items-center gap-2 text-sm text-zinc-500">
                <span className="flex items-center gap-1">
                  <UserIcon />
                  {post.author}
                </span>
              </div>
            </div>

            {/* 우측 정보 */}
            <div className="flex items-center gap-6 px-2">
              <div className="text-right">
                <div className="text-sm text-zinc-500">{post.date}</div>
                <div className="mt-1 flex items-center gap-3 text-sm text-zinc-500">
                  <span className="flex items-center gap-1">
                    <EyeIcon />
                    {post.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <CommentIcon />
                    {post.comments}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BestIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-zinc-700"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function ThumbsUpIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
