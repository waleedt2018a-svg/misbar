import { AdminInbox } from "@/components/admin/AdminInbox";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { getAdminInboxItems } from "@/lib/admin/review-persistence";
import { requireAdminRole } from "@/lib/auth/guards";
import { getAccessToken } from "@/lib/supabase/rest";

export default async function AdminInboxPage() {
  await requireAdminRole();
  const accessToken = await getAccessToken();
  const items = accessToken ? await getAdminInboxItems(accessToken) : [];

  return (
    <div>
      <AdminSectionHeader
        title="الوارد الإداري"
        description="طابور عمليات موحد يعتمد على Supabase ويعرض فقط العناصر التي تنتظر قرارًا إداريًا."
      />
      <AdminInbox items={items} />
    </div>
  );
}
