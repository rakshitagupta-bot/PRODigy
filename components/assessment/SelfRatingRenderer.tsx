"use client";

import type { AssessmentSelfRating } from "@/types";
import { DIMENSION_LABELS, DIMENSION_COLORS } from "@/lib/scoring";

interface SelfRatingRendererProps {
  rating: AssessmentSelfRating;
  selectedOption?: number; // 0–3
  onSelect: (optionIndex: number) => void;
}

export default function SelfRatingRenderer({
  rating,
  selectedOption,
  onSelect,
}: SelfRatingRendererProps) {
  const dimColor = DIMENSION_COLORS[rating.dimension];

  return (
    <div className="space-y-5">
      {/* Dimension tag */}
      <div className="flex items-center gap-2">
        <span
          className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold font-outfit border"
          style={{
            background: `${dimColor}18`,
            borderColor: `${dimColor}35`,
            color: dimColor,
          }}
        >
          {DIMENSION_LABELS[rating.dimension]}
        </span>
        <span className="text-[11px] text-white/25 font-outfit">Self-assessment</span>
      </div>

      {/* Stem card */}
      <div className="rounded-xl p-5 bg-[rgba(21,26,46,0.7)] backdrop-blur-xl border border-white/[0.06]">
        <p className="text-white/90 font-outfit text-sm leading-relaxed">
          {rating.stem}
        </p>
      </div>

      {/* Options — MCQ style, no letter prefix */}
      <div className="space-y-2.5">
        {rating.options.map((opt, i) => (
          <button
            key={opt.label}
            onClick={() => onSelect(i)}
            className={[
              "w-full text-left rounded-xl p-4 border transition-all duration-200 font-outfit text-sm leading-relaxed",
              selectedOption === i
                ? "border-[#6B5BFF]/60 bg-[#6B5BFF]/10 text-white shadow-[0_0_12px_rgba(107,91,255,0.2)]"
                : "border-white/[0.06] bg-white/[0.02] text-white/70 hover:border-white/20 hover:bg-white/[0.04] hover:text-white",
            ].join(" ")}
          >
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );
}
