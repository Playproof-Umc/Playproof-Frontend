// src/features/home/components/sections/HomeCommunityHighlightSection.tsx

import { useNavigate } from "react-router-dom";
import { HighlightFeed } from "@/features/community/components/highlight-feed/HighlightFeed";
import { HOME_ACTION_LABELS, HOME_SECTION_LABELS } from "@/features/home/constants/labels";
import type { HomeCommunityHighlightSectionProps } from "@/features/home/components/sections/types";

export function HomeCommunityHighlightSection({
  posts,
  onPostClick,
  getLikeState,
  getCommentCount,
  onToggleLike,
  currentUserName,
  onDeletePost,
}: HomeCommunityHighlightSectionProps) {
  const navigate = useNavigate();

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-zinc-900">
          {HOME_SECTION_LABELS.highlightCommunityTitle}
        </h2>
        <button
          type="button"
          onClick={() => navigate("/community")}
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
        >
          {HOME_ACTION_LABELS.more}
        </button>
      </div>
      <HighlightFeed
        posts={posts}
        onPostClick={onPostClick}
        getLikeState={getLikeState}
        getCommentCount={getCommentCount}
        onToggleLike={onToggleLike}
        currentUserName={currentUserName}
        onDeletePost={onDeletePost}
      />
    </section>
  );
}
