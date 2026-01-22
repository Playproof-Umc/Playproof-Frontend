import React from "react";
import { HighlightCard } from "@/features/community/components/HighlightCard";
import type { HighlightPost } from "@/features/community/types";

interface HighlightFeedProps {
  posts: HighlightPost[];
  onPostClick: (post: HighlightPost) => void;
}

export function HighlightFeed({ posts, onPostClick }: HighlightFeedProps) {
  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <HighlightCard key={post.id} post={post} onPostClick={onPostClick} />
        ))}
      </div>
    </section>
  );
}