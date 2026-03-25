import { createClient } from "@/lib/supabase";
import type { Badge, BadgeId, StreakData } from "@/types";
import type { ScoreProfile } from "@/lib/scoring";
import type { AssessmentDimension } from "@/types";

// ─── Badge definitions ────────────────────────────────────────────────────────

export const allBadges: Badge[] = [
  // Streak
  { id: "first_day",    name: "Day One",          description: "You showed up. That's the hardest part.",                    icon: "🌱", isEarned: false, category: "streak" },
  { id: "week_1",       name: "First Week Done",  description: "Week 1 completed. Momentum established.",                    icon: "✅", isEarned: false, category: "streak" },
  { id: "streak_7",     name: "Week Warrior",     description: "7 consecutive days. Most people don't make it here.",        icon: "🔥", isEarned: false, category: "streak" },
  { id: "streak_30",    name: "Monthly Master",   description: "30 days of consistent PM learning. This changes careers.",   icon: "⚡", isEarned: false, category: "streak" },
  { id: "perfect_week", name: "Perfect Week",     description: "7/7 days completed in a single week.",                       icon: "💎", isEarned: false, category: "streak" },
  { id: "comeback",     name: "The Comeback",     description: "Streak broke. You came back. That's the real skill.",        icon: "🔄", isEarned: false, category: "streak" },

  // Archetype
  { id: "strategist_unlock", name: "Strategist Unlocked", description: "Thinking & Strategy score crossed 7.0.",  icon: "📐", isEarned: false, category: "archetype" },
  { id: "builder_unlock",    name: "Builder Unlocked",    description: "Technical Fluency crossed 7.0.",           icon: "🏗️", isEarned: false, category: "archetype" },
  { id: "advocate_unlock",   name: "Advocate Unlocked",   description: "User & Research crossed 7.0.",             icon: "💬", isEarned: false, category: "archetype" },
  { id: "operator_unlock",   name: "Operator Unlocked",   description: "Execution crossed 7.0.",                   icon: "⚙️", isEarned: false, category: "archetype" },
  { id: "explorer_unlock",   name: "Explorer Unlocked",   description: "All dimensions ≥5.0.",                     icon: "🧭", isEarned: false, category: "archetype" },

  // Mastery
  { id: "dimension_master_ts",   name: "Strategy Master",       description: "All Thinking & Strategy sub-categories at benchmark.", icon: "🎯", isEarned: false, category: "mastery" },
  { id: "dimension_master_exec", name: "Execution Master",      description: "All Execution sub-categories at benchmark.",           icon: "📊", isEarned: false, category: "mastery" },
  { id: "dimension_master_tech", name: "Tech Fluent",           description: "All Technical sub-categories at benchmark.",           icon: "💻", isEarned: false, category: "mastery" },
  { id: "dimension_master_ur",   name: "Research Pro",          description: "All User & Research sub-categories at benchmark.",     icon: "🔍", isEarned: false, category: "mastery" },
  { id: "dimension_master_comm", name: "Communication Expert",  description: "All Communication sub-categories at benchmark.",       icon: "🎤", isEarned: false, category: "mastery" },

  // Milestone
  { id: "halfway",       name: "Halfway There", description: "50% of your active roadmap steps completed.",     icon: "🏔️", isEarned: false, category: "milestone" },
  { id: "all_gaps_closed", name: "Gap Zero",   description: "Every sub-category at or above benchmark.",        icon: "🏆", isEarned: false, category: "milestone" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DIMENSIONS: AssessmentDimension[] = [
  "thinking_strategy",
  "user_research",
  "execution",
  "technical_fluency",
  "communication",
];

const DIMENSION_BADGE_MAP: Record<string, AssessmentDimension> = {
  dimension_master_ts:   "thinking_strategy",
  dimension_master_exec: "execution",
  dimension_master_tech: "technical_fluency",
  dimension_master_ur:   "user_research",
  dimension_master_comm: "communication",
};

function allGapsGreen(profile: ScoreProfile): boolean {
  return profile.gapMap.every((g) => g.status === "green");
}

function dimSubcatsAllAtBenchmark(profile: ScoreProfile, dim: AssessmentDimension): boolean {
  const entries = profile.gapMap.filter((g) => g.dimension === dim);
  if (entries.length === 0) return false;
  return entries.every((g) => g.score >= g.benchmark);
}

function evaluateCondition(
  id: BadgeId,
  profile: ScoreProfile,
  streak: StreakData,
  completionProgress: number
): boolean {
  switch (id) {
    case "first_day":         return streak.totalDaysCompleted >= 1;
    case "week_1":            return streak.totalDaysCompleted >= 7;
    case "streak_7":          return streak.currentStreak >= 7;
    case "streak_30":         return streak.currentStreak >= 30;
    case "perfect_week":      return streak.currentStreak >= 7;
    case "comeback":          return streak.currentStreak >= 1 && streak.totalDaysCompleted > streak.currentStreak;
    case "strategist_unlock": return (profile.dimensionScores?.thinking_strategy ?? 0) >= 7;
    case "builder_unlock":    return (profile.dimensionScores?.technical_fluency ?? 0) >= 7;
    case "advocate_unlock":   return (profile.dimensionScores?.user_research ?? 0) >= 7;
    case "operator_unlock":   return (profile.dimensionScores?.execution ?? 0) >= 7;
    case "explorer_unlock":   return DIMENSIONS.every((d) => (profile.dimensionScores?.[d] ?? 0) >= 5);
    case "dimension_master_ts":   return dimSubcatsAllAtBenchmark(profile, "thinking_strategy");
    case "dimension_master_exec": return dimSubcatsAllAtBenchmark(profile, "execution");
    case "dimension_master_tech": return dimSubcatsAllAtBenchmark(profile, "technical_fluency");
    case "dimension_master_ur":   return dimSubcatsAllAtBenchmark(profile, "user_research");
    case "dimension_master_comm": return dimSubcatsAllAtBenchmark(profile, "communication");
    case "halfway":           return completionProgress >= 50;
    case "all_gaps_closed":   return completionProgress >= 100 || allGapsGreen(profile);
    default:                  return false;
  }
}

// ─── checkAndAwardBadges ──────────────────────────────────────────────────────

export async function checkAndAwardBadges(
  userId: string,
  profile: ScoreProfile,
  streak: StreakData,
  completionProgress: number
): Promise<Badge[]> {
  const supabase = createClient();

  try {
    const { data: existing } = await supabase
      .from("user_badges")
      .select("badge_id, earned_at")
      .eq("user_id", userId);

    const alreadyEarned = new Set((existing ?? []).map((r: { badge_id: string }) => r.badge_id));

    const newlyEarned: Badge[] = [];
    const now = new Date().toISOString();

    for (const badge of allBadges) {
      if (alreadyEarned.has(badge.id)) continue;
      if (evaluateCondition(badge.id, profile, streak, completionProgress)) {
        newlyEarned.push({ ...badge, isEarned: true, earnedAt: now });
      }
    }

    if (newlyEarned.length > 0) {
      const rows = newlyEarned.map((b) => ({
        user_id: userId,
        badge_id: b.id,
        earned_at: now,
      }));
      await supabase.from("user_badges").insert(rows);
    }

    return newlyEarned;
  } catch {
    return [];
  }
}

// ─── getUserBadges ────────────────────────────────────────────────────────────

export async function getUserBadges(userId: string): Promise<Badge[]> {
  const supabase = createClient();

  try {
    const { data } = await supabase
      .from("user_badges")
      .select("badge_id, earned_at")
      .eq("user_id", userId);

    const earnedMap = new Map<string, string>();
    for (const row of (data ?? []) as { badge_id: string; earned_at: string }[]) {
      earnedMap.set(row.badge_id, row.earned_at);
    }

    return allBadges.map((badge) => {
      const earnedAt = earnedMap.get(badge.id);
      if (earnedAt) {
        return { ...badge, isEarned: true, earnedAt };
      }
      return { ...badge };
    });
  } catch {
    return allBadges.map((b) => ({ ...b }));
  }
}

// ─── getBadgeProgress ─────────────────────────────────────────────────────────

export function getBadgeProgress(
  badge: Badge,
  profile: ScoreProfile,
  streak: StreakData,
  completionProgress: number
): number {
  if (badge.isEarned) return 100;

  const dimScore = (dim: AssessmentDimension): number =>
    profile.dimensionScores?.[dim] ?? 0;

  const subcatProgress = (dim: AssessmentDimension): number => {
    const entries = profile.gapMap.filter((g) => g.dimension === dim);
    if (entries.length === 0) return 0;
    const atBenchmark = entries.filter((g) => g.score >= g.benchmark).length;
    return Math.round((atBenchmark / entries.length) * 100);
  };

  switch (badge.id) {
    case "first_day":
      return streak.totalDaysCompleted >= 1 ? 100 : 0;

    case "week_1":
      return Math.min(100, Math.round((streak.totalDaysCompleted / 7) * 100));

    case "streak_7":
      return Math.min(100, Math.round((streak.currentStreak / 7) * 100));

    case "streak_30":
      return Math.min(100, Math.round((streak.currentStreak / 30) * 100));

    case "perfect_week":
      return streak.currentStreak >= 7
        ? 100
        : Math.min(100, Math.round((streak.currentStreak / 7) * 100));

    case "comeback":
      return streak.totalDaysCompleted > streak.currentStreak ? 100 : 0;

    case "strategist_unlock":
      return Math.min(100, Math.round((dimScore("thinking_strategy") / 7) * 100));

    case "builder_unlock":
      return Math.min(100, Math.round((dimScore("technical_fluency") / 7) * 100));

    case "advocate_unlock":
      return Math.min(100, Math.round((dimScore("user_research") / 7) * 100));

    case "operator_unlock":
      return Math.min(100, Math.round((dimScore("execution") / 7) * 100));

    case "explorer_unlock": {
      const minPct = Math.min(
        ...DIMENSIONS.map((d) => Math.min(100, Math.round((dimScore(d) / 5) * 100)))
      );
      return minPct;
    }

    case "dimension_master_ts":
      return subcatProgress("thinking_strategy");

    case "dimension_master_exec":
      return subcatProgress("execution");

    case "dimension_master_tech":
      return subcatProgress("technical_fluency");

    case "dimension_master_ur":
      return subcatProgress("user_research");

    case "dimension_master_comm":
      return subcatProgress("communication");

    case "halfway":
      return Math.min(100, Math.round(completionProgress * 2));

    case "all_gaps_closed":
      return Math.round(Math.min(100, completionProgress));

    default:
      return 0;
  }
}

// Suppress unused variable warning for DIMENSION_BADGE_MAP
void DIMENSION_BADGE_MAP;
