//src/features/auth/signup/hooks/usePhoneVerification.ts
import { useEffect, useMemo, useState } from "react";

const phoneValid = (v: string) => /^010\d{8}$/.test(v);
const digitsOnly = (v: string) => v.replace(/\D/g, "");
const pad2 = (n: number) => String(n).padStart(2, "0");

export type VerifyState = "idle" | "success" | "fail";

export const usePhoneVerification = () => {
    const [phone, setPhone] = useState("");
    const [phoneTouched, setPhoneTouched] = useState(false);
    const [phoneLocked, setPhoneLocked] = useState(false);

    // [수정] _smsSent 상태 제거 (set만 있고 사용되지 않음)
    const [smsCooldown, setSmsCooldown] = useState(0); 
    const [code, setCode] = useState("");
    const [codeTouched, setCodeTouched] = useState(false);

    const [codeTimer, setCodeTimer] = useState(0); 
    const [verifyState, setVerifyState] = useState<VerifyState>("idle");

    const [isVerifying, setIsVerifying] = useState(false);

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
        if (phoneLocked) return false;
        if (!phoneOk) return false;
        if (smsCooldown > 0) return false;
        return true;
    }, [locked, phoneLocked, phoneOk, smsCooldown]);

    const codeOk = useMemo(() => /^\d{6}$/.test(code), [code]);

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
        if (!phoneOk) return;

        setSmsCooldown(30);
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

        if (code === "123456") setVerifyState("success");
        else setVerifyState("fail");
        } finally {
        setIsVerifying(false);
        }
    };

    const uiProps = {
        phone,
        phoneLocked: phoneLocked || locked,
        phoneError,
        onPhoneBlur: () => setPhoneTouched(true),
        onPhoneChange: (next: string) => {
        if (locked) return; 
        const v = digitsOnly(next).slice(0, 11);
        setPhone(v);

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