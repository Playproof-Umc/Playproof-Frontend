// src/features/community/components/community-post/BoardEditModal.tsx

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { WriteModalUploadBox } from "@/features/community/components/WriteModalUploadBox";
import { GameFilter } from "@/features/matching/components";
import { GAME_LIST } from "@/features/matching/constants/matchingConfig";
import type { BoardPost } from "@/features/community/types";

type BoardEditModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: { title: string; content: string; images: File[]; game: string }) => void;
  post: BoardPost;
};

export function BoardEditModal({
  isOpen,
  onClose,
  onSubmit,
  post,
}: BoardEditModalProps) {
  if (!isOpen) return null;

  return (
    <BoardEditModalContent
      key={post.id}
      onClose={onClose}
      onSubmit={onSubmit}
      post={post}
    />
  );
}

function BoardEditModalContent({
  onClose,
  onSubmit,
  post,
}: Omit<BoardEditModalProps, "isOpen">) {
  const [title, setTitle] = useState(post.title || "");
  const [content, setContent] = useState(post.content || "");
  const [images, setImages] = useState<File[]>([]);
  const [selectedGame, setSelectedGame] = useState(post.game || GAME_LIST[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 기존 이미지 URL을 File 객체로 변환 (선택적)
  useEffect(() => {
    if (post.thumbnail) {
      // 기존 이미지가 있으면 표시는 하되, File 변환은 복잡하므로 생략
      // 실제로는 서버에서 기존 미디어 정보를 받아와야 함
    }
  }, [post]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    
    if (!title.trim() && !content.trim() && images.length === 0) {
      setError("제목, 내용 또는 이미지 중 하나는 입력해주세요.");
      return;
    }
    
    setLoading(true);
    try {
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        images,
        game: selectedGame,
      });
      onClose();
    } catch (err) {
      setError("수정에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-gray-600 hover:bg-white hover:text-gray-900"
          aria-label="닫기"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="text-lg font-bold text-gray-900">게시글 수정</h2>
          <p className="mt-1 text-xs text-gray-500">수정할 내용을 입력해주세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 max-h-[calc(90vh-96px)] overflow-y-auto">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">카테고리</label>
              <GameFilter
                games={GAME_LIST}
                activeGame={selectedGame}
                onGameSelect={setSelectedGame}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">제목</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력해주세요."
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-gray-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">이미지 업로드</label>
              <WriteModalUploadBox onFilesChange={setImages} initialFiles={images} />
              {post.thumbnail && images.length === 0 && (
                <p className="mt-2 text-xs text-gray-500">
                  * 새 이미지를 선택하지 않으면 기존 이미지가 유지됩니다.
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">내용</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                placeholder="내용을 입력해주세요."
                className="w-full resize-none rounded-lg border border-gray-200 p-3 text-sm text-gray-700 focus:border-gray-400 focus:outline-none"
              />
            </div>

            {error && (
              <div className="text-red-500 text-xs mt-2">{error}</div>
            )}
          </div>

          <div className="mt-6 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-lg text-xs font-bold hover:bg-gray-300 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[var(--color-primary-800)] text-white px-4 py-3 rounded-lg text-xs font-bold hover:bg-[var(--color-primary-700)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "수정 중..." : "수정 완료"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
