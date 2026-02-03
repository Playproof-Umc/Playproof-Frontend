// src/features/auth/signup/components/PhoneVerificationSection.tsx
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn"; // cn 유틸리티 사용

type Props = {
  // Phone
  phone: string;
  phoneLocked: boolean;
  phoneError: boolean;
  onPhoneBlur: () => void;
  onPhoneChange: (next: string) => void;

  // SMS request
  canRequestSms: boolean;
  smsCooldown: number;
  onRequestSms: () => void;

  // Code
  code: string;
  canTypeCode: boolean;
  codeTouched: boolean;
  verifyState: "idle" | "success" | "fail";
  codeTimeLabel: string;
  onCodeBlur: () => void;
  onCodeChange: (next: string) => void;

  // Verify
  canVerify: boolean;
  onVerifyCode: () => void;
};

export const PhoneVerificationSection = ({
  phone,
  phoneLocked,
  phoneError,
  onPhoneBlur,
  onPhoneChange,

  canRequestSms,
  smsCooldown,
  onRequestSms,

  code,
  canTypeCode,
  codeTouched,
  verifyState,
  codeTimeLabel,
  onCodeBlur,
  onCodeChange,

  canVerify,
  onVerifyCode,
}: Props) => {
  const isVerified = verifyState === "success";
  const isFail = verifyState === "fail";

  return (
    <section>
      <div className="mb-3 ml-2 text-lg font-semibold text-zinc-900">
        전화번호<span className="text-red-500">*</span>
      </div>

      {/* 1. 전화번호 입력 + 전송 버튼 */}
      <div className="mt-6 grid grid-cols-[1fr_100px] gap-2">
        <div className="relative">
          <input
            value={phone}
            disabled={phoneLocked}
            onBlur={onPhoneBlur}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="-없이 전화번호를 입력해주세요."
            className={cn(
              "h-[48px] w-full rounded-lg border px-4 text-sm outline-none transition-colors",
              phoneError ? "border-red-500 bg-white" : "border-zinc-200",
              // [디자인] 인증 완료 시 초록색 스타일
              isVerified && "border-green-500 bg-green-50 text-green-700 font-medium",
              // [디자인] 잠금 상태(성공)일 때 스타일
              phoneLocked && !isVerified && "bg-zinc-100 text-zinc-500"
            )}
          />
          {phoneError && (
            <div className="mt-1.5 ml-1 text-xs text-red-500 animate-in fade-in">
              올바르지 않은 전화번호 형식입니다.
            </div>
          )}
        </div>

        <Button
          type="button"
          // [디자인] 인증 완료 시 Outline 스타일 + 초록색 텍스트
          variant={isVerified ? "outline" : canRequestSms ? "primary" : "secondary"}
          disabled={!canRequestSms && !isVerified}
          onClick={onRequestSms}
          className={cn(
            "h-[48px] rounded-lg text-xs font-medium whitespace-nowrap transition-all",
            isVerified && "border-green-500 text-green-600 bg-white opacity-100 hover:bg-white cursor-default"
          )}
        >
          {isVerified ? "인증완료" : smsCooldown > 0 ? `${smsCooldown}초` : "인증번호 전송"}
        </Button>
      </div>

      {/* 2. 인증번호 입력 + 확인 버튼 (인증 전송 후 노출) */}
      {(canTypeCode || isVerified || isFail) && (
        <div className="mt-2 grid grid-cols-[1fr_100px] gap-2 animate-in fade-in slide-in-from-top-2">
          <div>
            <input
              value={code}
              disabled={!canTypeCode}
              onBlur={onCodeBlur}
              onChange={(e) => onCodeChange(e.target.value)}
              placeholder="인증번호 6자리"
              maxLength={6}
              className={cn(
                "h-[48px] w-full rounded-lg border px-4 text-sm outline-none transition-colors",
                isFail ? "border-red-500" : "border-zinc-200",
                !canTypeCode && !isVerified && "bg-zinc-100 text-zinc-400",
                // [디자인] 성공 시 초록색 테두리
                isVerified && "border-green-500 bg-white text-green-700"
              )}
            />

            {/* 상태 메시지 및 타이머 */}
            <div className="mt-2 ml-1 flex items-center text-xs font-medium min-h-[1.25rem]">
              {!isVerified && canTypeCode && (
                <span className="text-blue-600 mr-2">{codeTimeLabel}</span>
              )}

              {isVerified && (
                <span className="text-green-600 flex items-center gap-1">
                  🎉 인증이 완료되었습니다.
                </span>
              )}

              {isFail && codeTouched && (
                <span className="text-red-500">
                  인증번호가 일치하지 않습니다.
                </span>
              )}
            </div>
          </div>

          {!isVerified && (
            <Button
              type="button"
              variant={canVerify ? "primary" : "secondary"}
              disabled={!canVerify}
              onClick={onVerifyCode}
              className="h-[48px] rounded-lg text-xs font-semibold"
            >
              인증하기
            </Button>
          )}
        </div>
      )}
    </section>
  );
};
