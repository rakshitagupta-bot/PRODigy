"use client";

import { useEffect, useState } from "react";

interface ScoreRingProps {
  score: number;       // 0–100
  benchmark?: number;  // 0–100, optional comparison
  size?: number;
  strokeWidth?: number;
}

export default function ScoreRing({
  score,
  benchmark,
  size = 140,
  strokeWidth = 10,
}: ScoreRingProps) {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setAnimated(score));
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated / 100) * circumference;

  const aboveBenchmark = benchmark !== undefined && score >= benchmark;
  const benchmarkText =
    benchmark !== undefined
      ? aboveBenchmark
        ? "Above benchmark"
        : "Below benchmark"
      : null;
  const benchmarkColor = aboveBenchmark ? "#22c55e" : "#f59e0b";

  const gradId = "scoreRingGrad";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4A6CF7" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)" }}
          />
        </svg>

        {/* Centre label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <span className="text-2xl font-extrabold text-white font-outfit leading-none">
            {(score / 10).toFixed(1)}
          </span>
          <span className="text-[11px] text-white/30 font-outfit">/10</span>
        </div>
      </div>

      {benchmarkText && (
        <span
          className="text-[11px] font-semibold font-outfit px-2.5 py-1 rounded-full"
          style={{
            background: `${benchmarkColor}15`,
            color: benchmarkColor,
            border: `1px solid ${benchmarkColor}30`,
          }}
        >
          {benchmarkText}
        </span>
      )}
    </div>
  );
}
