import { FacultyAcademicProfileForm } from "@/components/faculty/FacultyAcademicProfileForm";
import { FacultyCard } from "@/components/faculty/FacultyCard";
import { FacultySectionHeader } from "@/components/faculty/FacultySectionHeader";

export default function FacultyProfilePage() {
  return (
    <div>
      <FacultySectionHeader
        title="ملفي الأكاديمي"
        description="أكمل بياناتك الأكاديمية حتى تتمكن من إرسال الفرص للمراجعة وإبداء الاهتمام بالإشراف على أفكار الطلاب."
      />
      <FacultyCard>
        <FacultyAcademicProfileForm />
      </FacultyCard>
    </div>
  );
}
