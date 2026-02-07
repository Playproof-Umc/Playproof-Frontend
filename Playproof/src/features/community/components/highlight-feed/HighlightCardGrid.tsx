// src/features/community/components/highlight-feed/HighlightCardGrid.tsx

import { HighlightCard } from "@/features/community/components/highlight-feed/HighlightCard";
import type { HighlightPost } from "@/features/community/types";

type HighlightCardGridProps = {
  posts: HighlightPost[];
  onPostClick: (post: HighlightPost) => void;
  getLikeState: (post: HighlightPost) => { count: number; isLiked: boolean };
  getCommentCount: (post: HighlightPost) => number;
  onToggleLike: (postId: number, fallbackLikes: number) => void;
  currentUserName: string;
  onDeletePost?: (postId: number) => void;
};

export function HighlightCardGrid({
  posts,
  onPostClick,
  getLikeState,
  getCommentCount,
  onToggleLike,
  currentUserName,
  onDeletePost,
}: HighlightCardGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => {
        const likeState = getLikeState(post);
        return (
          <HighlightCard
            key={post.id}
            post={post}
            likeCount={likeState.count}
            isLiked={likeState.isLiked}
            commentCount={getCommentCount(post)}
            onToggleLike={(postId) => onToggleLike(postId, post.likes)}
            onPostClick={onPostClick}
            currentUserName={currentUserName}
            onDeletePost={onDeletePost}
          />
        );
      })}
    </div>
  );
}
