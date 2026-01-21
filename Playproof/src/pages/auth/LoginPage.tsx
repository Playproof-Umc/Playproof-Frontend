import { LoginForm } from "@/features/auth/login/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <main className="mx-auto flex min-h-screen max-w-[980px] flex-col items-center justify-center px-6">
        <div className="w-full max-w-[360px]">
          <h1 className="mb-10 text-center text-2xl font-bold">로그인</h1>
          <LoginForm />
        </div>
      </main>
    </div>
  );
}