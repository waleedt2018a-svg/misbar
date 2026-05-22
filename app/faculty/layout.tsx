import { FacultyDashboardShell } from "@/components/faculty/FacultyDashboardShell";
import { requireRole } from "@/lib/auth/guards";

export default async function FacultyLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await requireRole("faculty");
  const displayName = `${profile.academic_title ?? ""} ${profile.full_name}`.trim();

  return <FacultyDashboardShell facultyName={displayName}>{children}</FacultyDashboardShell>;
}
