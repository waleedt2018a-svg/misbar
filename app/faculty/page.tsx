import { DashboardShell } from "@/components/DashboardShell";
import { requireRole } from "@/lib/auth/guards";

export default async function FacultyDashboardPage() {
  const profile = await requireRole("faculty");

  return <DashboardShell title="لوحة عضو هيئة التدريس" name={profile.full_name} />;
}
