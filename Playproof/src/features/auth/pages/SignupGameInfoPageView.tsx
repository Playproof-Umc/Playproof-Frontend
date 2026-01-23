import { StepDots } from "@/components/auth/StepDots";
import { SignupGameInfoForm } from "@/features/auth/gameInfoPage/components";

export const SignupGameInfoPageView = () => {
  return (
    <div className="min-h-screen bg-white text-black">
      <main className="mx-auto flex min-h-screen max-w-[980px] flex-col items-center px-6 pt-16">
        <div className="w-full max-w-[680px]">
          <StepDots step={3} />
          <SignupGameInfoForm />
        </div>
      </main>
    </div>
  );
};
