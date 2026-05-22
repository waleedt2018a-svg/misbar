import { mockFacultyRequests } from "@/data/faculty";
import { FacultyCard } from "@/components/faculty/FacultyCard";
import { FacultyStatusBadge } from "@/components/faculty/FacultyStatusBadge";

const sections = [
  {
    title: "طلبات الطلاب على فرصي البحثية",
    match: (type: string, status: string) => type.includes("فرصة") && status === "قيد المراجعة"
  },
  {
    title: "اهتماماتي بأفكار الطلاب",
    match: (type: string, status: string) => type.includes("إشراف") && status === "قيد المراجعة"
  },
  {
    title: "الطلبات المقبولة",
    match: (_type: string, status: string) => status === "مقبول"
  },
  {
    title: "الطلبات المرفوضة",
    match: (_type: string, status: string) => status === "مرفوض"
  }
];

export function FacultyRequests() {
  return (
    <div className="grid gap-6">
      {sections.map((section) => {
        const requests = mockFacultyRequests.filter((request) => section.match(request.type, request.status));

        return (
          <FacultyCard key={section.title}>
            <h3 className="mb-4 text-xl font-extrabold text-ivory">{section.title}</h3>
            {requests.length ? (
              <div className="grid gap-4">
                {requests.map((request) => (
                  <div key={request.id} className="rounded-3xl border border-gold/15 bg-white p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <FacultyStatusBadge status={request.status} />
                        <h4 className="mt-3 text-xl font-extrabold leading-8 text-ivory">{request.title}</h4>
                      </div>
                      <button className="rounded-full border border-gold/35 px-5 py-2.5 text-sm font-extrabold text-ivory transition hover:border-gold hover:bg-gold/10">
                        عرض التفاصيل
                      </button>
                    </div>
                    <div className="mt-4 grid gap-3 text-sm leading-7 text-muted sm:grid-cols-3">
                      <p><span className="font-bold text-ivory">النوع: </span>{request.type}</p>
                      <p><span className="font-bold text-ivory">الطرف الآخر: </span>{request.otherParty}</p>
                      <p><span className="font-bold text-ivory">التاريخ: </span>{request.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">لا توجد عناصر في هذا القسم.</p>
            )}
          </FacultyCard>
        );
      })}
    </div>
  );
}
