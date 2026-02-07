// src/components/auth/SignupCompleteModal.tsx

import * as React from "react";
import { cn } from "@/utils/cn";

type Props = {
  open: boolean;
  username?: string;
  onClose: () => void;
};

const AUTO_CLOSE_MS = 5000;

export function SignupCompleteModal({ open, username, onClose }: Props) {
  // ✅ 자동 닫힘 (확인 버튼 없이 토스트처럼 사라지게)
  React.useEffect(() => {
    if (!open) return;

    const id = window.setTimeout(() => {
      onClose();
    }, AUTO_CLOSE_MS);

    return () => window.clearTimeout(id);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* 배경 블러/암막 없음: 투명 오버레이로 클릭만 받음 */}
      <button
        type="button"
        aria-label="모달 닫기"
        className="absolute inset-0 bg-transparent"
        onClick={onClose}
      />

      {/* 모달 본체 */}
      <div className="absolute left-1/2 top-[18%] w-[min(520px,92vw)] -translate-x-1/2">
        <div
          role="dialog"
          aria-modal="true"
          className={cn(
            "rounded-xl border border-gray-200 bg-white px-8 py-7 shadow-lg",
            "text-center"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-lg font-bold text-gray-900">
            {username ? `${username}님, 환영합니다!` : "환영합니다!"}
          </p>
          <p className="mt-2 text-sm text-gray-600">회원가입이 완료되었습니다.</p>
        </div>
      </div>
    </div>
  );
}
