import type { ReactNode } from "react";
import { Navbar } from "@/components/common/Navbar";

type AppLayoutProps = {
  children: ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-white text-black relative">
      <Navbar />
      {children}
    </div>
  );
};
