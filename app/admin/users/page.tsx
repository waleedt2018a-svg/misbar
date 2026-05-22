import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { requireAdminRole } from "@/lib/auth/guards";
import type { AdminRole } from "@/lib/auth/types";

export default async function AdminUsersPage() {
  const profile = await requireAdminRole();

  return (
    <div>
      <AdminSectionHeader
        title="إدارة المستخدمين"
        description="إدارة حالة المستخدمين والتنبيهات والصلاحيات وفق دورك الإداري."
      />
      <AdminUsers role={profile.role as AdminRole} />
    </div>
  );
}
