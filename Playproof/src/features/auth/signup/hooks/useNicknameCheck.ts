import { useMemo, useState } from "react";

const nicknameRule = (v: string) => /^[A-Za-z0-9가-힣]{1,5}$/.test(v);

export type NickCheckState = "idle" | "checking" | "ok" | "dup" | "invalid";

export const useNicknameCheck = () => {
    const [nickname, setNickname] = useState("");
    const [touched, setTouched] = useState(false);
    const [checkState, setCheckState] = useState<NickCheckState>("idle");

    const isValid = useMemo(() => nicknameRule(nickname), [nickname]);

    const checkNickname = async () => {
        setTouched(true);

        if (!isValid) {
            setCheckState("invalid");
            return;
        }

        setCheckState("checking");
        await new Promise((r) => setTimeout(r, 700));

        // Mock: "레나"는 중복
        if (nickname === "레나") setCheckState("dup");
        else setCheckState("ok");
    };

    const uiProps = {
        nickname,
        nickTouched: touched,
        nickOk: isValid,
        nickCheckState: checkState,
        onNicknameBlur: () => setTouched(true),
        onNicknameChange: (v: string) => {
            setNickname(v);
            setCheckState("idle"); // 입력이 바뀌면 다시 확인 필요
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