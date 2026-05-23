"use client";

import { useEffect, useState } from "react";
import {
  getOpportunityApplications,
  getResearchProfile,
  isResearchProfileComplete,
  saveOpportunityApplications
} from "@/lib/student/storage";
import type { StoredOpportunityApplication } from "@/lib/student/types";
import type { StudentOpportunity } from "@/data/student";
import { BlockedFeatureNotice } from "@/components/student/BlockedFeatureNotice";
import { EmptyState } from "@/components/student/EmptyState";
import { StatusBadge } from "@/components/student/StatusBadge";
import { StudentCard } from "@/components/student/StudentCard";
import { StudentSectionHeader } from "@/components/student/StudentSectionHeader";

export function StudentOpportunities() {
  const [applications, setApplications] = useState<StoredOpportunityApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [blockedMessage, setBlockedMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const opportunities: StudentOpportunity[] = [];

  useEffect(() => {
    setApplications(getOpportunityApplications());
    setIsLoading(false);
  }, []);

  function applyToOpportunity(opportunityId: string) {
    const profile = getResearchProfile();

    if (!isResearchProfileComplete(profile)) {
      setBlockedMessage("يرجى إكمال ملفك البحثي قبل التقديم على الفرص البحثية.");
      setSuccessMessage("");
      return;
    }

    const opportunity = opportunities.find((item) => item?.id === opportunityId);

    if (!opportunity || opportunity.status === "مغلقة") {
      return;
    }

    const exists = applications.some((application) => application?.opportunityId === opportunityId);

    if (exists) {
      setSuccessMessage("طلبك على هذه الفرصة موجود بالفعل وحالته قيد المراجعة.");
      setBlockedMessage("");
      return;
    }

    const nextApplications: StoredOpportunityApplication[] = [
      ...applications,
      {
        id: `app-${opportunityId}-${Date.now()}`,
        opportunityId,
        title: opportunity.title,
        facultyName: opportunity.facultyName,
        status: "قيد المراجعة",
        createdAt: new Date().toISOString().slice(0, 10)
      }
    ];

    setApplications(nextApplications);
    saveOpportunityApplications(nextApplications);
    setBlockedMessage("");
    setSuccessMessage("تم إرسال طلبك وأصبحت حالته قيد المراجعة.");
  }

  return (
    <div>
      <StudentSectionHeader
        title="الفرص البحثية"
        description="استعرض الفرص البحثية المناسبة وقدم اهتمامك دون مشاركة بيانات التواصل في مرحلة التقديم."
      />

      <div className="mb-6 grid gap-4">
        {isLoading ? (
          <StudentCard>
            <p className="font-bold text-gold-light">جاري تحميل الفرص البحثية...</p>
          </StudentCard>
        ) : null}
        {blockedMessage ? <BlockedFeatureNotice message={blockedMessage} /> : null}
        {successMessage ? (
          <p className="rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm font-bold text-gold-light">
            {successMessage}
          </p>
        ) : null}
      </div>

      {opportunities.length === 0 ? (
        <EmptyState message="لا توجد فرص بحثية حاليًا" />
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {opportunities.map((opportunity) => {
            const requiredMajors = Array.isArray(opportunity.requiredMajors)
              ? opportunity.requiredMajors
              : [];
            const requiredSkills = Array.isArray(opportunity.requiredSkills)
              ? opportunity.requiredSkills
              : [];
            const application = applications.find(
              (item) => item?.opportunityId === opportunity.id
            );

            return (
              <StudentCard key={opportunity.id}>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={opportunity.status} />
                  <span className="rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-xs font-bold text-gold-light">
                    {opportunity.workMode}
                  </span>
                  {application ? <StatusBadge status={application.status} /> : null}
                </div>
                <h3 className="mt-5 text-2xl font-extrabold leading-9 text-ivory">
                  {opportunity.title}
                </h3>
                <div className="mt-4 grid gap-3 text-sm leading-7 text-muted md:grid-cols-2">
                  <p><span className="font-bold text-ivory">عضو هيئة التدريس: </span>{opportunity.facultyName}</p>
                  <p><span className="font-bold text-ivory">الكلية: </span>{opportunity.college}</p>
                  <p><span className="font-bold text-ivory">القسم: </span>{opportunity.department}</p>
                  <p><span className="font-bold text-ivory">المجال البحثي: </span>{opportunity.field}</p>
                  <p><span className="font-bold text-ivory">عدد الطلاب المطلوب: </span>{opportunity.requiredStudents}</p>
                  <p><span className="font-bold text-ivory">التخصصات المطلوبة: </span>{requiredMajors.length ? requiredMajors.join("، ") : "غير محدد"}</p>
                </div>
                <p className="mt-4 leading-8 text-muted">{opportunity.description}</p>
                <p className="mt-4 leading-8 text-muted">
                  <span className="font-bold text-ivory">المهارات المطلوبة: </span>
                  {requiredSkills.length ? requiredSkills.join("، ") : "غير محدد"}
                </p>
                <button
                  type="button"
                  disabled={Boolean(application) || opportunity.status === "مغلقة"}
                  onClick={() => applyToOpportunity(opportunity.id)}
                  className="mt-6 rounded-full border border-gold/35 px-5 py-2.5 text-sm font-extrabold text-ivory transition hover:border-gold hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {application ? "تم إبداء الاهتمام" : "إبداء الاهتمام"}
                </button>
              </StudentCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
