import { ContactSettingsForm } from "@/components/student/ContactSettingsForm";
import { requireRole } from "@/lib/auth/guards";

export default async function StudentContactSettingsPage() {
  const profile = await requireRole("student");

  return <ContactSettingsForm email={profile.email} phoneNumber={profile.phone_number ?? ""} />;
}
