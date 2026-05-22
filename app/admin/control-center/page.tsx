import { AdminAccessDenied } from "@/components/admin/AdminAccessDenied";
import { AdminControlCenter } from "@/components/admin/AdminControlCenter";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { requireAdminRole } from "@/lib/auth/guards";
import { canManageEverything } from "@/lib/admin/permissions";
import type { AdminRole } from "@/lib/auth/types";

export default async function AdminControlCenterPage() {
  const profile = await requireAdminRole();
  const role = profile.role as AdminRole;

  return (
    <div>
      <AdminSectionHeader
        title="مركز التحكم"
        description="تحكم مركزي كامل بجميع المستخدمين والمحتوى والبلاغات والتنبيهات والأدوار. متاح للسوبر أدمن فقط."
      />
      {canManageEverything(role) ? <AdminControlCenter /> : <AdminAccessDenied />}
    </div>
  );
}
