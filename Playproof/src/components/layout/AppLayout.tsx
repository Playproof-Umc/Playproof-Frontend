// src/components/layout/AppLayout.tsx

import type { ComponentProps, ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";

type AppLayoutProps = {
  children: ReactNode;
  navbarProps?: ComponentProps<typeof Navbar>;
  className?: string;
  containerClassName?: string;
};

export const AppLayout = ({
  children,
  navbarProps,
  className,
  containerClassName,
}: AppLayoutProps) => {
  return (
    <div className={["min-h-screen bg-white text-black relative", className].filter(Boolean).join(" ")}>
      <Navbar {...navbarProps} />
      <div className={["pp-container", containerClassName].filter(Boolean).join(" ")}>
        {children}
      </div>
    </div>
  );
};
