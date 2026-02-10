// src/features/team/components/azit/AzitSettingsModal.tsx

import React from "react";
import { Camera, Eye, EyeOff, X } from "lucide-react";

type AzitSettingsModalProps = {
  open: boolean;
  onClose: () => void;
  profileUrl?: string;
  onUpdateProfile?: (url: string) => void;
  initialName?: string;
  onUpdateName?: (name: string) => void;
  onSubmit?: () => void;
};

export const AzitSettingsModal: React.FC<AzitSettingsModalProps> = ({
  open,
  onClose,
  profileUrl: initialProfileUrl,
  onUpdateProfile,
  initialName,
  onUpdateName,
  onSubmit,
}) => {
  const [name, setName] = React.useState("");
  const [transferTo, setTransferTo] = React.useState("");
  const [kickMember, setKickMember] = React.useState("");
  const [showTransfer, setShowTransfer] = React.useState(false);
  const [showKick, setShowKick] = React.useState(false);
  const [deleteReason, setDeleteReason] = React.useState("");
  const [profileUrl, setProfileUrl] = React.useState<string>("");
  const fileRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!open) return;
    setName(initialName ?? "");
    setTransferTo("");
    setKickMember("");
    setShowTransfer(false);
    setShowKick(false);
    setDeleteReason("");
    setProfileUrl(initialProfileUrl ?? "");
  }, [open, initialProfileUrl, initialName]);

  React.useEffect(() => {
    return () => {
      if (profileUrl) URL.revokeObjectURL(profileUrl);
    };
  }, [profileUrl]);

  if (!open) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (profileUrl) URL.revokeObjectURL(profileUrl);
    const nextUrl = URL.createObjectURL(file);
    setProfileUrl(nextUrl);
    e.target.value = "";
  };

  const isDirty =
    profileUrl !== (initialProfileUrl ?? "") ||
    (name.trim() !== (initialName ?? "")) ||
    Boolean(transferTo.trim()) ||
    Boolean(kickMember.trim()) ||
    Boolean(deleteReason.trim());

  const handleSubmit = () => {
    if (!isDirty) return;
    if (profileUrl !== (initialProfileUrl ?? "")) {
      onUpdateProfile?.(profileUrl);
    }
    if (name.trim() !== (initialName ?? "")) {
      onUpdateName?.(name);
    }
    onSubmit?.();
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[120] bg-black/30" onClick={onClose} />
      <div className="fixed inset-0 z-[121] flex items-center justify-center px-4">
        <div className="w-full max-w-[520px] max-h-[90vh] overflow-y-auto bg-white rounded-[24px] shadow-2xl border border-gray-100 px-8 py-7 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-900 font-semibold">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-sm">
                ⚙︎
              </span>
              <span className="text-sm font-bold">아지트 설정</span>
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
                    {profileUrl ? (
                      <img src={profileUrl} alt="아지트 이미지" className="w-full h-full object-cover" />
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
                className="mt-3 text-xs font-semibold text-blue-600 hover:underline"
              >
                프로필 사진 변경
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
              <div className="text-xs font-semibold text-gray-700">배경 스킨 변경</div>
              <div className="mt-2 flex w-full items-center gap-2">
                {Array.from({ length: 7 }).map((_, idx) => (
                  <div
                    key={`skin-slot-${idx}`}
                    className="flex-1 min-w-0 aspect-square rounded-md border border-gray-200 bg-gray-50"
                  />
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="text-xs font-semibold text-gray-700">아지트 이름 변경</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="최대 20글자까지 입력 가능합니다."
                className="mt-2 w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                maxLength={20}
              />
            </div>

            <div className="mt-5">
              <label className="text-xs font-semibold text-gray-700">방장 권한 양도</label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                  placeholder="최대 20글자까지 입력 가능합니다."
                  type={showTransfer ? "text" : "password"}
                  className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
                <button
                  type="button"
                  onClick={() => setShowTransfer((prev) => !prev)}
                  className="h-11 w-11 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600"
                  aria-label={showTransfer ? "가리기" : "보기"}
                >
                  {showTransfer ? (
                    <EyeOff className="w-4 h-4 mx-auto" />
                  ) : (
                    <Eye className="w-4 h-4 mx-auto" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setTransferTo("")}
                  className="h-11 w-11 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600"
                  aria-label="입력 지우기"
                >
                  <X className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>

            <div className="mt-5">
              <label className="text-xs font-semibold text-gray-700">멤버 강퇴</label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  value={kickMember}
                  onChange={(e) => setKickMember(e.target.value)}
                  placeholder="최대 50글자까지 입력 가능합니다."
                  type={showKick ? "text" : "password"}
                  className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
                <button
                  type="button"
                  onClick={() => setShowKick((prev) => !prev)}
                  className="h-11 w-11 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600"
                  aria-label={showKick ? "가리기" : "보기"}
                >
                  {showKick ? (
                    <EyeOff className="w-4 h-4 mx-auto" />
                  ) : (
                    <Eye className="w-4 h-4 mx-auto" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setKickMember("")}
                  className="h-11 w-11 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600"
                  aria-label="입력 지우기"
                >
                  <X className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>

            <div className="mt-5">
              <label className="text-xs font-semibold text-gray-700">아지트 삭제</label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  placeholder="제한 없음"
                  className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
                <button className="h-11 w-11 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className={`mt-6 w-full h-12 rounded-xl font-semibold transition-colors ${
              isDirty
                ? "bg-[var(--color-primary-800)] text-white hover:bg-[var(--color-primary-700)]"
                : "bg-gray-300 text-white cursor-not-allowed"
            }`}
            disabled={!isDirty}
          >
            설정하기
          </button>
        </div>
      </div>
    </>
  );
};
