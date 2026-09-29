-- SakhiShield — Safety Copilot Database Schema & Strict RLS
-- Migration: 20260927_safety_copilot.sql

create table if not exists public.safety_copilot_sessions (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  started_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.safety_copilot_sessions enable row level security;

create policy "Users can select own copilot sessions"
  on public.safety_copilot_sessions
  for select
  using (auth.uid() = user_id);

create policy "Users can insert own copilot sessions"
  on public.safety_copilot_sessions
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own copilot sessions"
  on public.safety_copilot_sessions
  for update
  using (auth.uid() = user_id);

create policy "Users can delete own copilot sessions"
  on public.safety_copilot_sessions
  for delete
  using (auth.uid() = user_id);


create table if not exists public.safety_copilot_messages (
  id text primary key,
  session_id text not null references public.safety_copilot_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  sender text not null check (sender in ('USER', 'COPILOT', 'SYSTEM')),
  content text not null,
  source text not null check (source in ('AI', 'DETERMINISTIC_FALLBACK', 'SYSTEM_ACTION')),
  created_at timestamptz not null default now()
);

alter table public.safety_copilot_messages enable row level security;

create policy "Users can select own copilot messages"
  on public.safety_copilot_messages
  for select
  using (auth.uid() = user_id);

create policy "Users can insert own copilot messages"
  on public.safety_copilot_messages
  for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own copilot messages"
  on public.safety_copilot_messages
  for delete
  using (auth.uid() = user_id);

create index if not exists idx_copilot_messages_session
  on public.safety_copilot_messages (session_id, created_at asc);
