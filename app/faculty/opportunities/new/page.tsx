import { FacultyCard } from "@/components/faculty/FacultyCard";
import { FacultySectionHeader } from "@/components/faculty/FacultySectionHeader";
import { NewFacultyOpportunityForm } from "@/components/faculty/NewFacultyOpportunityForm";

export default function NewFacultyOpportunityPage() {
  return (
    <div>
      <FacultySectionHeader
        title="إنشاء فرصة بحثية"
        description="يمكن حفظ المسودة في أي وقت. إرسال الفرصة للمراجعة يتطلب اكتمال الملف الأكاديمي."
      />
      <FacultyCard>
        <NewFacultyOpportunityForm />
      </FacultyCard>
    </div>
  );
}
