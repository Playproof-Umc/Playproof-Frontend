// src/features/auth/gameSelectPage/components/RiotAccountModal.tsx

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ModalShell } from "@/components/ui/ModalShell";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (accountId: string, gameName: string, tagLine: string) => void;
  isPending?: boolean;
};

export function RiotAccountModal({ isOpen, onClose, onVerified, isPending = false }: Props) {
  const [gameName, setGameName] = useState("");
  const [tagLine, setTagLine] = useState("");
  const [error, setError] = useState("");

  const handleVerify = () => {
    setError("");

    const trimmedName = gameName.trim();
    const trimmedTag = tagLine.trim();

    if (!trimmedName) {
      setError("게임 이름을 입력해주세요.");
      return;
    }

    if (!trimmedTag) {
      setError("태그를 입력해주세요.");
      return;
    }

    // 부모 컴포넌트에 검증 요청
    onVerified("", trimmedName, trimmedTag);
  };

  const handleClose = () => {
    if (isPending) return; // 로딩 중에는 닫기 방지
    setGameName("");
    setTagLine("");
    setError("");
    onClose();
  };

  return (
    <ModalShell open={isOpen} onOverlayClick={handleClose}>
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          Riot 계정 인증
        </h2>

        <p className="mb-6 text-sm text-gray-600">
          라이엇 게임 계정(게임명#태그)을 입력해주세요.
        </p>

        <div className="space-y-4">
          {/* 게임 이름 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              게임 이름
            </label>
            <Input
              type="text"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              placeholder="예: 비둘기깃털"
              disabled={isPending}
            />
          </div>

          {/* 태그 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              태그 (# 제외)
            </label>
            <Input
              type="text"
              value={tagLine}
              onChange={(e) => setTagLine(e.target.value)}
              placeholder="예: KR1"
              disabled={isPending}
            />
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="text-sm text-red-600">
              {error}
            </div>
          )}
        </div>

        {/* 버튼 그룹 */}
        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isPending}
            className="flex-1"
          >
            취소
          </Button>
          <Button
            variant="primary"
            onClick={handleVerify}
            disabled={isPending}
            className="flex-1"
          >
            {isPending ? "검증 중..." : "인증하기"}
          </Button>
        </div>

        {/* 안내 문구 */}
        <p className="mt-4 text-xs text-gray-500">
          * 입력하신 계정이 실제로 존재하는지 확인합니다.
        </p>
      </div>
    </ModalShell>
  );
}
