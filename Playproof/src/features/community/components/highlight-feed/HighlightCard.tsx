// src/features/community/components/highlight-feed/HighlightCard.tsx

import React from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { HighlightPost } from "@/features/community/types";

interface HighlightCardProps {
  post: HighlightPost;
  likeCount: number;
  isLiked: boolean;
  commentCount: number;
  onToggleLike: (postId: number) => void;
  onPostClick: (post: HighlightPost) => void;
  currentUserName: string;
  currentUserId?: number | null;
  onDeletePost?: (postId: number) => void;
}

export function HighlightCard({
  post,
  likeCount,
  isLiked,
  commentCount,
  onToggleLike,
  onPostClick,
  currentUserName,
  currentUserId,
  onDeletePost,
}: HighlightCardProps) {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/user/user-1');
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("공유하기:", post.content);
    // TODO: 공유 기능 구현
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleLike(post.id);
  };

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPostClick(post);
  };

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => prev - 1);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => prev + 1);
  };

  const truncateText = (text: string, maxLength: number = 20) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength);
  };

  const needsTruncate = post.content.length > 20;

  function getRelativeTime(dateString: string) {
    if (!dateString) return '';
    const now = new Date();
    const date = new Date(dateString);
    const diff = (now.getTime() - date.getTime()) / 1000; // 초 단위
    if (diff < 60) return '방금 전';
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)}일 전`;
    return date.toLocaleDateString('ko-KR');
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5">
      {/* 프로필/상단 영역 */}
      <div
        onClick={() => onPostClick(post)}
        className="flex items-center gap-3 p-4 transition hover:bg-gray-50 relative cursor-pointer"
      >
        <div
          className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"
          onClick={(e) => {
            e.stopPropagation();
            handleProfileClick(e);
          }}
          style={{ cursor: 'pointer' }}
        >
          {/* 프로필 이미지 */}
          {post.profileUrl && (
            <img src={post.profileUrl} alt="프로필" className="h-10 w-10 rounded-full object-cover" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">{post.nickname}</p>
          <p className="text-xs text-gray-500">
            {post.createdAt ? getRelativeTime(post.createdAt) : '날짜 없음'}
          </p>
        </div>
        {post.userId && currentUserId && post.userId === currentUserId && onDeletePost ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              console.log("highlight delete click", {
                postId: post.id,
                postUserId: post.userId,
                currentUserId,
              });
              onDeletePost(post.id);
            }}
            className="ml-auto rounded-lg px-2 py-1 text-[10px] font-semibold text-gray-500 hover:text-gray-700"
          >
            삭제
          </button>
        ) : null}
      </div>

      {/* 사진 영역 */}
      <div
        onClick={() => onPostClick(post)}
        className="relative aspect-square cursor-pointer bg-gray-200"
      >
        {(post.medias ?? post.images ?? []).length > 0 ? (
          <>
            <img
              src={
                (post.medias ?? post.images ?? [])[currentImageIndex].startsWith('http')
                  ? (post.medias ?? post.images ?? [])[currentImageIndex]
                  : `${import.meta.env.VITE_API_BASE_URL}/uploads/${(post.medias ?? post.images ?? [])[currentImageIndex]}`
              }
              alt=""
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/no-image.png'; // public 폴더에 no-image.png 추가 필요
              }}
            />
            {/* 이미지 개수 표시 */}
            {(post.medias ?? post.images ?? []).length > 1 && (
              <>
                <div className="absolute right-3 top-3 rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white">
                  {currentImageIndex + 1} / {(post.medias ?? post.images ?? []).length}
                </div>
                {/* 이미지 네비게이션 */}
                <div className="absolute inset-0 flex items-center justify-between px-2">
                  {currentImageIndex > 0 && (
                    <button
                      onClick={handlePrevImage}
                      className="rounded-full bg-white/80 p-1.5 text-gray-800 shadow-md hover:bg-white"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  )}
                  {currentImageIndex < (post.medias ?? post.images ?? []).length - 1 && (
                    <button
                      onClick={handleNextImage}
                      className="ml-auto rounded-full bg-white/80 p-1.5 text-gray-800 shadow-md hover:bg-white"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  )}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-gray-400">이미지 없음</span>
          </div>
        )}
      </div>

      {/* 액션 버튼 영역 */}
      <div className="px-4 py-3">
        <div className="mb-3 flex items-center gap-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 text-sm transition ${
              isLiked ? "text-red-600" : "text-gray-700 hover:text-gray-900"
            }`}
          >
            <Heart className="h-5 w-5" fill={isLiked ? "currentColor" : "none"} />
            <span className="font-medium">{likeCount}</span>
          </button>
          <button
            onClick={handleComment}
            className="flex items-center gap-1 text-sm text-gray-700 transition hover:text-gray-900"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="font-medium">{commentCount}</span>
          </button>
          <button
            onClick={handleShare}
            className="ml-auto text-gray-700 transition hover:text-gray-900"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>

        {/* 제목/내용 영역 */}
        <div className="text-sm">
          <p className="text-gray-900">
            <span className="font-semibold">{post.nickname ?? post.author ?? ""}</span>{" "}
            {isExpanded || !needsTruncate
              ? post.content
              : truncateText(post.content)}
            {needsTruncate && !isExpanded && "..."}
          </p>
          {needsTruncate && (
            <button
              onClick={toggleExpand}
              className="mt-1 text-xs text-gray-500 hover:text-gray-700"
            >
              {isExpanded ? "간략히" : "더보기"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
