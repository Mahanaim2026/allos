-- Run this in your Supabase SQL editor to set up the database

-- Profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  plan text default 'free',
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Journey entries table
create table if not exists public.journey_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  mood text,
  struggle text,
  challenge text,
  spiritual_need text,
  custom_input text,
  output_type text not null,
  tone text,
  length text,
  title text,
  scripture_references jsonb default '[]',
  generated_text text,
  favorite boolean default false,
  helpful_rating text
);

-- Enable RLS
alter table public.journey_entries enable row level security;

create policy "Users can view own entries"
  on public.journey_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert own entries"
  on public.journey_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update own entries"
  on public.journey_entries for update
  using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();