import { AdminAccessDenied } from "@/components/admin/AdminAccessDenied";
import { AdminActivityLogList } from "@/components/admin/AdminActivityLogList";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { canViewAuditLogs } from "@/lib/admin/permissions";
import { getAdminActivityLogsFromSupabase } from "@/lib/admin/supabase-data";
import { requireAdminRole } from "@/lib/auth/guards";
import { getAccessToken } from "@/lib/supabase/rest";
import type { AdminRole } from "@/lib/auth/types";

export default async function AdminActivityLogPage() {
  const profile = await requireAdminRole();
  const role = profile.role as AdminRole;
  const accessToken = await getAccessToken();
  const logs = accessToken ? await getAdminActivityLogsFromSupabase(accessToken) : [];

  return (
    <div>
      <AdminSectionHeader
        title="سجل النشاط"
        description="مركز تدقيق احترافي لكل قرار إداري مع الفلاتر، البحث، والعرض الزمني."
      />
      {canViewAuditLogs(role) ? <AdminActivityLogList role={role} adminEmail={profile.email} logs={logs} /> : <AdminAccessDenied />}
    </div>
  );
}
