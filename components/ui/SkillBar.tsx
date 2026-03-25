"use client";

import { useEffect, useRef, useState } from "react";

interface SkillBarProps {
  label: string;
  score: number; // 0–100
  delay?: number; // ms stagger
}

export default function SkillBar({ label, score, delay = 0 }: SkillBarProps) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const color =
    score >= 70 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setAnimated(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className="w-full">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm text-white/70 font-outfit">{label}</span>
        <span className="text-sm font-semibold font-outfit" style={{ color }}>
          {score}%
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: animated ? `${score}%` : "0%",
            backgroundColor: color,
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}
