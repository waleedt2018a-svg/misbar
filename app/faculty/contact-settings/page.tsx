import { FacultyContactSettingsForm } from "@/components/faculty/FacultyContactSettingsForm";
import { FacultySectionHeader } from "@/components/faculty/FacultySectionHeader";
import { requireRole } from "@/lib/auth/guards";

export default async function FacultyContactSettingsPage() {
  const profile = await requireRole("faculty");

  return (
    <div>
      <FacultySectionHeader
        title="إعدادات التواصل"
        description="اختر طريقة مشاركة بيانات التواصل. لن تظهر هذه البيانات للطلاب إلا بعد القبول."
      />
      <FacultyContactSettingsForm email={profile.email} phoneNumber={profile.phone_number} />
    </div>
  );
}
