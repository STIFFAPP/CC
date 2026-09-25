-- Run this once in Supabase Dashboard > SQL Editor
create table if not exists public.app_sync (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.app_sync enable row level security;
drop policy if exists "users read own sync" on public.app_sync;
create policy "users read own sync" on public.app_sync for select using (auth.uid() = user_id);
drop policy if exists "users insert own sync" on public.app_sync;
create policy "users insert own sync" on public.app_sync for insert with check (auth.uid() = user_id);
drop policy if exists "users update own sync" on public.app_sync;
create policy "users update own sync" on public.app_sync for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
