// src/components/ui/OnboardingIndicator.tsx

//src/components/ui/OnboardingIndicator.tsx
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
	total: number;
	initialActive?: number;
	/** 진한 바 길이 */
	activeWidth?: number;
	/** 자동 전환 간격(ms). 0이면 자동 전환 없음 */
	autoMs?: number;
};

export const OnboardingIndicator = ({
	total,
	initialActive = 0,
	activeWidth = 183,
	autoMs = 3500,
}: Props) => {
	const safeTotal = Math.max(1, total);
	const [active, setActive] = useState(
		Math.min(Math.max(0, initialActive), safeTotal - 1)
	);

	const trackRef = useRef<HTMLButtonElement | null>(null);
	const [trackPx, setTrackPx] = useState<number>(0);

	useEffect(() => {
		const el = trackRef.current;
		if (!el) return;

		const measure = () => setTrackPx(el.getBoundingClientRect().width);
		measure();

		const ro = new ResizeObserver(() => measure());
		ro.observe(el);

		return () => ro.disconnect();
	}, []);

	useEffect(() => {
		if (autoMs <= 0 || safeTotal <= 1) return;
		const id = window.setInterval(() => {
			setActive((prev) => (prev + 1) % safeTotal);
		}, autoMs);
		return () => window.clearInterval(id);
	}, [autoMs, safeTotal]);

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

		const usable = Math.max(0, rect.width - activeWidth);
		const startX = Math.min(Math.max(x - activeWidth / 2, 0), usable);
		const gap = usable / (safeTotal - 1);

		const next = Math.round(startX / gap);
		setActive(Math.min(Math.max(next, 0), safeTotal - 1));
	};

	return (
		<div className="flex items-center justify-center">
			<button
				ref={trackRef}
				type="button"
				aria-label="onboarding indicator"
				onClick={(e) => setActiveByClientX(e.clientX)}
				onKeyDown={(e) => {
					if (e.key === "ArrowLeft") setActive((v) => Math.max(0, v - 1));
					if (e.key === "ArrowRight")
						setActive((v) => Math.min(safeTotal - 1, v + 1));
					if (e.key === "Home") setActive(0);
					if (e.key === "End") setActive(safeTotal - 1);
				}}
				className="relative h-[4px] w-[549px] pr-[366px] focus:outline-none"
			>
				<span
					className="absolute inset-0 rounded-[4px] bg-[#E4E4E7]"
					aria-hidden
				/>
				<span
					className="absolute left-0 top-1/2 h-[4px] -translate-y-1/2 rounded-[4px] bg-[#1533B6] transition-transform duration-300"
					style={{
						width: activeWidth,
						transform: `translateX(${offset}px)`,
					}}
					aria-hidden
				/>
			</button>
			<div className="sr-only" aria-live="polite">
				{`slide ${active + 1} of ${safeTotal}`}
			</div>
		</div>
	);
};
