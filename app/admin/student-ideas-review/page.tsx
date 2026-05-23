import { AdminInbox } from "@/components/admin/AdminInbox";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { getAdminInboxItems } from "@/lib/admin/review-persistence";
import { requireAdminRole } from "@/lib/auth/guards";
import { getAccessToken } from "@/lib/supabase/rest";

export default async function AdminStudentIdeasReviewPage() {
  await requireAdminRole();
  const accessToken = await getAccessToken();
  const items = accessToken ? (await getAdminInboxItems(accessToken)).filter((item) => item.targetType === "idea") : [];

  return (
    <div>
      <AdminSectionHeader
        title="مراجعة أفكار الطلاب"
        description="أفكار الطلاب القادمة من Supabase فقط."
      />
      <AdminInbox items={items} />
    </div>
  );
}
