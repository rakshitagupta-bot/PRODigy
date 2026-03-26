"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Clock, MapPin, Check, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import {
  getInsight,
  getExperienceFrame,
  getBackgroundProfile,
} from "@/lib/personalisation";

// ─── Fade-up helper ─────────────────────────────────────────────────────────────

function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────────

export default function InsightPage() {
  const router = useRouter();
  const [warmup, setWarmup] = useState<{
    background: string;
    experience: string;
    industry: string;
  } | null>(null);
  // Read warmup answers saved by the warmup page
  useEffect(() => {
    const raw = localStorage.getItem("prodigy_warmup");
    if (raw) {
      try {
        setWarmup(JSON.parse(raw));
      } catch {
        setWarmup({ background: "other", experience: "", industry: "other" });
      }
    } else {
      router.replace("/warmup");
    }
  }, [router]);

  if (!warmup) {
    return (
      <div className="min-h-screen bg-[#0B0E1A] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#6B5BFF]/30 border-t-[#6B5BFF] animate-spin" />
      </div>
    );
  }

  const { background, experience, industry } = warmup;

  const insight = getInsight(background, industry);
  const profile = getBackgroundProfile(background);
  const experienceFrame = getExperienceFrame(experience);

  return (
    <main className="min-h-screen bg-[#0B0E1A] flex flex-col">
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed inset-0 opacity-15"
        style={{
          background:
            "radial-gradient(ellipse 50% 35% at 50% 0%, #8B5CF630 0%, transparent 70%)",
        }}
      />


      {/* Content */}
      <div className="relative z-10 flex-1 w-full max-w-[600px] mx-auto px-5 py-10 space-y-6">

        {/* Label */}
        <FadeUp delay={0.05}>
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-outfit border"
              style={{
                background: "rgba(139,92,246,0.12)",
                borderColor: "rgba(139,92,246,0.3)",
                color: "#c4b5fd",
              }}
            >
              ✦ Based on your answers
            </span>
          </div>
        </FadeUp>

        {/* Main insight card — gradient border */}
        <FadeUp delay={0.15}>
          <div
            className="rounded-2xl p-px"
            style={{
              background:
                "linear-gradient(135deg, rgba(74,108,247,0.5), rgba(139,92,246,0.4), rgba(107,91,255,0.3))",
            }}
          >
            <div
              className="rounded-2xl p-6 space-y-4"
              style={{
                background:
                  "linear-gradient(135deg, rgba(74,108,247,0.08) 0%, rgba(21,26,46,0.97) 60%)",
              }}
            >
              <h1 className="text-xl sm:text-2xl font-bold text-white font-outfit leading-snug">
                {insight.headline}
              </h1>
              <p className="text-white/65 font-outfit text-sm leading-relaxed">
                {insight.body}
              </p>
              <div
                className="rounded-xl p-4 border space-y-1.5"
                style={{
                  background: "rgba(107,91,255,0.08)",
                  borderColor: "rgba(107,91,255,0.2)",
                }}
              >
                <p className="text-xs font-semibold text-[#a78bfa] font-outfit uppercase tracking-wider">
                  What this means for PM
                </p>
                <p className="text-sm text-white/75 font-outfit leading-relaxed italic">
                  &ldquo;{insight.translatedStrength}&rdquo;
                </p>
              </div>
            </div>
          </div>
        </FadeUp>

        {/* Experience framing */}
        <FadeUp delay={0.25}>
          <div
            className="rounded-xl px-4 py-3 border flex items-start gap-3"
            style={{
              background: "rgba(255,255,255,0.02)",
              borderColor: "rgba(255,255,255,0.06)",
            }}
          >
            <Clock size={16} strokeWidth={1.8} className="text-white/35 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-white/55 font-outfit leading-relaxed">
              {experienceFrame}
            </p>
          </div>
        </FadeUp>

        {/* Strengths + gaps */}
        {(profile.naturalStrengths.length > 0 || profile.likelyGaps.length > 0) && (
          <FadeUp delay={0.35}>
            <div className="grid grid-cols-2 gap-3">
              {profile.naturalStrengths.length > 0 && (
                <div
                  className="rounded-xl p-4 border space-y-2"
                  style={{
                    background: "rgba(34,197,94,0.05)",
                    borderColor: "rgba(34,197,94,0.2)",
                  }}
                >
                  <p className="text-xs font-semibold text-[#4ade80] font-outfit uppercase tracking-wider">
                    Your head start
                  </p>
                  <ul className="space-y-1">
                    {profile.naturalStrengths.map((s) => (
                      <li
                        key={s}
                        className="text-xs text-white/60 font-outfit flex items-center gap-1.5"
                      >
                        <Check size={11} strokeWidth={2.5} className="text-[#4ade80] flex-shrink-0" />
                        <span className="capitalize">{s.replace(/-/g, " ")}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {profile.likelyGaps.length > 0 && (
                <div
                  className="rounded-xl p-4 border space-y-2"
                  style={{
                    background: "rgba(239,68,68,0.05)",
                    borderColor: "rgba(239,68,68,0.15)",
                  }}
                >
                  <p className="text-xs font-semibold text-[#f87171] font-outfit uppercase tracking-wider">
                    To develop
                  </p>
                  <ul className="space-y-1">
                    {profile.likelyGaps.map((g) => (
                      <li
                        key={g}
                        className="text-xs text-white/60 font-outfit flex items-center gap-1.5"
                      >
                        <ArrowRight size={11} strokeWidth={2.5} className="text-[#f87171] flex-shrink-0" />
                        <span className="capitalize">{g.replace(/-/g, " ")}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </FadeUp>
        )}

        {/* What's next */}
        <FadeUp delay={0.45}>
          <div
            className="rounded-xl px-4 py-3 border flex items-start gap-3"
            style={{
              background: "rgba(255,255,255,0.02)",
              borderColor: "rgba(255,255,255,0.06)",
            }}
          >
            <MapPin size={16} strokeWidth={1.8} className="text-white/35 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-white/45 font-outfit leading-relaxed">
              The full diagnostic — 17 scenarios + 5 self-ratings — will measure your
              actual reasoning across Strategic Thinking, Product Sense, Execution Depth,
              Technical Fluency, and Communication.{" "}
              <span className="text-white/65">About 12 minutes.</span>
            </p>
          </div>
        </FadeUp>

        {/* CTA */}
        <FadeUp delay={0.55}>
          <div className="space-y-3 pt-2">
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
              Get my full PM assessment →
            </button>
            <p className="text-center text-xs text-white/25 font-outfit">
              22 questions · ~12 minutes · ₹499 one-time
            </p>
          </div>
        </FadeUp>
      </div>
    </main>
  );
}
