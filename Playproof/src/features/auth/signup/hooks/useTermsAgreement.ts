// src/features/auth/signup/hooks/useTermsAgreement.ts

//src/features/auth/signup/hooks/useTermsAgreement.ts
import { useMemo, useState } from "react";

export const useTermsAgreement = () => {
    // 필수
    const [agreeService, setAgreeService] = useState(false);
    const [agreePrivacy, setAgreePrivacy] = useState(false);

    // 선택
    const [agreeMarketing, setAgreeMarketing] = useState(false);

    // derived state (계산값)
    const agreeAll = useMemo(
        () => agreeService && agreePrivacy && agreeMarketing,
        [agreeService, agreePrivacy, agreeMarketing]
    );

    const requiredOk = useMemo(
        () => agreeService && agreePrivacy,
        [agreeService, agreePrivacy]
    );

    // 전체동의 클릭 시에만 "한 번에" 상태 변경
    const toggleAll = (next: boolean) => {
        setAgreeService(next);
        setAgreePrivacy(next);
        setAgreeMarketing(next);
    };

    const uiProps = {
        agreeAll,
        agreeService,
        agreePrivacy,
        agreeMarketing,
        onToggleAll: toggleAll,
        onToggleService: (next: boolean) => setAgreeService(next),
        onTogglePrivacy: (next: boolean) => setAgreePrivacy(next),
        onToggleMarketing: (next: boolean) => setAgreeMarketing(next),
    };

    return {
        requiredOk,
        uiProps,
    };
};