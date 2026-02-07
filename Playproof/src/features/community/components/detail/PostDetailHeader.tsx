// src/features/community/components/detail/PostDetailHeader.tsx

import { Eye, MessageCircle, Heart, Share2 } from "lucide-react";
import type { BoardPost } from "@/features/community/types";

type PostDetailHeaderProps = {
  post: BoardPost;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  currentUserName: string;
  onEdit: () => void;
  onDelete: () => void;
  onShare: () => void;
  onReport: () => void;
};

export const PostDetailHeader = ({
  post,
  likeCount,
  commentCount,
  isLiked,
  currentUserName,
  onEdit,
  onDelete,
  onShare,
  onReport,
}: PostDetailHeaderProps) => {
  return (
    <div className="border-b border-gray-200 p-6">
      <div className="mb-4 flex items-start justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={onShare}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
          >
            <Share2 className="h-5 w-5" />
          </button>
          <button
            onClick={onReport}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
            title="신고하기"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 10C10 9.45 10.196 8.97933 10.588 8.588C10.98 8.19667 11.4507 8.00067 12 8C12.2833 8 12.521 7.904 12.713 7.712C12.905 7.52 13.0007 7.28267 13 7C12.9993 6.71733 12.9033 6.48 12.712 6.288C12.5207 6.096 12.2833 6 12 6C10.9 6 9.95833 6.39167 9.175 7.175C8.39167 7.95833 8 8.9 8 10V12C8 12.2833 8.096 12.521 8.288 12.713C8.48 12.905 8.71733 13.0007 9 13C9.28267 12.9993 9.52033 12.9033 9.713 12.712C9.90567 12.5207 10.0013 12.2833 10 12V10ZM4 21C3.45 21 2.97933 20.8043 2.588 20.413C2.19667 20.0217 2.00067 19.5507 2 19V17C2 16.45 2.196 15.9793 2.588 15.588C2.98 15.1967 3.45067 15.0007 4 15H5V10C5 8.05 5.67933 6.396 7.038 5.038C8.39667 3.68 10.0507 3.00067 12 3C13.9493 2.99933 15.6037 3.67867 16.963 5.038C18.3223 6.39733 19.0013 8.05133 19 10V15H20C20.55 15 21.021 15.196 21.413 15.588C21.805 15.98 22.0007 16.4507 22 17V19C22 19.55 21.8043 20.021 21.413 20.413C21.0217 20.805 20.5507 21.0007 20 21H4Z" fill="currentColor"/>
            </svg>
          </button>
          {post.author === currentUserName ? (
            <>
              <button
                onClick={onEdit}
                className="rounded-lg px-2 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-100"
              >
                수정
              </button>
              <button
                onClick={onDelete}
                className="rounded-lg px-2 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-100"
              >
                삭제
              </button>
            </>
          ) : (
            <button
              onClick={onReport}
              className="rounded-lg px-2 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-100"
            >
              신고
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-300" />
          <div>
            <p className="text-sm font-semibold text-gray-900">{post.author}</p>
            <p className="text-xs text-gray-500">{post.date}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {post.views}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            {commentCount}
          </span>
          <span className={`flex items-center gap-1 ${isLiked ? "text-red-500" : ""}`}>
            <Heart className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} />
            {likeCount}
          </span>
        </div>
      </div>
    </div>
  );
};
