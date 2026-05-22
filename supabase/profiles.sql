create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone_number text not null,
  role text not null check (role in ('student', 'faculty', 'admin')),
  gender text not null check (gender in ('ذكر', 'أنثى')),
  college text not null,
  major text,
  department text,
  academic_level text,
  academic_rank text,
  academic_title text,
  created_at timestamp with time zone not null default now(),
  constraint student_profile_fields check (
    role <> 'student'
    or (major is not null and academic_level is not null and department is null and academic_rank is null and academic_title is null)
  ),
  constraint faculty_profile_fields check (
    role <> 'faculty'
    or (department is not null and academic_rank is not null and academic_title is not null and major is null and academic_level is null)
  )
);

alter table public.profiles add column if not exists phone_number text;
update public.profiles set phone_number = '' where phone_number is null;
alter table public.profiles alter column phone_number set not null;

alter table public.profiles enable row level security;

drop policy if exists "Users can read their own profile" on public.profiles;
drop policy if exists "Users can create their own non-admin profile" on public.profiles;
drop policy if exists "Users can update their own non-admin profile" on public.profiles;

create policy "Users can read their own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "Users can create their own non-admin profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id and role in ('student', 'faculty'));

create policy "Users can update their own non-admin profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id and role in ('student', 'faculty'))
with check (auth.uid() = id and role in ('student', 'faculty'));

create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists profiles_email_idx on public.profiles(email);
