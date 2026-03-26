"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Suspense } from "react";
import { Brain, Target, BarChart2, Map, Wrench, Crosshair, MessageCircle, Compass, Lock, Zap, CreditCard } from "lucide-react";

// ─── CONFIG ────────────────────────────────────────────────────────────────────
const PRICE_INR = 499;

// ─── What's included ──────────────────────────────────────────────────────────

const INCLUSIONS = [
  {
    icon: <Brain size={22} strokeWidth={1.6} />,
    title: "Expert-designed diagnostic",
    body: "22 questions built by PMs who've hired at Swiggy, Razorpay, and Flipkart — not generic aptitude tests.",
  },
  {
    icon: <Target size={22} strokeWidth={1.6} />,
    title: "Your unique PM archetype",
    body: "Discover exactly what kind of PM you are — and which roles, companies, and teams are built for your profile.",
  },
  {
    icon: <BarChart2 size={22} strokeWidth={1.6} />,
    title: "20-category strength map",
    body: "See precisely where you stand across Strategic Thinking, Product Sense, Execution, Technical Fluency, and Communication — broken down into 20 sub-skills.",
  },
  {
    icon: <Map size={22} strokeWidth={1.6} />,
    title: "Personalised roadmap",
    body: "A complementary 4-week plan with daily resources — articles, exercises, and videos — matched to your gaps. One step at a time.",
  },
];

// ─── Archetype previews ───────────────────────────────────────────────────────

const ARCHETYPES = [
  { name: "The Builder",    icon: <Wrench size={16} strokeWidth={1.8} />,       color: "#4A6CF7" },
  { name: "The Strategist", icon: <Crosshair size={16} strokeWidth={1.8} />,    color: "#8B5CF6" },
  { name: "The Advocate",   icon: <MessageCircle size={16} strokeWidth={1.8} />, color: "#EC4899" },
  { name: "The Operator",   icon: <BarChart2 size={16} strokeWidth={1.8} />,    color: "#F59E0B" },
  { name: "The Explorer",   icon: <Compass size={16} strokeWidth={1.8} />,      color: "#10B981" },
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

// ─── Inner page (needs useSearchParams) ───────────────────────────────────────

const RAZORPAY_PAYMENT_LINK = "https://pages.razorpay.com/pl_SVWThlSVdvfNur/view";

function PaymentPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [background, setBackground] = useState<string>("");
  const [paymentId, setPaymentId] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("prodigy_warmup");
    if (raw) {
      try {
        const w = JSON.parse(raw);
        setBackground(w.background ?? "");
      } catch {}
    }

    // Already paid — check if assessment done
    const paid = localStorage.getItem("prodigy_paid");
    if (paid) {
      const hasScore = localStorage.getItem("prodigy_score");
      router.replace(hasScore ? "/results" : "/assessment");
      return;
    }

    // Razorpay redirects back here with payment_id in URL after successful payment
    const urlPaymentId = searchParams.get("razorpay_payment_id");
    if (urlPaymentId) {
      setPaymentId(urlPaymentId);
      localStorage.setItem("prodigy_paid", urlPaymentId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  function handlePay() {
    // Redirect to Razorpay payment link — Razorpay will redirect back to this page
    // with ?razorpay_payment_id=xxx after successful payment.
    // Make sure your Razorpay Dashboard callback URL is set to: <your-domain>/payment
    window.location.href = RAZORPAY_PAYMENT_LINK;
  }

  function handleContinue() {
    if (!paymentId.trim()) return;
    localStorage.setItem("prodigy_paid", paymentId.trim());
    router.push("/assessment");
  }

  const paid = !!paymentId;

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
          <span className="text-xs text-white/20 font-outfit">6 of 26</span>
        </div>
        <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #4A6CF7, #8B5CF6)" }}
            initial={{ width: "18%" }}
            animate={{ width: "22%" }}
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
              ✦ Your score is ready
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
                  <span className="text-[#8B8FFF]">{item.icon}</span>
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
          </div>
        </FadeUp>

        {/* ── Pricing card ──────────────────────────────────────────────────── */}
        <FadeUp delay={0.28}>
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
              {!paid && (
                <button
                  onClick={handlePay}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-outfit font-bold text-base text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                  style={{
                    background:
                      "linear-gradient(135deg, #4A6CF7 0%, #6B5BFF 50%, #8B5CF6 100%)",
                    boxShadow:
                      "0 0 32px rgba(74,108,247,0.4), 0 0 64px rgba(107,91,255,0.15)",
                  }}
                >
                  Pay ₹{PRICE_INR} · Unlock my diagnostic
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}

              {/* Payment ID section — auto-filled after Razorpay success */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label
                    htmlFor="payment-id"
                    className="text-xs font-semibold text-white/40 font-outfit uppercase tracking-widest"
                  >
                    Payment ID
                  </label>
                  <div className="relative">
                    <input
                      id="payment-id"
                      type="text"
                      value={paymentId}
                      onChange={(e) => setPaymentId(e.target.value)}
                      placeholder="Auto-filled after payment · or paste here"
                      className="w-full rounded-xl px-4 py-3 text-sm font-outfit text-white placeholder-white/20 outline-none transition-all duration-200"
                      style={{
                        background: paid
                          ? "rgba(34,197,94,0.08)"
                          : "rgba(255,255,255,0.04)",
                        border: paid
                          ? "1px solid rgba(34,197,94,0.35)"
                          : "1px solid rgba(255,255,255,0.1)",
                      }}
                    />
                    {paid && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4ade80] text-sm">
                        ✓
                      </span>
                    )}
                  </div>
                  {!paid && (
                    <p className="text-[11px] text-white/25 font-outfit">
                      Payment ID is filled automatically after a successful payment.
                    </p>
                  )}
                </div>

                {/* Continue button — enabled once payment ID is present */}
                <button
                  onClick={handleContinue}
                  disabled={!paymentId.trim()}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-outfit font-bold text-base transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
                  style={
                    paymentId.trim()
                      ? {
                          background:
                            "linear-gradient(135deg, #4A6CF7 0%, #6B5BFF 50%, #8B5CF6 100%)",
                          color: "#fff",
                          boxShadow:
                            "0 0 24px rgba(74,108,247,0.35), 0 0 48px rgba(107,91,255,0.15)",
                        }
                      : {
                          background: "rgba(255,255,255,0.05)",
                          color: "rgba(255,255,255,0.3)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }
                  }
                >
                  Start my assessment →
                </button>
              </div>

              {/* Trust row */}
              <div className="flex items-center justify-center gap-5 flex-wrap">
                {[
                  { icon: <Lock size={12} strokeWidth={2} />, text: "Secure payment" },
                  { icon: <Zap size={12} strokeWidth={2} />, text: "Instant access" },
                  { icon: <CreditCard size={12} strokeWidth={2} />, text: "Cards, UPI & netbanking" },
                ].map(({ icon, text }) => (
                  <span key={text} className="flex items-center gap-1.5 text-xs text-white/30 font-outfit">
                    {icon}
                    {text}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </FadeUp>

        {/* ── Final reassurance ─────────────────────────────────────────────── */}
        <FadeUp delay={0.34}>
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

// ─── Page export (Suspense wrapper for useSearchParams) ───────────────────────

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B0E1A] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#6B5BFF]/30 border-t-[#6B5BFF] animate-spin" />
        </div>
      }
    >
      <PaymentPageInner />
    </Suspense>
  );
}
