import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";
import { requireAdminRole } from "@/lib/auth/guards";
import type { AdminRole } from "@/lib/auth/types";

export default async function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await requireAdminRole();

  return (
    <AdminDashboardShell adminName={profile.full_name} role={profile.role as AdminRole}>
      {children}
    </AdminDashboardShell>
  );
}
