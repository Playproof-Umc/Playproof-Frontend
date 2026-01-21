import { SignupGameSelectForm } from "@/features/auth/gameSelectPage/components/SignupGameSelectForm";
import { StepDots } from "@/components/auth/StepDots";
import { Navbar } from "@/components/layout/Navbar";

export default function SignupGameSelectPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <main className="mx-auto flex min-h-screen max-w-[980px] flex-col items-center px-6 pt-16">
        <div className="w-full max-w-[680px] pt-4">
          <StepDots step={2} />
          <SignupGameSelectForm />
        </div>
      </main>
    </div>
  );
}