import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";
import { getUnreadAdminNotificationCount } from "@/lib/admin/supabase-data";
import { requireAdminRole } from "@/lib/auth/guards";
import { getAccessToken } from "@/lib/supabase/rest";
import type { AdminRole } from "@/lib/auth/types";

export default async function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await requireAdminRole();
  const accessToken = await getAccessToken();
  const unreadNotificationCount = accessToken
    ? await getUnreadAdminNotificationCount(accessToken, profile.id)
    : 0;

  return (
    <AdminDashboardShell
      adminName={profile.full_name}
      adminEmail={profile.email}
      role={profile.role as AdminRole}
      adminStatus={profile.admin_status}
      lastLogin={profile.last_admin_login_at}
      unreadNotificationCount={unreadNotificationCount}
    >
      {children}
    </AdminDashboardShell>
  );
}
