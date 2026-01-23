import React from "react";
import { X } from "lucide-react";
import type { HighlightPost, Comment } from "@/features/community/types";
import { COMMUNITY_SECTION_LABELS } from "@/features/community/constants/labels";

interface HighlightDetailModalProps {
  post: HighlightPost;
  comments: Comment[];
  isOpen: boolean;
  onClose: () => void;
}

export function HighlightDetailModal({ post, comments, isOpen, onClose }: HighlightDetailModalProps) {
  const [newComment, setNewComment] = React.useState("");
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit comment:", newComment);
    setNewComment("");
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === post.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? post.images.length - 1 : prev - 1
    );
  };

  // 배경 클릭 시 닫기
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    >
      <div className="relative flex h-[90vh] w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-gray-600 hover:bg-white hover:text-gray-900"
        >
          <X className="h-6 w-6" />
        </button>

        {/* 왼쪽: 미디어 영역 */}
        <div className="relative flex w-3/5 items-center justify-center bg-zinc-900">
          {post.images.length > 0 ? (
            <>
              <img
                src={post.images[currentImageIndex]}
                alt={post.content}
                className="h-full w-full object-contain"
              />
              
              {/* 이미지 네비게이션 */}
              {post.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 rounded-full bg-white/80 p-2 hover:bg-white"
                  >
                    ←
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 rounded-full bg-white/80 p-2 hover:bg-white"
                  >
                    →
                  </button>
                  <div className="absolute bottom-4 right-4 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
                    {currentImageIndex + 1} / {post.images.length}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-4xl text-gray-400">이미지 없음</span>
            </div>
          )}
        </div>

        {/* 오른쪽: 댓글 영역 */}
        <div className="flex w-2/5 flex-col">
          {/* 작성자 정보 */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-300" />
              <div>
                <p className="font-semibold text-gray-900">{post.author}</p>
                <p className="text-xs text-gray-500">{post.date}</p>
              </div>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex items-center gap-4 border-b border-gray-200 px-4 py-3">
            <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {post.likes}
            </button>
            <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {post.comments}
            </button>
          </div>

          {/* 게시글 내용 */}
          <div className="border-b border-gray-200 p-4">
            <p className="text-sm text-gray-800">{post.content}</p>
          </div>

          {/* 댓글 목록 */}
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              {COMMUNITY_SECTION_LABELS.comments} {comments.length}
            </h3>
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gray-300" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {comment.author}
                      </span>
                      <span className="text-xs text-gray-500">{comment.date}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-700">{comment.content}</p>
                    {comment.replies > 0 && (
                      <button className="mt-2 text-xs font-medium text-gray-500 hover:text-gray-700">
                        답글보기 ({comment.replies})
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 댓글 작성 */}
          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={COMMUNITY_SECTION_LABELS.commentPlaceholder}
                className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="rounded-full bg-black px-6 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:bg-gray-300"
              >
                {COMMUNITY_SECTION_LABELS.commentSubmit}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
