"use client";

import type { AssessmentQuestion } from "@/types";
import OptionTile from "@/components/ui/OptionTile";
import { DIMENSION_LABELS, DIMENSION_COLORS } from "@/lib/scoring";

interface QuestionRendererProps {
  question: AssessmentQuestion;
  selectedOption?: number; // 0–3
  onSelect: (optionIndex: number) => void;
}

export default function QuestionRenderer({
  question,
  selectedOption,
  onSelect,
}: QuestionRendererProps) {
  const dimColor = DIMENSION_COLORS[question.dimension];

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
          {DIMENSION_LABELS[question.dimension]}
        </span>
        <span className="text-[11px] text-white/25 font-outfit">
          Tier {question.tier}
        </span>
      </div>

      {/* Stem card */}
      <div className="rounded-xl p-5 bg-[rgba(21,26,46,0.7)] backdrop-blur-xl border border-white/[0.06]">
        <p className="text-white/90 font-outfit text-sm leading-relaxed">
          {question.stem}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-2.5">
        {question.options.map((opt, i) => (
          <OptionTile
            key={opt.label}
            id={String(i)}
            text={opt.text}
            selected={selectedOption === i}
            onSelect={(id) => onSelect(parseInt(id, 10))}
            letter={opt.label}
          />
        ))}
      </div>
    </div>
  );
}
