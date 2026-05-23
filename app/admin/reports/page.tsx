import { AdminReports } from "@/components/admin/AdminReports";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { getReportsFromSupabase } from "@/lib/admin/supabase-data";
import { requireAdminRole } from "@/lib/auth/guards";
import { getAccessToken } from "@/lib/supabase/rest";

export default async function AdminReportsPage() {
  await requireAdminRole();
  const accessToken = await getAccessToken();
  const reports = accessToken ? await getReportsFromSupabase(accessToken) : [];

  return (
    <div>
      <AdminSectionHeader
        title="البلاغات"
        description="متابعة البلاغات الحقيقية المخزنة في Supabase بدون بيانات تجريبية."
      />
      <AdminReports reports={reports} />
    </div>
  );
}
