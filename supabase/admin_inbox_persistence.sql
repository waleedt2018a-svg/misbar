create table if not exists public.student_research_ideas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null default '',
  created_at timestamp with time zone not null default now(),
  status text not null default 'pending',
  reviewed_by text,
  reviewed_at timestamp with time zone,
  review_reason text
);

alter table public.student_research_ideas add column if not exists content text not null default '';
alter table public.student_research_ideas add column if not exists reviewed_by text;
alter table public.student_research_ideas add column if not exists reviewed_at timestamp with time zone;
alter table public.student_research_ideas add column if not exists review_reason text;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'student_research_ideas'
      and column_name = 'description'
  ) and exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'student_research_ideas'
      and column_name = 'research_problem'
  ) then
    update public.student_research_ideas
    set content = coalesce(nullif(content, ''), nullif(description, ''), nullif(research_problem, ''), '')
    where content = '';
  end if;
end $$;

update public.student_research_ideas
set status = case status
  when 'pending_review' then 'pending'
  when 'published' then 'approved'
  when 'draft' then 'pending'
  else status
end
where status in ('pending_review', 'published', 'draft');

alter table public.student_research_ideas drop constraint if exists student_research_ideas_status_check;
alter table public.student_research_ideas add constraint student_research_ideas_status_check
  check (status in ('pending', 'approved', 'rejected', 'needs_revision'));

create table if not exists public.research_opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null default '',
  created_at timestamp with time zone not null default now(),
  status text not null default 'pending',
  reviewed_by text,
  reviewed_at timestamp with time zone,
  review_reason text
);

alter table public.research_opportunities add column if not exists content text not null default '';
alter table public.research_opportunities add column if not exists reviewed_by text;
alter table public.research_opportunities add column if not exists reviewed_at timestamp with time zone;
alter table public.research_opportunities add column if not exists review_reason text;

alter table public.research_opportunities drop constraint if exists research_opportunities_status_check;
alter table public.research_opportunities add constraint research_opportunities_status_check
  check (status in ('pending', 'approved', 'rejected', 'needs_revision'));

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  title text not null default 'بلاغ',
  content text not null default '',
  created_at timestamp with time zone not null default now(),
  status text not null default 'pending',
  reviewed_by text,
  reviewed_at timestamp with time zone,
  review_reason text
);

alter table public.reports add column if not exists title text not null default 'بلاغ';
alter table public.reports add column if not exists content text not null default '';
alter table public.reports add column if not exists reviewed_by text;
alter table public.reports add column if not exists reviewed_at timestamp with time zone;
alter table public.reports add column if not exists review_reason text;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'reports'
      and column_name = 'reason'
  ) then
    update public.reports
    set title = coalesce(nullif(title, ''), nullif(reason, ''), 'بلاغ')
    where title = 'بلاغ' or title = '';
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'reports'
      and column_name = 'details'
  ) then
    update public.reports
    set content = coalesce(nullif(content, ''), nullif(details, ''), '')
    where content = '';
  end if;
end $$;

update public.reports
set status = case status
  when 'open' then 'pending'
  when 'under_review' then 'pending'
  when 'resolved' then 'approved'
  when 'dismissed' then 'rejected'
  else status
end
where status in ('open', 'under_review', 'resolved', 'dismissed');

alter table public.reports drop constraint if exists reports_status_check;
alter table public.reports add constraint reports_status_check
  check (status in ('pending', 'approved', 'rejected', 'needs_revision'));

alter table public.student_research_ideas enable row level security;
alter table public.research_opportunities enable row level security;
alter table public.reports enable row level security;

drop policy if exists "Admins read review inbox ideas" on public.student_research_ideas;
drop policy if exists "Admins update review inbox ideas" on public.student_research_ideas;
drop policy if exists "Admins read review inbox opportunities" on public.research_opportunities;
drop policy if exists "Admins update review inbox opportunities" on public.research_opportunities;
drop policy if exists "Admins read review inbox reports" on public.reports;
drop policy if exists "Admins update review inbox reports" on public.reports;

create policy "Admins read review inbox ideas"
on public.student_research_ideas
for select
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('super_admin', 'chief_admin', 'admin')
      and profiles.admin_status = 'active'
  )
);

create policy "Admins update review inbox ideas"
on public.student_research_ideas
for update
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('super_admin', 'chief_admin', 'admin')
      and profiles.admin_status = 'active'
  )
)
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('super_admin', 'chief_admin', 'admin')
      and profiles.admin_status = 'active'
  )
);

create policy "Admins read review inbox opportunities"
on public.research_opportunities
for select
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('super_admin', 'chief_admin', 'admin')
      and profiles.admin_status = 'active'
  )
);

create policy "Admins update review inbox opportunities"
on public.research_opportunities
for update
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('super_admin', 'chief_admin', 'admin')
      and profiles.admin_status = 'active'
  )
)
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('super_admin', 'chief_admin', 'admin')
      and profiles.admin_status = 'active'
  )
);

create policy "Admins read review inbox reports"
on public.reports
for select
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('super_admin', 'chief_admin', 'admin')
      and profiles.admin_status = 'active'
  )
);

create policy "Admins update review inbox reports"
on public.reports
for update
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('super_admin', 'chief_admin', 'admin')
      and profiles.admin_status = 'active'
  )
)
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('super_admin', 'chief_admin', 'admin')
      and profiles.admin_status = 'active'
  )
);

create index if not exists student_research_ideas_admin_status_idx on public.student_research_ideas(status);
create index if not exists research_opportunities_admin_status_idx on public.research_opportunities(status);
create index if not exists reports_admin_status_idx on public.reports(status);
create index if not exists student_research_ideas_reviewed_at_idx on public.student_research_ideas(reviewed_at);
create index if not exists research_opportunities_reviewed_at_idx on public.research_opportunities(reviewed_at);
create index if not exists reports_reviewed_at_idx on public.reports(reviewed_at);
