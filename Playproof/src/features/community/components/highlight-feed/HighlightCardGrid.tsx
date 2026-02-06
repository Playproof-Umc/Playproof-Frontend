import React from "react";
import { HighlightCard } from "@/features/community/components/HighlightCard";
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
      {posts.map((post) => (
        <HighlightCard
          key={post.id || post.highlight_id}
          post={post}
          likeCount={getLikeState(post).count}
          isLiked={getLikeState(post).isLiked}
          commentCount={getCommentCount(post)}
          onToggleLike={onToggleLike}
          onPostClick={onPostClick}
          currentUserName={currentUserName}
          onDeletePost={onDeletePost}
        />
      ))}
    </div>
  );
}
