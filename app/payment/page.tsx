"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
// ─── CONFIG ────────────────────────────────────────────────────────────────────
const PRICE_INR = 499;

// ─── What's included ──────────────────────────────────────────────────────────

const INCLUSIONS = [
  {
    icon: "🧠",
    title: "Expert-designed diagnostic",
    body: "22 questions built by PMs who've hired at Swiggy, Razorpay, and Flipkart — not generic aptitude tests.",
  },
  {
    icon: "🎯",
    title: "Your unique PM archetype",
    body: "Discover exactly what kind of PM you are — and which roles, companies, and teams are built for your profile.",
  },
  {
    icon: "📊",
    title: "20-category strength map",
    body: "See precisely where you stand across Strategic Thinking, Product Sense, Execution, Technical Fluency, and Communication — broken down into 20 sub-skills.",
  },
  {
    icon: "🗺️",
    title: "Personalised roadmap",
    body: "A complementary 4-week plan with daily resources — articles, exercises, and videos — matched to your gaps. One step at a time.",
  },
];

// ─── Archetype previews ───────────────────────────────────────────────────────

const ARCHETYPES = [
  { name: "The Builder", icon: "⚙️", color: "#4A6CF7" },
  { name: "The Strategist", icon: "🎯", color: "#8B5CF6" },
  { name: "The Advocate", icon: "💬", color: "#EC4899" },
  { name: "The Operator", icon: "📊", color: "#F59E0B" },
  { name: "The Explorer", icon: "🔭", color: "#10B981" },
];

// ─── Fade helper ──────────────────────────────────────────────────────────────

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PaymentPage() {
  const router = useRouter();
  const [background, setBackground] = useState<string>("");

  useEffect(() => {
    const raw = localStorage.getItem("prodigy_warmup");
    if (raw) {
      try {
        const w = JSON.parse(raw);
        setBackground(w.background ?? "");
      } catch {}
    }
    // Already paid — skip straight to results
    if (localStorage.getItem("prodigy_paid")) router.replace("/results");
  }, [router]);

  const bgLabel: Record<string, string> = {
    consulting: "Consulting & Strategy",
    engineering: "Software Engineering",
    design: "UX & Design",
    data: "Data & Analytics",
    bizanalysis: "Business Analysis",
    finance: "Finance & Ops",
    marketing: "Sales & Marketing",
    product: "Product Management",
    project: "Project Management",
    entrepreneurship: "Entrepreneurship",
  };

  const displayBg = bgLabel[background] ?? "your background";

  return (
    <main className="min-h-screen bg-[#0B0E1A] pb-20">
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed inset-0 opacity-25"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, #6B5BFF28 0%, transparent 65%)",
        }}
      />

      {/* Progress bar */}
      <header className="relative z-10 w-full max-w-[640px] mx-auto px-5 pt-8 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/35 font-outfit">Unlock full diagnostic</span>
          <span className="text-xs text-white/20 font-outfit">5 of 26</span>
        </div>
        <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #4A6CF7, #8B5CF6)" }}
            initial={{ width: "15%" }}
            animate={{ width: "18%" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </header>

      <div className="relative z-10 w-full max-w-[640px] mx-auto px-5 pt-10 space-y-8">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <FadeUp>
          <div className="space-y-3">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-outfit border"
              style={{
                background: "rgba(107,91,255,0.12)",
                borderColor: "rgba(107,91,255,0.3)",
                color: "#c4b5fd",
              }}
            >
              ✦ Your insight is ready
            </span>

            <h1 className="font-serif text-[36px] sm:text-[42px] leading-tight text-white">
              Now get the{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #4A6CF7, #8B5CF6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontStyle: "italic",
                }}
              >
                full picture.
              </span>
            </h1>

            <p className="text-white/55 text-base font-outfit leading-relaxed">
              Based on your {displayBg} background, we&apos;ve built a
              specially designed diagnostic that goes far beyond a generic PM
              quiz. This is a rigorous, expert-built analysis of exactly where
              you stand — and your precise path forward.
            </p>
          </div>
        </FadeUp>

        {/* ── What's included ───────────────────────────────────────────────── */}
        <FadeUp delay={0.08}>
          <div className="space-y-3">
            <p className="text-[10px] font-semibold text-white/30 font-outfit uppercase tracking-widest">
              What&apos;s included
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {INCLUSIONS.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: 0.12 + i * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="rounded-xl p-4 space-y-2"
                  style={{
                    background: "rgba(21,26,46,0.8)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <p className="text-sm font-semibold text-white font-outfit">
                    {item.title}
                  </p>
                  <p className="text-xs text-white/50 font-outfit leading-relaxed">
                    {item.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* ── Archetype teaser ──────────────────────────────────────────────── */}
        <FadeUp delay={0.2}>
          <div
            className="rounded-2xl p-6 space-y-4"
            style={{
              background: "rgba(21,26,46,0.8)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="space-y-1">
              <p className="text-[10px] font-semibold text-white/30 font-outfit uppercase tracking-widest">
                Unlock your PM archetype
              </p>
              <p className="text-sm text-white/60 font-outfit leading-relaxed">
                One of these five profiles is yours. The diagnostic will reveal
                exactly which one — and what it means for the roles you should
                target.
              </p>
            </div>

            <div className="flex gap-2.5 flex-wrap">
              {ARCHETYPES.map((a) => (
                <div
                  key={a.name}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl"
                  style={{
                    background: `${a.color}10`,
                    border: `1px solid ${a.color}25`,
                  }}
                >
                  <span className="text-base">{a.icon}</span>
                  <span
                    className="text-xs font-semibold font-outfit"
                    style={{ color: a.color }}
                  >
                    {a.name}
                  </span>
                </div>
              ))}
            </div>

            <div
              className="rounded-xl px-4 py-3 border flex items-start gap-3"
              style={{
                background: "rgba(107,91,255,0.07)",
                borderColor: "rgba(107,91,255,0.2)",
              }}
            >
              <span className="text-base flex-shrink-0 mt-0.5">🗺️</span>
              <p className="text-sm text-white/65 font-outfit leading-relaxed">
                Once we know your archetype and gaps, you&apos;ll get a free
                personalised roadmap — daily resources that close the exact
                skills standing between you and your first PM role.
              </p>
            </div>
          </div>
        </FadeUp>

        {/* ── Report preview ────────────────────────────────────────────────── */}
        <FadeUp delay={0.24}>
          <div className="space-y-3">
            <p className="text-[10px] font-semibold text-white/30 font-outfit uppercase tracking-widest">
              Your report will look like this
            </p>

            {/* Mock report card */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "rgba(13,17,35,0.95)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 24px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(107,91,255,0.1)",
              }}
            >
              {/* Mock top bar */}
              <div
                className="flex items-center gap-1.5 px-4 py-2.5 border-b"
                style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(21,26,46,0.6)" }}
              >
                <div className="w-2 h-2 rounded-full bg-[#ef4444]/60" />
                <div className="w-2 h-2 rounded-full bg-[#f59e0b]/60" />
                <div className="w-2 h-2 rounded-full bg-[#22c55e]/60" />
                <span className="ml-2 text-[10px] text-white/20 font-outfit">prodigy.app/report</span>
              </div>

              <div className="p-5 space-y-4">
                {/* Archetype header */}
                <div
                  className="rounded-xl p-4 space-y-2"
                  style={{
                    background: "linear-gradient(135deg, #8B5CF618 0%, rgba(21,26,46,0.9) 100%)",
                    border: "1px solid #8B5CF628",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎯</span>
                    <div>
                      <p className="text-[10px] text-white/30 font-outfit">Your Archetype</p>
                      <p
                        className="text-lg font-serif leading-tight"
                        style={{
                          background: "linear-gradient(135deg, #8B5CF6, #fff)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        The Strategist
                      </p>
                    </div>
                    <div className="ml-auto text-right">
                      <p
                        className="text-2xl font-extrabold font-outfit"
                        style={{ color: "#f59e0b" }}
                      >
                        7.2
                      </p>
                      <p className="text-[10px] text-white/25 font-outfit">/10</p>
                    </div>
                  </div>
                  <p className="text-xs text-white/45 font-outfit italic">
                    &ldquo;You see the market before the market does.&rdquo;
                  </p>
                </div>

                {/* Dimension bars */}
                <div className="space-y-2.5">
                  <p className="text-[10px] text-white/25 font-outfit uppercase tracking-widest">
                    Skill breakdown
                  </p>
                  {[
                    { label: "Strategic Thinking", pct: 82, color: "#4A6CF7" },
                    { label: "Product Sense",       pct: 68, color: "#8B5CF6" },
                    { label: "Execution",           pct: 55, color: "#F59E0B" },
                    { label: "Communication",       pct: 74, color: "#EC4899" },
                    { label: "Technical Fluency",   pct: 48, color: "#10B981" },
                  ].map(({ label, pct, color }) => (
                    <div key={label} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-[10px] text-white/45 font-outfit">{label}</span>
                        <span className="text-[10px] font-semibold font-outfit" style={{ color }}>
                          {(pct / 10).toFixed(1)}
                        </span>
                      </div>
                      <div className="h-1 rounded-full bg-white/[0.06] relative">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, background: color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Gap map teaser */}
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: "Roadmap Planning", status: "green" },
                    { label: "Stakeholder Mgmt", status: "amber" },
                    { label: "Technical Trade-offs", status: "red" },
                    { label: "User Research", status: "green" },
                    { label: "Data Analysis", status: "amber" },
                    { label: "API Strategy", status: "red" },
                  ].map(({ label, status }) => {
                    const c = status === "green" ? "#22c55e" : status === "amber" ? "#f59e0b" : "#ef4444";
                    return (
                      <div
                        key={label}
                        className="rounded-lg p-2 space-y-1"
                        style={{ background: `${c}0D`, border: `1px solid ${c}20` }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />
                        <p className="text-[9px] text-white/50 font-outfit leading-tight">{label}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Blur overlay at bottom — "more below the fold" effect */}
                <div
                  className="relative h-8 -mx-5 -mb-5"
                  style={{
                    background: "linear-gradient(to bottom, transparent, rgba(13,17,35,0.98))",
                  }}
                />
              </div>
            </div>
          </div>
        </FadeUp>

        {/* ── Roadmap preview ───────────────────────────────────────────────── */}
        <FadeUp delay={0.28}>
          <div className="space-y-3">
            <p className="text-[10px] font-semibold text-white/30 font-outfit uppercase tracking-widest">
              Your personalised roadmap will look like this
            </p>

            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "rgba(13,17,35,0.95)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 24px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(107,91,255,0.1)",
              }}
            >
              {/* Mock top bar */}
              <div
                className="flex items-center gap-1.5 px-4 py-2.5 border-b"
                style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(21,26,46,0.6)" }}
              >
                <div className="w-2 h-2 rounded-full bg-[#ef4444]/60" />
                <div className="w-2 h-2 rounded-full bg-[#f59e0b]/60" />
                <div className="w-2 h-2 rounded-full bg-[#22c55e]/60" />
                <span className="ml-2 text-[10px] text-white/20 font-outfit">prodigy.app/roadmap</span>
              </div>

              <div className="p-5 space-y-4">
                {/* Roadmap header */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-white/30 font-outfit uppercase tracking-widest mb-0.5">
                      Your 4-week plan
                    </p>
                    <p className="text-sm font-semibold text-white font-outfit">
                      Strategist growth path
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    {["W1","W2","W3","W4"].map((w, i) => (
                      <div
                        key={w}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold font-outfit"
                        style={{
                          background: i === 0 ? "rgba(107,91,255,0.3)" : "rgba(255,255,255,0.05)",
                          border: i === 0 ? "1px solid rgba(107,91,255,0.5)" : "1px solid rgba(255,255,255,0.08)",
                          color: i === 0 ? "#a5b4fc" : "rgba(255,255,255,0.3)",
                        }}
                      >
                        {w}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Week 1 theme */}
                <div
                  className="rounded-xl px-4 py-3"
                  style={{ background: "rgba(107,91,255,0.1)", border: "1px solid rgba(107,91,255,0.2)" }}
                >
                  <p className="text-xs font-semibold text-[#a5b4fc] font-outfit">
                    Week 1 — Build your strategy foundation
                  </p>
                  <p className="text-[10px] text-white/40 font-outfit mt-0.5">
                    Closing gaps in: Technical Trade-offs · API Strategy
                  </p>
                </div>

                {/* Daily resources */}
                <div className="space-y-2">
                  {[
                    { day: "Day 1", type: "article", title: "How Razorpay PMs think about platform decisions", time: "8 min read" },
                    { day: "Day 2", type: "video",   title: "Technical trade-offs for non-engineers", time: "14 min watch" },
                    { day: "Day 3", type: "exercise", title: "Write a 1-page build vs buy decision doc", time: "20 min" },
                    { day: "Day 4", type: "article", title: "Reading an API doc as a PM — a walkthrough", time: "6 min read" },
                  ].map(({ day, type, title, time }) => {
                    const typeColor = type === "video" ? "#EC4899" : type === "exercise" ? "#F59E0B" : "#4A6CF7";
                    const typeLabel = type === "video" ? "Video" : type === "exercise" ? "Exercise" : "Article";
                    return (
                      <div
                        key={day}
                        className="flex items-start gap-3 rounded-xl px-3 py-2.5"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          <p className="text-[9px] text-white/25 font-outfit uppercase tracking-widest">{day}</p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white/70 font-outfit leading-snug truncate">{title}</p>
                          <p className="text-[9px] text-white/25 font-outfit mt-0.5">{time}</p>
                        </div>
                        <span
                          className="text-[9px] font-semibold font-outfit px-1.5 py-0.5 rounded flex-shrink-0"
                          style={{ background: `${typeColor}18`, color: typeColor }}
                        >
                          {typeLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Progress bar teaser */}
                <div
                  className="rounded-xl px-4 py-3 flex items-center justify-between"
                  style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)" }}
                >
                  <div>
                    <p className="text-[10px] text-[#4ade80] font-outfit font-semibold">
                      3 of 7 days complete
                    </p>
                    <p className="text-[9px] text-white/30 font-outfit">Keep going — you&apos;re ahead of 68% of users</p>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-3 h-3 rounded-sm"
                        style={{ background: i < 3 ? "#22c55e" : "rgba(255,255,255,0.08)" }}
                      />
                    ))}
                  </div>
                </div>

                {/* Blur overlay */}
                <div
                  className="relative h-8 -mx-5 -mb-5"
                  style={{
                    background: "linear-gradient(to bottom, transparent, rgba(13,17,35,0.98))",
                  }}
                />
              </div>
            </div>
          </div>
        </FadeUp>

        {/* ── Pricing card ──────────────────────────────────────────────────── */}
        <FadeUp delay={0.34}>
          <div
            className="rounded-2xl p-px"
            style={{
              background:
                "linear-gradient(135deg, rgba(74,108,247,0.6), rgba(139,92,246,0.5), rgba(107,91,255,0.4))",
            }}
          >
            <div
              className="rounded-2xl p-7 space-y-6"
              style={{
                background:
                  "linear-gradient(135deg, rgba(74,108,247,0.08) 0%, rgba(21,26,46,0.98) 50%)",
              }}
            >
              {/* Price */}
              <div className="flex items-end gap-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-sm text-white/40 font-outfit">₹</span>
                  <span
                    className="text-5xl font-extrabold font-outfit leading-none"
                    style={{
                      background: "linear-gradient(135deg, #4A6CF7, #8B5CF6)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {PRICE_INR}
                  </span>
                </div>
                <div className="pb-1 space-y-0.5">
                  <p className="text-xs text-white/50 font-outfit">
                    one-time · lifetime access
                  </p>
                  <p className="text-xs text-white/25 font-outfit">
                    No subscription. No renewals.
                  </p>
                </div>
              </div>

              {/* Checklist */}
              <ul className="space-y-2.5">
                {[
                  "22-question expert diagnostic (~12 minutes)",
                  "Full PM readiness score across 20 sub-categories",
                  "Your unique PM archetype revealed",
                  "Personalised 4-week roadmap with daily resources",
                  "Downloadable report — share with recruiters",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span
                      className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] mt-0.5"
                      style={{
                        background: "rgba(34,197,94,0.15)",
                        color: "#4ade80",
                      }}
                    >
                      ✓
                    </span>
                    <span className="text-sm text-white/65 font-outfit">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Pay button */}
              <button
                onClick={() => router.push("/assessment")}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-outfit font-bold text-base text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #4A6CF7 0%, #6B5BFF 50%, #8B5CF6 100%)",
                  boxShadow: "0 0 32px rgba(74,108,247,0.4), 0 0 64px rgba(107,91,255,0.15)",
                }}
              >
                Pay ₹{PRICE_INR} · Unlock my diagnostic
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Trust row */}
              <div className="flex items-center justify-center gap-5 flex-wrap">
                {[
                  { icon: "🔒", text: "Secure payment" },
                  { icon: "⚡", text: "Instant access" },
                  { icon: "📱", text: "Cards, UPI & netbanking" },
                ].map(({ icon, text }) => (
                  <span key={text} className="flex items-center gap-1.5 text-xs text-white/30 font-outfit">
                    <span>{icon}</span>
                    {text}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </FadeUp>

        {/* ── Final reassurance ─────────────────────────────────────────────── */}
        <FadeUp delay={0.40}>
          <p className="text-center text-xs text-white/20 font-outfit leading-relaxed px-4 pb-4">
            Designed for people transitioning into PM roles from{" "}
            {displayBg !== "your background" ? displayBg : "any background"}.
            Your report is private, stored securely, and never shared.
          </p>
        </FadeUp>

      </div>
    </main>
  );
}
