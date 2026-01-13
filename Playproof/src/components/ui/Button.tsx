import * as React from "react";
import { cn } from "@/features/utils/cn";

type ButtonVariant = "primary" | "secondary" | "outline" | "blue" | "kakao";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export function Button({
  variant = "primary",
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors select-none " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black " +
    "active:translate-y-[0.5px]";

  const disabledStyle =
    "bg-gray-200 text-white cursor-not-allowed pointer-events-none";

  const variants: Record<ButtonVariant, string> = {
    primary: "bg-black text-white hover:bg-neutral-800",
    secondary: "bg-gray-900 text-white hover:bg-gray-800",
    outline: "border border-gray-300 bg-white text-gray-800 hover:bg-gray-50",
    blue: "bg-[#4562D6] text-white hover:brightness-95",
    kakao: "bg-[#FEE500] text-black hover:brightness-95",
  };

  const size = "px-4 py-2 text-sm";

  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        base,
        size,
        fullWidth && "w-full",
        disabled ? disabledStyle : variants[variant],
        leftIcon && "gap-2",
        className
      )}
      {...rest}
    >
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
}