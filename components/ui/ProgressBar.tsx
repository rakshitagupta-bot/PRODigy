"use client";

interface ProgressBarProps {
  value: number; // 0–100
  max?: number;
  color?: string;
  label?: string;
  animated?: boolean;
  className?: string;
}

export default function ProgressBar({
  value,
  max = 100,
  color,
  label,
  animated = true,
  className = "",
}: ProgressBarProps) {
  const pct = Math.round((value / max) * 100);

  const defaultColor =
    pct >= 70 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";
  const fillColor = color ?? defaultColor;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm text-white/70 font-outfit">{label}</span>
          <span className="text-sm font-semibold text-white/90">{pct}%</span>
        </div>
      )}
      <div className="h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${animated ? "animate-[fillBar_1s_ease-out_forwards]" : ""}`}
          style={{ width: `${pct}%`, backgroundColor: fillColor }}
        />
      </div>
    </div>
  );
}
