// src/features/team/components/azit/AzitCreateModal.tsx

import React from "react";
import { Camera, X } from "lucide-react";

export type AzitCreateData = {
  name: string;
  iconUrl?: string;
};

type AzitCreateModalProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (data: AzitCreateData) => void;
};

export const AzitCreateModal: React.FC<AzitCreateModalProps> = ({
  open,
  onClose,
  onCreate,
}) => {
  const [name, setName] = React.useState("");
  const [previewUrl, setPreviewUrl] = React.useState<string>("");
  const fileRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!open) return;
    setName("");
    setPreviewUrl("");
  }, [open]);

  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!open) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreate({
      name: name.trim(),
      iconUrl: previewUrl || undefined,
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-[120] bg-black/30" onClick={onClose} />
      <div className="fixed inset-0 z-[121] flex items-center justify-center px-4">
        <div className="w-full max-w-[420px] bg-white rounded-[24px] shadow-2xl border border-gray-100 p-8 relative">
          <button
            onClick={onClose}
            className="absolute right-5 top-5 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-extrabold text-center text-gray-900">아지트 생성</h2>

          <div className="mt-8 flex flex-col items-center gap-6">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-[120px] h-[120px] rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-gray-400 transition-colors overflow-hidden"
            >
              {previewUrl ? (
                <img src={previewUrl} alt="아지트 이미지" className="w-full h-full object-cover" />
              ) : (
                <Camera className="w-7 h-7" />
              )}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="w-full">
              <label className="text-[15px] font-bold text-gray-900">아지트 이름</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="아지트 이름을 입력하세요"
                className="mt-2 w-full h-12 rounded-xl bg-gray-100 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                maxLength={20}
              />
            </div>

            <div className="w-full flex gap-4 pt-2">
              <button
                onClick={onClose}
                className="flex-1 h-12 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
              >
                취소하기
              </button>
              <button
                onClick={handleCreate}
                disabled={!name.trim()}
                className={`flex-1 h-12 rounded-xl font-semibold transition-colors ${
                  name.trim()
                    ? "bg-gray-900 text-white hover:bg-black"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                만들기
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
