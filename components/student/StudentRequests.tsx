"use client";

import { useEffect, useMemo, useState } from "react";
import { mockRequests } from "@/data/student";
import { getOpportunityApplications } from "@/lib/student/storage";
import type { StudentRequest } from "@/data/student";
import { EmptyState } from "@/components/student/EmptyState";
import { StatusBadge } from "@/components/student/StatusBadge";
import { StudentCard } from "@/components/student/StudentCard";
import { StudentSectionHeader } from "@/components/student/StudentSectionHeader";

const sections = [
  "طلباتي على الفرص البحثية",
  "طلبات انضمامي لأفكار الطلاب",
  "طلبات واردة على أفكاري"
];

function belongsToSection(request: StudentRequest, section: string) {
  if (section === "طلباتي على الفرص البحثية") {
    return request?.type === section || request?.type === "طلب على فرصة بحثية";
  }

  if (section === "طلبات انضمامي لأفكار الطلاب") {
    return request?.type === section || request?.type === "طلب انضمام لفكرة طالب";
  }

  return request?.type === section || request?.type === "طلب وارد على فكرتي";
}

export function StudentRequests() {
  const [requests, setRequests] = useState<StudentRequest[]>(
    Array.isArray(mockRequests) ? mockRequests : []
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const applications = getOpportunityApplications().map<StudentRequest>((application) => ({
      id: application?.id || `application-${application?.opportunityId || Date.now()}`,
      title: application?.title || "فرصة بحثية",
      type: "طلباتي على الفرص البحثية",
      date: application?.createdAt || "غير محدد",
      status: application?.status || "قيد المراجعة",
      otherParty: application?.facultyName || "عضو هيئة التدريس"
    }));

    setRequests([...applications, ...(Array.isArray(mockRequests) ? mockRequests : [])]);
    setIsLoading(false);
  }, []);

  const requestsBySection = useMemo(
    () =>
      sections.map((section) => ({
        section,
        items: (Array.isArray(requests) ? requests : []).filter((request) =>
          belongsToSection(request, section)
        )
      })),
    [requests]
  );

  return (
    <div>
      <StudentSectionHeader
        title="طلباتي"
        description="متابعة موحدة لكل طلبات الفرص البحثية وطلبات الانضمام والأفكار الواردة."
      />

      <div className="grid gap-6">
        {isLoading ? (
          <StudentCard>
            <p className="font-bold text-gold-light">جاري تحميل الطلبات...</p>
          </StudentCard>
        ) : null}

        {requestsBySection.map(({ section, items }) => (
          <section key={section}>
            <h3 className="mb-4 text-xl font-extrabold text-ivory">{section}</h3>
            {items.length === 0 ? (
              <EmptyState message="لا توجد طلبات حاليًا" />
            ) : (
              <div className="grid gap-4 xl:grid-cols-2">
                {items.map((request, index) => (
                  <StudentCard key={request.id || `request-${index}`}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h4 className="text-xl font-extrabold leading-8 text-ivory">
                        {request.title || "طلب بحثي"}
                      </h4>
                      <StatusBadge status={request.status || "قيد المراجعة"} />
                    </div>
                    <div className="mt-4 grid gap-3 text-sm leading-7 text-muted sm:grid-cols-2">
                      <p><span className="font-bold text-ivory">النوع: </span>{request.type || "طلب"}</p>
                      <p><span className="font-bold text-ivory">التاريخ: </span>{request.date || "غير محدد"}</p>
                      <p><span className="font-bold text-ivory">الطرف الآخر: </span>{request.otherParty || "غير محدد"}</p>
                    </div>
                    <button className="mt-5 rounded-full border border-gold/35 px-5 py-2.5 text-sm font-extrabold text-ivory transition hover:border-gold hover:bg-gold/10">
                      عرض التفاصيل
                    </button>
                  </StudentCard>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
