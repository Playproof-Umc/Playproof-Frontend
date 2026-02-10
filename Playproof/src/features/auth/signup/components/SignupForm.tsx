// src/features/auth/signup/components/SignupForm.tsx

//src/pages/auth/SignupForm.tsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PhoneVerificationSection } from "@/features/auth/signup/components/PhoneVerificationSection";
import { PasswordSection } from "@/features/auth/signup/components/PasswordSection";
import { ProfileSection } from "@/features/auth/signup/components/ProfileSection";
import { TermsSection } from "@/features/auth/signup/components/TermsSection";
import { SignupCTA } from "@/features/auth/signup/components/SignupCTA";

import { usePhoneVerification } from "@/features/auth/signup/hooks/usePhoneVerification";
import { usePasswordRules } from "@/features/auth/signup/hooks/usePasswordRules";
import { useNicknameCheck } from "@/features/auth/signup/hooks/useNicknameCheck";
import { useTermsAgreement } from "@/features/auth/signup/hooks/useTermsAgreement";
import { useSignup } from "@/features/auth/signup/hooks/useSignup";

const SignupForm = () => {
	const navigate = useNavigate();
	const signup = useSignup();

	const phone = usePhoneVerification();
	const pw = usePasswordRules();
	const nick = useNicknameCheck();
	const terms = useTermsAgreement();
	const [avatarIdx, setAvatarIdx] = useState<number | null>(null);

	const canSubmit = useMemo(
		() =>
		phone.locked &&
		pw.isValid &&
		pw.isConfirmed &&
		nick.isValid &&
		nick.checkState === "ok" &&
		terms.requiredOk &&
		avatarIdx !== null,
		[phone.locked, pw.isValid, pw.isConfirmed, nick.isValid, nick.checkState, terms.requiredOk, avatarIdx]
	);

	const handleSubmit = () => {
		// 필요한 값은 훅에서 가져와서 payload 구성
		signup.mutate(
			{
				phone: phone.phone,
				password: pw.password,
				nickname: nick.nickname,
			},
			{
				onSuccess: () => navigate("/gameselect"),
				onError: () => {
					alert("일시적인 오류가 발생했습니다. 다시 시도해주세요.");
				},
			}
		);
	};

	return (
		<div className="space-y-10">
			<PhoneVerificationSection {...phone.uiProps} />

			<PasswordSection {...pw.uiProps} />

			<ProfileSection
				nicknameProps={nick.uiProps}
				avatarIdx={avatarIdx}
				onSelectAvatar={setAvatarIdx}
			/>

			<TermsSection {...terms.uiProps} />

			<SignupCTA
				disabled={!canSubmit || signup.isPending}
				onSubmit={handleSubmit}
			/>
		</div>
	);
};

export default SignupForm;
