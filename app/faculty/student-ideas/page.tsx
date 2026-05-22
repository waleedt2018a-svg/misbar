import { FacultySectionHeader } from "@/components/faculty/FacultySectionHeader";
import { FacultyStudentIdeas } from "@/components/faculty/FacultyStudentIdeas";

export default function FacultyStudentIdeasPage() {
  return (
    <div>
      <FacultySectionHeader
        title="أفكار الطلاب"
        description="استعرض أفكار الطلاب التي يمكن أن تناسب مجالات إشرافك. إبداء الاهتمام يتطلب ملفًا أكاديميًا مكتملًا."
      />
      <FacultyStudentIdeas />
    </div>
  );
}
