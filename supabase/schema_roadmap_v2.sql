-- ═══════════════════════════════════════════════════════════════════
-- PRODigy — Roadmap v2 Schema
-- Run in Supabase Dashboard → SQL Editor AFTER schema.sql
-- Safe to run even if schema_phase2.sql was already run —
-- uses IF NOT EXISTS / IF NOT EXISTS guards throughout.
-- ═══════════════════════════════════════════════════════════════════

-- ─── Extend users table ───────────────────────────────────────────────────────

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS goal_duration  text DEFAULT '3_months',
  ADD COLUMN IF NOT EXISTS goal_started_at timestamptz;

-- ─── user_streaks ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.user_streaks (
  id                          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id                     uuid        REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  current_streak              int         DEFAULT 0,
  longest_streak              int         DEFAULT 0,
  last_completed_date         date,
  total_days_completed        int         DEFAULT 0,
  streak_freeze_used_this_week boolean    DEFAULT false,
  updated_at                  timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- ─── daily_completions ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.daily_completions (
  id                uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id           uuid        REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  day_number        int         NOT NULL,
  task_id           text        NOT NULL,
  subcategory       text        NOT NULL,
  confidence_rating int         CHECK (confidence_rating BETWEEN 1 AND 5),
  completed_at      timestamptz DEFAULT now(),
  UNIQUE(user_id, task_id)
);

-- ─── daily_reflections ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.daily_reflections (
  id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         uuid        REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  day_number      int         NOT NULL,
  score           int         NOT NULL,
  total_questions int         NOT NULL,
  completed_at    timestamptz DEFAULT now(),
  UNIQUE(user_id, day_number)
);

-- ─── user_badges ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.user_badges (
  id        uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id   uuid        REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  badge_id  text        NOT NULL,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- ─── roadmap_progress additions ───────────────────────────────────────────────

ALTER TABLE public.roadmap_progress
  ADD COLUMN IF NOT EXISTS day_number int;

-- Add unique constraint only if it doesn't already exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'roadmap_progress_user_subcat_unique'
  ) THEN
    ALTER TABLE public.roadmap_progress
      ADD CONSTRAINT roadmap_progress_user_subcat_unique
      UNIQUE (user_id, subcategory);
  END IF;
END $$;

-- ─── RLS ─────────────────────────────────────────────────────────────────────

ALTER TABLE public.user_streaks      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges       ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies so re-running is safe
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT policyname, tablename FROM pg_policies
    WHERE tablename IN ('user_streaks','daily_completions','daily_reflections','user_badges')
    AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
  END LOOP;
END $$;

CREATE POLICY "Users own streaks"     ON public.user_streaks      FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own completions" ON public.daily_completions  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own reflections" ON public.daily_reflections  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own badges"      ON public.user_badges        FOR ALL USING (auth.uid() = user_id);

-- ─── Indexes ──────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS daily_completions_user_day_idx
  ON public.daily_completions (user_id, day_number);

CREATE INDEX IF NOT EXISTS daily_reflections_user_day_idx
  ON public.daily_reflections (user_id, day_number);

CREATE INDEX IF NOT EXISTS user_badges_user_idx
  ON public.user_badges (user_id);
