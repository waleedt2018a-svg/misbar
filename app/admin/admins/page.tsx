import { AdminAccessDenied } from "@/components/admin/AdminAccessDenied";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { AdminsManagement } from "@/components/admin/AdminsManagement";
import { requireAdminRole } from "@/lib/auth/guards";

export default async function AdminsPage() {
  const profile = await requireAdminRole();

  return (
    <div>
      <AdminSectionHeader
        title="إدارة الأدمنز"
        description="هذه الصفحة متاحة فقط لصاحب صلاحية super_admin."
      />
      {profile.role === "super_admin" ? <AdminsManagement /> : <AdminAccessDenied />}
    </div>
  );
}
