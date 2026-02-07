// src/features/auth/pages/FindPasswordPageView.tsx

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PhoneStep } from "../find-password/components/PhoneStep";
import { VerificationStep } from "../find-password/components/VerificationStep";
import { NewPasswordStep } from "../find-password/components/NewPasswordStep";
import { CompleteStep } from "../find-password/components/CompleteStep";

type Step = "PHONE" | "VERIFY" | "NEW_PW" | "COMPLETE";

export const FindPasswordPageView = () => {
  const [step, setStep] = useState<Step>("PHONE");
  const [userData, setUserData] = useState({ phone: "", name: "" });

  const handlePhoneNext = (data: { name: string; phone: string }) => {
    setUserData(data);
    setStep("VERIFY");
  };

  return (
    <AppLayout>
      <main className="mx-auto w-full max-w-[1280px] px-8 pb-24 pt-24">
        <div className="flex justify-center">
          <div className="w-full max-w-[343px]">
            {step === "PHONE" && <PhoneStep onNext={handlePhoneNext} />}
            {step === "VERIFY" && (
              <VerificationStep 
                phone={userData.phone} 
                onNext={() => setStep("NEW_PW")} 
              />
            )}
            {step === "NEW_PW" && <NewPasswordStep onNext={() => setStep("COMPLETE")} />}
            {step === "COMPLETE" && <CompleteStep />}
          </div>
        </div>
      </main>
    </AppLayout>
  );
};