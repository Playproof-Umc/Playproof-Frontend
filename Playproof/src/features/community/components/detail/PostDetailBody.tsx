// src/features/community/components/detail/PostDetailBody.tsx

import { Heart } from "lucide-react";
import type { BoardPost } from "@/features/community/types";

type PostDetailBodyProps = {
  post: BoardPost;
  likeCount: number;
  isLiked: boolean;
  onLike: () => void;
};

export const PostDetailBody = ({ post, likeCount, isLiked, onLike }: PostDetailBodyProps) => {
  return (
    <>
      <div className="p-6">
        <div className="prose max-w-none">
          <p className="whitespace-pre-wrap text-gray-800">{post.content}</p>

          {post.thumbnail && (
            <div className="mt-6 overflow-hidden rounded-lg bg-gray-200">
              <img src={post.thumbnail} alt="" className="h-auto w-full object-cover" />
            </div>
          )}

          {post.images && post.images.length > 0 && (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {post.images.map((url, index) => (
                <div
                  key={`${url}-${index}`}
                  className="overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
                >
                  <img src={url} alt="" className="h-auto w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 px-6 py-4">
        <button
          onClick={onLike}
          className={`flex w-full items-center justify-center gap-2 rounded-lg border py-2 text-sm font-medium transition-colors ${
            isLiked
              ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Heart className="h-5 w-5" fill={isLiked ? "currentColor" : "none"} />
          <span>{likeCount}</span>
        </button>
      </div>
    </>
  );
};
