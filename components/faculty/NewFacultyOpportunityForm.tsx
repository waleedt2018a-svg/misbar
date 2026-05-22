"use client";

import Link from "next/link";
import { useState } from "react";
import { FacultyBlockedFeatureNotice } from "@/components/faculty/FacultyBlockedFeatureNotice";
import {
  getFacultyAcademicProfile,
  getFacultyOpportunities,
  saveFacultyOpportunities
} from "@/lib/faculty/storage";
import type { FacultyWorkMode, StoredFacultyOpportunity } from "@/lib/faculty/types";

const inputClass =
  "w-full rounded-2xl border border-gold/20 bg-white px-4 py-3 text-ivory outline-none transition placeholder:text-muted/55 focus:border-gold focus:ring-4 focus:ring-gold/10";

const initialDraft = {
  title: "",
  description: "",
  researchField: "",
  college: "",
  department: "",
  requiredSkills: "",
  requiredMajors: "",
  requiredStudents: 1,
  workMode: "مختلط" as FacultyWorkMode,
  duration: "",
  deadline: "",
  notes: ""
};

export function NewFacultyOpportunityForm() {
  const [draft, setDraft] = useState(initialDraft);
  const [message, setMessage] = useState("");
  const [blocked, setBlocked] = useState(false);

  function updateField(name: keyof typeof initialDraft, value: string | number) {
    setMessage("");
    setBlocked(false);
    setDraft((current) => ({ ...current, [name]: value }));
  }

  function saveOpportunity(status: StoredFacultyOpportunity["status"]) {
    const profile = getFacultyAcademicProfile();

    if (status === "قيد المراجعة" && !profile.isComplete) {
      setBlocked(true);
      setMessage("");
      return;
    }

    const opportunities = getFacultyOpportunities();
    const opportunity: StoredFacultyOpportunity = {
      id: `faculty-opp-${Date.now()}`,
      ...draft,
      requiredStudents: Number(draft.requiredStudents) || 1,
      status,
      createdAt: new Date().toISOString().slice(0, 10)
    };

    saveFacultyOpportunities([opportunity, ...opportunities]);
    setMessage(status === "مسودة" ? "تم حفظ الفرصة كمسودة." : "تم إرسال الفرصة للمراجعة.");
    setDraft(initialDraft);
  }

  return (
    <form className="grid gap-5" onSubmit={(event) => event.preventDefault()}>
      {blocked ? <FacultyBlockedFeatureNotice /> : null}
      {message ? (
        <p className="rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm font-bold text-gold">
          {message}
        </p>
      ) : null}

      <label>
        <span className="mb-2 block text-sm font-bold text-ivory">عنوان الفرصة</span>
        <input className={inputClass} value={draft.title} onChange={(event) => updateField("title", event.target.value)} />
      </label>

      <label>
        <span className="mb-2 block text-sm font-bold text-ivory">وصف الفرصة</span>
        <textarea className={inputClass} rows={4} value={draft.description} onChange={(event) => updateField("description", event.target.value)} />
      </label>

      <div className="grid gap-5 md:grid-cols-2">
        <label>
          <span className="mb-2 block text-sm font-bold text-ivory">المجال البحثي</span>
          <input className={inputClass} value={draft.researchField} onChange={(event) => updateField("researchField", event.target.value)} />
        </label>
        <label>
          <span className="mb-2 block text-sm font-bold text-ivory">الكلية</span>
          <input className={inputClass} value={draft.college} onChange={(event) => updateField("college", event.target.value)} />
        </label>
        <label>
          <span className="mb-2 block text-sm font-bold text-ivory">القسم</span>
          <input className={inputClass} value={draft.department} onChange={(event) => updateField("department", event.target.value)} />
        </label>
        <label>
          <span className="mb-2 block text-sm font-bold text-ivory">عدد الطلاب المطلوب</span>
          <input className={inputClass} type="number" min={1} value={draft.requiredStudents} onChange={(event) => updateField("requiredStudents", Number(event.target.value))} />
        </label>
        <label>
          <span className="mb-2 block text-sm font-bold text-ivory">المهارات المطلوبة</span>
          <input className={inputClass} value={draft.requiredSkills} onChange={(event) => updateField("requiredSkills", event.target.value)} />
        </label>
        <label>
          <span className="mb-2 block text-sm font-bold text-ivory">التخصصات المطلوبة</span>
          <input className={inputClass} value={draft.requiredMajors} onChange={(event) => updateField("requiredMajors", event.target.value)} />
        </label>
        <label>
          <span className="mb-2 block text-sm font-bold text-ivory">طريقة العمل</span>
          <select className={inputClass} value={draft.workMode} onChange={(event) => updateField("workMode", event.target.value as FacultyWorkMode)}>
            <option>حضوري</option>
            <option>عن بعد</option>
            <option>مختلط</option>
          </select>
        </label>
        <label>
          <span className="mb-2 block text-sm font-bold text-ivory">مدة المشروع</span>
          <input className={inputClass} value={draft.duration} onChange={(event) => updateField("duration", event.target.value)} />
        </label>
        <label>
          <span className="mb-2 block text-sm font-bold text-ivory">موعد الإغلاق</span>
          <input className={inputClass} type="date" value={draft.deadline} onChange={(event) => updateField("deadline", event.target.value)} />
        </label>
      </div>

      <label>
        <span className="mb-2 block text-sm font-bold text-ivory">ملاحظات إضافية</span>
        <textarea className={inputClass} rows={3} value={draft.notes} onChange={(event) => updateField("notes", event.target.value)} />
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Link
          href="/faculty/opportunities"
          className="rounded-full border border-gold/35 px-6 py-3 text-center font-extrabold text-ivory transition hover:border-gold hover:bg-gold/10"
        >
          العودة للفرص
        </Link>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => saveOpportunity("مسودة")}
            className="rounded-full border border-gold/35 px-6 py-3 font-extrabold text-ivory transition hover:border-gold hover:bg-gold/10"
          >
            حفظ كمسودة
          </button>
          <button
            type="button"
            onClick={() => saveOpportunity("قيد المراجعة")}
            className="rounded-full bg-gold px-6 py-3 font-extrabold text-navy shadow-glow transition hover:bg-gold-light"
          >
            إرسال للمراجعة
          </button>
        </div>
      </div>
    </form>
  );
}
