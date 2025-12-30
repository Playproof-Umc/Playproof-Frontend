import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary";
    fullWidth?: boolean;
}

export const Button = ({
    children,
    variant = "primary",
    fullWidth = false,
    className = "",
    ...props
}: ButtonProps) => {
    const baseStyle =
      	"flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
		primary:
			"bg-black text-white hover:bg-black/90",
		secondary:
			"bg-[#C6C6C6] text-black hover:bg-[#B5B5B5]",
    };

    return (
		<button
			className={[
			baseStyle,
			variants[variant],
			fullWidth ? "w-full" : "",
			className,
			].join(" ")}
			{...props}
		>
			{children}
		</button>
    );
};