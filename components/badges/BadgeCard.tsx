"use client";

import { motion } from "framer-motion";
import type { Badge, StreakData } from "@/types";
import type { ScoreProfile } from "@/lib/scoring";
import { getBadgeProgress } from "@/lib/badges";

// ─── Props ────────────────────────────────────────────────────────────────────

interface BadgeCardProps {
  badge: Badge;
  profile?: ScoreProfile;
  streak?: StreakData;
  completionProgress?: number;
}

// ─── SVG Progress Ring ────────────────────────────────────────────────────────

function ProgressRing({ progress }: { progress: number }) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  const ringId = `ring-gradient-${Math.random().toString(36).slice(2, 7)}`;

  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      className="absolute inset-0 m-auto"
      style={{ top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <defs>
        <linearGradient id={ringId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4A6CF7" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      {/* Track */}
      <circle
        cx="40"
        cy="40"
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="3"
      />
      {/* Progress */}
      <circle
        cx="40"
        cy="40"
        r={radius}
        fill="none"
        stroke={`url(#${ringId})`}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 40 40)"
      />
    </svg>
  );
}

// ─── BadgeCard ────────────────────────────────────────────────────────────────

export default function BadgeCard({
  badge,
  profile,
  streak,
  completionProgress = 0,
}: BadgeCardProps) {
  const defaultStreak: StreakData = {
    currentStreak: 0,
    longestStreak: 0,
    lastCompletedDate: "",
    totalDaysCompleted: 0,
    streakFreezeAvailable: true,
    streakFreezeUsedThisWeek: false,
  };

  const progress =
    profile && streak
      ? getBadgeProgress(badge, profile, streak, completionProgress)
      : badge.isEarned
      ? 100
      : getBadgeProgress(
          badge,
          { subcategoryScores: {}, dimensionScores: {} as ScoreProfile["dimensionScores"], overallReadiness: 0, archetype: "explorer", roleType: "", gapMap: [], reportDimensionScores: {} as ScoreProfile["reportDimensionScores"] },
          streak ?? defaultStreak,
          completionProgress
        );

  const isAlmostEarned = !badge.isEarned && progress > 75;

  // Format earned date
  const earnedDateLabel = badge.earnedAt
    ? `Earned ${new Date(badge.earnedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
    : null;

  // ── EARNED ────────────────────────────────────────────────────────────────
  if (badge.isEarned) {
    return (
      <div
        className="relative w-full rounded-2xl p-4 flex flex-col items-center gap-2 text-center"
        style={{
          minHeight: "120px",
          background: "linear-gradient(135deg, rgba(74,108,247,0.08), rgba(139,92,246,0.08))",
          border: "1px solid rgba(107,91,255,0.3)",
        }}
      >
        {/* Glow blob behind icon */}
        <div
          className="relative flex items-center justify-center"
          style={{
            width: 56,
            height: 56,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              boxShadow: "0 0 24px 8px rgba(107,91,255,0.35)",
            }}
          />
          <span className="text-4xl relative z-10">{badge.icon}</span>
        </div>

        <span
          className="font-semibold text-sm text-white"
          style={{ fontFamily: "Outfit, sans-serif" }}
        >
          {badge.name}
        </span>

        {earnedDateLabel && (
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            {earnedDateLabel}
          </span>
        )}
      </div>
    );
  }

  // ── ALMOST EARNED ─────────────────────────────────────────────────────────
  if (isAlmostEarned) {
    return (
      <div
        className="relative w-full rounded-2xl p-4 flex flex-col items-center gap-2 text-center"
        style={{
          minHeight: "120px",
          background: "rgba(21,26,46,0.85)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Icon + progress ring */}
        <div className="relative flex items-center justify-center" style={{ width: 80, height: 80 }}>
          <ProgressRing progress={progress} />
          <motion.span
            className="text-4xl relative z-10"
            style={{ opacity: 0.7 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {badge.icon}
          </motion.span>
        </div>

        <span
          className="font-semibold text-sm"
          style={{ color: "rgba(255,255,255,0.7)", fontFamily: "Outfit, sans-serif" }}
        >
          {badge.name}
        </span>

        <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
          {progress}% there
        </span>
      </div>
    );
  }

  // ── LOCKED ────────────────────────────────────────────────────────────────
  return (
    <div
      className="relative w-full rounded-2xl p-4 flex flex-col items-center gap-2 text-center"
      style={{
        minHeight: "120px",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <span
        className="text-4xl"
        style={{ opacity: 0.35, filter: "grayscale(100%)" }}
      >
        {badge.icon}
      </span>

      <span
        className="font-semibold text-sm"
        style={{ color: "rgba(255,255,255,0.35)", fontFamily: "Outfit, sans-serif" }}
      >
        {badge.name}
      </span>
    </div>
  );
}
