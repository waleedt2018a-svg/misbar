import { StudentDashboardShell } from "@/components/student/StudentDashboardShell";
import { requireRole } from "@/lib/auth/guards";

export default async function StudentLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await requireRole("student");

  return (
    <StudentDashboardShell studentName={profile.full_name || "طالب مِسبار"}>
      {children}
    </StudentDashboardShell>
  );
}
