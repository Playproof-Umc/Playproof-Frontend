// src/features/auth/signup/components/PasswordSection.tsx

//src/features/auth/signup/components/PasswordSection.tsx
type Props = {
  password: string;
  confirm: string;

  // derived state from hook
  isValid: boolean;
  isConfirmed: boolean;

  // handlers from hook
  onPasswordChange: (v: string) => void;
  onConfirmChange: (v: string) => void;
  onPasswordBlur: () => void;
  onConfirmBlur: () => void;

  // (지금 UX는 즉시검증이라 필수는 아니지만, 훅이 주는 값이면 받자)
  pwTouched: boolean;
  confirmTouched: boolean;
};

export const PasswordSection = ({
  password,
  confirm,
  isValid,
  isConfirmed,
  onPasswordChange,
  onConfirmChange,
  onPasswordBlur,
  onConfirmBlur,
}: Props) => {
  const showPwError = password.length > 0 && !isValid;
  const showPwSuccess = password.length > 0 && isValid;

  // 확인 성공은 "규칙 통과 + 일치"일 때만
  const confirmMatch = confirm.length > 0 && password === confirm;
  const showConfirmError = confirm.length > 0 && !confirmMatch;
  const showConfirmSuccess = confirm.length > 0 && confirmMatch && isValid && isConfirmed;

  return (
    <section>
      <div className="mb-3 ml-2 font-semibold text-base">비밀번호*</div>

      <div className="space-y-3">
        <div>
          <input
            type="password"
            value={password}
            onBlur={onPasswordBlur}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="영문&숫자 포함 8글자 이상"
            className={[
              "mt-3 w-full h-[48px] rounded-lg border px-4 text-xs outline-none bg-white",
              showPwError ? "border-red-500" : "border-[#E5E5E5]",
            ].join(" ")}
          />

          {showPwError && (
            <div className="mt-1 text-xs text-red-500">
              영문&숫자 포함 8글자 이상 입력해주세요.
            </div>
          )}

          {showPwSuccess && (
            <div className="mt-1 text-xs text-[#3B59FF]">
              사용 가능한 비밀번호입니다.
            </div>
          )}
        </div>

        <div>
          <input
            type="password"
            value={confirm}
            onBlur={onConfirmBlur}
            onChange={(e) => onConfirmChange(e.target.value)}
            placeholder="비밀번호를 다시 입력해주세요."
            className={[
              "w-full h-[48px] rounded-lg border px-4 text-sm outline-none bg-white mb-3",
              showConfirmError ? "border-red-500" : "border-[#E5E5E5]",
            ].join(" ")}
          />

          {showConfirmError && (
            <div className="mt-1 text-xs text-red-500">
              비밀번호를 다시 확인해주세요.
            </div>
          )}

          {showConfirmSuccess && (
            <div className="mt-1 text-xs text-[#3B59FF]">
              비밀번호가 저장되었습니다.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};