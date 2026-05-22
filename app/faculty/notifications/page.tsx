import { FacultyNotifications } from "@/components/faculty/FacultyNotifications";
import { FacultySectionHeader } from "@/components/faculty/FacultySectionHeader";

export default function FacultyNotificationsPage() {
  return (
    <div>
      <FacultySectionHeader
        title="الإشعارات"
        description="آخر التحديثات المتعلقة بفرصك البحثية واهتمامات الإشراف وبيانات التواصل."
      />
      <FacultyNotifications />
    </div>
  );
}
