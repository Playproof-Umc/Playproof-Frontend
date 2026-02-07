// src/components/ui/Button.tsx

//src/components/ui/Button.tsx
//src/components/ui/Button.tsx
import React from "react";
import { cn } from "@/utils/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "blue"
  | "kakao";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  children,
  variant = "primary",
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  const baseStyle =
    "inline-flex items-center justify-center rounded-lg font-semibold " +
    "transition-colors duration-200 select-none " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black";

  // ✅ 기본 사이즈(필요하면 사용처에서 className으로 h-12 같은 거 덮어쓰기)
  const sizeStyle = "px-6 py-3 text-sm";

  // ✅ disabled는 어떤 variant든 무조건 회색 (정책)
  const disabledStyle =
    "bg-[#C6C6C6] text-white cursor-not-allowed pointer-events-none";

  const variants: Record<ButtonVariant, string> = {
    primary: "bg-[#1533B6] text-white hover:bg-[#122CA3]",
    secondary: "bg-[#C6C6C6] text-white hover:bg-[#B5B5B5]",
    outline: "bg-white text-black border border-black hover:bg-black hover:text-white",
    blue: "bg-[#4562D6] text-white hover:brightness-95",
    kakao: "bg-[#FEE500] text-black hover:brightness-95",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        baseStyle,
        sizeStyle,
        fullWidth && "w-full",
        disabled ? disabledStyle : variants[variant],
        // 아이콘 있으면 간격
        (leftIcon || rightIcon) && "gap-2",
        className
      )}
      {...props}
    >
      {leftIcon ? (
        <span className="inline-flex items-center shrink-0">{leftIcon}</span>
      ) : null}

      <span className="inline-flex items-center">{children}</span>

      {rightIcon ? (
        <span className="inline-flex items-center shrink-0">{rightIcon}</span>
      ) : null}
    </button>
  );
}
