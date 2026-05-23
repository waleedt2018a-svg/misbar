import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { AdminWarnings } from "@/components/admin/AdminWarnings";
import { getWarningsFromSupabase } from "@/lib/admin/supabase-data";
import { requireAdminRole } from "@/lib/auth/guards";
import { getAccessToken } from "@/lib/supabase/rest";

export default async function AdminWarningsPage() {
  await requireAdminRole();
  const accessToken = await getAccessToken();
  const warnings = accessToken ? await getWarningsFromSupabase(accessToken) : [];

  return (
    <div>
      <AdminSectionHeader
        title="التنبيهات"
        description="سجل التنبيهات الإدارية المخزنة في Supabase."
      />
      <AdminWarnings warnings={warnings} />
    </div>
  );
}
