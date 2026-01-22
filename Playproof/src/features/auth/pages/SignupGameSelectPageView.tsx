import { SignupGameSelectForm } from "@/features/auth/gameSelectPage/components";
import { StepDots } from "@/components/auth/StepDots";

export const SignupGameSelectPageView = () => {
  return (
    <div className="min-h-screen bg-white text-black">
      <main className="mx-auto flex min-h-screen max-w-[980px] flex-col items-center px-6 pt-16">
        <div className="w-full max-w-[680px] pt-4">
          <StepDots step={2} />
          <SignupGameSelectForm />
        </div>
      </main>
    </div>
  );
};
