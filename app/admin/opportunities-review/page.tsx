import { pendingOpportunities } from "@/data/admin";
import { AdminReviewList } from "@/components/admin/AdminReviewList";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { requireAdminRole } from "@/lib/auth/guards";
import type { AdminRole } from "@/lib/auth/types";

export default async function AdminOpportunitiesReviewPage() {
  const profile = await requireAdminRole();

  return (
    <div>
      <AdminSectionHeader
        title="مراجعة الفرص البحثية"
        description="راجع فرص أعضاء هيئة التدريس قبل نشرها للطلاب."
      />
      <AdminReviewList
        items={pendingOpportunities}
        role={profile.role as AdminRole}
        emptyMessage="لا توجد فرص بانتظار المراجعة"
      />
    </div>
  );
}
