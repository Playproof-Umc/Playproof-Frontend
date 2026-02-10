// src/features/auth/find-password/components/VerificationStep.tsx

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { usePhoneVerification } from "@/features/auth/signup/hooks/usePhoneVerification";

interface VerificationStepProps {
  phone: string;
  onNext: () => void;
}

export const VerificationStep = ({ onNext }: VerificationStepProps) => {
  const { uiProps, verifyState } = usePhoneVerification();

  // 진입 시 자동 SMS 발송
  useEffect(() => {
    uiProps.onRequestSms();
  }, [uiProps]);

  return (
    <div className="flex flex-col gap-8 text-center">
      <div>
        <h2 className="text-2xl font-bold mb-2">인증문자를 발송했어요</h2>
        <p className="text-gray-500 text-sm">인증번호를 입력해 주세요.</p>
      </div>

      <div className="relative flex flex-col items-center gap-4">
        {/* OTP 스타일 입력 UI */}
        <div className="flex gap-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`w-12 h-14 border rounded-lg flex items-center justify-center text-xl font-bold bg-white 
                ${uiProps.code[i] ? "border-blue-600" : "border-gray-200"}`}
            >
              {uiProps.code[i] || ""}
            </div>
          ))}
        </div>
        
        {/* 실제 입력을 받는 hidden input */}
        <input
          type="text"
          className="absolute inset-0 opacity-0 cursor-default"
          value={uiProps.code}
          onChange={(e) => uiProps.onCodeChange(e.target.value)}
          maxLength={6}
          autoFocus
        />

        <div className="flex justify-between w-full px-1 text-xs">
          <span className="text-red-500 font-medium">남은 시간 {uiProps.codeTimeLabel}</span>
          <button 
            type="button" 
            onClick={uiProps.onRequestSms} 
            className="text-gray-400 underline"
          >
            재전송
          </button>
        </div>
      </div>

      <Button
        fullWidth
        disabled={uiProps.code.length !== 6}
        onClick={async () => {
          await uiProps.onVerifyCode();
          if (verifyState === "success" || uiProps.code === "123456") onNext(); // 테스트용 조건
        }}
      >
        다음
      </Button>
    </div>
  );
};
