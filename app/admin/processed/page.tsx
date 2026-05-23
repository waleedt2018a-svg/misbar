import { AdminProcessed } from "@/components/admin/AdminProcessed";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { getAdminProcessedItems } from "@/lib/admin/review-persistence";
import { requireAdminRole } from "@/lib/auth/guards";
import { getAccessToken } from "@/lib/supabase/rest";

export default async function AdminProcessedPage() {
  await requireAdminRole();
  const accessToken = await getAccessToken();
  const items = accessToken ? await getAdminProcessedItems(accessToken) : [];

  return (
    <div>
      <AdminSectionHeader
        title="المعالجة والأرشيف"
        description="أرشيف تاريخي للقرارات المحفوظة في Supabase مع فلاتر حسب النوع والحالة والأدمن والسبب."
      />
      <AdminProcessed items={items} />
    </div>
  );
}
