"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import RadarChart from "@/components/ui/RadarChart";
import { Lock } from "lucide-react";
import {
  scoreColor,
  scoreLabel,
  DIMENSION_LABELS,
  DIMENSION_COLORS,
  BENCHMARKS,
} from "@/lib/scoring";
import { getBackgroundProfile } from "@/lib/personalisation";
import type { AssessmentDimension } from "@/types";

// ─── Animation variants ───────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
};

// ─── Score count-up hook ──────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    const steps = 40;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setValue(Math.round((target * step) / steps));
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

// ─── Estimated score calculator ──────────────────────────────────────────────

const REPORT_DIMS = [
  "strategic-thinking",
  "product-sense",
  "execution-depth",
  "technical-fluency",
  "communication",
] as const;

type ReportDim = (typeof REPORT_DIMS)[number];

// Deterministic offset per dim so scores feel real, not identical
const DIM_OFFSETS: Record<ReportDim, number> = {
  "strategic-thinking": 3,
  "product-sense": -2,
  "execution-depth": 5,
  "technical-fluency": -4,
  "communication": 2,
};

const EXP_BOOST: Record<string, number> = {
  "0-2": -5,
  "3-5": 0,
  "6-10": 5,
  "10+": 8,
};

function getEstimatedScores(
  background: string,
  experience: string
): { scores: Record<ReportDim, number>; overall: number } {
  const profile = getBackgroundProfile(background);

  const scores = {} as Record<ReportDim, number>;
  REPORT_DIMS.forEach((dim) => {
    let base = 50;
    if (profile.naturalStrengths.includes(dim as never)) base = 65;
    else if (profile.likelyGaps.includes(dim as never)) base = 35;
    scores[dim] = base + DIM_OFFSETS[dim];
  });

  const expBoost = EXP_BOOST[experience] ?? 0;
  const overall = Math.round(
    scores["strategic-thinking"] * 0.35 +
      scores["product-sense"] * 0.2 +
      scores["execution-depth"] * 0.2 +
      scores["communication"] * 0.15 +
      scores["technical-fluency"] * 0.1 +
      expBoost
  );

  return { scores, overall: Math.max(18, Math.min(78, overall)) };
}

// ─── Dimension bar ────────────────────────────────────────────────────────────

function DimBar({
  dim,
  score,
  delay,
}: {
  dim: AssessmentDimension;
  score: number;
  delay: number;
}) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const benchmark = BENCHMARKS[dim] * 10;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => setAnimated(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  const color = scoreColor(score);

  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: DIMENSION_COLORS[dim] }}
          />
          <span className="text-sm text-white/70 font-outfit">
            {DIMENSION_LABELS[dim]}
          </span>
        </div>
        <span className="text-sm font-semibold font-outfit" style={{ color }}>
          {score}
        </span>
      </div>
      <div className="relative h-2 rounded-full bg-white/[0.07] overflow-visible">
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: animated ? `${score}%` : "0%",
            backgroundColor: color,
          }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-px h-3.5 bg-white/30"
          style={{ left: `${benchmark}%` }}
        />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function YourResultsPage() {
  const router = useRouter();
  const [warmup, setWarmup] = useState<{
    background: string;
    experience: string;
    industry: string;
  } | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("prodigy_warmup");
    if (raw) {
      try {
        setWarmup(JSON.parse(raw));
      } catch {
        setWarmup({ background: "other", experience: "0-2", industry: "other" });
      }
    } else {
      router.replace("/warmup");
      return;
    }
    setReady(true);
  }, [router]);

  // Compute scores — safe defaults when not ready yet
  const estimatedData = ready && warmup
    ? getEstimatedScores(warmup.background, warmup.experience)
    : null;
  const overallPct = estimatedData?.overall ?? 0;

  // Hook must be called unconditionally
  const DisplayScore = useCountUp(overallPct, 1200);

  if (!ready || !warmup) {
    return (
      <div className="min-h-screen bg-[#0B0E1A] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#6B5BFF]/30 border-t-[#6B5BFF] animate-spin" />
      </div>
    );
  }

  const { scores } = estimatedData!;
  const label = scoreLabel(overallPct / 10);

  const dimOrder: AssessmentDimension[] = [
    "thinking_strategy",
    "user_research",
    "execution",
    "technical_fluency",
    "communication",
  ];

  const dimKeyMap: Record<AssessmentDimension, ReportDim> = {
    thinking_strategy: "strategic-thinking",
    user_research: "product-sense",
    execution: "execution-depth",
    technical_fluency: "technical-fluency",
    communication: "communication",
  };

  return (
    <main className="min-h-screen bg-[#0B0E1A] flex flex-col">
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(ellipse 55% 40% at 50% 0%, #6B5BFF35 0%, transparent 65%)",
        }}
      />


      <div className="relative z-10 w-full max-w-[600px] mx-auto px-5 py-8 space-y-6">

        {/* ── Overall score ─────────────────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          animate="show"
          custom={0}
          variants={fadeUp}
          className="text-center space-y-2 py-4"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-outfit bg-[#6B5BFF]/15 text-[#a78bfa] border border-[#6B5BFF]/30">
            ✦ PM Readiness Score
          </span>
          <div className="flex items-baseline justify-center gap-1.5">
            <span
              className="text-[72px] font-extrabold leading-none"
              style={{
                background: "linear-gradient(135deg, #4A6CF7, #8B5CF6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {DisplayScore}
            </span>
            <span className="text-2xl font-semibold text-white/40 font-outfit">
              / 100
            </span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <span
              className="text-sm font-semibold font-outfit px-3 py-1 rounded-full"
              style={{
                backgroundColor: `${scoreColor(overallPct / 10)}20`,
                color: scoreColor(overallPct / 10),
                border: `1px solid ${scoreColor(overallPct / 10)}40`,
              }}
            >
              {label}
            </span>
            <span className="text-xs text-white/30 font-outfit">
              Based on your profile
            </span>
          </div>
        </motion.div>

        {/* ── Radar chart ──────────────────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          animate="show"
          custom={1}
          variants={fadeUp}
          className="rounded-2xl p-4 bg-[rgba(21,26,46,0.7)] backdrop-blur-xl border border-white/[0.06]"
        >
          <div className="flex items-center justify-between mb-2 px-2">
            <p className="text-xs font-semibold text-white/40 font-outfit uppercase tracking-wider">
              PM Readiness Pentagon
            </p>
            <div className="flex items-center gap-4 text-[11px] text-white/35 font-outfit">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 rounded bg-[#8B8FFF] inline-block" />
                You
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="w-3 h-0.5 rounded inline-block"
                  style={{
                    background: "rgba(255,255,255,0.25)",
                    borderTop: "1px dashed rgba(255,255,255,0.25)",
                  }}
                />
                Benchmark
              </span>
            </div>
          </div>
          <RadarChart scores={scores} showBenchmark size={300} />
        </motion.div>

        {/* ── Dimension bars ─────────────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          animate="show"
          custom={2}
          variants={fadeUp}
          className="rounded-2xl p-5 bg-[rgba(21,26,46,0.7)] backdrop-blur-xl border border-white/[0.06] space-y-4"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-white/40 font-outfit uppercase tracking-wider">
              Dimension Breakdown
            </p>
            <div className="flex items-center gap-3 text-[10px] text-white/25 font-outfit">
              <span className="flex items-center gap-1">
                <span className="w-px h-3 bg-white/25 inline-block" />
                Benchmark
              </span>
            </div>
          </div>

          {dimOrder.map((dim, i) => (
            <DimBar
              key={dim}
              dim={dim}
              score={scores[dimKeyMap[dim]]}
              delay={i * 100}
            />
          ))}
        </motion.div>

        {/* ── Teaser lock notice ────────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          animate="show"
          custom={3}
          variants={fadeUp}
          className="rounded-xl px-5 py-4 border space-y-2"
          style={{
            background: "rgba(107,91,255,0.07)",
            borderColor: "rgba(107,91,255,0.2)",
          }}
        >
          <p className="text-sm font-semibold text-[#c4b5fd] font-outfit flex items-center gap-2">
            <Lock size={14} strokeWidth={2} /> This is your estimated score
          </p>
          <p className="text-xs text-white/50 font-outfit leading-relaxed">
            Based on your background and experience. Take the full 22-question
            diagnostic to get your precise score — broken down across 20
            sub-categories with your personalised roadmap.
          </p>
        </motion.div>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          animate="show"
          custom={4}
          variants={fadeUp}
          className="space-y-3 pb-8"
        >
          <button
            onClick={() => router.push("/payment")}
            className="relative w-full flex items-center justify-center gap-2 font-outfit font-semibold rounded-xl text-white px-8 py-4 text-base overflow-hidden transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
            style={{
              background:
                "linear-gradient(135deg, #4A6CF7 0%, #6B5BFF 40%, #8B5CF6 60%, #4A6CF7 100%)",
              backgroundSize: "200% auto",
              animation: "shimmer 2.4s linear infinite",
              boxShadow:
                "0 0 24px rgba(74,108,247,0.35), 0 0 48px rgba(107,91,255,0.15)",
            }}
          >
            Unlock my precise score →
          </button>
          <p className="text-center text-xs text-white/25 font-outfit">
            22 questions · ~12 minutes · ₹499 one-time
          </p>
        </motion.div>
      </div>
    </main>
  );
}
