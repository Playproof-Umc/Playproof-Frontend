import { Button } from "@/components/ui/Button";

type Props = {
    // Phone
    phone: string;
    phoneLocked: boolean;
    phoneError: boolean;
    onPhoneBlur: () => void;
    onPhoneChange: (next: string) => void;

    // SMS request
    canRequestSms: boolean;
    smsCooldown: number;
    onRequestSms: () => void;

    // Code
    code: string;
    canTypeCode: boolean;
    codeTouched: boolean;
    verifyState: "idle" | "success" | "fail";
    codeTimeLabel: string; // ex) 4:59
    onCodeBlur: () => void;
    onCodeChange: (next: string) => void;

    // Verify
    canVerify: boolean;
    onVerifyCode: () => void;
};

export const PhoneVerificationSection = ({
	phone,
	phoneLocked,
	phoneError,
	onPhoneBlur,
	onPhoneChange,

	canRequestSms,
	onRequestSms,

	code,
	canTypeCode,
	codeTouched,
	verifyState,
	codeTimeLabel,
	onCodeBlur,
	onCodeChange,

	canVerify,
	onVerifyCode,
}: Props) => {
	const showOutline = canRequestSms;
	const showVerifyOutline = canVerify;
	
	return (
		<section>
			<div className="mb-3 ml-2 text-lg font-semibold">전화번호*</div>

			{/* 전화번호 + 인증번호 입력 버튼 */}
			<div className="mt-6 grid grid-cols-[1fr_100px] gap-1.5">
				<div className="relative">
					<input
						value={phone}
						disabled={phoneLocked}
						onBlur={onPhoneBlur}
						onChange={(e) => onPhoneChange(e.target.value)}
						placeholder="-없이 전화번호를 입력해주세요."
						className={[
						"w-full h-[48px] rounded-lg border px-4 text-xs outline-none",
						phoneError ? "border-red-500" : "border-[#E5E5E5]",
						phoneLocked ? "bg-[#F2F2F2] text-[#777]" : "bg-white",
						].join(" ")}
					/>
					{phoneError && (
						<div className="mt-1 text-xs text-red-500">
							올바르지 않은 전화번호 형식입니다.
						</div>
					)}
				</div>

				<Button
					type="button"
					variant={showOutline ? "outline" : "secondary"}
					disabled={!canRequestSms}
					onClick={onRequestSms}
					className="h-[48px] rounded-lg text-xs whitespace-nowrap"
				>
				인증번호 전송
				</Button>
			</div>

			{/* 인증번호 입력 + 인증하기 */}
				<div className="mt-3 grid grid-cols-[1fr_100px] gap-1.5">
					<div>
						<input
							value={code}
							disabled={!canTypeCode}
							onBlur={onCodeBlur}
							onChange={(e) => onCodeChange(e.target.value)}
							placeholder="인증번호를 입력해주세요."
							className={[
							"w-full h-[48px] rounded-lg border px-4 text-xs outline-none",
							verifyState === "fail" ? "border-red-500" : "border-[#E5E5E5]",
							!canTypeCode ? "bg-[#F2F2F2] text-[#777]" : "bg-white",
							].join(" ")}
						/>

						{/* 타이머/상태 메시지 */}
						<div className="flex mt-2 ml-3 text-xs">
							{canTypeCode && verifyState !== "success" && (
							<div className="text-[#3B59FF] mr-2">{codeTimeLabel}</div>
							)}

							{verifyState === "success" && (
							<div className="text-[#3B59FF]">
								인증이 완료되었습니다.
							</div>
							)}

							{verifyState === "fail" && codeTouched && (
							<div className="text-red-500">
								인증번호가 일치하지 않습니다.
							</div>
							)}
						</div>
					</div>

					<Button
						type="button"
						variant={showVerifyOutline ? "outline" : "secondary"}
						disabled={!canVerify}
						onClick={onVerifyCode}
						className="h-[48px] rounded-lg font-semibold text-xs"
					>
					인증하기
					</Button>
			</div>
		</section>
	);
};