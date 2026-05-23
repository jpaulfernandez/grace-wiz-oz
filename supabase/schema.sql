-- Grace Prototype Database Schema
-- Run this in Supabase SQL Editor

create table sessions (
  id uuid primary key default gen_random_uuid(),
  invite_code text not null,
  cohort text not null,
  scenario_id text not null,
  nickname text,
  started_at timestamptz not null default now(),
  consented_at timestamptz,
  guided_completed_at timestamptz,
  free_roam_started_at timestamptz,
  completed_at timestamptz,
  ended_early boolean default false,
  user_agent text,
  viewport_width int,
  is_moderated boolean default false,
  end_survey jsonb,
  sus_responses jsonb,
  pricing_response text
);

create table events (
  id bigserial primary key,
  session_id uuid not null references sessions(id) on delete cascade,
  ts timestamptz not null default now(),
  screen_id text,
  event_type text not null,
  payload jsonb
);

-- Indexes for performance
create index events_session_ts_idx on events(session_id, ts);
create index sessions_invite_code_idx on sessions(invite_code);
create index sessions_cohort_idx on sessions(cohort);

-- Row Level Security
alter table sessions enable row level security;
alter table events enable row level security;

-- Policies for anonymous access (anon key)
create policy "anon insert sessions" on sessions
  for insert to anon with check (true);

create policy "anon select sessions" on sessions
  for select to anon using (true);

create policy "anon insert events" on events
  for insert to anon with check (true);

create policy "anon update own session" on sessions
  for update to anon using (true) with check (true);
