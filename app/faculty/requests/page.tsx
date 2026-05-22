import { FacultyRequests } from "@/components/faculty/FacultyRequests";
import { FacultySectionHeader } from "@/components/faculty/FacultySectionHeader";

export default function FacultyRequestsPage() {
  return (
    <div>
      <FacultySectionHeader
        title="الطلبات"
        description="تابع طلبات الطلاب على فرصك واهتماماتك بالإشراف على أفكار الطلاب."
      />
      <FacultyRequests />
    </div>
  );
}
