// src/features/auth/gameSelectPage/components/OverwatchAccountModal.tsx

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ModalShell } from "@/components/ui/ModalShell";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (accountId: string, battleTag: string) => void;
  isPending?: boolean;
};

export function OverwatchAccountModal({ isOpen, onClose, onVerified, isPending = false }: Props) {
  const [battleTag, setBattleTag] = useState("");
  const [error, setError] = useState("");

  const handleVerify = () => {
    setError("");

    const trimmed = battleTag.trim();

    if (!trimmed) {
      setError("BattleTag를 입력해주세요.");
      return;
    }

    // BattleTag 형식 검증 (Name#1234 또는 Name-1234)
    if (!trimmed.match(/^[a-zA-Z0-9가-힣]{2,12}[#-]\d{4,5}$/)) {
      setError("올바른 BattleTag 형식이 아닙니다. (예: PlayerName#1234)");
      return;
    }

    // 부모 컴포넌트에 검증 요청
    onVerified("", trimmed);
  };

  const handleClose = () => {
    if (isPending) return;
    setBattleTag("");
    setError("");
    onClose();
  };

  return (
    <ModalShell open={isOpen} onOverlayClick={handleClose}>
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          Battle.net 계정 인증
        </h2>

        <p className="mb-6 text-sm text-gray-600">
          오버워치 BattleTag를 입력해주세요.
        </p>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              BattleTag
            </label>
            <Input
              type="text"
              value={battleTag}
              onChange={(e) => setBattleTag(e.target.value)}
              placeholder="예: PlayerName#1234"
              disabled={isPending}
            />
            <p className="mt-1 text-xs text-gray-500">
              # 또는 - 기호를 포함해서 입력하세요
            </p>
          </div>

          {error && (
            <div className="text-sm text-red-600">
              {error}
            </div>
          )}
        </div>

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

        <p className="mt-4 text-xs text-gray-500">
          * 입력하신 BattleTag가 실제로 존재하는지 확인합니다.
        </p>
      </div>
    </ModalShell>
  );
}
