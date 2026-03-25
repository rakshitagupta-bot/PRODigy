import type { HTMLAttributes } from "react";

interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "accent" | "subtle" | "success" | "warning" | "error";
}

export default function Chip({
  variant = "accent",
  className = "",
  children,
  ...props
}: ChipProps) {
  const variants = {
    accent:
      "bg-gradient-to-r from-[#4A6CF7]/20 to-[#8B5CF6]/20 text-[#8B8FFF] border border-[#6B5BFF]/30",
    subtle: "bg-white/5 text-white/60 border border-white/[0.06]",
    success: "bg-[#22c55e]/15 text-[#4ade80] border border-[#22c55e]/30",
    warning: "bg-[#f59e0b]/15 text-[#fbbf24] border border-[#f59e0b]/30",
    error: "bg-[#ef4444]/15 text-[#f87171] border border-[#ef4444]/30",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-outfit ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
