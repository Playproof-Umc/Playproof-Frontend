// src/features/auth/login/hooks/useLoginForm.ts

import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { login } from "@/services/authApi";
import { getMyProfile } from "@/services/userApi";
import { useAuthStore } from "@/store/authStore";
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

function formatPhoneNumberInput(digits: string): string {
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }
  if (digits.length <= 11) {
    const head = digits.slice(0, 3);
    const middle = digits.length === 10 ? digits.slice(3, 6) : digits.slice(3, 7);
    const tail = digits.slice(middle.length + 3);
    return `${head}-${middle}-${tail}`;
  }
  return digits;
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
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [showPw, setShowPw] = useState(false);

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

  // 로그인에서는 비밀번호 규칙 검증하지 않음 (길이만 체크)
  const pwOk = useMemo(() => password.length > 0, [password]);

  const canSubmit = useMemo(() => phoneOk && pwOk, [phoneOk, pwOk]);

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: async (res) => {
      console.log('✅ 로그인 성공:', res);
      
      // 1. 토큰 저장
      auth.setAuth({
        accessToken: res.data.accessToken,
    userId: res.data.userId,
    nickname: res.data.nickname,
      });

      try {
        // 2. /users/my-profile API로 사용자 정보 가져오기
        const userProfile = await getMyProfile();
        console.log('✅ 프로필 정보 로드:', userProfile);
        
        // 3. 사용자 정보 업데이트
        auth.setAuth({
          accessToken: res.data.accessToken,
          userId: userProfile.id,
          nickname: userProfile.nickname,
        });

        // 4. 리다이렉트
        const redirect = getRedirectPath(location.state);
        navigate(redirect, { replace: true });
      } catch (error) {
        console.error('❌ 사용자 정보 조회 실패:', error);
        // 토큰은 있지만 사용자 정보를 못 가져온 경우에도 일단 홈으로
        navigate('/home', { replace: true });
      }
    },
    onError: (err: AxiosError<ApiErrorResponse>) => {
      console.error('❌ 로그인 실패:', {
        status: err.response?.status,
        code: err.response?.data?.error?.code,
        message: err.response?.data?.error?.message,
        errors: err.response?.data?.error?.errors,
        fullResponse: err.response?.data,
      });

      // errors 배열을 하나씩 출력
      const errors = err.response?.data?.error?.errors ?? [];
      if (errors.length > 0) {
        console.error('🔍 상세 에러:', JSON.stringify(errors, null, 2));
        errors.forEach((e, idx) => {
          console.error(`  [${idx}] field: ${e.field}, reason: ${e.reason}`);
        });
      }

      const status = err.response?.status;
      const code = err.response?.data?.error?.code;

      // 등록되지 않은 번호
      if (status === 404 && code === "USER_NOT_FOUND") {
        setServerError("등록되지 않은 번호입니다.");
        return;
      }

      // 서버 validation: phoneNumber는 문구를 고정
      if (status === 400 && code === "VALIDATION_FAILED") {
        const next: FieldError = {};
        for (const e of errors) {
          if (e.field === "phoneNumber" || e.field === "phone") next.phoneNumber = PHONE_FORMAT_MSG;
          if (e.field === "password") next.password = e.reason ?? PW_MSG;
        }
        setFieldError(next);
        setServerError(null);
        return;
      }

      // 비밀번호 불일치 등 인증 실패
      if (status === 401) {
        setServerError("전화번호 또는 비밀번호가 일치하지 않습니다.");
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

    const requestBody = {
      phone: phoneNumber, // 하이픈 포함 전송
      password,
    };

    console.log('📞 로그인 요청 바디:', requestBody);
    mutation.mutate(requestBody);
  };

  const onChangePhoneNumber = (v: string) => {
    // 숫자만 유지
    const digitsOnly = normalizeDigitsOnly(v);
    setPhoneNumber(formatPhoneNumberInput(digitsOnly));
    setServerError(null);

    // 제출 이후에만 에러를 갱신/해제
    if (submittedOnce) setFieldError((prev) => ({ ...prev, phoneNumber: undefined }));
  };

  const onChangePassword = (v: string) => {
    setPassword(v);
    setServerError(null);
    if (submittedOnce) setFieldError((prev) => ({ ...prev, password: undefined }));
  };

  const onToggleKeepLoggedIn = () => setKeepLoggedIn((p) => !p);
  const onToggleShowPw = () => setShowPw((p) => !p);

  const onClickKakao = () => alert("카카오 로그인은 준비중입니다. (추후 API 연동 예정)");
  const onClickFindPassword = () => navigate("/find-password");

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