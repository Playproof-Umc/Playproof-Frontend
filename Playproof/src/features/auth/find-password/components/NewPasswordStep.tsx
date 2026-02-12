// src/features/auth/find-password/components/NewPasswordStep.tsx

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PASSWORD_REGEX } from "@/features/auth/constants/regex";

interface NewPasswordStepProps {
  onNext: (password: string) => void;
  isPending?: boolean;
}

export const NewPasswordStep = ({ onNext, isPending = false }: NewPasswordStepProps) => {
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState(false);

  const passwordStrength = useMemo(() => {
    if (!password) return null;
    
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;
    
    if (!isLongEnough || !hasLetter || !hasNumber) {
      return { text: '사용불가', color: 'text-red-500' };
    }
    
    if (hasSpecial && password.length >= 10) {
      return { text: '안전', color: 'text-green-500' };
    }
    
    return { text: '보통', color: 'text-yellow-500' };
  }, [password]);

  const isValid = PASSWORD_REGEX.test(password);
  const showError = touched && password.length > 0 && !isValid;

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">새 비밀번호를 입력해 주세요</h2>
        <p className="text-gray-500 text-sm">영문, 숫자 포함 8글자 이상 입력해주세요.</p>
      </div>

      <div className="flex flex-col gap-2">
        <Input
          type="password"
          label="비밀번호"
          placeholder="새 비밀번호를 입력해주세요."
          variant="light"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => setTouched(true)}
        />
        
        {password && passwordStrength && (
          <div className="flex items-center gap-2 px-1">
            <span className="text-xs text-gray-500">안전도 :</span>
            <span className={`text-xs font-medium ${passwordStrength.color}`}>
              {passwordStrength.text}
            </span>
          </div>
        )}
        
        {showError && (
          <p className="text-xs text-red-500 px-1">
            영문, 숫자 포함 8글자 이상이어야 합니다.
          </p>
        )}
        
        <p className="text-[11px] text-gray-400 leading-tight px-1 mt-1">
          쉬운 비밀번호, 다른 사이트에서 사용한 비밀번호, 도용된 비밀번호는 피해 주세요.
        </p>
      </div>

      <Button
        fullWidth
        disabled={!isValid || isPending}
        onClick={() => onNext(password)}
      >
        {isPending ? '처리 중...' : '확인'}
      </Button>
    </div>
  );
};
