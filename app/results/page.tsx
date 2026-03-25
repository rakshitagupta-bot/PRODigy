"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { Variants } from "framer-motion";
import RadarChart from "@/components/ui/RadarChart";
import { scoreColor, scoreLabel, DIMENSION_LABELS, DIMENSION_COLORS, BENCHMARKS, type ScoreProfile } from "@/lib/scoring";
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
  const benchmark = BENCHMARKS[dim] * 10; // convert to 0-100 scale

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTimeout(() => setAnimated(true), delay); observer.disconnect(); } },
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

      {/* Track with benchmark marker */}
      <div className="relative h-2 rounded-full bg-white/[0.07] overflow-visible">
        {/* Fill */}
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: animated ? `${score}%` : "0%",
            backgroundColor: color,
          }}
        />
        {/* Benchmark tick */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-px h-3.5 bg-white/30"
          style={{ left: `${benchmark}%` }}
          title={`Benchmark: ${benchmark}`}
        />
      </div>

      {/* Benchmark label (only on hover - handled via title) */}
    </div>
  );
}

// ─── Main content ─────────────────────────────────────────────────────────────

function ResultsContent() {
  const params = useSearchParams();
  const [profile, setProfile] = useState<ScoreProfile | null>(null);
  const [ready, setReady] = useState(false);

  // URL param fallback
  const urlOverall = parseFloat(params.get("overall") ?? "0");

  useEffect(() => {
    // 1. Try sessionStorage (set by assessment page)
    let raw = sessionStorage.getItem("prodigy_score");

    // 2. Fall back to localStorage (survives tab close)
    if (!raw) raw = localStorage.getItem("prodigy_score");

    if (raw) {
      try {
        const parsed: ScoreProfile = JSON.parse(raw);
        // Persist to localStorage so it survives the OAuth redirect
        localStorage.setItem("prodigy_score", raw);
        setProfile(parsed);
      } catch {
        // ignore parse errors
      }
    }

    setReady(true);
  }, []);

  // Derived values — prefer full profile, fall back to URL params
  const overallPct = profile
    ? Math.round(profile.overallReadiness * 10)
    : Math.round(urlOverall * 10);

  const dimScores = profile?.reportDimensionScores ?? null;

  const displayScore = useCountUp(ready ? overallPct : 0, 1200);
  const label = scoreLabel(overallPct / 10);


  if (!ready) {
    return (
      <div className="min-h-screen bg-[#0B0E1A] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#6B5BFF]/30 border-t-[#6B5BFF] animate-spin" />
      </div>
    );
  }

  if (ready && !profile && urlOverall === 0) {
    // No score data at all
    return (
      <main className="min-h-screen bg-[#0B0E1A] flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-sm">
          <p className="text-4xl">🤔</p>
          <h1 className="text-xl font-bold text-white font-outfit">No results yet</h1>
          <p className="text-white/50 text-sm font-outfit">
            Take the PM Readiness Assessment first to see your score.
          </p>
          <Link
            href="/warmup"
            className="inline-block mt-2 px-6 py-3 rounded-xl bg-[#6B5BFF]/20 border border-[#6B5BFF]/40 text-[#8B8FFF] text-sm font-semibold font-outfit hover:bg-[#6B5BFF]/30 transition-all"
          >
            Start the assessment →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0B0E1A] flex flex-col">
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed inset-0 opacity-20"
        style={{
          background: "radial-gradient(ellipse 55% 40% at 50% 0%, #6B5BFF35 0%, transparent 65%)",
        }}
      />

      {/* Progress bar */}
      <header className="relative z-10 w-full max-w-[600px] mx-auto px-5 pt-8 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/35 font-outfit">Your results</span>
          <span className="text-xs text-white/20 font-outfit">25 of 25</span>
        </div>
        <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #4A6CF7, #8B5CF6)" }}
            initial={{ width: "90%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </header>

      <div className="relative z-10 w-full max-w-[600px] mx-auto px-5 py-8 space-y-6">

        {/* ── Overall score ───────────────────────────────────────────────── */}
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
              {displayScore}
            </span>
            <span className="text-2xl font-semibold text-white/40 font-outfit">/ 100</span>
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
            <span className="text-xs text-white/30 font-outfit">Based on 22 questions</span>
          </div>
        </motion.div>

        {/* ── Radar chart ──────────────────────────────────────────────────── */}
        <AnimatePresence>
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

            <RadarChart
              scores={dimScores ?? {}}
              showBenchmark
              size={300}
            />
          </motion.div>
        </AnimatePresence>

        {/* ── Dimension bars ───────────────────────────────────────────────── */}
        {dimScores && (
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

            {(
              [
                "thinking_strategy",
                "user_research",
                "execution",
                "technical_fluency",
                "communication",
              ] as AssessmentDimension[]
            ).map((dim, i) => {
              const reportKey = {
                thinking_strategy: "strategic-thinking",
                user_research: "product-sense",
                execution: "execution-depth",
                technical_fluency: "technical-fluency",
                communication: "communication",
              }[dim] as string;
              const score = dimScores[reportKey as keyof typeof dimScores] ?? 0;
              return (
                <DimBar key={dim} dim={dim} score={score} delay={i * 100} />
              );
            })}
          </motion.div>
        )}

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          animate="show"
          custom={3}
          variants={fadeUp}
          className="space-y-4 pb-8"
        >
          <p className="text-sm text-white/50 font-outfit leading-relaxed text-center px-2">
            Your full archetype profile, scores across{" "}
            <span className="text-white/75">20 sub-categories</span>, gap analysis,
            and personalised 4-week roadmap are ready.
          </p>

          <Link
            href="/report"
            className="relative w-full flex items-center justify-center gap-2 font-outfit font-semibold rounded-xl text-white px-8 py-4 text-base overflow-hidden transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
            style={{
              background:
                "linear-gradient(135deg, #4A6CF7 0%, #6B5BFF 40%, #8B5CF6 60%, #4A6CF7 100%)",
              backgroundSize: "200% auto",
              animation: "shimmer 2.4s linear infinite",
              boxShadow:
                "0 0 24px rgba(74,108,247,0.4), 0 0 48px rgba(107,91,255,0.15)",
            }}
          >
            View my full diagnostic report →
          </Link>
        </motion.div>
      </div>
    </main>
  );
}

// ─── Page export ──────────────────────────────────────────────────────────────

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B0E1A] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#6B5BFF]/30 border-t-[#6B5BFF] animate-spin" />
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
