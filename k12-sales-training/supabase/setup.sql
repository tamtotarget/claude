-- K-12 Sales Training: Database Setup
-- Run this in Supabase SQL Editor (Database → SQL Editor)

-- 1. Profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text not null default '',
  avatar_url text,
  role text not null default '' check (role in ('', 'SDR', 'GTM Engineer', 'SDR Manager', 'CSM', 'Other')),
  is_manager boolean not null default false,
  is_admin boolean not null default false,
  manager_id uuid references public.profiles(id),
  onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Module progress table
create table public.module_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  module_id integer not null,
  completed boolean not null default false,
  quiz_score integer,
  quiz_completed boolean not null default false,
  last_accessed timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, module_id)
);

-- 3. Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.module_progress enable row level security;

-- 4. RLS Policies for profiles
-- Users can read their own profile
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Users can insert their own profile
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Managers can read profiles of their team members
create policy "Managers can read team profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_manager = true
    )
    and manager_id = auth.uid()
  );

-- All authenticated users can read managers list (for onboarding dropdown)
create policy "Authenticated users can read managers"
  on public.profiles for select
  using (
    auth.uid() is not null and is_manager = true
  );

-- Admins can read ALL profiles
create policy "Admins can read all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );

-- 5. RLS Policies for module_progress
-- Users can manage their own progress
create policy "Users can read own progress"
  on public.module_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.module_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.module_progress for update
  using (auth.uid() = user_id);

-- Managers can read their team members' progress
create policy "Managers can read team progress"
  on public.module_progress for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = user_id and p.manager_id = auth.uid()
    )
  );

-- Admins can read ALL progress
create policy "Admins can read all progress"
  on public.module_progress for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );

-- 6. Function to auto-create profile on signup (with admin detection)
create or replace function public.handle_new_user()
returns trigger as $$
declare
  admin_emails text[] := array['bobby@tamtotarget.com', 'rose@tamtotarget.com', 'td@tamtotarget.com'];
begin
  insert into public.profiles (id, email, full_name, avatar_url, is_admin)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', ''),
    new.email = any(admin_emails)
  );
  return new;
end;
$$ language plpgsql security definer;

-- 7. Trigger to run on new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 8. Indexes for faster queries
create index idx_profiles_manager_id on public.profiles(manager_id);
create index idx_profiles_is_admin on public.profiles(is_admin);
create index idx_module_progress_user_id on public.module_progress(user_id);
