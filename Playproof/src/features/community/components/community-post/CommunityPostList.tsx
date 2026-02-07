// src/features/community/components/community-post/CommunityPostList.tsx

import type { BoardPost } from "@/features/community/types";
import { CommunityPostListItem } from "@/features/community/components/community-post/CommunityPostListItem";

interface CommunityPostListProps {
  posts: BoardPost[];
  onPostClick: (post: BoardPost) => void;
}

export function CommunityPostList({ posts, onPostClick }: CommunityPostListProps) {
  return (
    <div className="mb-8">
      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5">
        {posts.map((post, index) => (
          <CommunityPostListItem
            key={post.id}
            post={post}
            isLast={index === posts.length - 1}
            onPostClick={onPostClick}
          />
        ))}
      </div>
    </div>
  );
}
