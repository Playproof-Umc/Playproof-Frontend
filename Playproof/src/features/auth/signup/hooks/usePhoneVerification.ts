// src/features/auth/signup/hooks/usePhoneVerification.ts
import { useEffect, useMemo, useState } from "react";
import { sendPhoneCertification, validatePhone } from "@/services/authApi";

const phoneValid = (v: string) => /^010\d{8}$/.test(v);
const digitsOnly = (v: string) => v.replace(/\D/g, "");
const pad2 = (n: number) => String(n).padStart(2, "0");

export type VerifyState = "idle" | "success" | "fail";

export const usePhoneVerification = () => {
  const [phone, setPhone] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);
  
  // [수정] phoneLocked 상태 변수 제거 (불필요한 잠금 방지)

  const [smsCooldown, setSmsCooldown] = useState(0);
  const [code, setCode] = useState("");
  const [codeTouched, setCodeTouched] = useState(false);

  const [codeTimer, setCodeTimer] = useState(0);
  const [verifyState, setVerifyState] = useState<VerifyState>("idle");

  const [isVerifying, setIsVerifying] = useState(false);

  // 최종 인증 성공 시에만 잠금
  const locked = verifyState === "success";

  useEffect(() => {
    if (smsCooldown <= 0) return;
    const t = setInterval(() => setSmsCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [smsCooldown]);

  useEffect(() => {
    if (codeTimer <= 0) return;
    const t = setInterval(() => setCodeTimer((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [codeTimer]);

  const phoneOk = useMemo(() => phoneValid(phone), [phone]);

  const phoneError = useMemo(() => {
    if (!phoneTouched) return false;
    if (phone.length === 0) return false;
    return !phoneValid(phone);
  }, [phone, phoneTouched]);

  const canRequestSms = useMemo(() => {
    if (locked) return false;
    if (!phoneOk) return false;
    if (smsCooldown > 0) return false;
    return true;
  }, [locked, phoneOk, smsCooldown]);

  const codeOk = useMemo(() => /^\d{6}$/.test(code), [code]);

  const canTypeCode = useMemo(() => {
    if (locked) return false;
    if (isVerifying) return false;
    // [수정] 타이머가 돌고 있을 때만 입력 가능
    return codeTimer > 0;
  }, [locked, isVerifying, codeTimer]);

  const canVerify = useMemo(() => {
    if (!canTypeCode) return false;
    if (locked) return false;
    if (isVerifying) return false;
    return codeOk;
  }, [canTypeCode, locked, isVerifying, codeOk]);

  const codeTimeLabel = useMemo(() => {
    const m = Math.floor(codeTimer / 60);
    const s = codeTimer % 60;
    return `${m}:${pad2(s)}`;
  }, [codeTimer]);

  const requestSms = async () => {
    setPhoneTouched(true);
    if (!phoneOk) return;

    try {
      // 실제 SMS 발송
      await sendPhoneCertification({ phone });
      
      setSmsCooldown(30);
      setCode("");
      setCodeTouched(false);
      setVerifyState("idle");
      setCodeTimer(3 * 60); // 3분
      
      console.log('📱 SMS 인증번호가 발송되었습니다.');
    } catch (error: unknown) {
      console.error('❌ SMS 발송 실패:', error);
      
      // 409 Conflict: 이미 등록된 전화번호
      const axiosError = error as { response?: { status?: number } };
      if (axiosError?.response?.status === 409) {
        alert('이미 가입된 전화번호입니다. 다른 번호를 사용해주세요.');
      } else {
        alert('인증번호 발송에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  const verifyCode = async () => {
    setCodeTouched(true);
    if (!canVerify) return;

    setIsVerifying(true);
    try {
      // 실제 API 호출
      await validatePhone({ phone, code });
      setVerifyState("success");
      console.log('✅ 전화번호 인증 성공');
    } catch (error) {
      setVerifyState("fail");
      console.error('❌ 인증번호 검증 실패:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const uiProps = {
    phone,
    // [수정] 성공했을 때만 잠금 (입력 수정 시 초기화됨)
    phoneLocked: locked, 
    phoneError,
    onPhoneBlur: () => setPhoneTouched(true),
    onPhoneChange: (next: string) => {
      if (locked) return; // 이미 성공했으면 수정 불가
      const v = digitsOnly(next).slice(0, 11);
      setPhone(v);

      // 번호 변경 시 모든 상태 초기화 (재인증 필요)
      setSmsCooldown(0);
      setCode("");
      setCodeTouched(false);
      setVerifyState("idle");
      setCodeTimer(0);
      setIsVerifying(false);
    },

    canRequestSms,
    smsCooldown,
    onRequestSms: requestSms,

    code,
    canTypeCode,
    codeTouched,
    verifyState,
    codeTimeLabel,
    onCodeBlur: () => setCodeTouched(true),
    onCodeChange: (next: string) => {
      setCode(digitsOnly(next).slice(0, 6));
      if (verifyState === "fail") setVerifyState("idle");
    },

    canVerify,
    isVerifying,
    onVerifyCode: verifyCode,
  };

  return {
    phone,
    locked,
    verifyState,
    uiProps,
  };
};