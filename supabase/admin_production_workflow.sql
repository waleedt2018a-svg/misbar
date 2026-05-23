alter table public.profiles add column if not exists admin_status text not null default 'active';
alter table public.profiles add column if not exists last_admin_login_at timestamp with time zone;
alter table public.profiles add column if not exists last_admin_seen_at timestamp with time zone;
alter table public.profiles add column if not exists last_admin_action_at timestamp with time zone;

alter table public.profiles drop constraint if exists profiles_admin_status_check;
alter table public.profiles add constraint profiles_admin_status_check
  check (admin_status in ('active', 'inactive'));

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('student', 'faculty', 'admin', 'chief_admin', 'super_admin'));

create table if not exists public.admin_activity_logs (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid references auth.users(id) on delete set null,
  admin_name text,
  admin_email text,
  admin_role text not null check (admin_role in ('super_admin', 'chief_admin', 'admin')),
  action_type text not null check (
    action_type in (
      'approve',
      'reject',
      'request_edit',
      'pause',
      'unpublish',
      'send_warning',
      'admin_login',
      'toggle_admin_status'
    )
  ),
  target_type text not null check (target_type in ('idea', 'opportunity', 'user', 'report', 'admin')),
  target_id text,
  target_title_or_email text,
  reason text,
  restricted_to_super boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone not null default now()
);

alter table public.admin_activity_logs add column if not exists admin_name text;
alter table public.admin_activity_logs add column if not exists restricted_to_super boolean not null default false;

do $$
begin
  if to_regclass('public.student_research_ideas') is not null then
    alter table public.student_research_ideas add column if not exists rejection_reason text;
    alter table public.student_research_ideas add column if not exists edit_reason text;
    alter table public.student_research_ideas add column if not exists pause_reason text;
  end if;
end $$;

do $$
begin
  if to_regclass('public.faculty_research_opportunities') is not null then
    alter table public.faculty_research_opportunities add column if not exists rejection_reason text;
    alter table public.faculty_research_opportunities add column if not exists edit_reason text;
    alter table public.faculty_research_opportunities add column if not exists pause_reason text;
  end if;
end $$;

alter table public.admin_warnings add column if not exists warning_reason text;

alter table public.admin_activity_logs enable row level security;

drop policy if exists "Admins read scoped activity logs" on public.admin_activity_logs;
drop policy if exists "Admins write activity logs" on public.admin_activity_logs;

create policy "Admins read scoped activity logs"
on public.admin_activity_logs
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles viewer
    where viewer.id = auth.uid()
      and viewer.role = 'super_admin'
      and viewer.admin_status = 'active'
  )
  or exists (
    select 1
    from public.profiles viewer
    where viewer.id = auth.uid()
      and viewer.role = 'chief_admin'
      and viewer.admin_status = 'active'
      and restricted_to_super = false
  )
  or (
    admin_user_id = auth.uid()
    and exists (
      select 1
      from public.profiles viewer
      where viewer.id = auth.uid()
        and viewer.role = 'admin'
        and viewer.admin_status = 'active'
    )
  )
);

create policy "Admins write activity logs"
on public.admin_activity_logs
for insert
to authenticated
with check (
  admin_user_id = auth.uid()
  and exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('super_admin', 'chief_admin', 'admin')
      and profiles.admin_status = 'active'
  )
);

create index if not exists profiles_admin_status_idx on public.profiles(admin_status);
create index if not exists profiles_last_admin_seen_at_idx on public.profiles(last_admin_seen_at);
create index if not exists admin_activity_logs_admin_user_id_idx on public.admin_activity_logs(admin_user_id);
create index if not exists admin_activity_logs_admin_role_idx on public.admin_activity_logs(admin_role);
create index if not exists admin_activity_logs_action_type_idx on public.admin_activity_logs(action_type);
create index if not exists admin_activity_logs_target_type_idx on public.admin_activity_logs(target_type);
create index if not exists admin_activity_logs_created_at_idx on public.admin_activity_logs(created_at);
