import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { login } from "@/services/authApi";
import { getMyProfile } from "@/services/userApi";
import { useAuthStore } from "@/store/authStore";
import { usePasswordRules } from "@/features/auth/signup/hooks/usePasswordRules";
import { PHONE_REGEX } from "@/features/auth/constants/regex";

type FieldError = {
  phoneNumber?: string;
  password?: string;
};

type RedirectState = {
  from?: { pathname?: string };
};

type ApiErrorResponse = {
  error?: {
    code?: string;
    message?: string;
    errors?: Array<{ field?: string; reason?: string }>;
  };
};

const PHONE_FORMAT_MSG = "올바르지 않은 전화번호 형식입니다.";
const PW_MSG = "비밀번호를 다시 입력해주세요.";
const GENERIC_ERROR_MSG = "일시적인 오류입니다. 다시 시도해 주세요.";

function normalizeDigitsOnly(v: string) {
  return v.replace(/\D/g, "");
}

function formatPhoneNumber(phone: string): string {
  // 숫자만 추출
  const digits = phone.replace(/\D/g, "");
  
  // 010-1234-5678 형식으로 변환
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }
  
  // 형식이 맞지 않으면 그대로 반환
  return phone;
}

function getRedirectPath(locationState: unknown): string {
  const state = locationState as RedirectState | null;
  const fromPath = state?.from?.pathname;
  return typeof fromPath === "string" && fromPath.length > 0 ? fromPath : "/home";
}

export function useLoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuthStore();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [showPw, setShowPw] = useState(false);

  // ✅ 비밀번호는 기존 규칙 훅 재사용
  const pw = usePasswordRules();
  const password = pw.uiProps.password;

  // 에러는 "시작하기" 클릭 이후에만 노출
  const [submittedOnce, setSubmittedOnce] = useState(false);
  const [fieldError, setFieldError] = useState<FieldError>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const normalizedPhone = useMemo(
    () => normalizeDigitsOnly(phoneNumber),
    [phoneNumber]
  );

  // ✅ 전화번호는 regex.ts 단일 진실 소스
  const phoneOk = useMemo(
    () => PHONE_REGEX.test(normalizedPhone),
    [normalizedPhone]
  );

  const pwOk = useMemo(() => pw.isValid, [pw.isValid]);

  const canSubmit = useMemo(() => phoneOk && pwOk, [phoneOk, pwOk]);

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: async (res) => {
      // 1. 토큰 저장
      auth.setAuth({
        accessToken: res.accessToken,
        userId: 0, // 임시값 (곧 /users/me에서 가져올 것)
        nickname: '', // 임시값
      });

      try {
        // 2. /users/me API로 사용자 정보 가져오기
        const userProfile = await getMyProfile();
        
        // 3. 사용자 정보 업데이트
        auth.setAuth({
          accessToken: res.accessToken,
          userId: userProfile.id,
          nickname: userProfile.nickname,
        });

        // 4. 리다이렉트
        const redirect = getRedirectPath(location.state);
        navigate(redirect, { replace: true });
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
        // 토큰은 있지만 사용자 정보를 못 가져온 경우에도 일단 홈으로
        navigate('/home', { replace: true });
      }
    },
    onError: (err: AxiosError<ApiErrorResponse>) => {
      const status = err.response?.status;
      const code = err.response?.data?.error?.code;
      const errors = err.response?.data?.error?.errors ?? [];

      // 등록되지 않은 번호
      if (status === 404 && code === "USER_NOT_FOUND") {
        setServerError(" 등록되지 않은 번호입니다.");
        return;
      }

      // 서버 validation: phoneNumber는 문구를 고정
      if (status === 400 && code === "VALIDATION_FAILED") {
        const next: FieldError = {};
        for (const e of errors) {
          if (e.field === "phoneNumber") next.phoneNumber = PHONE_FORMAT_MSG;
          if (e.field === "password") next.password = e.reason ?? PW_MSG;
        }
        setFieldError(next);
        setServerError(null);
        return;
      }

      // 네트워크/기타 오류는 고정 문구
      setServerError(GENERIC_ERROR_MSG);
    },
  });

  const validateOnSubmit = () => {
    const next: FieldError = {};
    if (!phoneOk) next.phoneNumber = PHONE_FORMAT_MSG;
    if (!pwOk) next.password = PW_MSG;

    setFieldError(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedOnce(true);
    setServerError(null);

    const ok = validateOnSubmit();
    if (!ok) return;

    mutation.mutate({
      phone: formatPhoneNumber(normalizedPhone), // 010-1234-5678 형식
      password,
    });
  };

  const onChangePhoneNumber = (v: string) => {
    // 숫자만 유지
    setPhoneNumber(normalizeDigitsOnly(v));
    setServerError(null);

    // 제출 이후에만 에러를 갱신/해제
    if (submittedOnce) setFieldError((prev) => ({ ...prev, phoneNumber: undefined }));
  };

  const onChangePassword = (v: string) => {
    pw.uiProps.onPasswordChange(v);
    setServerError(null);
    if (submittedOnce) setFieldError((prev) => ({ ...prev, password: undefined }));
  };

  const onToggleKeepLoggedIn = () => setKeepLoggedIn((p) => !p);
  const onToggleShowPw = () => setShowPw((p) => !p);

  const onClickKakao = () => alert("카카오 로그인은 준비중입니다. (추후 API 연동 예정)");
  const onClickFindPassword = () => alert("비밀번호 찾기는 준비중입니다.");

  return {
    phoneNumber,
    password,
    keepLoggedIn,
    showPw,

    fieldError: submittedOnce ? fieldError : {}, // 제출 전엔 숨김
    serverError,

    canSubmit,
    isPending: mutation.isPending,

    onChangePhoneNumber,
    onChangePassword,
    onToggleKeepLoggedIn,
    onToggleShowPw,

    onSubmit,
    onClickKakao,
    onClickFindPassword,
  };
}