"use client";

import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, ...props }, ref) => {
    const base =
      "relative inline-flex items-center justify-center font-outfit font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#6B5BFF]/50 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden";

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    const variants = {
      primary: [
        "text-white shadow-glow",
        "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-[#4A6CF7] before:via-[#6B5BFF] before:to-[#8B5CF6]",
        "before:bg-[length:200%_auto] before:animate-shimmer",
        "hover:shadow-[0_0_32px_rgba(74,108,247,0.6),0_0_64px_rgba(107,91,255,0.3)] hover:scale-[1.02] active:scale-[0.98]",
      ].join(" "),
      ghost:
        "text-white/70 hover:text-white hover:bg-white/5 active:bg-white/10",
      outline:
        "text-white border border-white/10 hover:border-[#6B5BFF]/50 hover:bg-[#6B5BFF]/10 active:bg-[#6B5BFF]/20",
    };

    return (
      <button
        ref={ref}
        className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
