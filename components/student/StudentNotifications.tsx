import { EmptyState } from "@/components/student/EmptyState";
import { StudentSectionHeader } from "@/components/student/StudentSectionHeader";

export function StudentNotifications() {
  return (
    <div>
      <StudentSectionHeader
        title="الإشعارات"
        description="آخر التنبيهات المتعلقة بالفرص البحثية والأفكار وبيانات التواصل."
      />

      <EmptyState message="لا توجد إشعارات جديدة" />
    </div>
  );
}
