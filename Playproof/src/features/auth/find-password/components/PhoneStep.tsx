// src/features/auth/find-password/components/PhoneStep.tsx

import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface PhoneStepProps {
  onNext: (data: { name: string; phone: string }) => void;
}

export const PhoneStep = ({ onNext }: PhoneStepProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 11);
    setPhone(value);
  };

  const isFormValid = name.length > 0 && phone.length === 11;

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">비밀번호 찾기</h2>
        <p className="text-gray-500 text-sm">전화번호를 입력해 주세요.</p>
      </div>

      <div className="flex flex-col gap-4">
        <Input
          label="전화번호"
          placeholder="전화번호를 -없이 입력해주세요."
          variant="light"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={11}
          autoComplete="tel"
          value={phone}
          onChange={handlePhoneChange}
        />
        {phone.length === 11 ? (
          <Input
            label="이름"
            placeholder="이름을 입력해주세요."
            variant="light"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : null}
      </div>

      <Button
        fullWidth
        disabled={!isFormValid}
        onClick={() => onNext({ name, phone })}
      >
        다음
      </Button>
    </div>
  );
};
