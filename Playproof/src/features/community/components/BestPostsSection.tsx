// src/features/community/components/BestPostsSection.tsx

import { Heart, MessageCircle, Eye, MoreVertical } from "lucide-react";
import type { BoardPost } from "@/features/community/types";
import { COMMUNITY_SECTION_LABELS } from "@/features/community/constants/labels";

interface BestPostsSectionProps {
  posts: BoardPost[];
  onPostClick: (post: BoardPost) => void;
}

export function BestPostsSection({ posts, onPostClick }: BestPostsSectionProps) {
  // 상위 3개만 표시
  const topPosts = posts.slice(0, 3);

  return (
    <section className="mb-8 mt-6">
      {/* 정렬 드롭다운 */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-zinc-900">
          {COMMUNITY_SECTION_LABELS.bestPostsTitle}
        </h2>
        <button className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
          {COMMUNITY_SECTION_LABELS.bestPostsBadge}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* 베스트 게시글 리스트 */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5">
        {topPosts.map((post, index) => (
          <div
            key={post.id}
            onClick={() => onPostClick(post)}
            className={`flex cursor-pointer items-center gap-4 p-4 transition hover:bg-gray-50 ${
              index !== topPosts.length - 1 ? "border-b border-gray-100" : ""
            }`}
          >
            {/* 좋아요 */}
            <div className="flex flex-col items-center gap-1 text-gray-600">
              <Heart className="h-5 w-5" />
              <span className="text-xs font-medium">{post.likes}</span>
            </div>

            {/* 썸네일 */}
            {post.thumbnail && (
              <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
                <img
                  src={post.thumbnail}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            {/* 게시글 정보 */}
            <div className="flex-1">
              <h3 className="mb-1 font-semibold text-gray-900">{post.title}</h3>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="h-4 w-4 rounded-full bg-gray-300" />
                  <span>{post.author}</span>
                </div>
              </div>
            </div>

            {/* 날짜 및 통계 */}
            <div className="flex flex-col items-end gap-1 text-right">
              <span className="text-xs text-gray-500">{post.date}</span>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {post.views}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-3.5 w-3.5" />
                  {post.comments}
                </span>
              </div>
            </div>

            {/* 더보기 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log("더보기:", post.id);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
