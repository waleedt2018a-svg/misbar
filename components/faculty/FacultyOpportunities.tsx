"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FacultyCard } from "@/components/faculty/FacultyCard";
import { FacultyEmptyState } from "@/components/faculty/FacultyEmptyState";
import { FacultyStatusBadge } from "@/components/faculty/FacultyStatusBadge";
import { getFacultyOpportunities } from "@/lib/faculty/storage";
import type { StoredFacultyOpportunity } from "@/lib/faculty/types";

export function FacultyOpportunities() {
  const [opportunities, setOpportunities] = useState<StoredFacultyOpportunity[]>([]);

  useEffect(() => {
    setOpportunities(getFacultyOpportunities());
  }, []);

  if (!opportunities.length) {
    return <FacultyEmptyState message="لا توجد فرص بحثية بعد" />;
  }

  return (
    <div className="grid gap-5">
      {opportunities.map((opportunity) => (
        <FacultyCard key={opportunity.id}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <FacultyStatusBadge status={opportunity.status} />
              <h3 className="mt-4 text-2xl font-extrabold leading-9 text-ivory">{opportunity.title}</h3>
            </div>
            <Link
              href="/faculty/opportunities/new"
              className="rounded-full border border-gold/35 px-5 py-2.5 text-sm font-extrabold text-ivory transition hover:border-gold hover:bg-gold/10"
            >
              إنشاء فرصة مشابهة
            </Link>
          </div>
          <p className="mt-4 leading-8 text-muted">{opportunity.description}</p>
          <div className="mt-5 grid gap-3 text-sm leading-7 text-muted md:grid-cols-2">
            <p><span className="font-bold text-ivory">المجال البحثي: </span>{opportunity.researchField}</p>
            <p><span className="font-bold text-ivory">القسم: </span>{opportunity.department}</p>
            <p><span className="font-bold text-ivory">طريقة العمل: </span>{opportunity.workMode}</p>
            <p><span className="font-bold text-ivory">عدد الطلاب المطلوب: </span>{opportunity.requiredStudents}</p>
            <p><span className="font-bold text-ivory">مدة المشروع: </span>{opportunity.duration || "غير محدد"}</p>
            <p><span className="font-bold text-ivory">موعد الإغلاق: </span>{opportunity.deadline || "غير محدد"}</p>
          </div>
        </FacultyCard>
      ))}
    </div>
  );
}
