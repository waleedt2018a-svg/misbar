create table if not exists public.admin_warnings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  reason text not null,
  details text,
  issued_by uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users(id) on delete cascade,
  reported_user_id uuid references auth.users(id) on delete set null,
  content_type text,
  content_id uuid,
  reason text not null,
  details text,
  status text not null default 'open' check (status in ('open', 'under_review', 'resolved', 'dismissed')),
  created_at timestamp with time zone not null default now()
);

alter table public.profiles add column if not exists status text not null default 'active';
alter table public.profiles add column if not exists warnings_count integer not null default 0;
alter table public.profiles add column if not exists banned_at timestamp with time zone;
alter table public.profiles add column if not exists banned_by uuid references auth.users(id);
alter table public.profiles add column if not exists ban_reason text;

alter table public.profiles drop constraint if exists profiles_status_check;
alter table public.profiles add constraint profiles_status_check check (status in ('active', 'inactive', 'banned'));

-- If your existing role check only allows student/faculty/admin, replace it manually with:
-- role in ('student', 'faculty', 'admin', 'super_admin', 'moderator')
-- Constraint names vary by project, so verify the current name in Supabase before dropping it.

alter table public.admin_warnings enable row level security;
alter table public.reports enable row level security;

drop policy if exists "Admins read warnings" on public.admin_warnings;
drop policy if exists "Admins write warnings" on public.admin_warnings;
drop policy if exists "Admins read reports" on public.reports;
drop policy if exists "Authenticated users create reports" on public.reports;
drop policy if exists "Admins update reports" on public.reports;

create policy "Admins read warnings"
on public.admin_warnings
for select
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('super_admin', 'admin', 'moderator')
  )
);

create policy "Admins write warnings"
on public.admin_warnings
for insert
to authenticated
with check (
  issued_by = auth.uid()
  and exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('super_admin', 'admin', 'moderator')
  )
);

create policy "Admins read reports"
on public.reports
for select
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('super_admin', 'admin', 'moderator')
  )
);

create policy "Authenticated users create reports"
on public.reports
for insert
to authenticated
with check (reporter_id = auth.uid());

create policy "Admins update reports"
on public.reports
for update
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('super_admin', 'admin')
  )
)
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('super_admin', 'admin')
  )
);

create index if not exists admin_warnings_user_id_idx on public.admin_warnings(user_id);
create index if not exists admin_warnings_issued_by_idx on public.admin_warnings(issued_by);
create index if not exists reports_reporter_id_idx on public.reports(reporter_id);
create index if not exists reports_reported_user_id_idx on public.reports(reported_user_id);
create index if not exists reports_status_idx on public.reports(status);
create index if not exists profiles_status_idx on public.profiles(status);
