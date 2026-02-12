// src/features/auth/find-password/components/CompleteStep.tsx

import { Button } from "@/components/ui/Button";

interface CompleteStepProps {
  onNext: () => void;
}

export const CompleteStep = ({ onNext }: CompleteStepProps) => {
  return (
    <div className="flex flex-col items-center text-center gap-10 py-4">
      <div className="w-20 h-20 rounded-full border-[3px] border-[#1533B6] flex items-center justify-center">
        <svg className="w-10 h-10 text-[#1533B6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-2">비밀번호 변경이 완료됐습니다.</h2>
        <p className="text-gray-500 text-sm">새 비밀번호로 로그인해 주세요.</p>
      </div>

      <Button fullWidth onClick={onNext}>
        로그인
      </Button>
    </div>
  );
};