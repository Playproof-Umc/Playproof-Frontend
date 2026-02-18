// src/features/auth/pages/FindPasswordPageView.tsx

import { AppLayout } from "@/components/layout/AppLayout";
import { PhoneStep } from "../find-password/components/PhoneStep";
import { VerificationStep } from "../find-password/components/VerificationStep";
import { NewPasswordStep } from "../find-password/components/NewPasswordStep";
import { CompleteStep } from "../find-password/components/CompleteStep";
import { useFindPassword } from "../find-password/hooks/useFindPassword";

export const FindPasswordPageView = () => {
  const {
    step,
    userData,
    isPending,
    handlePhoneNext,
    handleVerifyNext,
    handlePasswordSubmit,
    handleComplete,
  } = useFindPassword();

  return (
    <AppLayout>
      <main className="mx-auto w-full max-w-[1280px] px-8 pb-24 pt-24">
        <div className="flex justify-center">
          <div className="w-full max-w-[343px]">
            {step === "PHONE" && <PhoneStep onNext={handlePhoneNext} />}
            {step === "VERIFY" && (
              <VerificationStep 
                phone={userData.phone} 
                onNext={handleVerifyNext} 
              />
            )}
            {step === "NEW_PW" && (
              <NewPasswordStep 
                onNext={handlePasswordSubmit}
                isPending={isPending}
              />
            )}
            {step === "COMPLETE" && <CompleteStep onNext={handleComplete} />}
          </div>
        </div>
      </main>
    </AppLayout>
  );
};