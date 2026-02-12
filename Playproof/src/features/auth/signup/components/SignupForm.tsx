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
import { useSignupStore } from "@/store/signupStore";

const SignupForm = () => {
	const navigate = useNavigate();
	const { setBasicInfo } = useSignupStore();

	const phone = usePhoneVerification();
	const pw = usePasswordRules();
	const nick = useNicknameCheck();
	const terms = useTermsAgreement();
	const [avatarIdx, setAvatarIdx] = useState<number | null>(null);

	const canSubmit = useMemo(
		() => {
			const conditions = {
				'전화번호 인증': phone.locked,
				'비밀번호 유효': pw.isValid,
				'비밀번호 확인': pw.isConfirmed,
				'닉네임 유효': nick.isValid,
				'닉네임 중복확인': nick.checkState === "ok",
				'약관 동의': terms.requiredOk,
				'아바타 선택': avatarIdx !== null,
			};

			const allValid = phone.locked &&
				pw.isValid &&
				pw.isConfirmed &&
				nick.isValid &&
				nick.checkState === "ok" &&
				terms.requiredOk &&
				avatarIdx !== null;

			if (!allValid) {
				console.log('🔍 [회원가입 조건 체크]', conditions);
				console.log('❌ 미충족 조건:', Object.entries(conditions).filter(([, isValid]) => !isValid).map(([key]) => key));
			}

			return allValid;
		},
		[phone.locked, pw.isValid, pw.isConfirmed, nick.isValid, nick.checkState, terms.requiredOk, avatarIdx]
	);

	const handleSubmit = () => {
		// Step 1: 기본 정보를 store에 저장
		const basicInfo = {
			phone: phone.phone,
			password: pw.password,
			nickname: nick.nickname,
			terms: [
				{ id: 1, agree: terms.uiProps.agreeService },
				{ id: 2, agree: terms.uiProps.agreePrivacy },
				{ id: 3, agree: terms.uiProps.agreeMarketing },
			],
		};
		
		console.log('📤 [Step 1 완료 - 기본 정보 저장]', basicInfo);
		
		setBasicInfo(basicInfo);
		
		// Step 2: 게임 선택 페이지로 이동
		navigate("/gameselect");
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
				disabled={!canSubmit}
				onSubmit={handleSubmit}
			/>
		</div>
	);
};

export default SignupForm;
