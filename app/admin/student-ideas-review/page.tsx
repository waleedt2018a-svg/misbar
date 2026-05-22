import { pendingStudentIdeas } from "@/data/admin";
import { AdminReviewList } from "@/components/admin/AdminReviewList";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { requireAdminRole } from "@/lib/auth/guards";
import type { AdminRole } from "@/lib/auth/types";

export default async function AdminStudentIdeasReviewPage() {
  const profile = await requireAdminRole();

  return (
    <div>
      <AdminSectionHeader
        title="مراجعة أفكار الطلاب"
        description="راجع أفكار الطلاب قبل إتاحتها للتفاعل والإشراف."
      />
      <AdminReviewList
        items={pendingStudentIdeas}
        role={profile.role as AdminRole}
        emptyMessage="لا توجد أفكار بانتظار المراجعة"
      />
    </div>
  );
}
