import SignupForm from "@/features/auth/signup/components/SignupForm";
import { StepDots } from "@/components/auth/StepDots";

export const SignupPageView = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="pt-20">
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
