import Link from "next/link";
import { FacultyOpportunities } from "@/components/faculty/FacultyOpportunities";
import { FacultySectionHeader } from "@/components/faculty/FacultySectionHeader";

export default function FacultyOpportunitiesPage() {
  return (
    <div>
      <FacultySectionHeader
        title="فرصي البحثية"
        description="استعرض فرصك الحالية، وأنشئ فرصًا جديدة للطلاب المهتمين بالبحث."
        action={
          <Link
            href="/faculty/opportunities/new"
            className="rounded-full bg-gold px-5 py-2.5 text-sm font-extrabold text-navy shadow-glow transition hover:bg-gold-light"
          >
            إنشاء فرصة بحثية
          </Link>
        }
      />
      <FacultyOpportunities />
    </div>
  );
}
