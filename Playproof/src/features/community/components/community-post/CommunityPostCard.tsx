// src/features/community/components/community-post/CommunityPostCard.tsx

import { Card } from "@/components/ui/Card";
import { CommunityPostActions } from "@/features/community/components/community-post/CommunityPostActions";
import { CommunityPostHeader } from "@/features/community/components/community-post/CommunityPostHeader";
import { CommunityPostMediaCarousel } from "@/features/community/components/community-post/CommunityPostMediaCarousel";

type CommunityPostProps = {
  author: string;
  date: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  avatarUrl?: string;
  images?: string[];
  onProfileClick?: () => void;
  onMoreClick?: () => void;
};

export function CommunityPostCard({
  author,
  date,
  title,
  content,
  likes,
  comments,
  avatarUrl,
  images = [],
  onProfileClick,
  onMoreClick,
}: CommunityPostProps) {
  const displayText = title || content;

  return (
    <Card className="!rounded-2xl !shadow-sm !ring-1 !ring-black/5 !border-0 transition-shadow hover:!shadow-md">
      <CommunityPostHeader
        author={author}
        date={date}
        avatarUrl={avatarUrl}
        onProfileClick={onProfileClick}
        onMoreClick={onMoreClick}
      />
      <CommunityPostMediaCarousel title={displayText} images={images} />
      <CommunityPostActions likes={likes} comments={comments} />

      <div className="px-4 pb-4">
        <p className="text-sm leading-relaxed text-zinc-900">{displayText}</p>
      </div>
    </Card>
  );
}
