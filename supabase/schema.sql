-- Gameroom leaderboard: one table per-game scores
-- Run this in Supabase SQL Editor after creating a project.

create table if not exists public.scores (
  id uuid primary key default gen_random_uuid(),
  game_id text not null,
  player_name text,
  score integer not null check (score >= 0),
  created_at timestamptz not null default now()
);

-- Index for fast per-game leaderboard queries (top N by score desc)
create index if not exists idx_scores_game_score on public.scores (game_id, score desc);

-- Allow anonymous read/insert for leaderboard (RLS optional; use service role from API)
alter table public.scores enable row level security;

-- Policy: allow anyone to read (for leaderboard display)
create policy "Scores are viewable by everyone"
  on public.scores for select
  using (true);

-- Policy: allow anyone to insert (games submit scores; restrict in API by gameId allowlist)
create policy "Scores are insertable by everyone"
  on public.scores for insert
  with check (true);
