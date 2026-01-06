import SignupForm from "./SignupForm";

/* sub components */

const Dot = ({ active, label }: { active?: boolean; label: string }) => (
	<div
		className={[
		"h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0",
		active ? "bg-black text-white" : "bg-[#D9D9D9] text-white",
		].join(" ")}
	>
		{label}
	</div>
);

const Bar = () => <div className="h-[2px] w-10 bg-[#D9D9D9]" />;

const StepDots = ({ step = 1 }: { step?: 1 | 2 | 3 }) => (
	<div className="mb-5 flex items-center justify-center">
		<Dot active={step === 1} label="1" />
		<Bar />
		<Dot active={step === 2} label="2" />
		<Bar />
		<Dot active={step === 3} label="3" />
	</div>
);

/* page */

const SignupPage = () => {
	return (
		<div className="min-h-screen bg-white">
			<div className="pt-10">
				<StepDots step={1} />
			</div>

			<main className="mx-auto w-full max-w-[1280px] px-8 pb-24 pt-8">
				<h1 className="mb-12 text-center text-2xl font-bold">회원가입</h1>

				<div className="flex justify-center">
					<div className="w-full max-w-[343px]">
						<SignupForm />
					</div>
				</div>
			</main>
		</div>
	);
};

export default SignupPage;