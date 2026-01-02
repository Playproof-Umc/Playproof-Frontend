import { useMemo, useState } from "react";

const passwordValid = (v: string) => /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(v);

export const usePasswordRules = () => {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const isValid = useMemo(() => passwordValid(password), [password]);
    const isConfirmed = useMemo(
        () => confirm.length > 0 && password === confirm,
        [password, confirm]
    );

    const uiProps = {
        pw: password,
        pw2: confirm,
        pwOk: isValid,
        pw2Ok: isConfirmed,
        onPwChange: setPassword,
        onPw2Change: setConfirm,
    };

    return {
        password,
        confirm,
        isValid,
        isConfirmed,
        uiProps,
    };
};