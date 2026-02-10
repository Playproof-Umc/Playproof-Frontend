// src/features/community/components/highlight-feed/HighlightFeed.tsx

import type { HighlightPost } from "@/features/community/types";
import { HighlightCardGrid } from "@/features/community/components/highlight-feed/HighlightCardGrid";

interface HighlightFeedProps {
  posts: HighlightPost[];
  onPostClick: (post: HighlightPost) => void;
  getLikeState: (post: HighlightPost) => { count: number; isLiked: boolean };
  getCommentCount: (post: HighlightPost) => number;
  onToggleLike: (postId: number, fallbackLikes: number) => void;
  currentUserName: string;
  onDeletePost?: (postId: number) => void;
}

export function HighlightFeed({
  posts,
  onPostClick,
  getLikeState,
  getCommentCount,
  onToggleLike,
  currentUserName,
  onDeletePost,
}: HighlightFeedProps) {
  return (
    <section className="mb-8">
      <HighlightCardGrid
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
