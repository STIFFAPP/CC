-- Confidence Hub cloud-sync table.
-- Your current Supabase project already has this table, so you do NOT need to run this again.
create table if not exists public.user_app_data (
  user_id uuid not null references auth.users(id) on delete cascade,
  app_key text not null,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, app_key)
);

alter table public.user_app_data enable row level security;

drop policy if exists "Users can view their own app data" on public.user_app_data;
create policy "Users can view their own app data" on public.user_app_data for select using (auth.uid() = user_id);

drop policy if exists "Users can create their own app data" on public.user_app_data;
create policy "Users can create their own app data" on public.user_app_data for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update their own app data" on public.user_app_data;
create policy "Users can update their own app data" on public.user_app_data for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own app data" on public.user_app_data;
create policy "Users can delete their own app data" on public.user_app_data for delete using (auth.uid() = user_id);
