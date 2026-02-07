// src/features/auth/pages/LandingPageView.tsx

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { OnboardingPlaceholder } from "@/components/ui/OnboardingPlaceholder";
import { OnboardingIndicator } from "@/components/ui/OnboardingIndicator";
import { AppLayout } from "@/components/layout/AppLayout";

export const LandingPageView = () => {
  return (
    <AppLayout>
      <main className="mx-auto flex min-h-screen max-w-[1280px] flex-col items-center justify-center px-6">
        <div className="w-full max-w-[1232px]">
          <div className="relative">
            <OnboardingPlaceholder />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
              <OnboardingIndicator total={3} initialActive={0} />
            </div>
          </div>
        </div>

        <div className="mt-16 flex w-full flex-col items-center justify-center">
          <Link to="/signup" className="w-full max-w-[604px]">
            <Button
              variant="primary"
              className="flex h-12 w-[604px] max-w-full items-center justify-center gap-2 rounded-lg px-4 py-2"
            >
              시작하기
            </Button>
          </Link>
        </div>
      </main>
    </AppLayout>
  );
};
