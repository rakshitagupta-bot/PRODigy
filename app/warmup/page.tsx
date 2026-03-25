"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase";
import OptionTile from "@/components/ui/OptionTile";

// ─── Question data ─────────────────────────────────────────────────────────────

const questions = [
  {
    id: "background",
    step: 1,
    question: "What best describes where you've been working?",
    layout: "grid" as const,
    options: [
      { id: "consulting", text: "Consulting / Strategy" },
      { id: "engineering", text: "Software Engineering" },
      { id: "design", text: "UX / Design" },
      { id: "data", text: "Data & Analytics" },
      { id: "bizanalysis", text: "Business Analysis" },
      { id: "finance", text: "Finance & Ops" },
      { id: "marketing", text: "Sales & Marketing" },
      { id: "product", text: "Product Management" },
      { id: "project", text: "Project Management" },
      { id: "entrepreneurship", text: "Entrepreneurship" },
    ],
  },
  {
    id: "experience",
    step: 2,
    question: "How many years of professional experience do you have?",
    layout: "stack" as const,
    options: [
      { id: "0-2", text: "0–2 years" },
      { id: "3-5", text: "3–5 years" },
      { id: "6-10", text: "6–10 years" },
      { id: "10+", text: "10+ years" },
    ],
  },
  {
    id: "industry",
    step: 3,
    question: "Which industry have you spent most of your career in?",
    layout: "grid" as const,
    options: [
      { id: "fintech", text: "Fintech" },
      { id: "ecommerce", text: "E-commerce / D2C" },
      { id: "saas", text: "SaaS / B2B" },
      { id: "consumer-tech", text: "Consumer Tech" },
      { id: "edtech", text: "Edtech" },
      { id: "healthtech", text: "Healthtech" },
      { id: "logistics", text: "Logistics / Ops" },
      { id: "consulting-ind", text: "Consulting" },
      { id: "media", text: "Media / Content" },
      { id: "other", text: "Other" },
    ],
  },
];

const TOTAL_STEPS = 25;

// ─── Slide animation ───────────────────────────────────────────────────────────

const slideVariants: Variants = {
  enter: { opacity: 0, x: 28 },
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
  },
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function WarmupPage() {
  const router = useRouter();
  const supabaseRef = useRef<SupabaseClient | null>(null);
  function getSupabase(): SupabaseClient {
    if (!supabaseRef.current) supabaseRef.current = createClient();
    return supabaseRef.current;
  }

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [pending, setPending] = useState<string | null>(null);

  // Generate or restore anonymous session ID
  useEffect(() => {
    if (!localStorage.getItem("prodigy_anonymous_id")) {
      localStorage.setItem("prodigy_anonymous_id", crypto.randomUUID());
    }
  }, []);

  const current = questions[step];

  function handleSelect(optionId: string) {
    if (pending) return;
    setPending(optionId);
    setAnswers((prev) => ({ ...prev, [current.id]: optionId }));

    setTimeout(async () => {
      setPending(null);
      if (step < questions.length - 1) {
        setStep((s) => s + 1);
      } else {
        const finalAnswers = { ...answers, [current.id]: optionId };
        const warmup = {
          background: finalAnswers.background ?? "",
          experience: finalAnswers.experience ?? "",
          industry:   finalAnswers.industry   ?? "",
        };

        // Save to localStorage (works without internet, survives OAuth redirect)
        localStorage.setItem("prodigy_warmup", JSON.stringify(warmup));

        // Save to Supabase pre_signup_sessions (persists even if localStorage cleared)
        const anonymousId = localStorage.getItem("prodigy_anonymous_id");
        if (anonymousId) {
          await getSupabase()
            .from("pre_signup_sessions")
            .upsert(
              { anonymous_id: anonymousId, ...warmup },
              { onConflict: "anonymous_id" }
            );
        }

        router.push("/insight");
      }
    }, 350);
  }

  const progressPct = ((current.step) / TOTAL_STEPS) * 100;

  return (
    <main className="min-h-screen bg-[#0B0E1A] flex flex-col">
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed inset-0 opacity-15"
        style={{
          background:
            "radial-gradient(ellipse 50% 35% at 50% 0%, #4A6CF730 0%, transparent 70%)",
        }}
      />

      {/* Top bar */}
      <header className="relative z-10 w-full max-w-[600px] mx-auto px-5 pt-8 pb-0 space-y-3">
        {/* Step counter */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/35 font-outfit">
            {current.step} of {TOTAL_STEPS}
          </span>
          <span className="text-xs text-white/25 font-outfit">Warm-up</span>
        </div>

        {/* Progress bar */}
        <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #4A6CF7, #8B5CF6)",
            }}
            initial={false}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </header>

      {/* Question area */}
      <div className="relative z-10 flex-1 flex flex-col justify-center w-full max-w-[600px] mx-auto px-5 py-10">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="space-y-6"
          >
            {/* Question text */}
            <h2 className="text-xl sm:text-2xl font-bold text-white font-outfit leading-snug">
              {current.question}
            </h2>

            {/* Options */}
            {current.layout === "grid" ? (
              <div className="grid grid-cols-2 gap-2.5">
                {current.options.map((opt) => (
                  <OptionTile
                    key={opt.id}
                    id={opt.id}
                    text={opt.text}
                    selected={pending === opt.id || answers[current.id] === opt.id}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2.5">
                {current.options.map((opt) => (
                  <OptionTile
                    key={opt.id}
                    id={opt.id}
                    text={opt.text}
                    selected={pending === opt.id || answers[current.id] === opt.id}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Back nav */}
      <footer className="relative z-10 w-full max-w-[600px] mx-auto px-5 pb-8">
        {step > 0 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="text-xs text-white/30 hover:text-white/60 font-outfit transition-colors"
          >
            ← Back
          </button>
        )}
      </footer>
    </main>
  );
}
