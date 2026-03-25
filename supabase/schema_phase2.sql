-- ─── Phase 2: Habit-Building Tables ─────────────────────────────────────────
-- Run this in Supabase Dashboard → SQL Editor AFTER schema.sql

-- User streaks (one row per user)
CREATE TABLE IF NOT EXISTS user_streaks (
  id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         uuid        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  current_streak  int         DEFAULT 0,
  longest_streak  int         DEFAULT 0,
  last_activity_date date,
  goal_days       int         DEFAULT 30,
  goal_start_date date,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Daily task completions (one row per user per day number)
CREATE TABLE IF NOT EXISTS daily_completions (
  id           uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      uuid        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  day_number   int         NOT NULL,
  task_title   text,
  dimension    text,
  confidence   int         CHECK (confidence BETWEEN 1 AND 5),
  completed_at timestamptz DEFAULT now(),
  UNIQUE(user_id, day_number)
);

-- Daily reflections (optional — one per day)
CREATE TABLE IF NOT EXISTS daily_reflections (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  day_number  int         NOT NULL,
  prompt      text,
  response    text,
  created_at  timestamptz DEFAULT now(),
  UNIQUE(user_id, day_number)
);

-- Earned badges
CREATE TABLE IF NOT EXISTS user_badges (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    uuid        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  badge_key  text        NOT NULL,
  earned_at  timestamptz DEFAULT now(),
  UNIQUE(user_id, badge_key)
);

-- ─── RLS ─────────────────────────────────────────────────────────────────────

ALTER TABLE user_streaks       ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_completions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_reflections  ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges        ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own streaks"     ON user_streaks       FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own completions" ON daily_completions  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own reflections" ON daily_reflections  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own badges"      ON user_badges        FOR ALL USING (auth.uid() = user_id);

-- ─── roadmap_progress additions (from base schema) ───────────────────────────
-- Only run if roadmap_progress already exists from schema.sql

ALTER TABLE roadmap_progress ADD COLUMN IF NOT EXISTS day_number int;
