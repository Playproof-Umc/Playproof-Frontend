// src/features/auth/pages/SignupGameInfoPageView.tsx

import { StepDots } from "@/components/auth/StepDots";
import { SignupGameInfoForm } from "@/features/auth/gameInfoPage/components";
import { AppLayout } from "@/components/layout/AppLayout";

export const SignupGameInfoPageView = () => {
  return (
    <AppLayout>
      <main className="mx-auto flex min-h-screen max-w-[980px] flex-col items-center px-6 pt-16">
        <div className="w-full max-w-[680px]">
          <StepDots step={3} />
          <SignupGameInfoForm />
        </div>
      </main>
    </AppLayout>
  );
};
