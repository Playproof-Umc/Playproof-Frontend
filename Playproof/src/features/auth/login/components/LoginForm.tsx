// src/features/auth/login/components/LoginForm.tsx

import { useState } from "react";
import { Link } from "react-router-dom";
import { X, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useLoginForm } from "@/features/auth/login/hooks/useLoginForm";

import kakaoIcon from "@/assets/icons/kakao.png";

export function LoginForm() {
  const {
    phoneNumber,
    password,
    keepLoggedIn,
    showPw,

    fieldError,
    serverError,

    isPending,

    onChangePhoneNumber,
    onChangePassword,
    onToggleKeepLoggedIn,
    onToggleShowPw,

    onSubmit,
    onClickKakao,
    onClickFindPassword,
  } = useLoginForm();

  const [capsLockOn, setCapsLockOn] = useState(false);

  const handleCapsLock = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLockOn(e.getModifierState("CapsLock"));
  };

  // ✅ 입력 여부 기준 (유효성 X)
  const isFilled = phoneNumber.trim().length > 0 && password.trim().length > 0;

  return (
    <form className="space-y-3" onSubmit={onSubmit}>
      {/* 전화번호 */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700 ml-2">전화번호</p>
        <Input
          variant="light"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={11}
          autoComplete="tel"
          placeholder="전화번호를 입력해주세요."
          value={phoneNumber}
          onChange={(e) => onChangePhoneNumber(e.target.value)}
          error={fieldError.phoneNumber}
          required
          rightSlot={
            phoneNumber ? (
              <button
                type="button"
                onClick={() => onChangePhoneNumber("")}
                className="text-gray-400 hover:text-gray-600"
                aria-label="전화번호 지우기"
              >
                <X size={18} />
              </button>
            ) : null
          }
        />
      </div>

      {/* 비밀번호 */}
      <div className="space-y-2 mt-8">
        <p className="text-sm font-medium text-gray-700 ml-2">비밀번호</p>
        <Input
          variant="light"
          type={showPw ? "text" : "password"}
          autoComplete="current-password"
          placeholder="비밀번호를 입력해주세요."
          value={password}
          onChange={(e) => onChangePassword(e.target.value)}
          error={fieldError.password}
          required
          onKeyDown={handleCapsLock}
          onKeyUp={handleCapsLock}
          onFocus={() => setCapsLockOn(false)}
          onBlur={() => setCapsLockOn(false)}
          rightSlot={
            <button
              type="button"
              onClick={onToggleShowPw}
              className="text-gray-400 hover:text-gray-600"
              aria-label="비밀번호 보기 토글"
            >
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />

        {capsLockOn && (
          <p className="mt-1 text-xs text-red-500">
            Caps Lock이 켜져 있습니다.
          </p>
        )}
      </div>

      {/* 자동 로그인 */}
      <label className="flex items-center gap-2 pt-10 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={keepLoggedIn}
          onChange={onToggleKeepLoggedIn}
          className="h-4 w-4"
        />
        자동 로그인
      </label>

      {/* 시작하기 */}
      <Button
        type="submit"
        variant="primary"
        fullWidth
        disabled={!isFilled || isPending}
        className="h-11"
      >
        {isPending ? "로그인 중..." : "시작하기"}
      </Button>

      {/* 서버 오류 */}
      {serverError ? (
        <p className="text-xs text-red-500">{serverError}</p>
      ) : null}

      {/* 하단 링크 */}
      <div className="flex items-center justify-center gap-3 pt-1 text-xs text-gray-600 mb-8">
        <Button
          type="button"
          variant="outline"
          onClick={onClickFindPassword}
          className="border-0 bg-transparent px-0 py-0 text-gray-600 hover:bg-transparent hover:text-black"
        >
          비밀번호 찾기
        </Button>

        <span className="text-gray-300">|</span>

        <Link to="/signup" className="hover:text-black">
          회원가입
        </Link>
      </div>

      {/* 구분선 */}
      <div className="pt-3">
        <div className="h-px w-full bg-gray-200 mb-10" />
      </div>

      {/* 카카오 로그인 */}
      <Button
        type="button"
        variant="kakao"
        fullWidth
        onClick={onClickKakao}
        className="h-11 font-semibold"
        leftIcon={<img src={kakaoIcon} alt="kakao" className="h-5 w-5" />}
      >
        카카오 로그인
      </Button>
    </form>
  );
}
