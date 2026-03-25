"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import type { Variants } from "framer-motion";
import Link from "next/link";

// ─── Animation helpers ────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
};

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
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      custom={delay}
      variants={fadeUp}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Score Preview Card ───────────────────────────────────────────────────────

const sampleDimensions = [
  { label: "Strategic Thinking", score: 72, color: "#22c55e" },
  { label: "Product Sense", score: 45, color: "#ef4444" },
  { label: "Execution Depth", score: 60, color: "#f59e0b" },
  { label: "Technical Fluency", score: 38, color: "#ef4444" },
  { label: "Communication", score: 68, color: "#22c55e" },
];

function ScoreBar({
  label,
  score,
  color,
  delay,
}: {
  label: string;
  score: number;
  color: string;
  delay: number;
}) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });

  useEffect(() => {
    if (inView) setTimeout(() => setAnimated(true), delay);
  }, [inView, delay]);

  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs text-white/60 font-outfit">{label}</span>
        <span className="text-xs font-semibold font-outfit" style={{ color }}>
          {score}%
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: animated ? `${score}%` : "0%",
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

function ScorePreviewCard() {
  return (
    <FadeUp delay={3} className="w-full max-w-[420px] mx-auto">
      <div className="rounded-2xl p-5 bg-[rgba(21,26,46,0.8)] backdrop-blur-xl border border-white/[0.06] shadow-card space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/50 font-outfit">PM Readiness Score</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/[0.06] text-white/40 font-outfit border border-white/[0.06]">
            Sample result
          </span>
        </div>

        {/* Big number */}
        <div>
          <div
            className="text-[56px] font-extrabold leading-none"
            style={{
              background: "linear-gradient(135deg, #4A6CF7, #8B5CF6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            58%
          </div>
          <p className="text-xs text-white/40 font-outfit mt-1">
            Candidate: Aspiring Product Manager
          </p>
        </div>

        {/* Bars */}
        <div className="space-y-3">
          {sampleDimensions.map((d, i) => (
            <ScoreBar key={d.label} {...d} delay={i * 150} />
          ))}
        </div>

        {/* Archetype chip */}
        <div className="pt-1 border-t border-white/[0.05]">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#4A6CF7]/15 text-[#8B8FFF] border border-[#6B5BFF]/30 font-outfit">
            ⚙️ Target Archetype: The Technical Architect PM
          </span>
        </div>
      </div>
    </FadeUp>
  );
}

// ─── Value Props ──────────────────────────────────────────────────────────────

const valueProps = [
  {
    icon: "🎯",
    title: "Clarity of Outcome",
    body: "Know exactly which PM roles match your background instead of applying blindly to every 'Associate PM' posting.",
  },
  {
    icon: "🧬",
    title: "The Archetype System",
    body: "Map your professional DNA to one of 5 PM archetypes. Leverage your strengths as a 'Strategist' or 'Builder.'",
  },
  {
    icon: "🔄",
    title: "Gap-Closing Roadmap",
    body: "A week-by-week plan that fixes what you're missing before you face a recruiter at Razorpay or Zomato.",
  },
];

// ─── Archetypes ───────────────────────────────────────────────────────────────

const miniArchetypes = [
  { icon: "🎯", name: "Strategist", desc: "Turns market insight into roadmaps" },
  { icon: "💬", name: "Advocate", desc: "Builds what people actually need" },
  { icon: "📊", name: "Operator", desc: "Turns chaos into a repeatable machine" },
  { icon: "🔭", name: "Explorer", desc: "Finds opportunities no one else sees" },
];

// ─── Steps ────────────────────────────────────────────────────────────────────

const steps = [
  {
    n: "01",
    title: "Assessment",
    body: "Benchmark your skills across 5 core PM dimensions. 22 questions, 12 minutes.",
  },
  {
    n: "02",
    title: "Archetype",
    body: "Identify your PM persona and understand which companies and roles match your strengths.",
  },
  {
    n: "03",
    title: "Roadmap",
    body: "Execute a tailored week-by-week plan to close your specific gaps — not generic content.",
  },
  {
    n: "04",
    title: "Hired",
    body: "Walk into interviews with clarity, confidence, and the readiness score to prove it.",
  },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────

const testimonials = [
  {
    quote:
      "3 years in consulting. Everyone says I'm ready. I had no idea if that was true — until this.",
    name: "Ananya S.",
    from: "Strategy Consultant",
    to: "APM at Razorpay",
  },
  {
    quote:
      "I was applying to 30 PM roles a week. This told me I was targeting the wrong ones for my profile.",
    name: "Karan M.",
    from: "SDE-2",
    to: "PM at a Series B fintech",
  },
  {
    quote:
      "The archetype system showed me I was a natural Advocate. That changed how I positioned myself.",
    name: "Priya D.",
    from: "UX Designer",
    to: "PM at CRED",
  },
];

// ─── CTA Button ───────────────────────────────────────────────────────────────

function CTAButton({
  size = "lg",
  className = "",
}: {
  size?: "md" | "lg";
  className?: string;
}) {
  return (
    <Link
      href="/warmup"
      className={[
        "relative inline-flex items-center justify-center font-outfit font-semibold rounded-xl text-white overflow-hidden",
        "transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
        "shadow-[0_0_24px_rgba(74,108,247,0.4),0_0_48px_rgba(107,91,255,0.2)]",
        "hover:shadow-[0_0_32px_rgba(74,108,247,0.6),0_0_64px_rgba(107,91,255,0.3)]",
        size === "lg" ? "px-8 py-4 text-lg" : "px-6 py-3 text-base",
        className,
      ].join(" ")}
      style={{
        background:
          "linear-gradient(135deg, #4A6CF7 0%, #6B5BFF 40%, #8B5CF6 60%, #4A6CF7 100%)",
        backgroundSize: "200% auto",
        animation: "shimmer 2.4s linear infinite",
      }}
    >
      Check your PM readiness →
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0B0E1A] text-white overflow-x-hidden">
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% -10%, #4A6CF740 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-[700px] mx-auto px-5 py-16 space-y-24">
        {/* ── HERO ───────────────────────────────────────────────────── */}
        <section className="flex flex-col items-center text-center space-y-6">
          <FadeUp delay={0}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-outfit bg-[#4A6CF7]/15 text-[#8B8FFF] border border-[#6B5BFF]/30">
              ✦ Free PM Readiness Assessment
            </span>
          </FadeUp>

          <FadeUp delay={1}>
            <h1 className="font-serif text-[clamp(36px,8vw,52px)] leading-tight text-white">
              Stop Guessing.{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #4A6CF7, #8B5CF6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontStyle: "italic",
                }}
              >
                Start Getting Hired.
              </span>
            </h1>
          </FadeUp>

          <FadeUp delay={2}>
            <p className="text-white/65 text-lg font-outfit leading-relaxed max-w-[520px]">
              The first PM transition platform built for the Indian market that
              tells you exactly where you stand — and gets you ready for
              top-tier roles.
            </p>
          </FadeUp>

          <FadeUp delay={2.5}>
            <p className="text-white/35 text-sm font-outfit italic">
              Preparing for PM but not getting calls? Don&apos;t know if
              you&apos;re ready? We&apos;ve got you.
            </p>
          </FadeUp>

          <FadeUp delay={3}>
            <CTAButton size="lg" />
          </FadeUp>

          <FadeUp delay={3.5}>
            <p className="text-white/35 text-xs font-outfit tracking-wide">
              Free · 12 min · No signup needed
            </p>
          </FadeUp>
        </section>

        {/* ── SCORE PREVIEW ──────────────────────────────────────────── */}
        <ScorePreviewCard />

        {/* ── ALUMNI BAR ─────────────────────────────────────────────── */}
        <FadeUp>
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-white/35 text-xs font-outfit uppercase tracking-widest">
              Our alumni lead product teams at
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {["Flipkart", "Razorpay", "Swiggy", "Zomato", "CRED", "PhonePe"].map(
                (co) => (
                  <span
                    key={co}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/[0.04] border border-white/[0.06] text-white/55 font-outfit"
                  >
                    {co}
                  </span>
                )
              )}
            </div>
          </div>
        </FadeUp>

        {/* ── PAIN POINT ─────────────────────────────────────────────── */}
        <FadeUp>
          <div className="rounded-2xl p-6 bg-white/[0.02] border border-white/[0.06] text-center">
            <p className="text-white/70 font-outfit text-base leading-relaxed">
              We don&apos;t sell 100-hour video courses. We give you a{" "}
              <span className="text-white font-semibold">surgical system</span>{" "}
              designed to get you hired into strong PM roles.
            </p>
          </div>
        </FadeUp>

        {/* ── VALUE PROPS ────────────────────────────────────────────── */}
        <section className="space-y-4">
          <FadeUp>
            <h2 className="text-center text-xl font-bold font-outfit text-white/90">
              What you actually get
            </h2>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {valueProps.map((v, i) => (
              <FadeUp key={v.title} delay={i * 0.5}>
                <div className="rounded-2xl p-5 bg-[rgba(21,26,46,0.7)] backdrop-blur-xl border border-white/[0.06] h-full space-y-3">
                  <span className="text-2xl">{v.icon}</span>
                  <h3 className="font-semibold text-white font-outfit">{v.title}</h3>
                  <p className="text-sm text-white/55 font-outfit leading-relaxed">
                    {v.body}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* ── ARCHETYPE SHOWCASE ─────────────────────────────────────── */}
        <section className="space-y-6">
          <FadeUp>
            <div className="text-center space-y-1">
              <h2 className="text-xl font-bold font-outfit text-white/90">
                The Archetype System
              </h2>
              <p className="text-sm text-white/45 font-outfit">
                We identify your PM persona to target the right roles.
              </p>
            </div>
          </FadeUp>

          {/* Featured card */}
          <FadeUp>
            <div
              className="rounded-2xl p-6 border space-y-4"
              style={{
                background:
                  "linear-gradient(135deg, rgba(74,108,247,0.12) 0%, rgba(21,26,46,0.95) 100%)",
                borderColor: "rgba(74,108,247,0.25)",
              }}
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl">⚙️</span>
                <div>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-[#4A6CF7]/20 text-[#8B8FFF] font-outfit mb-2">
                    Recommended for Engineers
                  </span>
                  <h3 className="text-xl font-bold text-white font-serif">
                    The Builder
                  </h3>
                  <p className="text-sm text-white/55 font-outfit italic mt-0.5">
                    You ship systems, not just features.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {["System Architecture", "Technical Trade-offs", "Build vs Buy", "API Strategy"].map(
                  (item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-sm text-white/70 font-outfit"
                    >
                      <span className="text-[#4A6CF7]">✓</span>
                      {item}
                    </div>
                  )
                )}
              </div>
            </div>
          </FadeUp>

          {/* Mini archetype grid */}
          <div className="grid grid-cols-2 gap-3">
            {miniArchetypes.map((a, i) => (
              <FadeUp key={a.name} delay={i * 0.3}>
                <div className="rounded-xl p-4 bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <span className="text-xl">{a.icon}</span>
                  <h4 className="font-semibold text-white text-sm font-outfit">
                    {a.name}
                  </h4>
                  <p className="text-xs text-white/45 font-outfit">{a.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ───────────────────────────────────────────── */}
        <section className="space-y-6">
          <FadeUp>
            <h2 className="text-center text-xl font-bold font-outfit text-white/90">
              How it works
            </h2>
          </FadeUp>
          <div className="relative">
            {/* Connector line */}
            <div className="absolute left-5 top-5 bottom-5 w-px bg-white/[0.06] hidden sm:block" />
            <div className="space-y-5">
              {steps.map((step, i) => (
                <FadeUp key={step.n} delay={i * 0.3}>
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#6B5BFF]/15 border border-[#6B5BFF]/25 flex items-center justify-center text-xs font-bold text-[#8B8FFF] font-outfit">
                      {step.n}
                    </div>
                    <div className="pt-1.5">
                      <h3 className="font-semibold text-white font-outfit mb-1">
                        {step.title}
                      </h3>
                      <p className="text-sm text-white/55 font-outfit leading-relaxed">
                        {step.body}
                      </p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ───────────────────────────────────────────── */}
        <section className="space-y-4">
          <FadeUp>
            <h2 className="text-center text-xl font-bold font-outfit text-white/90">
              What they said
            </h2>
          </FadeUp>
          <div className="space-y-3">
            {testimonials.map((t, i) => (
              <FadeUp key={t.name} delay={i * 0.3}>
                <div className="rounded-2xl p-5 bg-[rgba(21,26,46,0.7)] backdrop-blur-xl border border-white/[0.06] space-y-3">
                  <p className="text-white/80 font-outfit text-sm leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#6B5BFF]/20 flex items-center justify-center text-xs font-bold text-[#8B8FFF] font-outfit">
                      {t.name[0]}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-white/70 font-outfit">
                        {t.name}
                      </span>
                      <span className="text-xs text-white/35 font-outfit">
                        {" "}
                        · {t.from} → {t.to}
                      </span>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* ── FINAL CTA ──────────────────────────────────────────────── */}
        <FadeUp>
          <div
            className="rounded-2xl p-8 text-center space-y-5"
            style={{
              background: "rgba(21,26,46,0.8)",
              border: "1px solid transparent",
              backgroundClip: "padding-box",
              boxShadow: "0 0 0 1px rgba(107,91,255,0.25), 0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            <h2 className="text-2xl font-bold font-serif text-white">
              Ready to stop guessing and start getting hired?
            </h2>
            <p className="text-white/55 font-outfit text-sm leading-relaxed max-w-md mx-auto">
              Get your PM Readiness Score in 12 minutes. Free to use.
              Just clarity.
            </p>
            <CTAButton size="lg" />
            <div className="flex flex-wrap justify-center gap-4 text-xs text-white/35 font-outfit pt-1">
              {["✓ Free forever", "✓ No signup to start", "✓ 12 minutes", "✓ Personalised results"].map(
                (item) => (
                  <span key={item}>{item}</span>
                )
              )}
            </div>
          </div>
        </FadeUp>

        {/* Footer */}
        <footer className="text-center text-xs text-white/20 font-outfit pb-4">
          PRODigy · Built for PM career-switchers in India
        </footer>
      </div>
    </main>
  );
}
