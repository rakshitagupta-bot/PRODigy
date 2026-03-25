-- ═══════════════════════════════════════════════════════════════════
-- PRODigy — Pre-signup session tracking
-- Run AFTER schema.sql in Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════

-- ─── Pre-signup sessions ──────────────────────────────────────────────────────
-- Captures warmup answers before the user creates an account.
-- anonymous_id is a UUID generated client-side and stored in localStorage.
-- After sign-up, the assessment page links user_id to this row.
-- A trigger then copies the warmup data into public.users automatically.

CREATE TABLE IF NOT EXISTS public.pre_signup_sessions (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  anonymous_id  text        UNIQUE NOT NULL,
  background    text,
  experience    text,
  industry      text,
  created_at    timestamptz DEFAULT now(),
  user_id       uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  claimed_at    timestamptz
);

ALTER TABLE public.pre_signup_sessions ENABLE ROW LEVEL SECURITY;

-- Anyone (including unauthenticated) can create a pre-signup session
CREATE POLICY "pre_signup: insert"
  ON public.pre_signup_sessions FOR INSERT
  WITH CHECK (true);

-- Authenticated users can read their own claimed sessions
CREATE POLICY "pre_signup: select own"
  ON public.pre_signup_sessions FOR SELECT
  USING (auth.uid() = user_id);

-- Authenticated users can claim an unclaimed session
CREATE POLICY "pre_signup: claim"
  ON public.pre_signup_sessions FOR UPDATE
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (user_id = auth.uid());

-- ─── Trigger: copy warmup data to users table when session is claimed ─────────

CREATE OR REPLACE FUNCTION public.handle_session_claim()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Only fire when user_id transitions from NULL → a real value
  IF NEW.user_id IS NOT NULL AND OLD.user_id IS NULL THEN
    NEW.claimed_at := now();

    -- Write warmup answers into the users row (created by the auth trigger)
    UPDATE public.users
    SET
      background      = NEW.background,
      experience_band = NEW.experience,
      industry        = NEW.industry
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_pre_signup_session_claimed ON public.pre_signup_sessions;

CREATE TRIGGER on_pre_signup_session_claimed
  BEFORE UPDATE ON public.pre_signup_sessions
  FOR EACH ROW EXECUTE PROCEDURE public.handle_session_claim();

-- ─── Index ────────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS pre_signup_anon_id_idx
  ON public.pre_signup_sessions (anonymous_id);

CREATE INDEX IF NOT EXISTS pre_signup_user_id_idx
  ON public.pre_signup_sessions (user_id);
