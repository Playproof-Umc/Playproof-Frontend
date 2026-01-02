import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
	total: number;
	initialActive?: number;
	/** 진한 바 길이 수정 */
	activeWidth?: number;
};

export const OnboardingIndicator = ({
	total,
	initialActive = 0,
	activeWidth = 150,
}: Props) => {
	const safeTotal = Math.max(1, total);
	const [active, setActive] = useState(
		Math.min(Math.max(0, initialActive), safeTotal - 1)
	);

	const trackRef = useRef<HTMLButtonElement | null>(null);
	const [trackPx, setTrackPx] = useState<number>(0);

	// 실제 트랙 너비를 측정해서 상태로 보관
	useEffect(() => {
		const el = trackRef.current;
		if (!el) return;

		const measure = () => setTrackPx(el.getBoundingClientRect().width);
		measure();

		const ro = new ResizeObserver(() => measure());
		ro.observe(el);

		return () => ro.disconnect();
	}, []);

	const stepGap = useMemo(() => {
		if (safeTotal <= 1) return 0;
		const usable = Math.max(0, trackPx - activeWidth);
		return usable / (safeTotal - 1);
	}, [safeTotal, trackPx, activeWidth]);

	const offset = active * stepGap;

	const setActiveByClientX = (clientX: number) => {
		const el = trackRef.current;
		if (!el) return;

		const rect = el.getBoundingClientRect();
		const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);

		if (safeTotal === 1) {
		setActive(0);
		return;
		}

		// 진한 바의 시작점을 기준으로 단계 선택 (트랙 내부로 clamp)
		const usable = Math.max(0, rect.width - activeWidth);
		const startX = Math.min(Math.max(x - activeWidth / 2, 0), usable);
		const gap = usable / (safeTotal - 1);

		const next = Math.round(startX / gap);
		setActive(Math.min(Math.max(next, 0), safeTotal - 1));
	};

	return (
		<div className="flex items-center justify-center">
		{/* 트랙은 실제 UI 너비를 원하는 값으로 조절 */}
			<button
				ref={trackRef}
				type="button"
				aria-label="onboarding indicator"
				onClick={(e) => setActiveByClientX(e.clientX)}
				onKeyDown={(e) => {
					if (e.key === "ArrowLeft") setActive((v) => Math.max(0, v - 1));
					if (e.key === "ArrowRight") setActive((v) => Math.min(safeTotal - 1, v + 1));
					if (e.key === "Home") setActive(0);
					if (e.key === "End") setActive(safeTotal - 1);
				}}
				/* 긴 연한 바 길이 수정 */
				className="relative h-[18px] w-[440px] focus:outline-none"
			>
				{/* 긴 연한 바 */}
				<span
					className="absolute left-0 top-1/2 h-[3px] w-full -translate-y-1/2 rounded-full bg-[#E4E4E7]"
					aria-hidden
				/>
				{/* 짧은 진한 바 */}
				<span
					className="absolute left-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-[#7a7a7a] transition-transform duration-300"
					style={{
						width: activeWidth,
						transform: `translateX(${offset}px)`,
					}}
					aria-hidden
				/>
			</button>
		</div>
	);
};