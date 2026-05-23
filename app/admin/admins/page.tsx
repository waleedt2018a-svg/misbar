import { AdminAccessDenied } from "@/components/admin/AdminAccessDenied";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { AdminsManagement } from "@/components/admin/AdminsManagement";
import { canManageAdmins } from "@/lib/admin/permissions";
import { getAdminActivityLogsFromSupabase, getManagedAdminsFromSupabase } from "@/lib/admin/supabase-data";
import { requireAdminRole } from "@/lib/auth/guards";
import { getAccessToken } from "@/lib/supabase/rest";
import type { AdminRole } from "@/lib/auth/types";

export default async function AdminsPage() {
  const profile = await requireAdminRole();
  const role = profile.role as AdminRole;
  const accessToken = await getAccessToken();
  const admins = accessToken ? await getManagedAdminsFromSupabase(accessToken) : [];
  const logs = accessToken ? await getAdminActivityLogsFromSupabase(accessToken) : [];
  const actionCounts = logs.reduce<Record<string, number>>((acc, log) => {
    acc[log.adminEmail] = (acc[log.adminEmail] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <AdminSectionHeader
        title="إدارة الأدمنز"
        description="مركز التحكم بصلاحيات فريق الإدارة، حالة الدخول، الرتب، وسجلات النشاط."
      />
      {canManageAdmins(role) ? <AdminsManagement role={role} admins={admins} actionCounts={actionCounts} /> : <AdminAccessDenied />}
    </div>
  );
}
