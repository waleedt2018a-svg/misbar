"use client";

import { useState } from "react";
import { incomingJoinRequests } from "@/data/student";
import type { IncomingIdeaJoinRequest } from "@/data/student";
import { EmptyState } from "@/components/student/EmptyState";
import { StatusBadge } from "@/components/student/StatusBadge";
import { StudentCard } from "@/components/student/StudentCard";
import { StudentSectionHeader } from "@/components/student/StudentSectionHeader";

export function IdeaJoinRequests() {
  const [requests, setRequests] = useState<IncomingIdeaJoinRequest[]>(
    Array.isArray(incomingJoinRequests) ? incomingJoinRequests : []
  );
  const [message, setMessage] = useState("");
  const safeRequests = Array.isArray(requests) ? requests : [];

  function updateStatus(id: string, status: "مقبول" | "مرفوض") {
    setRequests((current) =>
      current.map((request) => {
        const acceptedTeamMembers =
          typeof request.acceptedTeamMembers === "number" ? request.acceptedTeamMembers : 0;
        const requiredTeamMembers =
          typeof request.ideaRequiredTeamMembers === "number" ? request.ideaRequiredTeamMembers : 0;

        return request.id === id
          ? {
              ...request,
              status,
              acceptedTeamMembers:
                status === "مقبول" && request.status !== "مقبول"
                  ? Math.min(acceptedTeamMembers + 1, requiredTeamMembers)
                  : acceptedTeamMembers
            }
          : request;
      })
    );

    setMessage(
      status === "مقبول"
        ? "تم قبول الطلب ومشاركة بيانات التواصل حسب إعدادات الخصوصية."
        : "تم رفض الطلب."
    );
  }

  return (
    <div>
      <StudentSectionHeader
        title="طلبات الانضمام لفكرتي"
        description="راجع ملخصات الطلاب المهتمين بالانضمام إلى أفكارك دون إظهار البريد الإلكتروني أو رقم الجوال قبل القبول."
      />

      {message ? (
        <p className="mb-6 rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm font-bold text-gold-light">
          {message}
        </p>
      ) : null}

      {safeRequests.length === 0 ? (
        <EmptyState message="لا توجد طلبات حاليًا" />
      ) : (
        <div className="grid gap-5">
          {safeRequests.map((request, index) => {
            const acceptedTeamMembers =
              typeof request.acceptedTeamMembers === "number" ? request.acceptedTeamMembers : 0;
            const requiredTeamMembers =
              typeof request.ideaRequiredTeamMembers === "number" ? request.ideaRequiredTeamMembers : 0;
            const remaining = Math.max(
              requiredTeamMembers - acceptedTeamMembers,
              0
            );
            const researchInterests = Array.isArray(request.researchInterests)
              ? request.researchInterests
              : [];
            const researchSkills = Array.isArray(request.researchSkills)
              ? request.researchSkills
              : [];
            const technicalSkills = Array.isArray(request.technicalSkills)
              ? request.technicalSkills
              : [];

            return (
              <StudentCard key={request.id || `join-request-${index}`}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-gold-light">
                      {request.ideaTitle || "فكرة بحثية"}
                    </p>
                    <h3 className="mt-2 text-2xl font-extrabold text-ivory">
                      {request.studentName || "طالب مهتم"}
                    </h3>
                  </div>
                  <StatusBadge status={request.status || "قيد المراجعة"} />
                </div>

                <div className="mt-5 grid gap-3 text-sm leading-7 text-muted md:grid-cols-3">
                  <p><span className="font-bold text-ivory">الكلية: </span>{request.college || "غير محدد"}</p>
                  <p><span className="font-bold text-ivory">التخصص: </span>{request.major || "غير محدد"}</p>
                  <p><span className="font-bold text-ivory">المستوى الدراسي: </span>{request.academicLevel || "غير محدد"}</p>
                  <p><span className="font-bold text-ivory">عدد أعضاء الفريق المطلوب: </span>{requiredTeamMembers}</p>
                  <p><span className="font-bold text-ivory">المقبولون: </span>{acceptedTeamMembers}</p>
                  <p><span className="font-bold text-ivory">المتبقي: </span>{remaining}</p>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <p className="leading-8 text-muted"><span className="font-bold text-ivory">نبذة تعريفية: </span>{request.bio || "لم تتم إضافة نبذة بعد."}</p>
                  <p className="leading-8 text-muted"><span className="font-bold text-ivory">الاهتمامات البحثية: </span>{researchInterests.length ? researchInterests.join("، ") : "غير محدد"}</p>
                  <p className="leading-8 text-muted"><span className="font-bold text-ivory">المهارات البحثية: </span>{researchSkills.length ? researchSkills.join("، ") : "غير محدد"}</p>
                  <p className="leading-8 text-muted"><span className="font-bold text-ivory">المهارات التقنية: </span>{technicalSkills.length ? technicalSkills.join("، ") : "غير محدد"}</p>
                  {request.achievements ? (
                    <p className="leading-8 text-muted"><span className="font-bold text-ivory">الإنجازات: </span>{request.achievements}</p>
                  ) : null}
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    disabled={request.status !== "قيد المراجعة"}
                    onClick={() => updateStatus(request.id, "مقبول")}
                    className="rounded-full bg-gold px-5 py-2.5 text-sm font-extrabold text-navy transition hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    قبول
                  </button>
                  <button
                    type="button"
                    disabled={request.status !== "قيد المراجعة"}
                    onClick={() => updateStatus(request.id, "مرفوض")}
                    className="rounded-full border border-gold/35 px-5 py-2.5 text-sm font-extrabold text-ivory transition hover:border-gold hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    رفض
                  </button>
                </div>
              </StudentCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
