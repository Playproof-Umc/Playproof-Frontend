import { Outlet } from "react-router-dom";
import { SignupCompleteModal } from "@/components/auth/SignupCompleteModal";
import { useSignupCompleteModal } from "@/features/auth/signup/hooks/useSignupCompleteModal";

export default function AppLayout() {
  const { open, username, close } = useSignupCompleteModal();

  return (
    <div className="min-h-screen bg-white text-black">
      {/* TODO: App 영역 Navbar가 있으면 여기 */}
      {/* <Navbar /> */}

      <Outlet />

      <SignupCompleteModal open={open} username={username} onClose={close} />
    </div>
  );
}