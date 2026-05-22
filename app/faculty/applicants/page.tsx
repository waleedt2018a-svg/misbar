import { FacultyApplicants } from "@/components/faculty/FacultyApplicants";
import { FacultySectionHeader } from "@/components/faculty/FacultySectionHeader";

export default function FacultyApplicantsPage() {
  return (
    <div>
      <FacultySectionHeader
        title="المتقدمون على فرصي"
        description="راجع الطلاب المهتمين بفرصك البحثية. بيانات التواصل لا تظهر إلا بعد القبول."
      />
      <FacultyApplicants />
    </div>
  );
}
