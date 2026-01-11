import * as React from "react";

type Post = {
  id: number;
  author: string;
  date: string;
  title: string;
  content: string;
  likes: number;
  views: number;
  comments: number;
  thumbnail?: string;
};

type CommunityPostListProps = {
  posts: Post[];
};

export function CommunityPostList({ posts }: CommunityPostListProps) {
  return (
    <div className="space-y-0 border-t border-zinc-200">
      {posts.map((post) => (
        <div
          key={post.id}
          className="flex items-center gap-4 border-b border-zinc-200 py-4 hover:bg-zinc-50 transition-colors cursor-pointer"
        >
          {/* 좋아요 */}
          <div className="flex flex-col items-center gap-1 px-4">
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
          <div className="flex items-center gap-6 px-4">
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
            <button className="text-zinc-400 hover:text-zinc-600 transition-colors">
              <MoreIcon />
            </button>
          </div>
        </div>
      ))}
    </div>
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

function MoreIcon() {
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
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );
}

export type { Post };
