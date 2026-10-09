-- Eden GMC Commercial CRM — Supabase setup
create table if not exists public.eden_crm_prospects (
  id text primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.eden_crm_prospects enable row level security;

drop policy if exists "eden_crm_select_own" on public.eden_crm_prospects;
drop policy if exists "eden_crm_insert_own" on public.eden_crm_prospects;
drop policy if exists "eden_crm_update_own" on public.eden_crm_prospects;
drop policy if exists "eden_crm_delete_own" on public.eden_crm_prospects;

create policy "eden_crm_select_own" on public.eden_crm_prospects for select
using (auth.uid() = owner_id);
create policy "eden_crm_insert_own" on public.eden_crm_prospects for insert
with check (auth.uid() = owner_id);
create policy "eden_crm_update_own" on public.eden_crm_prospects for update
using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "eden_crm_delete_own" on public.eden_crm_prospects for delete
using (auth.uid() = owner_id);
