// src/features/auth/signup/components/TermsSection.tsx

//src/features/auth/signup/components/TermsSection.tsx
import { Check, ChevronDown } from "lucide-react";

type Props = {
	agreeAll: boolean;
	agreeService: boolean;
	agreePrivacy: boolean;
	agreeMarketing: boolean;

	onToggleAll: (next: boolean) => void;
	onToggleService: (next: boolean) => void;
	onTogglePrivacy: (next: boolean) => void;
	onToggleMarketing: (next: boolean) => void;
};

const TermsRow = ({
	checked,
	label,
	onToggle,
}: {
	checked: boolean;
	label: string;
	onToggle: (next: boolean) => void;
}) => {
	return (
		<div className="flex items-center justify-between py-2">
			{/* 실제 체크 상태는 input이 들고, UI는 아이콘으로만 */}
			<label className="flex items-center gap-3 cursor-pointer select-none">
				<input
					type="checkbox"
					checked={checked}
					onChange={(e) => onToggle(e.target.checked)}
					className="sr-only"
				/>

				{/* 체크표시만 (미체크면 흐리게/안보이게) */}
				<span
					aria-hidden="true"
					className={[
						"inline-flex h-4 w-4 items-center justify-center",
						checked ? "opacity-100" : "opacity-20",
					].join(" ")}
					>
					<Check className="h-5 w-5" />
				</span>

				<span className="text-base">{label}</span>
			</label>

			{/* 오른쪽 꺾쇠 -> 아래 방향 */}
			<button
				type="button"
				className="p-1 text-black/80 hover:text-black"
				aria-label={`${label} 펼치기`}
			>
				<ChevronDown className="h-5 w-5" />
			</button>
		</div>
	);
};

export const TermsSection = ({
	agreeAll,
	agreeService,
	agreePrivacy,
	agreeMarketing,
	onToggleAll,
	onToggleService,
	onTogglePrivacy,
	onToggleMarketing,
}: Props) => {
	return (
		<section>
		{/* 타이틀 크게 */}
		<div className="mb-6 text-left text-xl font-bold">이용약관</div>

			{/* 구분선 제거 + 여백만 */}
			<div>
				<TermsRow checked={agreeService} label="이용약관(필수)" onToggle={onToggleService} />
				<TermsRow
					checked={agreePrivacy}
					label="개인정보 수집 및 이용동의(필수)"
					onToggle={onTogglePrivacy}
				/>
				<TermsRow
					checked={agreeMarketing}
					label="마케팅 정보 수신 동의(선택)"
					onToggle={onToggleMarketing}
				/>

				{/* 약관 전체 동의하기 */}
				<div className="flex items-center justify-end pt-5">
					<label className="flex items-center gap-2 cursor-pointer select-none text-gray-400">
						<input
							type="checkbox"
							checked={agreeAll}
							onChange={(e) => onToggleAll(e.target.checked)}
							className="h-5 w-5 rounded-md border border-gray-300 accent-black"
						/>
						<span className={[
							"flex items-center gap-2 cursor-pointer select-none",
							agreeAll ? "text-black" : "text-gray-400",
						].join(" ")}
						>
						약관 전체 동의하기</span>
					</label>
				</div>
			</div>
		</section>
	);
};