"use client";

import { Suspense, useState, useCallback, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase";

import { questions } from "@/lib/questions";
import { selfRatings } from "@/lib/self-ratings";
import { calculateScores, DIMENSION_LABELS, DIMENSION_COLORS } from "@/lib/scoring";
import type { AnswerInput } from "@/lib/scoring";

import QuestionRenderer from "@/components/assessment/QuestionRenderer";
import SelfRatingRenderer from "@/components/assessment/SelfRatingRenderer";

// ─── Constants ────────────────────────────────────────────────────────────────

const TOTAL_SCENARIO = 17;
const TOTAL_SR = 5;
const TOTAL = TOTAL_SCENARIO + TOTAL_SR; // 22

// Transition metadata: fires before entering these overall indices
interface TransitionData {
  heading: string;
  subheading: string;
  body: string;
  icon: string;
}

const TRANSITIONS: Record<number, TransitionData> = {
  4: {
    icon: "💡",
    heading: "Product Intuition",
    subheading: "User Research · Q5–Q7",
    body: "Now let's test how well you understand what users actually need — versus what they say they want. Product sense is the hardest dimension to fake.",
  },
  7: {
    icon: "⚡",
    heading: "Execution Depth",
    subheading: "Execution · Q8–Q11",
    body: "Shipping is where most PM candidates get separated from the field. These questions test how you handle the messiness between 'idea approved' and 'live in production.'",
  },
  11: {
    icon: "🔧",
    heading: "Technical Fluency",
    subheading: "Technical Fluency · Q12–Q14",
    body: "You don't need to write code. But great PMs can think alongside engineers, challenge estimates, and smell a bad architectural decision. Let's see where you stand.",
  },
  14: {
    icon: "📢",
    heading: "Communication & Influence",
    subheading: "Communication · Q15–Q17",
    body: "Final scenario dimension. These questions test how you align, convince, and lead without authority — the skill that separates PMs who ship from PMs who get things done.",
  },
  17: {
    icon: "🪞",
    heading: "Almost there.",
    subheading: "Self-Assessment · SR1–SR5",
    body: "Five quick statements about how you see your own strengths. There are no right answers — honesty calibrates your score. Takes about 2 minutes.",
  },
};

// Toast messages fired after specific question answers (0-indexed)
const TOASTS: Record<number, string> = {
  7:  "You're more than halfway through the hardest part.",
  13: "Almost there — one final dimension to go.",
};

// ─── Animation variants ───────────────────────────────────────────────────────

const slideVariants: Variants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
  exit:  { opacity: 0, x: -18, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } },
};

const transitionVariants: Variants = {
  enter: { opacity: 0, scale: 0.96, y: 16 },
  center: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit:  { opacity: 0, scale: 0.97, y: -12, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } },
};

// ─── Assessment engine ────────────────────────────────────────────────────────

function AssessmentContent() {
  const router = useRouter();
  const params = useSearchParams();
  const supabaseRef = useRef<SupabaseClient | null>(null);
  function getSupabase(): SupabaseClient {
    if (!supabaseRef.current) supabaseRef.current = createClient();
    return supabaseRef.current;
  }

  // Claim pre-signup session — links anonymous warmup data to the signed-in user
  useEffect(() => {
    const claim = async () => {
      const anonymousId = localStorage.getItem("prodigy_anonymous_id");
      if (!anonymousId) return;
      const { data: { session } } = await getSupabase().auth.getSession();
      if (!session) return;
      await getSupabase()
        .from("pre_signup_sessions")
        .update({ user_id: session.user.id })
        .eq("anonymous_id", anonymousId)
        .is("user_id", null);
      localStorage.removeItem("prodigy_anonymous_id");
    };
    claim();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Read warmup from localStorage (set by warmup page)
  const warmup = (() => {
    try {
      const raw = localStorage.getItem("prodigy_warmup");
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  })();
  const bg       = params.get("background") ?? warmup.background ?? "other";
  const exp      = params.get("experience") ?? warmup.experience ?? "";
  const industry = params.get("industry")   ?? warmup.industry   ?? "other";

  const [overallIndex, setOverallIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [pending, setPending] = useState(false);
  const [transition, setTransition] = useState<TransitionData | null>(null);
  const [pendingNextIndex, setPendingNextIndex] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isScenario = overallIndex < TOTAL_SCENARIO;
  const currentQuestion = isScenario ? questions[overallIndex] : null;
  const currentSelfRating = !isScenario ? selfRatings[overallIndex - TOTAL_SCENARIO] : null;
  const currentId = isScenario
    ? questions[overallIndex]?.id
    : selfRatings[overallIndex - TOTAL_SCENARIO]?.id;

  const questionLabel = isScenario
    ? `Q${overallIndex + 1} of ${TOTAL_SCENARIO}`
    : `SR${overallIndex - TOTAL_SCENARIO + 1} of ${TOTAL_SR}`;

  // Progress % (15% → 95% across the full journey)
  const progressPct = 15 + (overallIndex / (TOTAL - 1)) * 80;

  // ── Navigation helpers ──────────────────────────────────────────────────────

  function showToast(message: string) {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  }

  const handleComplete = useCallback(
    (finalAnswers: Record<string, number>) => {
      const answerInputs: AnswerInput[] = Object.entries(finalAnswers).map(
        ([questionId, selectedOption]) => ({ questionId, selectedOption })
      );
      const profile = calculateScores(
        answerInputs,
        questions,
        selfRatings,
        { background: bg, experience: exp, industry }
      );

      // Persist to sessionStorage so /results can read it
      sessionStorage.setItem("prodigy_score", JSON.stringify(profile));

      // Pass minimal params in URL for SSR-friendly linking
      const urlParams = new URLSearchParams({
        bg,
        exp,
        industry,
        overall: String(profile.overallReadiness),
        archetype: profile.archetype,
      });
      router.push(`/results?${urlParams.toString()}`);
    },
    [bg, exp, industry, router]
  );

  function advance(fromIndex: number, latestAnswers: Record<string, number>) {
    const nextIndex = fromIndex + 1;

    if (nextIndex >= TOTAL) {
      handleComplete(latestAnswers);
      return;
    }

    // Fire toast after specific questions
    if (TOASTS[fromIndex]) showToast(TOASTS[fromIndex]);

    // Check if transition screen should appear before next question
    if (TRANSITIONS[nextIndex]) {
      setTransition(TRANSITIONS[nextIndex]);
      setPendingNextIndex(nextIndex);
    } else {
      setOverallIndex(nextIndex);
    }
  }

  // ── Select handler ──────────────────────────────────────────────────────────

  function handleSelect(optionIndex: number) {
    if (pending || !currentId) return;
    setPending(true);

    const latestAnswers = { ...answers, [currentId]: optionIndex };
    setAnswers(latestAnswers);

    setTimeout(() => {
      setPending(false);
      advance(overallIndex, latestAnswers);
    }, 350);
  }

  function handleTransitionContinue() {
    if (pendingNextIndex === null) return;
    setTransition(null);
    setOverallIndex(pendingNextIndex);
    setPendingNextIndex(null);
  }

  function handleBack() {
    if (overallIndex === 0) return;
    // If a transition is showing, dismiss it
    if (transition) {
      setTransition(null);
      setPendingNextIndex(null);
      return;
    }
    setOverallIndex((i) => i - 1);
  }

  // Cleanup toast timer on unmount
  useEffect(() => {
    return () => { if (toastTimer.current) clearTimeout(toastTimer.current); };
  }, []);

  // ── Dimension info for current position ────────────────────────────────────
  const currentDim = currentQuestion?.dimension ?? currentSelfRating?.dimension;
  const dimColor = currentDim ? DIMENSION_COLORS[currentDim] : "#6B5BFF";
  const dimLabel = currentDim ? DIMENSION_LABELS[currentDim] : "";

  return (
    <main className="min-h-screen bg-[#0B0E1A] flex flex-col">
      {/* Ambient glow — colour follows dimension */}
      <div
        className="pointer-events-none fixed inset-0 opacity-10 transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse 50% 35% at 50% 0%, ${dimColor}40 0%, transparent 70%)`,
        }}
      />

      {/* ── Progress header ─────────────────────────────────────────────────── */}
      <header className="relative z-10 w-full max-w-[600px] mx-auto px-5 pt-8 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40 font-outfit">{questionLabel}</span>
            {currentDim && !transition && (
              <>
                <span className="text-white/20">·</span>
                <span
                  className="text-[11px] font-semibold font-outfit"
                  style={{ color: dimColor }}
                >
                  {dimLabel}
                </span>
              </>
            )}
          </div>
          <span className="text-xs text-white/20 font-outfit">
            {Math.round(progressPct)}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            className="h-full rounded-full transition-colors duration-700"
            style={{ background: `linear-gradient(90deg, #4A6CF7, ${dimColor})` }}
            initial={false}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </header>

      {/* ── Main content area ────────────────────────────────────────────────── */}
      <div className="relative z-10 flex-1 w-full max-w-[600px] mx-auto px-5 py-8">
        <AnimatePresence mode="wait" initial={false}>
          {/* Transition screen */}
          {transition ? (
            <motion.div
              key="transition"
              variants={transitionVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6"
            >
              <div className="text-5xl">{transition.icon}</div>
              <div className="space-y-2">
                <p className="text-xs text-white/35 font-outfit uppercase tracking-widest">
                  {transition.subheading}
                </p>
                <h2 className="text-2xl font-bold text-white font-outfit">
                  {transition.heading}
                </h2>
                <p className="text-white/55 text-sm font-outfit leading-relaxed max-w-sm mx-auto">
                  {transition.body}
                </p>
              </div>
              <button
                onClick={handleTransitionContinue}
                className="px-7 py-3 rounded-xl text-sm font-semibold font-outfit text-white border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20 transition-all"
              >
                Continue →
              </button>
            </motion.div>
          ) : currentQuestion ? (
            /* Scenario MCQ */
            <motion.div
              key={`q-${overallIndex}`}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <QuestionRenderer
                question={currentQuestion}
                selectedOption={answers[currentQuestion.id]}
                onSelect={handleSelect}
              />
            </motion.div>
          ) : currentSelfRating ? (
            /* Self-rating */
            <motion.div
              key={`sr-${overallIndex}`}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <SelfRatingRenderer
                rating={currentSelfRating}
                selectedOption={answers[currentSelfRating.id]}
                onSelect={handleSelect}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* ── Back button ──────────────────────────────────────────────────────── */}
      <footer className="relative z-10 w-full max-w-[600px] mx-auto px-5 pb-8">
        {(overallIndex > 0 || transition) && (
          <button
            onClick={handleBack}
            className="text-xs text-white/25 hover:text-white/55 font-outfit transition-colors"
          >
            ← Back
          </button>
        )}
      </footer>

      {/* ── Toast ────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full text-xs font-semibold font-outfit text-white shadow-glow"
            style={{
              background: "linear-gradient(135deg, rgba(74,108,247,0.9), rgba(107,91,255,0.9))",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(107,91,255,0.4)",
            }}
          >
            ✦ {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

// ─── Page export with Suspense ────────────────────────────────────────────────

export default function AssessmentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B0E1A] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#6B5BFF]/30 border-t-[#6B5BFF] animate-spin" />
        </div>
      }
    >
      <AssessmentContent />
    </Suspense>
  );
}
