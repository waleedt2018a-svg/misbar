create table if not exists public.student_research_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  bio text not null default '',
  research_interests text[] not null default '{}',
  research_skills text[] not null default '{}',
  technical_skills text[] not null default '{}',
  experiences text not null default '',
  achievements text not null default '',
  linkedin_url text,
  orcid_url text,
  google_scholar_url text,
  cv_url text,
  is_complete boolean not null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  unique (user_id)
);

create table if not exists public.contact_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  share_email boolean not null default true,
  share_phone boolean not null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  unique (user_id),
  constraint contact_preferences_one_method check (share_email = true or share_phone = true)
);

create table if not exists public.student_research_ideas (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  research_problem text not null,
  description text not null default '',
  field text not null default '',
  needs_supervisor boolean not null default false,
  needs_team boolean not null default false,
  required_team_members integer not null default 0 check (required_team_members >= 0),
  accepted_team_members integer not null default 0 check (accepted_team_members >= 0),
  required_majors text[] not null default '{}',
  required_skills text[] not null default '{}',
  notes text,
  status text not null default 'draft' check (status in ('draft', 'pending_review', 'published', 'rejected', 'completed')),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table if not exists public.idea_join_requests (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid not null references public.student_research_ideas(id) on delete cascade,
  requester_id uuid not null references auth.users(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected', 'waitlisted')),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  unique (idea_id, requester_id)
);

create table if not exists public.opportunity_applications (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null,
  student_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected', 'waitlisted')),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  unique (opportunity_id, student_id)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamp with time zone not null default now()
);

alter table public.student_research_profiles enable row level security;
alter table public.contact_preferences enable row level security;
alter table public.student_research_ideas enable row level security;
alter table public.idea_join_requests enable row level security;
alter table public.opportunity_applications enable row level security;
alter table public.notifications enable row level security;

drop policy if exists "Students read own research profile" on public.student_research_profiles;
drop policy if exists "Students write own research profile" on public.student_research_profiles;
drop policy if exists "Students update own research profile" on public.student_research_profiles;
drop policy if exists "Students read own contact preferences" on public.contact_preferences;
drop policy if exists "Students write own contact preferences" on public.contact_preferences;
drop policy if exists "Students update own contact preferences" on public.contact_preferences;
drop policy if exists "Students read own ideas" on public.student_research_ideas;
drop policy if exists "Students write own ideas" on public.student_research_ideas;
drop policy if exists "Students update own ideas" on public.student_research_ideas;
drop policy if exists "Students read related join requests" on public.idea_join_requests;
drop policy if exists "Students create own join requests" on public.idea_join_requests;
drop policy if exists "Idea owners update join requests" on public.idea_join_requests;
drop policy if exists "Students read own opportunity applications" on public.opportunity_applications;
drop policy if exists "Students create own opportunity applications" on public.opportunity_applications;
drop policy if exists "Students update own opportunity applications" on public.opportunity_applications;
drop policy if exists "Students read own notifications" on public.notifications;
drop policy if exists "Students update own notifications" on public.notifications;

create policy "Students read own research profile"
on public.student_research_profiles
for select
to authenticated
using (auth.uid() = user_id);

create policy "Students write own research profile"
on public.student_research_profiles
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Students update own research profile"
on public.student_research_profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Students read own contact preferences"
on public.contact_preferences
for select
to authenticated
using (auth.uid() = user_id);

create policy "Students write own contact preferences"
on public.contact_preferences
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Students update own contact preferences"
on public.contact_preferences
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Students read own ideas"
on public.student_research_ideas
for select
to authenticated
using (auth.uid() = owner_id);

create policy "Students write own ideas"
on public.student_research_ideas
for insert
to authenticated
with check (auth.uid() = owner_id);

create policy "Students update own ideas"
on public.student_research_ideas
for update
to authenticated
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

create policy "Students read related join requests"
on public.idea_join_requests
for select
to authenticated
using (auth.uid() = requester_id or auth.uid() = owner_id);

create policy "Students create own join requests"
on public.idea_join_requests
for insert
to authenticated
with check (auth.uid() = requester_id);

create policy "Idea owners update join requests"
on public.idea_join_requests
for update
to authenticated
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

create policy "Students read own opportunity applications"
on public.opportunity_applications
for select
to authenticated
using (auth.uid() = student_id);

create policy "Students create own opportunity applications"
on public.opportunity_applications
for insert
to authenticated
with check (auth.uid() = student_id);

create policy "Students update own opportunity applications"
on public.opportunity_applications
for update
to authenticated
using (auth.uid() = student_id)
with check (auth.uid() = student_id);

create policy "Students read own notifications"
on public.notifications
for select
to authenticated
using (auth.uid() = user_id);

create policy "Students update own notifications"
on public.notifications
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create index if not exists student_research_profiles_user_id_idx on public.student_research_profiles(user_id);
create index if not exists contact_preferences_user_id_idx on public.contact_preferences(user_id);
create index if not exists student_research_ideas_owner_id_idx on public.student_research_ideas(owner_id);
create index if not exists idea_join_requests_owner_id_idx on public.idea_join_requests(owner_id);
create index if not exists idea_join_requests_requester_id_idx on public.idea_join_requests(requester_id);
create index if not exists opportunity_applications_student_id_idx on public.opportunity_applications(student_id);
create index if not exists notifications_user_id_idx on public.notifications(user_id);
