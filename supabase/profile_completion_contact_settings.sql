alter table public.student_research_profiles
  add column if not exists profile_completed_at timestamptz;

alter table public.faculty_academic_profiles
  add column if not exists profile_completed_at timestamptz;

alter table public.contact_preferences
  add column if not exists contact_visibility text,
  add column if not exists contact_settings_completed_at timestamptz;

alter table public.contact_preferences
  drop constraint if exists contact_preferences_contact_visibility_check;

alter table public.contact_preferences
  add constraint contact_preferences_contact_visibility_check
  check (
    contact_visibility is null
    or contact_visibility in ('email', 'phone', 'both')
  );

update public.contact_preferences
set contact_visibility = case
  when share_email = true and share_phone = true then 'both'
  when share_phone = true then 'phone'
  when share_email = true then 'email'
  else contact_visibility
end
where contact_visibility is null;

update public.contact_preferences
set contact_settings_completed_at = coalesce(contact_settings_completed_at, now())
where contact_visibility is not null;

update public.student_research_profiles
set profile_completed_at = coalesce(profile_completed_at, now())
where profile_completed_at is null
  and bio <> ''
  and cardinality(research_interests) > 0
  and cardinality(research_skills) > 0;

update public.faculty_academic_profiles
set profile_completed_at = coalesce(profile_completed_at, now())
where profile_completed_at is null
  and academic_bio <> ''
  and cardinality(research_interests) > 0
  and cardinality(research_fields) > 0;
