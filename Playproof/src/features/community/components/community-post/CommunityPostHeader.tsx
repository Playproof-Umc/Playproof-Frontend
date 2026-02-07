// src/features/community/components/community-post/CommunityPostHeader.tsx

import React from "react";
import { ThreeDotsIcon, UserIcon } from "@/features/community/components/community-post/CommunityPostIcons";

type CommunityPostHeaderProps = {
  author: string;
  date: string;
  avatarUrl?: string;
  onProfileClick?: () => void;
  onMoreClick?: () => void;
};

export function CommunityPostHeader({
  author,
  date,
  avatarUrl,
  onProfileClick,
  onMoreClick,
}: CommunityPostHeaderProps) {
  const handleProfileClick = () => onProfileClick?.();
  const handleMoreClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onMoreClick?.();
  };

  return (
    <div className="flex items-center gap-3 p-4 pb-3">
      <button
        type="button"
        onClick={handleProfileClick}
        className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-zinc-200"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={author} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center text-zinc-400">
            <UserIcon />
          </div>
        )}
      </button>

      <button
        type="button"
        onClick={handleProfileClick}
        className="min-w-0 flex-1 text-left"
      >
        <div className="text-sm font-semibold text-zinc-900">{author}</div>
        <div className="text-xs text-zinc-500">{date}</div>
      </button>

      <button
        type="button"
        onClick={handleMoreClick}
        className="shrink-0 p-1 text-zinc-400 hover:text-zinc-600"
      >
        <ThreeDotsIcon />
      </button>
    </div>
  );
}
