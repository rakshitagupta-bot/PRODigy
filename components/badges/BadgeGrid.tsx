"use client";

import type { Badge, StreakData } from "@/types";
import type { ScoreProfile } from "@/lib/scoring";
import { allBadges, getBadgeProgress } from "@/lib/badges";
import BadgeCard from "@/components/badges/BadgeCard";

// ─── Props ────────────────────────────────────────────────────────────────────

interface BadgeGridProps {
  badges: Badge[];
  profile?: ScoreProfile;
  streak?: StreakData;
  completionProgress?: number;
}

// ─── Types ────────────────────────────────────────────────────────────────────

type BadgeCategory = "streak" | "archetype" | "mastery" | "milestone";

const CATEGORY_LABELS: Record<BadgeCategory, string> = {
  streak:    "Streak",
  archetype: "Archetype",
  mastery:   "Mastery",
  milestone: "Milestone",
};

const CATEGORY_ORDER: BadgeCategory[] = ["streak", "archetype", "mastery", "milestone"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sortBadges(
  badges: Badge[],
  profile: ScoreProfile | undefined,
  streak: StreakData | undefined,
  completionProgress: number
): Badge[] {
  const defaultStreak: StreakData = {
    currentStreak: 0,
    longestStreak: 0,
    lastCompletedDate: "",
    totalDaysCompleted: 0,
    streakFreezeAvailable: true,
    streakFreezeUsedThisWeek: false,
  };

  const emptyProfile: ScoreProfile = {
    subcategoryScores: {},
    dimensionScores: {} as ScoreProfile["dimensionScores"],
    overallReadiness: 0,
    archetype: "explorer",
    roleType: "",
    gapMap: [],
    reportDimensionScores: {} as ScoreProfile["reportDimensionScores"],
  };

  return [...badges].sort((a, b) => {
    const getTier = (badge: Badge): number => {
      if (badge.isEarned) return 0;
      const p = getBadgeProgress(
        badge,
        profile ?? emptyProfile,
        streak ?? defaultStreak,
        completionProgress
      );
      if (p > 75) return 1;
      return 2;
    };
    return getTier(a) - getTier(b);
  });
}

// ─── BadgeGrid ────────────────────────────────────────────────────────────────

export default function BadgeGrid({
  badges,
  profile,
  streak,
  completionProgress = 0,
}: BadgeGridProps) {
  const totalEarned = badges.filter((b) => b.isEarned).length;

  // Merge passed badges with allBadges to ensure all 18 are present
  const badgeMap = new Map<string, Badge>();
  for (const b of allBadges) badgeMap.set(b.id, { ...b });
  for (const b of badges) badgeMap.set(b.id, b);
  const allMerged = Array.from(badgeMap.values());

  return (
    <div className="flex flex-col gap-6" style={{ fontFamily: "Outfit, sans-serif" }}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-outfit" style={{ color: "rgba(255,255,255,0.5)" }}>
          {totalEarned} of 18 badges earned
        </span>

        {/* Ultimate goal banner */}
        <span
          className="text-xs px-3 py-1 rounded-full"
          style={{
            background: "linear-gradient(135deg, rgba(74,108,247,0.12), rgba(139,92,246,0.12))",
            border: "1px solid rgba(107,91,255,0.35)",
            color: "rgba(139,92,246,0.9)",
          }}
        >
          Collect all 5 archetype badges to unlock your PM identity
        </span>
      </div>

      {/* Category sections */}
      {CATEGORY_ORDER.map((category) => {
        const sectionBadges = allMerged.filter((b) => b.category === category);
        const earnedInSection = sectionBadges.filter((b) => b.isEarned).length;
        const sorted = sortBadges(sectionBadges, profile, streak, completionProgress);

        return (
          <div key={category} className="flex flex-col gap-3">
            {/* Section header */}
            <div className="flex items-center gap-2">
              <span
                className="text-xs uppercase tracking-widest"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                {CATEGORY_LABELS[category]}
              </span>
              <span
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.25)" }}
              >
                {earnedInSection}/{sectionBadges.length}
              </span>
            </div>

            {/* Badge grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {sorted.map((badge) => (
                <BadgeCard
                  key={badge.id}
                  badge={badge}
                  profile={profile}
                  streak={streak}
                  completionProgress={completionProgress}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
