// src/features/community/components/HighlightWriteModal.tsx

import React, { useState } from "react";
import { X } from "lucide-react";
import { WriteModalUploadBox } from "@/features/community/components/WriteModalUploadBox";

type HighlightWriteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: { title?: string; content: string; images: File[] }) => void;
  initialImages?: File[];
};

export function HighlightWriteModal({
  isOpen,
  onClose,
  onSubmit,
  initialImages,
}: HighlightWriteModalProps) {
  if (!isOpen) return null;

  return (
    <HighlightWriteModalContent
      onClose={onClose}
      onSubmit={onSubmit}
      initialImages={initialImages}
    />
  );
}

function HighlightWriteModalContent({
  onClose,
  onSubmit,
  initialImages = [],
}: Omit<HighlightWriteModalProps, "isOpen">) {
  const [title] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>(initialImages);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!content.trim() && images.length === 0 && !title.trim()) return;
    onSubmit({ title: title.trim() || undefined, content: content.trim(), images });
    onClose();
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
          <h2 className="text-lg font-bold text-gray-900">하이라이트 글쓰기</h2>
          <p className="mt-1 text-xs text-gray-500">사진 업로드와 내용을 작성해주세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 max-h-[calc(90vh-96px)] overflow-y-auto">
          <div className="space-y-4">
            <div>
              <WriteModalUploadBox onFilesChange={setImages} initialFiles={initialImages} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">내용</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                placeholder="하이라이트 내용을 입력해주세요."
                className="w-full resize-none rounded-lg border border-gray-200 p-3 text-sm text-gray-700 focus:border-gray-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-black text-white px-4 py-3 rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors"
            >
              업로드
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
