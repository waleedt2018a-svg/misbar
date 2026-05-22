"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { StoredStudentIdea } from "@/lib/student/types";
import { getStoredIdeas } from "@/lib/student/storage";
import { EmptyState } from "@/components/student/EmptyState";
import { StatusBadge } from "@/components/student/StatusBadge";
import { StudentCard } from "@/components/student/StudentCard";
import { StudentSectionHeader } from "@/components/student/StudentSectionHeader";

export function StudentIdeas() {
  const [ideas, setIdeas] = useState<StoredStudentIdea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const safeIdeas = Array.isArray(ideas) ? ideas : [];

  useEffect(() => {
    setIdeas(getStoredIdeas());
    setIsLoading(false);
  }, []);

  return (
    <div>
      <StudentSectionHeader
        title="أفكاري البحثية"
        description="أنشئ أفكارك واحفظها كمسودة أو أرسلها للمراجعة عندما يكتمل ملفك البحثي."
        action={
          <Link
            href="/student/ideas/new"
            className="rounded-full bg-gold px-5 py-2.5 text-sm font-extrabold text-navy shadow-glow transition hover:bg-gold-light"
          >
            إنشاء فكرة جديدة
          </Link>
        }
      />

      {isLoading ? (
        <StudentCard>
          <p className="font-bold text-gold-light">جاري تحميل أفكارك البحثية...</p>
        </StudentCard>
      ) : safeIdeas.length === 0 ? (
        <EmptyState message="لا توجد أفكار بحثية بعد" />
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {safeIdeas.map((idea, index) => (
            <StudentCard key={idea.id || `idea-${index}`}>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={idea.status || "مسودة"} />
                <span className="rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-xs font-bold text-gold-light">
                  {idea.field || "غير محدد"}
                </span>
              </div>
              <h3 className="mt-5 text-2xl font-extrabold leading-9 text-ivory">
                {idea.title || "فكرة بحثية بدون عنوان"}
              </h3>
              <p className="mt-4 leading-8 text-muted">
                {idea.researchProblem || "لم تتم إضافة المشكلة البحثية بعد."}
              </p>
              <div className="mt-5 grid gap-3 text-sm text-muted sm:grid-cols-2">
                <p><span className="font-bold text-ivory">تحتاج مشرف؟ </span>{idea.needsSupervisor ? "نعم" : "لا"}</p>
                <p><span className="font-bold text-ivory">تحتاج فريق؟ </span>{idea.needsTeam ? "نعم" : "لا"}</p>
                <p><span className="font-bold text-ivory">عدد الفريق المطلوب: </span>{idea.requiredTeamMembers ?? 0}</p>
                <p><span className="font-bold text-ivory">المقبولون: </span>{idea.acceptedTeamMembers ?? 0}</p>
              </div>
            </StudentCard>
          ))}
        </div>
      )}
    </div>
  );
}
