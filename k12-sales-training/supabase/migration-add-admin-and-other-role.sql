-- Migration: Add admin role and 'Other' role
-- Run this if you already ran setup.sql previously

-- 1. Add is_admin column
alter table public.profiles add column if not exists is_admin boolean not null default false;

-- 2. Update role check constraint to include 'Other'
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('', 'SDR', 'GTM Engineer', 'SDR Manager', 'CSM', 'Other'));

-- 3. Admin RLS policies
create policy "Admins can read all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );

create policy "Admins can read all progress"
  on public.module_progress for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );

-- 4. Update trigger function to detect admins on signup
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

-- 5. Index for admin queries
create index if not exists idx_profiles_is_admin on public.profiles(is_admin);
