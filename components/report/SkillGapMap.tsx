"use client";

import { useState } from "react";
import type { AssessmentDimension } from "@/types";
import type { GapEntry } from "@/lib/scoring";
import { DIMENSION_LABELS, DIMENSION_COLORS } from "@/lib/scoring";

const DIM_ORDER: AssessmentDimension[] = [
  "thinking_strategy",
  "user_research",
  "execution",
  "communication",
  "technical_fluency",
];

interface SkillGapMapProps {
  gapMap: GapEntry[];
}

function SubcatRow({ entry }: { entry: GapEntry }) {
  const statusColor =
    entry.status === "green"
      ? "#22c55e"
      : entry.status === "amber"
      ? "#f59e0b"
      : "#ef4444";
  const statusLabel =
    entry.status === "green" ? "Strength" : entry.status === "amber" ? "Develop" : "Focus";

  const pct = Math.min(entry.score / 10, 1) * 100;
  const benchPct = Math.min(entry.benchmark / 10, 1) * 100;

  return (
    <div className="flex items-center gap-3 py-2">
      {/* Name + status */}
      <div className="w-[200px] flex-shrink-0 flex items-center gap-2">
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: statusColor }}
        />
        <span className="text-xs text-white/60 font-outfit capitalize leading-tight">
          {entry.subcategory.replace(/_/g, " ")}
        </span>
      </div>

      {/* Bar */}
      <div className="flex-1 relative h-1.5 rounded-full bg-white/[0.06]">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: statusColor }}
        />
        {/* Benchmark tick */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-[2px] h-3 rounded-full bg-white/25"
          style={{ left: `${benchPct}%` }}
        />
      </div>

      {/* Score + status */}
      <div className="flex items-center gap-2 flex-shrink-0 w-[90px] justify-end">
        <span className="text-[11px] text-white/40 font-outfit">
          {entry.score.toFixed(1)}/10
        </span>
        <span
          className="text-[10px] font-semibold font-outfit px-1.5 py-0.5 rounded"
          style={{ background: `${statusColor}18`, color: statusColor }}
        >
          {statusLabel}
        </span>
      </div>
    </div>
  );
}

export default function SkillGapMap({ gapMap }: SkillGapMapProps) {
  const [openDims, setOpenDims] = useState<Set<AssessmentDimension>>(
    new Set([DIM_ORDER[0]])
  );

  function toggle(dim: AssessmentDimension) {
    setOpenDims((prev) => {
      const next = new Set(prev);
      if (next.has(dim)) next.delete(dim);
      else next.add(dim);
      return next;
    });
  }

  return (
    <div className="space-y-2">
      {DIM_ORDER.map((dim) => {
        // Show strengths first → develop → focus (positive framing)
        const STATUS_ORDER = { green: 0, amber: 1, red: 2 };
        const entries = gapMap
          .filter((e) => e.dimension === dim)
          .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
        if (entries.length === 0) return null;

        const isOpen = openDims.has(dim);
        const color = DIMENSION_COLORS[dim];

        // Count statuses
        const reds = entries.filter((e) => e.status === "red").length;
        const ambers = entries.filter((e) => e.status === "amber").length;
        const greens = entries.filter((e) => e.status === "green").length;

        return (
          <div
            key={dim}
            className="rounded-xl overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.06)" }}
          >
            {/* Header */}
            <button
              onClick={() => toggle(dim)}
              className="w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-white/[0.02]"
              style={{ background: "rgba(21,26,46,0.6)" }}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: color }}
                />
                <span className="text-sm font-semibold text-white/80 font-outfit">
                  {DIMENSION_LABELS[dim]}
                </span>
                <span className="text-xs text-white/25 font-outfit">
                  {entries.length} skill{entries.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Status summary dots */}
                <div className="flex items-center gap-1.5 text-[10px] font-outfit">
                  {reds > 0 && (
                    <span className="text-[#ef4444]">{reds} focus</span>
                  )}
                  {ambers > 0 && (
                    <span className="text-[#f59e0b]">{ambers} develop</span>
                  )}
                  {greens > 0 && (
                    <span className="text-[#22c55e]">{greens} strong</span>
                  )}
                </div>

                {/* Chevron */}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="text-white/30 transition-transform duration-200"
                  style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                >
                  <path
                    d="M3 5l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </button>

            {/* Rows */}
            {isOpen && (
              <div className="px-4 pb-2 divide-y divide-white/[0.04]">
                {entries.map((entry) => (
                  <SubcatRow key={entry.subcategory} entry={entry} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
