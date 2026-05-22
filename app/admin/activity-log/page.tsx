import { AdminAccessDenied } from "@/components/admin/AdminAccessDenied";
import { AdminActivityLogList } from "@/components/admin/AdminActivityLogList";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { requireAdminRole } from "@/lib/auth/guards";
import { canViewAuditLogs } from "@/lib/admin/permissions";
import type { AdminRole } from "@/lib/auth/types";

export default async function AdminActivityLogPage() {
  const profile = await requireAdminRole();
  const role = profile.role as AdminRole;

  return (
    <div>
      <AdminSectionHeader
        title="سجل نشاط الأدمنز"
        description="تابع من اعتمد أو رفض أو حظر أو أرسل تنبيهًا أو غيّر صلاحية داخل المنصة."
      />
      {canViewAuditLogs(role) ? <AdminActivityLogList /> : <AdminAccessDenied />}
    </div>
  );
}
