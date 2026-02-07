// src/features/auth/login/hooks/useLoginForm.ts

import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { login } from "@/services/loginApi";
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
    onSuccess: (res) => {
      auth.setAuth({
        accessToken: res.data.accessToken,
        userId: res.data.userId,
        nickname: res.data.nickname,
      });

      const redirect = getRedirectPath(location.state);
      navigate(redirect, { replace: true });
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
      phoneNumber: normalizedPhone,
      password,
      keepLoggedIn,
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
