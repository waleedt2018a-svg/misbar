import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { AdminWarnings } from "@/components/admin/AdminWarnings";
import { requireAdminRole } from "@/lib/auth/guards";

export default async function AdminWarningsPage() {
  const profile = await requireAdminRole();

  return (
    <div>
      <AdminSectionHeader
        title="التنبيهات"
        description="إرسال ومراجعة التنبيهات الإدارية. عند وصول المستخدم إلى 3 تنبيهات تظهر توصية بمراجعة الحظر."
      />
      <AdminWarnings issuedBy={profile.full_name} />
    </div>
  );
}
