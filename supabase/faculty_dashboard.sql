create table if not exists public.faculty_academic_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  academic_bio text not null default '',
  research_interests text[] not null default '{}',
  research_fields text[] not null default '{}',
  research_experience text not null default '',
  publications text not null default '',
  previous_projects text not null default '',
  google_scholar_url text,
  orcid_url text,
  researchgate_url text,
  linkedin_url text,
  cv_url text,
  is_complete boolean not null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  unique (user_id)
);

create table if not exists public.faculty_research_opportunities (
  id uuid primary key default gen_random_uuid(),
  faculty_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null,
  research_field text not null default '',
  college text not null default '',
  department text not null default '',
  required_skills text[] not null default '{}',
  required_majors text[] not null default '{}',
  required_students integer not null default 1 check (required_students > 0),
  work_mode text not null default 'mixed' check (work_mode in ('onsite', 'remote', 'mixed')),
  duration text,
  deadline date,
  notes text,
  status text not null default 'draft' check (status in ('draft', 'pending_review', 'published', 'closed', 'rejected')),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table if not exists public.faculty_supervision_interests (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid not null,
  faculty_id uuid not null references auth.users(id) on delete cascade,
  student_owner_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  unique (idea_id, faculty_id)
);

alter table public.faculty_academic_profiles enable row level security;
alter table public.faculty_research_opportunities enable row level security;
alter table public.faculty_supervision_interests enable row level security;

drop policy if exists "Faculty read own academic profile" on public.faculty_academic_profiles;
drop policy if exists "Faculty write own academic profile" on public.faculty_academic_profiles;
drop policy if exists "Faculty update own academic profile" on public.faculty_academic_profiles;
drop policy if exists "Faculty read own opportunities" on public.faculty_research_opportunities;
drop policy if exists "Faculty write own opportunities" on public.faculty_research_opportunities;
drop policy if exists "Faculty update own opportunities" on public.faculty_research_opportunities;
drop policy if exists "Faculty read own supervision interests" on public.faculty_supervision_interests;
drop policy if exists "Faculty write own supervision interests" on public.faculty_supervision_interests;
drop policy if exists "Faculty update own supervision interests" on public.faculty_supervision_interests;

create policy "Faculty read own academic profile"
on public.faculty_academic_profiles
for select
to authenticated
using (auth.uid() = user_id);

create policy "Faculty write own academic profile"
on public.faculty_academic_profiles
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Faculty update own academic profile"
on public.faculty_academic_profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Faculty read own opportunities"
on public.faculty_research_opportunities
for select
to authenticated
using (auth.uid() = faculty_id);

create policy "Faculty write own opportunities"
on public.faculty_research_opportunities
for insert
to authenticated
with check (auth.uid() = faculty_id);

create policy "Faculty update own opportunities"
on public.faculty_research_opportunities
for update
to authenticated
using (auth.uid() = faculty_id)
with check (auth.uid() = faculty_id);

create policy "Faculty read own supervision interests"
on public.faculty_supervision_interests
for select
to authenticated
using (auth.uid() = faculty_id or auth.uid() = student_owner_id);

create policy "Faculty write own supervision interests"
on public.faculty_supervision_interests
for insert
to authenticated
with check (auth.uid() = faculty_id);

create policy "Faculty update own supervision interests"
on public.faculty_supervision_interests
for update
to authenticated
using (auth.uid() = faculty_id or auth.uid() = student_owner_id)
with check (auth.uid() = faculty_id or auth.uid() = student_owner_id);

create index if not exists faculty_academic_profiles_user_id_idx on public.faculty_academic_profiles(user_id);
create index if not exists faculty_research_opportunities_faculty_id_idx on public.faculty_research_opportunities(faculty_id);
create index if not exists faculty_research_opportunities_status_idx on public.faculty_research_opportunities(status);
create index if not exists faculty_supervision_interests_faculty_id_idx on public.faculty_supervision_interests(faculty_id);
create index if not exists faculty_supervision_interests_student_owner_id_idx on public.faculty_supervision_interests(student_owner_id);
