import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { getAdminUsersFromSupabase } from "@/lib/admin/supabase-data";
import { requireAdminRole } from "@/lib/auth/guards";
import { getAccessToken } from "@/lib/supabase/rest";

export default async function AdminUsersPage() {
  await requireAdminRole();
  const accessToken = await getAccessToken();
  const users = accessToken ? await getAdminUsersFromSupabase(accessToken) : [];

  return (
    <div>
      <AdminSectionHeader
        title="إدارة المستخدمين"
        description="مركز استخبارات المستخدمين للبحث، الفرز، وفهم حالة الطلاب وأعضاء هيئة التدريس والأدمنز."
      />
      <AdminUsers users={users} />
    </div>
  );
}
