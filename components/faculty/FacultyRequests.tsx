import { FacultyCard } from "@/components/faculty/FacultyCard";

const sections = [
  "طلبات الطلاب على فرصي البحثية",
  "اهتماماتي بأفكار الطلاب",
  "الطلبات المقبولة",
  "الطلبات المرفوضة"
];

export function FacultyRequests() {
  return (
    <div className="grid gap-6">
      {sections.map((section) => (
        <FacultyCard key={section}>
          <h3 className="mb-4 text-xl font-extrabold text-ivory">{section}</h3>
          <p className="text-muted">لا توجد عناصر في هذا القسم.</p>
        </FacultyCard>
      ))}
    </div>
  );
}
