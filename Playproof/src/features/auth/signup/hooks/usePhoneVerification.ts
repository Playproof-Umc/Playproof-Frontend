import { useEffect, useMemo, useState } from "react";

const phoneValid = (v: string) => /^010\d{8}$/.test(v); // ✅ 정확히 11자리
const digitsOnly = (v: string) => v.replace(/\D/g, "");
const pad2 = (n: number) => String(n).padStart(2, "0");

export type VerifyState = "idle" | "success" | "fail";

export const usePhoneVerification = () => {
    const [phone, setPhone] = useState("");
    const [phoneTouched, setPhoneTouched] = useState(false);
    const [phoneLocked, setPhoneLocked] = useState(false); // ✅ "SMS 요청 후" 코드 입력 허용용 잠금

    // 임시 변수
    const [_smsSent, setSmsSent] = useState(false);
    const [smsCooldown, setSmsCooldown] = useState(0); // 30초
    const [code, setCode] = useState("");
    const [codeTouched, setCodeTouched] = useState(false);

    const [codeTimer, setCodeTimer] = useState(0); // 5분(300초)
    const [verifyState, setVerifyState] = useState<VerifyState>("idle");

    const [isVerifying, setIsVerifying] = useState(false);

    // ✅ 성공 잠금 (원래 너 코드의 locked 개념 유지)
    const locked = verifyState === "success";

    // cooldown ticker
    useEffect(() => {
        if (smsCooldown <= 0) return;
        const t = setInterval(() => setSmsCooldown((s) => Math.max(0, s - 1)), 1000);
        return () => clearInterval(t);
    }, [smsCooldown]);

    // code timer ticker
    useEffect(() => {
        if (codeTimer <= 0) return;
        const t = setInterval(() => setCodeTimer((s) => Math.max(0, s - 1)), 1000);
        return () => clearInterval(t);
    }, [codeTimer]);

    const phoneOk = useMemo(() => phoneValid(phone), [phone]);

    // ✅ 11자리(010xxxxxxxx) 기준으로 에러 판단
    const phoneError = useMemo(() => {
        if (!phoneTouched) return false;
        if (phone.length === 0) return false;
        return !phoneValid(phone);
    }, [phone, phoneTouched]);

    // ✅ 요청 가능 조건도 phoneOk(=11자리) 필수
    const canRequestSms = useMemo(() => {
        if (locked) return false;         // 성공 후에는 재요청 불가
        if (phoneLocked) return false;    // 요청 후에는 번호 잠금
        if (!phoneOk) return false;       // 11자리 아니면 불가
        if (smsCooldown > 0) return false;
        return true;
    }, [locked, phoneLocked, phoneOk, smsCooldown]);

    const codeOk = useMemo(() => /^\d{6}$/.test(code), [code]);

    // ✅ 코드 입력 가능: 요청 후 + 인증 성공 전 + 인증중 아닐 때
    //    -> "인증하기" 누르면 즉시 입력 잠김(isVerifying)
    const canTypeCode = useMemo(() => {
        if (!phoneLocked) return false;
        if (locked) return false;
        if (isVerifying) return false;
        return true;
    }, [phoneLocked, locked, isVerifying]);

    const canVerify = useMemo(() => {
        if (!canTypeCode) return false;
        if (locked) return false;
        if (isVerifying) return false;
        if (codeTimer <= 0) return false;
        return codeOk;
    }, [canTypeCode, locked, isVerifying, codeTimer, codeOk]);

    const codeTimeLabel = useMemo(() => {
        const m = Math.floor(codeTimer / 60);
        const s = codeTimer % 60;
        return `${m}:${pad2(s)}`;
    }, [codeTimer]);

    const requestSms = async () => {
        setPhoneTouched(true);
        if (!phoneOk) return; // ✅ 11자리 아니면 발송 X

        // Mock: 발송 성공
        setSmsSent(true);
        setSmsCooldown(30);

        // ✅ "요청 후" 코드 입력 가능 상태로 전환
        setPhoneLocked(true);

        setCode("");
        setCodeTouched(false);
        setVerifyState("idle");
        setCodeTimer(5 * 60);
    };

    const verifyCode = async () => {
        setCodeTouched(true);
        if (!canVerify) return;

        setIsVerifying(true);
        try {
        await new Promise((r) => setTimeout(r, 700));

        // Mock: 123456 성공
        if (code === "123456") setVerifyState("success");
        else setVerifyState("fail");
        } finally {
        setIsVerifying(false);
        }
    };

    const uiProps = {
        phone,
        // ✅ 전화번호 입력 잠김: 요청 후 잠금 or 성공 잠금
        phoneLocked: phoneLocked || locked,
        phoneError,
        onPhoneBlur: () => setPhoneTouched(true),
        onPhoneChange: (next: string) => {
        if (locked) return; // 성공 후 변경 불가
        const v = digitsOnly(next).slice(0, 11);
        setPhone(v);

        // ✅ 전화번호 바꾸면 인증 흐름 리셋(원래 기대 동작)
        setSmsSent(false);
        setSmsCooldown(0);
        setPhoneLocked(false);
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
        // ✅ 실패 후 재입력하면 메시지 정리
        if (verifyState === "fail") setVerifyState("idle");
        },

        canVerify,
        isVerifying, // UI에서 "확인중..." 표시용
        onVerifyCode: verifyCode,
    };

    return {
        phone,
        locked,
        verifyState,
        uiProps,
    };
};