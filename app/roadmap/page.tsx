"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FileText, Play, PenLine, Sparkles, Flame, BarChart2, Map, LayoutDashboard, PartyPopper } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ScoreProfile } from "@/lib/scoring";
import { DIMENSION_COLORS, DIMENSION_LABELS } from "@/lib/scoring";
import type { AssessmentDimension } from "@/types";
import {
  buildDailyPlan,
  currentDayNumber,
  calcStreak,
  type GoalDays,
  type DayTask,
} from "@/lib/roadmap-engine";

// ─── Constants ────────────────────────────────────────────────────────────────

const GOAL_OPTIONS: { days: GoalDays; label: string; sub: string }[] = [
  { days: 30,  label: "30 days",  sub: "Fast-track — 1 focused task/day" },
  { days: 90,  label: "3 months", sub: "Standard — build real habits" },
  { days: 180, label: "6 months", sub: "Deep mastery — interview-ready" },
];

const TASK_ICONS: Record<DayTask["taskType"], React.ReactNode> = {
  article:  <FileText size={14} strokeWidth={1.8} />,
  video:    <Play size={14} strokeWidth={1.8} />,
  exercise: <PenLine size={14} strokeWidth={1.8} />,
  reflect:  <Sparkles size={14} strokeWidth={1.8} />,
};

const TASK_LABELS: Record<DayTask["taskType"], string> = {
  article:  "Read",
  video:    "Watch",
  exercise: "Practice",
  reflect:  "Reflect",
};

// ─── Bottom nav (shared with report) ─────────────────────────────────────────

function BottomNav() {
  const router   = useRouter();
  const pathname = usePathname();

  const links = [
    { label: "Report",    href: "/report",    icon: <BarChart2 size={20} strokeWidth={1.6} /> },
    { label: "Roadmap",   href: "/roadmap",   icon: <Map size={20} strokeWidth={1.6} /> },
    { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={20} strokeWidth={1.6} /> },
  ];

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-6 py-3"
      style={{
        background:   "rgba(11,14,26,0.92)",
        borderTop:    "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(16px)",
      }}
    >
      {links.map(({ label, href, icon }) => {
        const active = pathname === href;
        return (
          <button
            key={href}
            onClick={() => router.push(href)}
            className="flex flex-col items-center gap-1 px-4 py-1 transition-colors"
            style={{ color: active ? "#6B5BFF" : "rgba(255,255,255,0.3)" }}
          >
            {icon}
            <span className="text-[10px] font-outfit font-medium">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Goal selector screen ─────────────────────────────────────────────────────

function GoalSelector({
  onSelect,
}: {
  onSelect: (days: GoalDays) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-3"
      >
        <p className="text-xs text-white/35 font-outfit uppercase tracking-widest">
          Your personalised plan is ready
        </p>
        <h1 className="text-2xl font-bold text-white font-outfit">
          How long until your PM interview?
        </h1>
        <p className="text-sm text-white/45 font-outfit max-w-xs mx-auto">
          Pick a goal and we&apos;ll generate a daily task plan matched to your weakest areas.
        </p>
      </motion.div>

      <div className="w-full space-y-3">
        {GOAL_OPTIONS.map(({ days, label, sub }, i) => (
          <motion.button
            key={days}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => onSelect(days)}
            className="w-full text-left rounded-xl px-5 py-4 border transition-all hover:border-[#6B5BFF]/40 hover:bg-white/[0.03]"
            style={{
              background:  "rgba(21,26,46,0.6)",
              borderColor: "rgba(255,255,255,0.08)",
            }}
          >
            <p className="text-sm font-semibold text-white font-outfit">{label}</p>
            <p className="text-xs text-white/40 font-outfit mt-0.5">{sub}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─── Day pill (week strip) ────────────────────────────────────────────────────

function DayPill({
  day,
  isToday,
  isDone,
  isFuture,
}: {
  day: number;
  isToday: boolean;
  isDone: boolean;
  isFuture: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold font-outfit transition-all"
        style={{
          background: isToday
            ? "linear-gradient(135deg, #4A6CF7, #6B5BFF)"
            : isDone
            ? "rgba(74,108,247,0.2)"
            : "rgba(255,255,255,0.04)",
          color: isToday
            ? "#fff"
            : isDone
            ? "#6B5BFF"
            : isFuture
            ? "rgba(255,255,255,0.2)"
            : "rgba(255,255,255,0.5)",
          border: isToday ? "none" : isDone ? "1px solid rgba(107,91,255,0.3)" : "1px solid rgba(255,255,255,0.06)",
          boxShadow: isToday ? "0 0 16px rgba(107,91,255,0.4)" : "none",
        }}
      >
        {isDone && !isToday ? "✓" : day}
      </div>
      {isToday && (
        <span className="text-[9px] font-outfit text-[#6B5BFF] font-semibold uppercase tracking-wider">
          Today
        </span>
      )}
    </div>
  );
}

// ─── Task card ────────────────────────────────────────────────────────────────

function TaskCard({
  task,
  isDone,
  onMarkDone,
}: {
  task: DayTask;
  isDone: boolean;
  onMarkDone: () => void;
}) {
  return (
    <motion.div
      key={task.dayNumber}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl p-px"
      style={{
        background: isDone
          ? "linear-gradient(135deg, rgba(34,197,94,0.3), rgba(34,197,94,0.15))"
          : `linear-gradient(135deg, ${task.dimensionColor}50, rgba(107,91,255,0.3))`,
      }}
    >
      <div
        className="rounded-2xl p-5 space-y-4"
        style={{
          background: "linear-gradient(135deg, rgba(21,26,46,0.97) 0%, rgba(11,14,26,0.98) 100%)",
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-base">{TASK_ICONS[task.taskType]}</span>
              <span
                className="text-[10px] font-semibold font-outfit uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{
                  background: `${task.dimensionColor}18`,
                  color:       task.dimensionColor,
                  border:      `1px solid ${task.dimensionColor}35`,
                }}
              >
                {task.dimensionLabel}
              </span>
              <span className="text-[10px] text-white/30 font-outfit">
                {TASK_LABELS[task.taskType]} · {task.estimatedMinutes} min
              </span>
            </div>
            <p className="text-sm font-semibold text-white font-outfit leading-snug">
              {task.title}
            </p>
          </div>
        </div>

        {/* Link */}
        {task.url && !isDone && (
          <a
            href={task.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-[#6B5BFF] font-outfit hover:text-[#8B7BFF] transition-colors"
          >
            <span>Open resource</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        )}

        {/* CTA */}
        {!isDone ? (
          <button
            onClick={onMarkDone}
            className="w-full py-2.5 rounded-xl text-xs font-semibold font-outfit text-white transition-all hover:scale-[1.01] active:scale-[0.99]"
            style={{
              background: `linear-gradient(135deg, ${task.dimensionColor}cc, #6B5BFF)`,
              boxShadow:  `0 0 20px ${task.dimensionColor}30`,
            }}
          >
            Mark as done ✓
          </button>
        ) : (
          <div className="flex items-center justify-center gap-2 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
            <span className="text-green-400 text-xs font-semibold font-outfit">
              ✓ Completed today
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function RoadmapPage() {
  const router = useRouter();

  const [profile,       setProfile]       = useState<ScoreProfile | null>(null);
  const [goal,          setGoal]          = useState<GoalDays | null>(null);
  const [goalStartDate, setGoalStartDate] = useState<string | null>(null);
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());
  const [plan,          setPlan]          = useState<DayTask[]>([]);
  const [loaded,        setLoaded]        = useState(false);

  // Load from localStorage
  useEffect(() => {
    const raw = localStorage.getItem("prodigy_score");
    if (!raw) {
      router.replace("/report");
      return;
    }

    try {
      const p: ScoreProfile = JSON.parse(raw);
      setProfile(p);

      const savedGoal  = localStorage.getItem("prodigy_goal") as GoalDays | null;
      const savedStart = localStorage.getItem("prodigy_goal_start");
      const savedDone  = localStorage.getItem("prodigy_completions");

      if (savedGoal && savedStart) {
        const g = Number(savedGoal) as GoalDays;
        setGoal(g);
        setGoalStartDate(savedStart);
        setPlan(buildDailyPlan(p.gapMap, p.archetype, g));
      }

      if (savedDone) {
        setCompletedDays(new Set(JSON.parse(savedDone) as number[]));
      }
    } catch {
      router.replace("/report");
      return;
    }

    setLoaded(true);
  }, [router]);

  function handleGoalSelect(days: GoalDays) {
    if (!profile) return;
    const start = new Date().toISOString().split("T")[0];
    setGoal(days);
    setGoalStartDate(start);
    const newPlan = buildDailyPlan(profile.gapMap, profile.archetype, days);
    setPlan(newPlan);
    localStorage.setItem("prodigy_goal",       String(days));
    localStorage.setItem("prodigy_goal_start", start);
  }

  function handleMarkDone(dayNum: number) {
    const next = new Set(completedDays);
    next.add(dayNum);
    setCompletedDays(next);
    localStorage.setItem("prodigy_completions", JSON.stringify(Array.from(next)));
  }

  // ── Derived state ────────────────────────────────────────────────────────────

  const todayDay = goal && goalStartDate
    ? currentDayNumber(goalStartDate, goal)
    : 1;

  const { current: streak, pct: progressPct } = (goal && goalStartDate)
    ? calcStreak(completedDays, goalStartDate, goal)
    : { current: 0, pct: 0 };

  const todayTask = plan[todayDay - 1] ?? null;

  // Week strip: show 7 days centred around today
  const weekStart = Math.max(1, todayDay - 3);
  const weekDays  = Array.from({ length: 7 }, (_, i) => weekStart + i).filter(
    (d) => d <= (goal ?? 30)
  );

  // Dimension weakness summary (top 3 red → amber)
  const focusDims: AssessmentDimension[] = profile
    ? (Array.from(new Set(
        profile.gapMap
          .sort((a, b) => a.score - b.score)
          .map((e) => e.dimension)
      )) as AssessmentDimension[]).slice(0, 3)
    : [];

  // ── Loading ──────────────────────────────────────────────────────────────────

  if (!loaded) {
    return (
      <div className="min-h-screen bg-[#0B0E1A] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#6B5BFF]/30 border-t-[#6B5BFF] animate-spin" />
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-[#0B0E1A] flex flex-col pb-24">
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed inset-0 opacity-10"
        style={{
          background:
            "radial-gradient(ellipse 50% 35% at 50% 0%, #6B5BFF40 0%, transparent 70%)",
        }}
      />

      {/* Goal selector (first visit) */}
      <AnimatePresence mode="wait">
        {!goal ? (
          <motion.div
            key="goal-selector"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 w-full max-w-[600px] mx-auto px-5 pt-10"
          >
            <GoalSelector onSelect={handleGoalSelect} />
          </motion.div>
        ) : (
          <motion.div
            key="roadmap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 w-full max-w-[600px] mx-auto px-5 space-y-6 pt-8"
          >
            {/* ── Header ──────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/35 font-outfit">Your plan</p>
                <h1 className="text-lg font-bold text-white font-outfit leading-tight">
                  Day {todayDay} of {goal}
                </h1>
              </div>

              {/* Streak pill */}
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{
                  background:  "rgba(107,91,255,0.12)",
                  border:      "1px solid rgba(107,91,255,0.25)",
                }}
              >
                <Flame size={16} className="text-[#f97316]" strokeWidth={1.8} />
                <div>
                  <p className="text-xs font-bold text-white font-outfit leading-none">
                    {streak} day{streak !== 1 ? "s" : ""}
                  </p>
                  <p className="text-[9px] text-white/35 font-outfit">streak</p>
                </div>
              </div>
            </div>

            {/* ── Progress bar ─────────────────────────────────────────────── */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-white/35 font-outfit">
                  {completedDays.size} of {goal} days completed
                </span>
                <span className="text-[11px] text-white/35 font-outfit">{progressPct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: "linear-gradient(90deg, #4A6CF7, #6B5BFF, #8B5CF6)",
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>

            {/* ── Week strip ───────────────────────────────────────────────── */}
            <div
              className="rounded-xl px-4 py-4"
              style={{
                background:  "rgba(21,26,46,0.6)",
                border:      "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <p className="text-[10px] text-white/30 font-outfit uppercase tracking-wider mb-3">
                This week
              </p>
              <div className="flex items-center justify-between">
                {weekDays.map((d) => (
                  <DayPill
                    key={d}
                    day={d}
                    isToday={d === todayDay}
                    isDone={completedDays.has(d)}
                    isFuture={d > todayDay}
                  />
                ))}
              </div>
            </div>

            {/* ── Today's task ─────────────────────────────────────────────── */}
            <div className="space-y-2">
              <p className="text-xs text-white/35 font-outfit uppercase tracking-wider">
                Today&apos;s task
              </p>
              {todayTask ? (
                <TaskCard
                  task={todayTask}
                  isDone={completedDays.has(todayDay)}
                  onMarkDone={() => handleMarkDone(todayDay)}
                />
              ) : (
                <div
                  className="rounded-2xl px-5 py-6 text-center"
                  style={{
                    background:  "rgba(21,26,46,0.6)",
                    border:      "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div className="flex justify-center mb-3">
                    <span className="flex items-center justify-center w-12 h-12 rounded-2xl text-[#8B8FFF]" style={{ background: "rgba(107,91,255,0.12)", border: "1px solid rgba(107,91,255,0.2)" }}>
                      <PartyPopper size={24} strokeWidth={1.5} />
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white font-outfit">
                    Plan complete!
                  </p>
                  <p className="text-xs text-white/40 font-outfit mt-1">
                    You&apos;ve finished all {goal} days. Time to apply for that PM role.
                  </p>
                </div>
              )}
            </div>

            {/* ── Upcoming ─────────────────────────────────────────────────── */}
            {plan.slice(todayDay, todayDay + 3).length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-white/35 font-outfit uppercase tracking-wider">
                  Coming up
                </p>
                <div className="space-y-2">
                  {plan.slice(todayDay, todayDay + 3).map((t) => (
                    <div
                      key={t.dayNumber}
                      className="flex items-center gap-3 rounded-xl px-4 py-3"
                      style={{
                        background:  "rgba(21,26,46,0.4)",
                        border:      "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <span className="text-sm">{TASK_ICONS[t.taskType]}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white/60 font-outfit truncate">
                          Day {t.dayNumber} · {t.dimensionLabel}
                        </p>
                        <p className="text-xs text-white/35 font-outfit truncate">
                          {t.title}
                        </p>
                      </div>
                      <span
                        className="text-[9px] font-outfit px-1.5 py-0.5 rounded flex-shrink-0"
                        style={{
                          background: `${t.dimensionColor}15`,
                          color:       t.dimensionColor,
                        }}
                      >
                        {t.estimatedMinutes}m
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Focus areas ──────────────────────────────────────────────── */}
            {focusDims.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-white/35 font-outfit uppercase tracking-wider">
                  Plan targets your gaps
                </p>
                <div className="space-y-2">
                  {focusDims.map((dim) => {
                    const dimEntries = profile!.gapMap.filter((e) => e.dimension === dim);
                    const avg = dimEntries.length
                      ? dimEntries.reduce((s, e) => s + e.score, 0) / dimEntries.length
                      : 5;
                    const color = DIMENSION_COLORS[dim];
                    return (
                      <div key={dim} className="flex items-center gap-3">
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ background: color }}
                        />
                        <span className="text-xs text-white/55 font-outfit w-[140px] flex-shrink-0">
                          {DIMENSION_LABELS[dim]}
                        </span>
                        <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width:      `${(avg / 10) * 100}%`,
                              background: color,
                            }}
                          />
                        </div>
                        <span className="text-[11px] text-white/30 font-outfit w-8 text-right">
                          {avg.toFixed(1)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Reset goal ───────────────────────────────────────────────── */}
            <div className="pt-2 pb-4 text-center">
              <button
                onClick={() => {
                  localStorage.removeItem("prodigy_goal");
                  localStorage.removeItem("prodigy_goal_start");
                  setGoal(null);
                  setGoalStartDate(null);
                  setCompletedDays(new Set());
                  setPlan([]);
                }}
                className="text-xs text-white/20 hover:text-white/40 font-outfit transition-colors"
              >
                Change goal duration
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </main>
  );
}
