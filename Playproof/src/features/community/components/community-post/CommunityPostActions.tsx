// src/features/community/components/community-post/CommunityPostActions.tsx

import {
  CommentIcon,
  HeartIcon,
  ShareIcon,
} from "@/features/community/components/community-post/CommunityPostIcons";

type CommunityPostActionsProps = {
  likes: number;
  comments: number;
};

export function CommunityPostActions({ likes, comments }: CommunityPostActionsProps) {
  return (
    <div className="flex items-center gap-4 p-4 pt-3">
      <button className="flex items-center gap-1.5 text-zinc-500 transition-colors hover:text-red-500">
        <HeartIcon />
        <span className="text-sm font-medium">{likes}</span>
      </button>

      <button className="flex items-center gap-1.5 text-zinc-500 transition-colors hover:text-blue-500">
        <CommentIcon />
        <span className="text-sm font-medium">{comments}</span>
      </button>

      <button className="ml-auto text-zinc-500 transition-colors hover:text-zinc-900">
        <ShareIcon />
      </button>
    </div>
  );
}
