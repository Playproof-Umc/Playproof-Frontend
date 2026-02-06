import React, { useState } from "react";
import { X } from "lucide-react";
import { WriteModalUploadBox } from "@/features/community/components/WriteModalUploadBox";
import { createHighlight } from "@/services/api";

// 타입을 직접 정의하여 import 오류 방지
interface CreateHighlightMedia {
  media_url: string;
  order: number;
}

type HighlightWriteModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function HighlightWriteModal({ isOpen, onClose }: HighlightWriteModalProps) {
  if (!isOpen) return null;
  return <HighlightWriteModalContent onClose={onClose} />;
}

function HighlightWriteModalContent({ onClose }: { onClose: () => void }) {
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 실제 서비스에서는 S3 업로드 후 media_url을 받아야 함
  // 여기서는 File 객체의 name을 임시 URL로 사용 (실제 구현 시 S3 업로드 필요)
  const getMediaUrls = async (files: File[]): Promise<CreateHighlightMedia[]> => {
    // TODO: S3 업로드 로직 필요
    // 임시로 파일명을 media_url로 사용
    return files.map((file, idx) => ({
      media_url: file.name, // 실제는 S3 업로드 후 URL
      order: idx + 1,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!content.trim() && images.length === 0) return;
    setLoading(true);
    try {
      const medias = await getMediaUrls(images);
      await createHighlight({
        content: content.trim(),
        is_public: true,
        medias,
      });
      onClose();
    } catch (e: any) {
      setError("업로드에 실패했습니다. 다시 시도해주세요.");
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
          <h2 className="text-lg font-bold text-gray-900">하이라이트 글쓰기</h2>
          <p className="mt-1 text-xs text-gray-500">사진 업로드와 내용을 작성해주세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 max-h-[calc(90vh-96px)] overflow-y-auto">
          <div className="space-y-4">
            <div>
              <WriteModalUploadBox onFilesChange={setImages} />
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
            {error && <div className="text-red-500 text-xs mt-2">{error}</div>}
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-black text-white px-4 py-3 rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors"
              disabled={loading}
            >
              {loading ? "업로드 중..." : "업로드"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
