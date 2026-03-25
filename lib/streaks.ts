import { createClient } from "@/lib/supabase";
import type { StreakData, BadgeId } from "@/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toISODate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function today(): string {
  return toISODate(new Date());
}

function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return toISODate(d);
}

function twoDaysAgo(): string {
  const d = new Date();
  d.setDate(d.getDate() - 2);
  return toISODate(d);
}

function isMonday(): boolean {
  return new Date().getDay() === 1;
}

function rowToStreakData(row: Record<string, unknown>): StreakData {
  return {
    currentStreak: (row.current_streak as number) ?? 0,
    longestStreak: (row.longest_streak as number) ?? 0,
    lastCompletedDate: (row.last_completed_date as string) ?? "",
    totalDaysCompleted: (row.total_days_completed as number) ?? 0,
    streakFreezeAvailable: !((row.streak_freeze_used_this_week as boolean) ?? false),
    streakFreezeUsedThisWeek: (row.streak_freeze_used_this_week as boolean) ?? false,
  };
}

const defaultStreakData: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastCompletedDate: "",
  totalDaysCompleted: 0,
  streakFreezeAvailable: true,
  streakFreezeUsedThisWeek: false,
};

// ─── recordDayCompletion ──────────────────────────────────────────────────────

export async function recordDayCompletion(userId: string): Promise<StreakData> {
  const supabase = createClient();
  const todayStr = today();

  try {
    const { data: existing } = await supabase
      .from("user_streaks")
      .select("*")
      .eq("user_id", userId)
      .single();

    // No existing row → fresh insert
    if (!existing) {
      const newRow = {
        user_id: userId,
        current_streak: 1,
        longest_streak: 1,
        last_completed_date: todayStr,
        total_days_completed: 1,
        streak_freeze_used_this_week: false,
        updated_at: new Date().toISOString(),
      };
      await supabase.from("user_streaks").insert(newRow);
      return {
        currentStreak: 1,
        longestStreak: 1,
        lastCompletedDate: todayStr,
        totalDaysCompleted: 1,
        streakFreezeAvailable: true,
        streakFreezeUsedThisWeek: false,
      };
    }

    // Already completed today
    if (existing.last_completed_date === todayStr) {
      return rowToStreakData(existing);
    }

    let currentStreak: number = existing.current_streak ?? 0;
    let streakFreezeUsedThisWeek: boolean = existing.streak_freeze_used_this_week ?? false;
    const lastDate: string = existing.last_completed_date ?? "";

    if (lastDate === yesterday()) {
      // Consecutive day
      currentStreak = currentStreak + 1;
    } else if (lastDate === twoDaysAgo() && !streakFreezeUsedThisWeek) {
      // Gap of one day — use freeze
      currentStreak = currentStreak + 1;
      streakFreezeUsedThisWeek = true;
    } else {
      // Streak broken
      currentStreak = 1;
    }

    const longestStreak: number = Math.max(existing.longest_streak ?? 0, currentStreak);
    const totalDaysCompleted: number = (existing.total_days_completed ?? 0) + 1;

    // Reset freeze on Monday
    if (isMonday()) {
      streakFreezeUsedThisWeek = false;
    }

    const updatedRow = {
      user_id: userId,
      current_streak: currentStreak,
      longest_streak: longestStreak,
      last_completed_date: todayStr,
      total_days_completed: totalDaysCompleted,
      streak_freeze_used_this_week: streakFreezeUsedThisWeek,
      updated_at: new Date().toISOString(),
    };

    await supabase.from("user_streaks").upsert(updatedRow, { onConflict: "user_id" });

    return {
      currentStreak,
      longestStreak,
      lastCompletedDate: todayStr,
      totalDaysCompleted,
      streakFreezeAvailable: !streakFreezeUsedThisWeek,
      streakFreezeUsedThisWeek,
    };
  } catch {
    return defaultStreakData;
  }
}

// ─── getStreakData ─────────────────────────────────────────────────────────────

export async function getStreakData(userId: string): Promise<StreakData> {
  const supabase = createClient();

  try {
    const { data } = await supabase
      .from("user_streaks")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!data) return defaultStreakData;
    return rowToStreakData(data);
  } catch {
    return defaultStreakData;
  }
}

// ─── useStreakFreeze ───────────────────────────────────────────────────────────

export async function useStreakFreeze(userId: string): Promise<boolean> {
  const supabase = createClient();

  try {
    const { data } = await supabase
      .from("user_streaks")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!data) return false;
    if (data.streak_freeze_used_this_week) return false;

    await supabase
      .from("user_streaks")
      .update({ streak_freeze_used_this_week: true, updated_at: new Date().toISOString() })
      .eq("user_id", userId);

    return true;
  } catch {
    return false;
  }
}

// ─── getStreakMessage ──────────────────────────────────────────────────────────

export function getStreakMessage(streak: StreakData): string {
  const n = streak.currentStreak;

  if (n === 0) return "Start your streak today";
  if (n <= 2) return "You're building momentum. Keep going.";
  if (n <= 6) return `${n} days strong. Most people drop off at day 3 — you didn't.`;
  if (n <= 13) return `🔥 ${n}-day streak! You're in the top 20% of committed learners.`;
  if (n <= 29) return `🔥🔥 ${n} days. This kind of consistency changes careers.`;
  return `🔥🔥🔥 ${n}-day streak. You're in rare territory. PMs who do this get hired.`;
}

// ─── checkStreakBadges ─────────────────────────────────────────────────────────

export function checkStreakBadges(streak: StreakData): BadgeId[] {
  const earned: BadgeId[] = [];

  if (streak.totalDaysCompleted >= 1) earned.push("first_day");
  if (streak.currentStreak >= 7) earned.push("streak_7");
  if (streak.currentStreak >= 30) earned.push("streak_30");

  return earned;
}
