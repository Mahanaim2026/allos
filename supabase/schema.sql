-- Allos Database Schema
-- Run this in your Supabase SQL editor to set up or reset the database

-- ── Profiles ──────────────────────────────────────────────
create table if not exists public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  email           text,
  display_name    text,
  first_name      text,
  last_name       text,
  denomination    text,
  country         text,
  plan            text default 'free',
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- RLS for profiles
alter table public.profiles enable row level security;
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- ── Journey Entries ────────────────────────────────────────
create table if not exists public.journey_entries (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id) on delete cascade,
  title           text not null,
  content         text not null,
  mood            text,
  struggle        text,
  life_challenge  text,
  spiritual_need  text,
  output_type     text default 'sermonette',
  tone            text default 'pastoral',
  length          text default 'medium',
  notes           text,
  is_favourite    boolean default false,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- RLS for journey_entries
alter table public.journey_entries enable row level security;
drop policy if exists "Users can view own entries" on public.journey_entries;
drop policy if exists "Users can insert own entries" on public.journey_entries;
drop policy if exists "Users can update own entries" on public.journey_entries;
drop policy if exists "Users can delete own entries" on public.journey_entries;
create policy "Users can view own entries"   on public.journey_entries for select using (auth.uid() = user_id);
create policy "Users can insert own entries" on public.journey_entries for insert with check (auth.uid() = user_id);
create policy "Users can update own entries" on public.journey_entries for update using (auth.uid() = user_id);
create policy "Users can delete own entries" on public.journey_entries for delete using (auth.uid() = user_id);

-- ── Triggers: auto-update updated_at ──────────────────────
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();

drop trigger if exists journey_entries_updated_at on public.journey_entries;
create trigger journey_entries_updated_at before update on public.journey_entries
  for each row execute procedure public.handle_updated_at();

-- ── Auto-create profile on signup ─────────────────────────
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute procedure public.handle_new_user();
