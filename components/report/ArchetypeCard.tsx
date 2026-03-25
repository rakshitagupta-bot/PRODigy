"use client";

import type { Archetype } from "@/types";
import Chip from "@/components/ui/Chip";

interface ArchetypeCardProps {
  archetype: Archetype;
}

export default function ArchetypeCard({ archetype }: ArchetypeCardProps) {
  return (
    <div
      className="rounded-2xl p-7 space-y-5"
      style={{
        background: `linear-gradient(135deg, ${archetype.color}16 0%, rgba(21,26,46,0.9) 60%)`,
        border: `1px solid ${archetype.color}28`,
      }}
    >
      {/* Icon + label */}
      <div className="flex items-center gap-2">
        <span className="text-3xl">{archetype.icon}</span>
        <span className="text-xs font-semibold text-white/35 font-outfit uppercase tracking-widest">
          Your Archetype
        </span>
      </div>

      {/* Name */}
      <div className="space-y-1.5">
        <h2
          className="font-serif leading-tight"
          style={{
            fontSize: 48,
            background: `linear-gradient(135deg, ${archetype.color}, #ffffff)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {archetype.name}
        </h2>
        <p className="text-white/45 text-sm font-outfit italic leading-relaxed">
          &ldquo;{archetype.tagline}&rdquo;
        </p>
      </div>

      {/* Description */}
      <p className="text-white/65 text-sm font-outfit leading-relaxed">
        {archetype.description}
      </p>

      {/* Core strengths */}
      <div className="space-y-2">
        <p className="text-[10px] font-semibold text-white/30 font-outfit uppercase tracking-widest">
          Core Strengths
        </p>
        <div className="flex flex-wrap gap-2">
          {archetype.strengths.map((s) => (
            <Chip key={s} variant="accent">{s}</Chip>
          ))}
        </div>
      </div>

      {/* Target roles */}
      <div className="space-y-2">
        <p className="text-[10px] font-semibold text-white/30 font-outfit uppercase tracking-widest">
          Role Fit
        </p>
        <div className="flex flex-wrap gap-2">
          {archetype.targetRoles.map((r) => (
            <Chip key={r} variant="subtle">{r}</Chip>
          ))}
        </div>
      </div>

      {/* Target companies */}
      <div className="space-y-2">
        <p className="text-[10px] font-semibold text-white/30 font-outfit uppercase tracking-widest">
          Where You&apos;d Thrive
        </p>
        <div className="flex flex-wrap gap-2">
          {archetype.targetCompanies.map((c) => (
            <span
              key={c}
              className="text-xs font-outfit px-3 py-1.5 rounded-lg text-white/50"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
