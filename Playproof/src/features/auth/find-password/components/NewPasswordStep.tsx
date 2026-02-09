// src/features/auth/find-password/components/NewPasswordStep.tsx

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PASSWORD_REGEX } from "@/features/auth/constants/regex";

export const NewPasswordStep = ({ onNext }: { onNext: () => void }) => {
  const [password, setPassword] = useState("");
  const isError = password.length > 0 && !PASSWORD_REGEX.test(password);

  return (
    <div className="flex flex-col gap-8">
      <div>
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
          error={isError ? "영문, 숫자 포함 8글자 이상이어야 합니다." : ""}
        />
        <p className="text-[11px] text-gray-400 leading-tight">
          쉬운 비밀번호, 다른 사이트에서 사용한 비밀번호, 도용된 비밀번호는 피해 주세요.
        </p>
      </div>

      <Button
        fullWidth
        disabled={!password || isError}
        onClick={onNext}
      >
        확인
      </Button>
    </div>
  );
};