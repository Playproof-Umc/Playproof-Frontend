// src/features/community/components/community-post/CommunityPostListItem.tsx

import { Eye, Heart, MessageCircle, MoreVertical } from "lucide-react";
import type { BoardPost } from "@/features/community/types";

type CommunityPostListItemProps = {
  post: BoardPost;
  isLast: boolean;
  onPostClick: (post: BoardPost) => void;
};

export function CommunityPostListItem({ post, isLast, onPostClick }: CommunityPostListItemProps) {
  return (
    <div
      onClick={() => onPostClick(post)}
      className={`flex cursor-pointer items-center gap-4 p-4 transition hover:bg-gray-50 ${
        isLast ? "" : "border-b border-gray-100"
      }`}
    >
      <div className="flex flex-col items-center gap-1 text-gray-600">
        <Heart className="h-5 w-5" />
        <span className="text-xs font-medium">{post.likes}</span>
      </div>

      {post.thumbnail ? (
        <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
          <img src={post.thumbnail} alt="" className="h-full w-full object-cover" />
        </div>
      ) : (
        <div className="h-16 w-24 flex-shrink-0 rounded-lg bg-gray-200" />
      )}

      <div className="flex-1">
        <h3 className="mb-1 font-semibold text-gray-900">{post.title}</h3>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <div className="h-4 w-4 rounded-full bg-gray-300" />
            <span>{post.author}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1 text-right">
        <span className="text-xs text-gray-500">{post.date}</span>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {post.views}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-3.5 w-3.5" />
            {post.comments}
          </span>
        </div>
      </div>

      <button
        onClick={(event) => {
          event.stopPropagation();
          console.log("더보기:", post.id);
        }}
        className="text-gray-400 hover:text-gray-600"
      >
        <MoreVertical className="h-5 w-5" />
      </button>
    </div>
  );
}
