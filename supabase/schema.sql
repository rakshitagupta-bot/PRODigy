-- ═══════════════════════════════════════════════════════════════════
-- PRODigy — Database Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ═══════════════════════════════════════════════════════════════════

-- ─── Tables ───────────────────────────────────────────────────────────────────

create table if not exists public.users (
  id              uuid references auth.users on delete cascade primary key,
  email           text,
  background      text,         -- warmup Q1: engineering, consulting, design…
  experience_band text,         -- warmup Q2: 0-2, 3-5, 6-10, 10+
  industry        text,         -- warmup Q3: fintech, saas, ecommerce…
  created_at      timestamptz default now()
);

create table if not exists public.assessments (
  id              uuid default gen_random_uuid() primary key,
  user_id         uuid references public.users(id) on delete cascade not null,
  answers         jsonb not null default '{}',   -- { questionId: optionIndex }
  scores          jsonb not null default '{}',   -- full ScoreProfile object
  archetype       text,
  role_type       text,
  readiness_score numeric(4,2),                  -- 0.00–10.00
  created_at      timestamptz default now()
);

create table if not exists public.roadmap_progress (
  id                uuid default gen_random_uuid() primary key,
  user_id           uuid references public.users(id) on delete cascade not null,
  subcategory       text not null,
  status            text default 'active' check (status in ('active','completed','skipped')),
  confidence_rating int  check (confidence_rating between 1 and 5),
  completed_at      timestamptz,
  created_at        timestamptz default now(),
  unique (user_id, subcategory)
);

-- ─── Enable Row Level Security ────────────────────────────────────────────────

alter table public.users              enable row level security;
alter table public.assessments        enable row level security;
alter table public.roadmap_progress   enable row level security;

-- ─── RLS Policies: users ──────────────────────────────────────────────────────

-- Users can read their own row
create policy "users: select own"
  on public.users for select
  using (auth.uid() = id);

-- Users can insert their own row (called during onboarding)
create policy "users: insert own"
  on public.users for insert
  with check (auth.uid() = id);

-- Users can update their own row
create policy "users: update own"
  on public.users for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ─── RLS Policies: assessments ───────────────────────────────────────────────

create policy "assessments: select own"
  on public.assessments for select
  using (auth.uid() = user_id);

create policy "assessments: insert own"
  on public.assessments for insert
  with check (auth.uid() = user_id);

-- Allow updating (e.g., re-taking assessment overwrites previous)
create policy "assessments: update own"
  on public.assessments for update
  using (auth.uid() = user_id);

-- ─── RLS Policies: roadmap_progress ──────────────────────────────────────────

create policy "roadmap: select own"
  on public.roadmap_progress for select
  using (auth.uid() = user_id);

create policy "roadmap: insert own"
  on public.roadmap_progress for insert
  with check (auth.uid() = user_id);

create policy "roadmap: update own"
  on public.roadmap_progress for update
  using (auth.uid() = user_id);

-- ─── Trigger: auto-create user row on first sign-in ──────────────────────────
-- This fires when Supabase Auth creates a new user, avoiding a client-side race.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Drop and recreate so re-running this script is safe
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Helpful indexes ──────────────────────────────────────────────────────────

create index if not exists assessments_user_id_idx
  on public.assessments (user_id, created_at desc);

create index if not exists roadmap_user_id_idx
  on public.roadmap_progress (user_id);
