// src/components/ui/Input.tsx

import * as React from "react";
import { cn } from "@/utils/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: "dark" | "light";
  rightSlot?: React.ReactNode;
}

export const Input = ({
  label,
  error,
  variant = "dark",
  rightSlot,
  className,
  disabled,
  ...props
}: InputProps) => {
  const baseStyle =
    "w-full h-12 px-4 rounded-lg border text-sm transition-colors " +
    "focus:outline-none focus:ring-2";

  const variants = {
    dark:
      "bg-gray-800 border-gray-700 text-white placeholder-gray-500 " +
      "focus:border-blue-500 focus:ring-blue-500/20",

    light:
      "bg-white border-gray-300 text-gray-900 placeholder-gray-400 " +
      "focus:border-black focus:ring-black/10",
  };

  const errorStyle =
    "border-red-500 focus:border-red-500 focus:ring-red-500/20";

  const disabledStyle =
    "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed";

  return (
    <div className="flex w-full flex-col gap-1">
      {label ? (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      ) : null}

      <div className="relative flex items-center">
        <input
          className={cn(
            baseStyle,
            variants[variant],
            error && errorStyle,
            disabled && disabledStyle,
            rightSlot && "pr-10",
            className
          )}
          disabled={disabled}
          {...props}
        />

        {rightSlot ? (
          <div className="absolute right-3 flex items-center text-gray-400">
            {rightSlot}
          </div>
        ) : null}
      </div>

      {error ? (
        <span className="mt-1 text-xs text-red-500">{error}</span>
      ) : null}
    </div>
  );
};