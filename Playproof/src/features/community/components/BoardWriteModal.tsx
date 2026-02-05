import React, { useState } from "react";
import { X } from "lucide-react";
import { WriteModalUploadBox } from "@/features/community/components/WriteModalUploadBox";

type BoardWriteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: { title: string; content: string; images: File[] }) => void;
};

export function BoardWriteModal({ isOpen, onClose, onSubmit }: BoardWriteModalProps) {
  if (!isOpen) return null;

  return <BoardWriteModalContent onClose={onClose} onSubmit={onSubmit} />;
}

function BoardWriteModalContent({
  onClose,
  onSubmit,
}: Omit<BoardWriteModalProps, "isOpen">) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim() && !content.trim() && images.length === 0) return;
    onSubmit({ title: title.trim(), content: content.trim(), images });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-gray-600 hover:bg-white hover:text-gray-900"
          aria-label="닫기"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="text-lg font-bold text-gray-900">자유게시판 글쓰기</h2>
          <p className="mt-1 text-xs text-gray-500">제목과 내용을 작성해주세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5">
          <div className="space-y-4">
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
              <WriteModalUploadBox onFilesChange={setImages} />
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
