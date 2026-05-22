"use client";

import { useEffect, useState } from "react";
import { mockFacultyApplicants } from "@/data/faculty";
import { FacultyCard } from "@/components/faculty/FacultyCard";
import { FacultyEmptyState } from "@/components/faculty/FacultyEmptyState";
import { FacultyStatusBadge } from "@/components/faculty/FacultyStatusBadge";
import { getFacultyApplicants, saveFacultyApplicants } from "@/lib/faculty/storage";
import type { FacultyApplicant, FacultyApplicantStatus } from "@/lib/faculty/types";

function contactDetails(applicant: FacultyApplicant) {
  if (applicant.status !== "مقبول") {
    return null;
  }

  if (applicant.contactPreference === "email") {
    return `البريد الإلكتروني: ${applicant.contactEmail ?? "غير متاح"}`;
  }

  if (applicant.contactPreference === "phone") {
    return `رقم الجوال: ${applicant.contactPhone ?? "غير متاح"}`;
  }

  return `البريد الإلكتروني: ${applicant.contactEmail ?? "غير متاح"} — رقم الجوال: ${applicant.contactPhone ?? "غير متاح"}`;
}

export function FacultyApplicants() {
  const [applicants, setApplicants] = useState<FacultyApplicant[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setApplicants(getFacultyApplicants(mockFacultyApplicants));
  }, []);

  function updateStatus(id: string, status: FacultyApplicantStatus) {
    const nextApplicants = applicants.map((applicant) =>
      applicant.id === id ? { ...applicant, status } : applicant
    );

    setApplicants(nextApplicants);
    saveFacultyApplicants(nextApplicants);
    setMessage(
      status === "مقبول"
        ? "تم قبول الطالب ومشاركة بيانات التواصل حسب إعدادات الخصوصية."
        : status === "مرفوض"
          ? "تم تحديث حالة الطلب إلى مرفوض."
          : "تم تحديث حالة الطلب إلى قائمة انتظار."
    );
  }

  if (!applicants.length) {
    return <FacultyEmptyState message="لا يوجد متقدمون حاليًا" />;
  }

  return (
    <div className="grid gap-5">
      {message ? (
        <p className="rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm font-bold text-gold">
          {message}
        </p>
      ) : null}
      {applicants.map((applicant) => (
        <FacultyCard key={applicant.id}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <FacultyStatusBadge status={applicant.status} />
              <h3 className="mt-4 text-2xl font-extrabold text-ivory">{applicant.studentName}</h3>
              <p className="mt-2 text-sm font-bold text-gold">{applicant.opportunityTitle}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => updateStatus(applicant.id, "مقبول")} className="rounded-full bg-gold px-5 py-2.5 text-sm font-extrabold text-navy transition hover:bg-gold-light">قبول</button>
              <button onClick={() => updateStatus(applicant.id, "مرفوض")} className="rounded-full border border-gold/35 px-5 py-2.5 text-sm font-extrabold text-ivory transition hover:border-gold hover:bg-gold/10">رفض</button>
              <button onClick={() => updateStatus(applicant.id, "قائمة انتظار")} className="rounded-full border border-gold/35 px-5 py-2.5 text-sm font-extrabold text-ivory transition hover:border-gold hover:bg-gold/10">قائمة انتظار</button>
            </div>
          </div>
          <div className="mt-5 grid gap-3 text-sm leading-7 text-muted md:grid-cols-3">
            <p><span className="font-bold text-ivory">الكلية: </span>{applicant.college}</p>
            <p><span className="font-bold text-ivory">التخصص: </span>{applicant.major}</p>
            <p><span className="font-bold text-ivory">المستوى الدراسي: </span>{applicant.academicLevel}</p>
          </div>
          <p className="mt-4 leading-8 text-muted"><span className="font-bold text-ivory">النبذة البحثية: </span>{applicant.bio}</p>
          <p className="mt-3 leading-8 text-muted"><span className="font-bold text-ivory">المهارات البحثية: </span>{applicant.researchSkills.join("، ")}</p>
          <p className="mt-3 leading-8 text-muted"><span className="font-bold text-ivory">المهارات التقنية: </span>{applicant.technicalSkills.join("، ")}</p>
          <p className="mt-3 leading-8 text-muted"><span className="font-bold text-ivory">الاهتمامات البحثية: </span>{applicant.researchInterests.join("، ")}</p>
          {applicant.achievements ? <p className="mt-3 leading-8 text-muted"><span className="font-bold text-ivory">الإنجازات: </span>{applicant.achievements}</p> : null}
          {contactDetails(applicant) ? (
            <p className="mt-4 rounded-2xl border border-gold/20 bg-gold/5 px-4 py-3 text-sm font-bold text-gold">
              {contactDetails(applicant)}
            </p>
          ) : null}
        </FacultyCard>
      ))}
    </div>
  );
}
