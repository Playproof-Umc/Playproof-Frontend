// src/features/auth/find-password/components/NameStep.tsx

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface NameStepProps {
  phone: string;
  onNext: (name: string) => Promise<void>;
  isPending?: boolean;
}

export const NameStep = ({ phone, onNext, isPending = false }: NameStepProps) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("이름을 입력해주세요.");
      return;
    }
    
    setError("");
    
    try {
      await onNext(name);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "등록되지 않은 계정입니다.";
      setError(errorMessage);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">비밀번호 찾기</h2>
        <p className="text-gray-500 text-sm">이름을 입력해 주세요.</p>
      </div>

      <div className="flex flex-col gap-4">
        <Input
          label="전화번호"
          variant="light"
          value={phone}
          disabled
          readOnly
        />

        <Input
          label="이름"
          placeholder="이름을 입력해 주세요."
          variant="light"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
          error={error}
          autoFocus
        />
      </div>

      <Button
        fullWidth
        disabled={!name.trim() || isPending}
        onClick={handleSubmit}
      >
        {isPending ? '확인 중...' : '다음'}
      </Button>
    </div>
  );
};

