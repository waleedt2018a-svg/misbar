# Misbar Data Source Audit

## Removed Fake Data

- `data/home.ts` previously exported static public homepage arrays for research projects, journal entries, opportunities, student ideas, and Paper Lab items. It now contains types only.
- `data/student.ts` previously exported static student opportunities, starter ideas, join requests, requests, and notifications. It now contains types only.
- `data/faculty.ts` previously exported starter faculty opportunities, applicants, student ideas, requests, and notifications. The file was removed.

## Supabase-Backed Public Pages

- `app/page.tsx` now reads public homepage data through `lib/public/supabase-data.ts`.
- Published public opportunities come from `research_opportunities`.
- Published student ideas come from `student_research_ideas`.
- Published research projects come from `projects` when present, otherwise published student ideas are reused as real project rows.
- Platform stats are counted from Supabase only.
- Empty public sections render Arabic empty states instead of demo cards.

## Supabase-Backed Admin Pages

- Admin users and admins read from `profiles`.
- Admin inbox and processed queues read from `student_research_ideas`, `research_opportunities`, and `reports`.
- Admin logs read from `admin_activity_logs`.
- Reports, warnings, notification reads, analytics, and control center data are all Supabase-backed.

## Remaining Mock Data

No fake/demo/mock display data remains in `app/`, `components/`, `data/`, or `lib/`.

Static arrays that remain are configuration lists only, such as auth dropdown options, nav items, tab labels, and role constants.
