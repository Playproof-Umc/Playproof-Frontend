import { useEffect, useMemo, useState } from "react";

const phoneValid = (v: string) => /^010\d{8}$/.test(v);
const digitsOnly = (v: string) => v.replace(/\D/g, "");

const pad2 = (n: number) => String(n).padStart(2, "0");

export type VerifyState = "idle" | "success" | "fail";

export const usePhoneVerification = () => {
    const [phone, setPhone] = useState("");
    const [phoneTouched, setPhoneTouched] = useState(false);

    const [smsSent, setSmsSent] = useState(false);
    const [smsCooldown, setSmsCooldown] = useState(0); // 30초
    const [code, setCode] = useState("");
    const [codeTouched, setCodeTouched] = useState(false);

    const [codeTimer, setCodeTimer] = useState(0); // 5분(300초)
    const [verifyState, setVerifyState] = useState<VerifyState>("idle");

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

    const phoneOk = phoneValid(phone);
    const phoneError = phoneTouched && phone.length > 0 && !phoneOk;

    const canRequestSms = phoneOk && !locked && smsCooldown === 0;

    const canTypeCode = smsSent && !locked && codeTimer > 0;
    const codeOk = /^\d{6}$/.test(code);
    const canVerify = canTypeCode && codeOk;

    const codeTimeLabel = useMemo(() => {
        const m = Math.floor(codeTimer / 60);
        const s = codeTimer % 60;
        return `${m}:${pad2(s)}`;
    }, [codeTimer]);

    const requestSms = async () => {
        // Mock: 발송 성공
        setSmsSent(true);
        setSmsCooldown(30);
        setCode("");
        setCodeTouched(false);
        setVerifyState("idle");
        setCodeTimer(5 * 60);
    };

    const verifyCode = async () => {
        setCodeTouched(true);

        // Mock: 123456 성공
        if (code === "123456") setVerifyState("success");
        else setVerifyState("fail");
    };

    const uiProps = {
        phone,
        phoneLocked: locked,
        phoneError,
        onPhoneBlur: () => setPhoneTouched(true),
        onPhoneChange: (next: string) => setPhone(digitsOnly(next).slice(0, 11)),

        canRequestSms,
        smsCooldown,
        onRequestSms: requestSms,

        code,
        canTypeCode,
        codeTouched,
        verifyState,
        codeTimeLabel,
        onCodeBlur: () => setCodeTouched(true),
        onCodeChange: (next: string) => setCode(digitsOnly(next).slice(0, 6)),

        canVerify,
        onVerifyCode: verifyCode,
    };

    return {
        // 조립용에서 쓰기 좋은 값들
        phone,
        locked,
        verifyState,
        // UI 컴포넌트에 spread
        uiProps,
    };
};