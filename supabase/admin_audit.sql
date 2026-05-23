create table if not exists public.admin_activity_logs (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid references auth.users(id) on delete set null,
  admin_email text,
  admin_role text,
  action_type text not null,
  target_type text not null,
  target_id text,
  target_title_or_email text,
  reason text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone not null default now()
);

alter table public.admin_activity_logs enable row level security;

drop policy if exists "Admins read activity logs" on public.admin_activity_logs;
drop policy if exists "Admins write activity logs" on public.admin_activity_logs;

create policy "Admins read activity logs"
on public.admin_activity_logs
for select
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('super_admin', 'admin')
  )
);

create policy "Admins write activity logs"
on public.admin_activity_logs
for insert
to authenticated
with check (
  admin_user_id = auth.uid()
  and exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('super_admin', 'chief_admin', 'admin')
  )
);

do $$
begin
  if to_regclass('public.student_research_ideas') is not null then
    alter table public.student_research_ideas add column if not exists reviewed_by uuid references auth.users(id);
    alter table public.student_research_ideas add column if not exists reviewed_at timestamp with time zone;
    alter table public.student_research_ideas add column if not exists rejection_reason text;
    alter table public.student_research_ideas add column if not exists requested_edit_reason text;
  end if;
end $$;

do $$
begin
  if to_regclass('public.faculty_research_opportunities') is not null then
    alter table public.faculty_research_opportunities add column if not exists reviewed_by uuid references auth.users(id);
    alter table public.faculty_research_opportunities add column if not exists reviewed_at timestamp with time zone;
    alter table public.faculty_research_opportunities add column if not exists rejection_reason text;
    alter table public.faculty_research_opportunities add column if not exists requested_edit_reason text;
  end if;
end $$;

do $$
begin
  if to_regclass('public.reports') is not null then
    alter table public.reports add column if not exists reviewed_by uuid references auth.users(id);
    alter table public.reports add column if not exists reviewed_at timestamp with time zone;
    alter table public.reports add column if not exists rejection_reason text;
    alter table public.reports add column if not exists requested_edit_reason text;
  end if;
end $$;

do $$
begin
  if to_regclass('public.projects') is not null then
    alter table public.projects add column if not exists reviewed_by uuid references auth.users(id);
    alter table public.projects add column if not exists reviewed_at timestamp with time zone;
    alter table public.projects add column if not exists rejection_reason text;
    alter table public.projects add column if not exists requested_edit_reason text;
  end if;
end $$;

create index if not exists admin_activity_logs_admin_email_idx on public.admin_activity_logs(admin_email);
create index if not exists admin_activity_logs_action_type_idx on public.admin_activity_logs(action_type);
create index if not exists admin_activity_logs_target_type_idx on public.admin_activity_logs(target_type);
create index if not exists admin_activity_logs_created_at_idx on public.admin_activity_logs(created_at);
