import React from "react";

type InputVariant = "dark" | "light";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: InputVariant;
  rightSlot?: React.ReactNode; // ✅ 추가
}

export const Input = ({
  label,
  error,
  variant = "dark",
  rightSlot,
  className = "",
  ...props
}: InputProps) => {
  const baseStyle =
    "w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-1";

  const variants: Record<InputVariant, string> = {
    dark: `
      bg-gray-800 text-white border-gray-700
      placeholder-gray-500
      focus:border-blue-500 focus:ring-blue-500
    `,
    light: `
      bg-white text-black border-gray-300
      placeholder-gray-400
      focus:border-blue-700 focus:ring-blue-700
    `,
  };

  return (
    <div className="flex w-full flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-600">{label}</label>
      )}

      <div className="relative">
        <input
          className={[
            baseStyle,
            variants[variant],
            rightSlot ? "pr-12" : "",
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "",
            className,
          ].join(" ")}
          {...props}
        />

        {rightSlot && (
          <div className="absolute right-3 top-[54%] -translate-y-1/2">
            {rightSlot}
          </div>
        )}
      </div>

      {error && <span className="mt-1 text-xs text-red-500 ml-2">{error}</span>}
    </div>
  );
};