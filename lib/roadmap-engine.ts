import type { GapEntry } from "@/lib/scoring";
import type { ArchetypeKey, AssessmentDimension } from "@/types";
import { roadmapContent } from "@/lib/content";
import { DIMENSION_LABELS, DIMENSION_COLORS } from "@/lib/scoring";

// ─── Types ───────────────────────────────────────────────────────────────────

export type GoalDays = 30 | 90 | 180;

export interface DayTask {
  dayNumber:      number;
  weekNumber:     number;               // 1–4
  dimension:      AssessmentDimension;
  dimensionLabel: string;
  dimensionColor: string;
  taskType:       "article" | "video" | "exercise" | "reflect";
  title:          string;
  url?:           string;
  estimatedMinutes: number;
}

// ─── Which dimension each archetype week primarily targets ───────────────────

const WEEK_DIM: Record<ArchetypeKey, AssessmentDimension[]> = {
  builder:    ["thinking_strategy", "communication",    "user_research",    "execution"],
  strategist: ["thinking_strategy", "technical_fluency","thinking_strategy","execution"],
  advocate:   ["execution",         "thinking_strategy","execution",        "user_research"],
  operator:   ["thinking_strategy", "user_research",    "technical_fluency","execution"],
  explorer:   ["execution",         "execution",        "communication",    "thinking_strategy"],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Sort week indices (0–3) worst-gap-first, so the plan front-loads weak areas. */
function weekOrder(archetype: ArchetypeKey, gapMap: GapEntry[]): number[] {
  const dimAvg: Record<AssessmentDimension, number> = {} as Record<AssessmentDimension, number>;

  WEEK_DIM[archetype].forEach((dim) => {
    const entries = gapMap.filter((e) => e.dimension === dim);
    dimAvg[dim] = entries.length
      ? entries.reduce((s, e) => s + e.score, 0) / entries.length
      : 5;
  });

  return [0, 1, 2, 3].sort(
    (a, b) => dimAvg[WEEK_DIM[archetype][a]] - dimAvg[WEEK_DIM[archetype][b]]
  );
}

/** Expand one content week into 7 DayTask entries. */
function expandWeek(
  weekContentIndex: number,
  archetype: ArchetypeKey,
  calendarWeek: number          // 1-indexed week within the overall plan
): Omit<DayTask, "dayNumber">[] {
  const content = roadmapContent[archetype];
  const week    = content.weeks[weekContentIndex];
  if (!week) return [];

  const dim      = WEEK_DIM[archetype][weekContentIndex];
  const dimLabel = DIMENSION_LABELS[dim];
  const dimColor = DIMENSION_COLORS[dim];

  const tasks: Omit<DayTask, "dayNumber">[] = [];

  // Slot 1 — first resource (or exercise 1 if no resources)
  if (week.resources[0]) {
    tasks.push({
      weekNumber:       calendarWeek,
      dimension:        dim,
      dimensionLabel:   dimLabel,
      dimensionColor:   dimColor,
      taskType:         week.resources[0].type === "video" ? "video" : "article",
      title:            week.resources[0].title,
      url:              week.resources[0].url,
      estimatedMinutes: week.resources[0].type === "video" ? 20 : 15,
    });
  }

  // Slot 2 — exercise 1
  if (week.objectives[0]) {
    tasks.push({
      weekNumber:       calendarWeek,
      dimension:        dim,
      dimensionLabel:   dimLabel,
      dimensionColor:   dimColor,
      taskType:         "exercise",
      title:            week.objectives[0],
      estimatedMinutes: 30,
    });
  }

  // Slot 3 — second resource (or exercise 2 if none)
  if (week.resources[1]) {
    tasks.push({
      weekNumber:       calendarWeek,
      dimension:        dim,
      dimensionLabel:   dimLabel,
      dimensionColor:   dimColor,
      taskType:         week.resources[1].type === "video" ? "video" : "article",
      title:            week.resources[1].title,
      url:              week.resources[1].url,
      estimatedMinutes: week.resources[1].type === "video" ? 20 : 15,
    });
  } else if (week.objectives[1]) {
    tasks.push({
      weekNumber:       calendarWeek,
      dimension:        dim,
      dimensionLabel:   dimLabel,
      dimensionColor:   dimColor,
      taskType:         "exercise",
      title:            week.objectives[1],
      estimatedMinutes: 30,
    });
  }

  // Slot 4 — exercise 2 (if not used in slot 3)
  if (week.resources[1] && week.objectives[1]) {
    tasks.push({
      weekNumber:       calendarWeek,
      dimension:        dim,
      dimensionLabel:   dimLabel,
      dimensionColor:   dimColor,
      taskType:         "exercise",
      title:            week.objectives[1],
      estimatedMinutes: 30,
    });
  }

  // Pad remaining slots up to 6 with a consolidation task, then reflection on day 7
  const consolidationTitle = `Apply: ${week.theme} — review what you practised this week`;
  while (tasks.length < 6) {
    tasks.push({
      weekNumber:       calendarWeek,
      dimension:        dim,
      dimensionLabel:   dimLabel,
      dimensionColor:   dimColor,
      taskType:         "exercise",
      title:            consolidationTitle,
      estimatedMinutes: 20,
    });
  }

  // Day 7 = reflection
  tasks.push({
    weekNumber:       calendarWeek,
    dimension:        dim,
    dimensionLabel:   dimLabel,
    dimensionColor:   dimColor,
    taskType:         "reflect",
    title:            `Reflect on ${week.theme}: what clicked, what felt unclear?`,
    estimatedMinutes: 10,
  });

  return tasks.slice(0, 7); // exactly 7 days
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Generate a full daily plan ordered by gap severity.
 * 30 days → 1 cycle (28 days + 2 bonus)
 * 90 days → 3 cycles
 * 180 days → 6 cycles
 */
export function buildDailyPlan(
  gapMap:    GapEntry[],
  archetype: ArchetypeKey,
  goalDays:  GoalDays
): DayTask[] {
  const order     = weekOrder(archetype, gapMap);
  const cycles    = goalDays === 30 ? 1 : goalDays === 90 ? 3 : 6;
  const allTasks: DayTask[] = [];

  for (let cycle = 0; cycle < cycles; cycle++) {
    order.forEach((contentWeekIdx, position) => {
      const calendarWeek = cycle * 4 + position + 1;
      const dayTasks     = expandWeek(contentWeekIdx, archetype, calendarWeek);
      dayTasks.forEach((t) => {
        allTasks.push({ ...t, dayNumber: allTasks.length + 1 });
      });
    });
  }

  // Trim or extend to exact goalDays
  while (allTasks.length < goalDays) {
    const last = allTasks[allTasks.length - 1];
    allTasks.push({
      ...last,
      dayNumber:  allTasks.length + 1,
      taskType:   "reflect",
      title:      "Review your progress and journal one thing you improved this week",
      estimatedMinutes: 10,
    });
  }

  return allTasks.slice(0, goalDays);
}

/**
 * Given a goal start date (ISO string), return the current day number (1-indexed).
 * Returns 1 on day 0, goalDays on the final day. Clamps within range.
 */
export function currentDayNumber(
  goalStartDate: string,
  goalDays: GoalDays
): number {
  const start    = new Date(goalStartDate);
  const today    = new Date();
  const diffDays = Math.floor((today.getTime() - start.getTime()) / 86_400_000);
  return Math.max(1, Math.min(goalDays, diffDays + 1));
}

/**
 * Calculate streak from a Set of completed day numbers and goal start date.
 * Streak = consecutive days ending today that have a completion.
 */
export function calcStreak(
  completedDays: Set<number>,
  goalStartDate: string,
  goalDays: GoalDays
): { current: number; pct: number } {
  const todayDay = currentDayNumber(goalStartDate, goalDays);
  let streak = 0;

  for (let d = todayDay; d >= 1; d--) {
    if (completedDays.has(d)) streak++;
    else break;
  }

  return {
    current: streak,
    pct:     Math.round((completedDays.size / goalDays) * 100),
  };
}
