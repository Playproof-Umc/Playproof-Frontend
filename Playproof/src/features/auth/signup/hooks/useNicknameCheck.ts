// src/features/auth/signup/hooks/useNicknameCheck.ts

//src/features/auth/signup/hooks/useNicknameCheck.ts
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { NICKNAME_REGEX } from "@/features/auth/constants/regex";

export type NickCheckState = "idle" | "checking" | "ok" | "dup" | "invalid";

const DEBOUNCE_MS = 500;

const mockCheckNickname = async (nickname: string) => {
  await new Promise((r) => setTimeout(r, 700));
  // Mock: "레나"는 중복
  return nickname !== "레나";
};

export const useNicknameCheck = () => {
    const [nickname, setNickname] = useState("");
    const [touched, setTouched] = useState(false);
    const [checkState, setCheckState] = useState<NickCheckState>("idle");

    // 정규식은 분리
    const isValid = useMemo(() => NICKNAME_REGEX.test(nickname), [nickname]);

    // debounce + 레이스 방지
    const timerRef = useRef<number | null>(null);
    const requestSeqRef = useRef(0);

    const clearTimer = useCallback(() => {
        if (timerRef.current !== null) {
            window.clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const runCheck = useCallback(async (value: string) => {
        const seq = ++requestSeqRef.current;

        setCheckState("checking");
        try {
            const available = await mockCheckNickname(value);

            if (seq !== requestSeqRef.current) return;

            setCheckState(available ? "ok" : "dup");
        } catch {
            if (seq !== requestSeqRef.current) return;
            setCheckState("idle");
        }
    }, []);

    const scheduleDebouncedCheck = useCallback(
        (value: string) => {
            clearTimer();
            timerRef.current = window.setTimeout(() => {
                runCheck(value);
            }, DEBOUNCE_MS);
        },
        [clearTimer, runCheck]
    );

    const checkNickname = useCallback(async () => {
        setTouched(true);

        if (nickname.length === 0) {
            setCheckState("idle");
            return;
        }

        if (!NICKNAME_REGEX.test(nickname)) {
            // 진행 중 요청 무효화
            requestSeqRef.current++;
            setCheckState("invalid");
            return;
        }

        clearTimer();
        await runCheck(nickname);
    }, [nickname, clearTimer, runCheck]);

    useEffect(() => {
        return () => clearTimer();
    }, [clearTimer]);

    const uiProps = {
        nickname,
        nickTouched: touched,
        nickOk: isValid,
        nickCheckState: checkState,

        onNicknameBlur: () => {
            setTouched(true);

            // (선택) blur 시 유효하고 아직 결과가 없으면 즉시 체크
            if (nickname.length > 0 && NICKNAME_REGEX.test(nickname) && checkState === "idle") {
                clearTimer();
                runCheck(nickname);
            }
        },

        onNicknameChange: (v: string) => {
            setNickname(v);
            if (!touched) setTouched(true);

            clearTimer();

            if (v.length === 0) {
                // 입력 없으면 초기
                requestSeqRef.current++;
                setCheckState("idle");
                return;
            }

            if (!NICKNAME_REGEX.test(v)) {
                // 유효하지 않으면 invalid로
                requestSeqRef.current++;
                setCheckState("invalid");
                return;
            }

            // 유효하면 자동 디바운스 체크
            setCheckState("idle");
            scheduleDebouncedCheck(v);
        },

        onCheckNickname: checkNickname,
    };

    return {
        nickname,
        isValid,
        checkState,
        uiProps,
    };
};