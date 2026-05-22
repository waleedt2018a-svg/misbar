import { DashboardShell } from "@/components/DashboardShell";
import { requireRole } from "@/lib/auth/guards";

export default async function AdminDashboardPage() {
  const profile = await requireRole("admin");

  return <DashboardShell title="لوحة الإدارة" name={profile.full_name} />;
}
