// src/features/auth/find-password/components/PhoneStep.tsx

import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { verifyName } from "@/services/authApi";

interface PhoneStepProps {
  onNext: (phone: string, name: string) => void;
}

export const PhoneStep = ({ onNext }: PhoneStepProps) => {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const [showNameField, setShowNameField] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 11);
    setPhone(value);
    setError("");
    
    // 전화번호가 11자리가 되면 이름 입력 필드 표시
    if (value.length === 11) {
      setShowNameField(true);
    } else {
      setShowNameField(false);
      setName("");
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setError("");
  };

  const handleSubmit = async () => {
    if (isPending) return;

    setIsPending(true);
    setError("");
    
    try {
      // 백엔드로 전화번호 + 이름 확인
      const isValid = await verifyName({ phone, name });
      
      if (isValid) {
        onNext(phone, name);
      } else {
        setError("등록되지 않은 계정입니다.");
      }
    } catch (error) {
      console.error('❌ 계정 확인 실패:', error);
      setError("등록되지 않은 계정입니다.");
    } finally {
      setIsPending(false);
    }
  };

  const isPhoneValid = phone.length === 11;
  const isNameValid = name.trim().length > 0;
  const isFormValid = isPhoneValid && showNameField && isNameValid;

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">비밀번호 찾기</h2>
        <p className="text-gray-500 text-sm">이름을 입력해 주세요.</p>
      </div>

      <div className="flex flex-col gap-4">
        <Input
          label="전화번호"
          placeholder="01012345678"
          variant="light"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={11}
          autoComplete="tel"
          value={phone}
          onChange={handlePhoneChange}
        />

        {showNameField && (
          <Input
            label="이름"
            placeholder="김플푸"
            variant="light"
            autoComplete="name"
            value={name}
            onChange={handleNameChange}
            error={error}
          />
        )}
      </div>

      <Button
        fullWidth
        disabled={!isFormValid || isPending}
        onClick={handleSubmit}
      >
        {isPending ? "확인 중..." : "다음"}
      </Button>
    </div>
  );
};
