"use client";

import { motion } from "framer-motion";
import type { AssessmentDimension } from "@/types";
import { DIMENSION_LABELS } from "@/lib/scoring";

const DIMENSION_DESCRIPTIONS: Record<AssessmentDimension, string> = {
  thinking_strategy: "How you frame problems, make tradeoffs, and connect product decisions to business outcomes.",
  user_research: "Your intuition for what users actually need — not just what they say they want.",
  execution: "How rigorously you drive features from approved to shipped to measured.",
  technical_fluency: "Your ability to partner with engineers as an equal, not a requester.",
  communication: "How you align, influence, and communicate across different stakeholders.",
};

interface DimensionTransitionProps {
  dimension: AssessmentDimension;
  onContinue: () => void;
}

export default function DimensionTransition({
  dimension,
  onContinue,
}: DimensionTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 px-4"
    >
      <div className="text-5xl">📍</div>
      <div>
        <p className="text-white/40 text-sm font-outfit mb-2">Next dimension</p>
        <h2 className="text-2xl font-bold text-white font-outfit">
          {DIMENSION_LABELS[dimension]}
        </h2>
        <p className="text-white/55 text-sm font-outfit mt-3 max-w-sm mx-auto">
          {DIMENSION_DESCRIPTIONS[dimension]}
        </p>
      </div>
      <button
        onClick={onContinue}
        className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 font-outfit text-sm hover:bg-white/10 hover:text-white transition-all"
      >
        Continue →
      </button>
    </motion.div>
  );
}
