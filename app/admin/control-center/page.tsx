import { AdminAccessDenied } from "@/components/admin/AdminAccessDenied";
import { AdminControlCenter } from "@/components/admin/AdminControlCenter";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { canManageEverything } from "@/lib/admin/permissions";
import { getAdminInboxItems, getAdminProcessedItems } from "@/lib/admin/review-persistence";
import {
  getAdminActivityLogsFromSupabase,
  getAdminUsersFromSupabase,
  getManagedAdminsFromSupabase,
  getReportsFromSupabase,
  getWarningsFromSupabase
} from "@/lib/admin/supabase-data";
import { requireAdminRole } from "@/lib/auth/guards";
import { getAccessToken } from "@/lib/supabase/rest";
import type { AdminRole } from "@/lib/auth/types";

export default async function AdminControlCenterPage() {
  const profile = await requireAdminRole();
  const role = profile.role as AdminRole;
  const accessToken = await getAccessToken();
  const users = accessToken ? await getAdminUsersFromSupabase(accessToken) : [];
  const admins = accessToken ? await getManagedAdminsFromSupabase(accessToken) : [];
  const inboxItems = accessToken ? await getAdminInboxItems(accessToken) : [];
  const processedItems = accessToken ? await getAdminProcessedItems(accessToken) : [];
  const reports = accessToken ? await getReportsFromSupabase(accessToken) : [];
  const warnings = accessToken ? await getWarningsFromSupabase(accessToken) : [];
  const logs = accessToken ? await getAdminActivityLogsFromSupabase(accessToken) : [];

  return (
    <div>
      <AdminSectionHeader
        title="مركز التحكم"
        description="نظرة موحدة على بيانات Supabase الإدارية، متاحة للسوبر أدمن فقط."
      />
      {canManageEverything(role) ? (
        <AdminControlCenter users={users} admins={admins} inboxItems={inboxItems} processedItems={processedItems} reports={reports} warnings={warnings} logs={logs} />
      ) : (
        <AdminAccessDenied />
      )}
    </div>
  );
}
