create table if not exists public.admin_notification_reads (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references auth.users(id) on delete cascade,
  notification_id text not null,
  read_at timestamp with time zone not null default now(),
  unique (admin_user_id, notification_id)
);

alter table public.admin_notification_reads enable row level security;

drop policy if exists "Admins read own notification reads" on public.admin_notification_reads;
drop policy if exists "Admins insert own notification reads" on public.admin_notification_reads;

create policy "Admins read own notification reads"
on public.admin_notification_reads
for select
to authenticated
using (admin_user_id = auth.uid());

create policy "Admins insert own notification reads"
on public.admin_notification_reads
for insert
to authenticated
with check (admin_user_id = auth.uid());

create index if not exists admin_notification_reads_admin_user_id_idx
on public.admin_notification_reads(admin_user_id);

create index if not exists admin_notification_reads_notification_id_idx
on public.admin_notification_reads(notification_id);
