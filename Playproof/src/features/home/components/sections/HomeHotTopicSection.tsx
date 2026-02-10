// src/features/home/components/sections/HomeHotTopicSection.tsx

import type { HomeHotTopicSectionProps } from "@/features/home/components/sections/types";
import { HOME_ACTION_LABELS, HOME_SECTION_LABELS } from "@/features/home/constants/labels";

export function HomeHotTopicSection({
  posts,
  onMoreClick,
  onPostClick,
}: HomeHotTopicSectionProps) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-zinc-900">
          {HOME_SECTION_LABELS.hotTopicTitle}
        </h2>
        <button
          type="button"
          onClick={onMoreClick}
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
        >
          {HOME_ACTION_LABELS.more}
        </button>
      </div>
      <div className="grid gap-4">
        {posts.map((post, i) => (
          <div
            key={post.id}
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 flex items-center gap-4 cursor-pointer hover:bg-zinc-50 transition-colors"
            onClick={() => onPostClick?.(post)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onPostClick?.(post);
              }
            }}
          >
            <div className="text-2xl font-bold text-zinc-900 w-8 text-center">
              {i + 1}
            </div>
            <div>
              <div className="font-semibold text-zinc-900">{post.title}</div>
              <div className="text-sm text-zinc-500 mt-1">
                🔥 {post.likes} 좋아요 · 💬 {post.comments} 댓글
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
