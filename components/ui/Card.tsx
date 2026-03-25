import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export default function Card({
  glass = true,
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={[
        "rounded-2xl p-6",
        glass
          ? "bg-[rgba(21,26,46,0.7)] backdrop-blur-xl border border-white/[0.06]"
          : "bg-[#151A2E] border border-white/[0.06]",
        "shadow-card",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
