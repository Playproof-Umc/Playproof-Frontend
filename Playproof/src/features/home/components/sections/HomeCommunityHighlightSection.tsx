import * as React from "react";
import { HighlightFeed } from "@/features/community/components/HighlightFeed";
import { HOME_ACTION_LABELS, HOME_SECTION_LABELS } from "@/features/home/constants/labels";
import type { HighlightPost } from "@/features/community/types";

type HomeCommunityHighlightSectionProps = {
  posts: HighlightPost[];
  onPostClick: (post: HighlightPost) => void;
};

export function HomeCommunityHighlightSection({
  posts,
  onPostClick,
}: HomeCommunityHighlightSectionProps) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-zinc-900">
          {HOME_SECTION_LABELS.highlightCommunityTitle}
        </h2>
        <button className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
          {HOME_ACTION_LABELS.more}
        </button>
      </div>
      <HighlightFeed posts={posts} onPostClick={onPostClick} />
    </section>
  );
}
