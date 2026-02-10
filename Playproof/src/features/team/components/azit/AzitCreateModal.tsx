// src/features/team/components/azit/AzitCreateModal.tsx

import React from "react";
import { Camera, X } from "lucide-react";

export type AzitCreateData = {
  name: string;
  iconUrl?: string;
  coverUrl?: string;
  description?: string;
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
  const [description, setDescription] = React.useState("");
  const fileRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!open) return;
    setName("");
    setPreviewUrl("");
    setDescription("");
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
      description: description.trim() || undefined,
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-[120] bg-black/30" onClick={onClose} />
      <div className="fixed inset-0 z-[121] flex items-center justify-center px-4">
        <div className="w-full max-w-[520px] bg-white rounded-[24px] shadow-2xl border border-gray-100 px-8 py-7 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-900 font-semibold">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-sm">+</span>
              <span className="text-sm font-bold">아지트 생성</span>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

            <div className="mt-6 rounded-2xl border border-gray-200 bg-white px-6 py-8">
            <div className="flex flex-col items-center">
              <div className="relative w-full h-[140px]">
                <div className="absolute top-0 left-0 right-0 h-[96px] rounded-lg border border-gray-200 bg-gray-50" />
                <div className="absolute top-[52px] left-1/2 -translate-x-1/2">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="w-[88px] h-[88px] rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-300 overflow-hidden"
                  >
                    {previewUrl ? (
                      <img src={previewUrl} alt="아지트 이미지" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-7 h-7" />
                    )}
                  </button>
                  <span className="absolute -bottom-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-gray-400 shadow border border-gray-200 pointer-events-none">
                    <Camera className="w-3 h-3" />
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="mt-6 text-xs font-semibold text-blue-600 hover:underline"
              >
                프로필 사진 설정
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div className="mt-6">
              <div className="text-xs font-semibold text-gray-700">배경 사진 설정</div>
              <div className="mt-2 flex w-full items-center gap-2">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={`cover-slot-${idx}`}
                    className="flex-1 min-w-0 aspect-square rounded-md border border-gray-200 bg-gray-50"
                  />
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="text-xs font-semibold text-gray-700">아지트 이름</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="최대 20글자까지 입력 가능합니다."
                className="mt-2 w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                maxLength={20}
              />
            </div>

            <div className="mt-5">
              <label className="text-xs font-semibold text-gray-700">아지트 한줄소개</label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="최대 50글자까지 입력 가능합니다."
                className="mt-2 w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                maxLength={50}
              />
            </div>
          </div>

          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            className={`mt-6 w-full h-12 rounded-xl font-semibold transition-colors ${
              name.trim()
                ? "bg-[var(--color-primary-800)] text-white hover:bg-[var(--color-primary-700)]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            생성하기
          </button>
        </div>
      </div>
    </>
  );
};
