import { FacultyAcademicProfileForm } from "@/components/faculty/FacultyAcademicProfileForm";
import { FacultySectionHeader } from "@/components/faculty/FacultySectionHeader";

export default function FacultyProfilePage() {
  return (
    <div>
      <FacultySectionHeader
        title="ملفي الأكاديمي"
        description="أكمل بياناتك الأكاديمية حتى تتمكن من إرسال الفرص للمراجعة وإبداء الاهتمام بالإشراف على أفكار الطلاب."
      />
      <FacultyAcademicProfileForm />
    </div>
  );
}
