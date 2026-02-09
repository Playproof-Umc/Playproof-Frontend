// src/features/auth/signup/hooks/usePasswordRules.ts

//src/features/auth/signup/hooks/usePasswordRules.ts
import { useCallback, useMemo, useState } from "react";

import { PASSWORD_REGEX } from "@/features/auth/constants/regex";

export const usePasswordRules = () => {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const [pwTouched, setPwTouched] = useState(false);
    const [confirmTouched, setConfirmTouched] = useState(false);

    const isValid = useMemo(() => PASSWORD_REGEX.test(password), [password]);
    const isConfirmed = useMemo(
        () => confirm.length > 0 && password === confirm,
        [password, confirm]
    );

    const onPasswordChange = useCallback((v: string) => {
        setPassword(v);
    }, []);

    const onConfirmChange = useCallback((v: string) => {
        setConfirm(v);
    }, []);

    const onPasswordBlur = useCallback(() => setPwTouched(true), []);
    const onConfirmBlur = useCallback(() => setConfirmTouched(true), []);

    return {
        password,
        confirm,
        isValid,
        isConfirmed,
        pwTouched,
        confirmTouched,

        uiProps: {
            password,
            confirm,
            pwTouched,
            confirmTouched,
            isValid,
            isConfirmed,
            onPasswordChange,
            onConfirmChange,
            onPasswordBlur,
            onConfirmBlur,
        },
    };
};