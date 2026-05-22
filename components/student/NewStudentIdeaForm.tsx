"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  getResearchProfile,
  getStoredIdeas,
  isResearchProfileComplete,
  saveStoredIdeas
} from "@/lib/student/storage";
import type { IdeaStatus } from "@/data/student";
import type { StoredStudentIdea } from "@/lib/student/types";
import { BlockedFeatureNotice } from "@/components/student/BlockedFeatureNotice";
import { StudentCard } from "@/components/student/StudentCard";
import { StudentSectionHeader } from "@/components/student/StudentSectionHeader";

const inputClass =
  "w-full rounded-2xl border border-gold/20 bg-navy/70 px-4 py-3 text-ivory outline-none transition placeholder:text-muted/55 focus:border-gold focus:ring-4 focus:ring-gold/10";

type IdeaForm = {
  title: string;
  researchProblem: string;
  description: string;
  field: string;
  needsSupervisor: boolean;
  needsTeam: boolean;
  requiredTeamMembers: string;
  requiredMajors: string;
  requiredSkills: string;
  notes: string;
};

const initialForm: IdeaForm = {
  title: "",
  researchProblem: "",
  description: "",
  field: "",
  needsSupervisor: true,
  needsTeam: true,
  requiredTeamMembers: "1",
  requiredMajors: "",
  requiredSkills: "",
  notes: ""
};

export function NewStudentIdeaForm() {
  const router = useRouter();
  const [form, setForm] = useState<IdeaForm>(initialForm);
  const [error, setError] = useState("");
  const [blocked, setBlocked] = useState(false);

  function updateField<T extends keyof IdeaForm>(field: T, value: IdeaForm[T]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function saveIdea(status: IdeaStatus) {
    setError("");
    setBlocked(false);

    if (!form.title.trim()) {
      setError("يرجى إدخال عنوان الفكرة");
      return;
    }

    if (!form.researchProblem.trim()) {
      setError("يرجى إدخال المشكلة البحثية");
      return;
    }

    if (status === "قيد المراجعة" && !isResearchProfileComplete(getResearchProfile())) {
      setBlocked(true);
      return;
    }

    const ideas = getStoredIdeas();
    const nextIdea: StoredStudentIdea = {
      id: `idea-${Date.now()}`,
      title: form.title,
      researchProblem: form.researchProblem,
      description: form.description,
      field: form.field,
      needsSupervisor: form.needsSupervisor,
      needsTeam: form.needsTeam,
      requiredTeamMembers: Number(form.requiredTeamMembers) || 0,
      acceptedTeamMembers: 0,
      requiredMajors: form.requiredMajors,
      requiredSkills: form.requiredSkills,
      notes: form.notes,
      status,
      createdAt: new Date().toISOString().slice(0, 10)
    };

    saveStoredIdeas([nextIdea, ...ideas]);
    router.push("/student/ideas");
  }

  return (
    <div>
      <StudentSectionHeader
        title="فكرة بحثية جديدة"
        description="يمكنك حفظ الفكرة كمسودة في أي وقت، أما إرسالها للمراجعة فيتطلب إكمال الملف البحثي."
      />

      <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
        <StudentCard>
          <div className="grid gap-5">
            <label>
              <span className="mb-2 block text-sm font-bold text-ivory">عنوان الفكرة</span>
              <input className={inputClass} value={form.title} onChange={(event) => updateField("title", event.target.value)} />
            </label>
            <label>
              <span className="mb-2 block text-sm font-bold text-ivory">المشكلة البحثية</span>
              <textarea className={inputClass} rows={3} value={form.researchProblem} onChange={(event) => updateField("researchProblem", event.target.value)} />
            </label>
            <label>
              <span className="mb-2 block text-sm font-bold text-ivory">وصف الفكرة</span>
              <textarea className={inputClass} rows={4} value={form.description} onChange={(event) => updateField("description", event.target.value)} />
            </label>
            <label>
              <span className="mb-2 block text-sm font-bold text-ivory">المجال البحثي</span>
              <input className={inputClass} value={form.field} onChange={(event) => updateField("field", event.target.value)} />
            </label>
          </div>
        </StudentCard>

        <StudentCard>
          <div className="grid gap-5 md:grid-cols-2">
            <label>
              <span className="mb-2 block text-sm font-bold text-ivory">هل تحتاج مشرف؟</span>
              <select className={inputClass} value={form.needsSupervisor ? "yes" : "no"} onChange={(event) => updateField("needsSupervisor", event.target.value === "yes")}>
                <option value="yes">نعم</option>
                <option value="no">لا</option>
              </select>
            </label>
            <label>
              <span className="mb-2 block text-sm font-bold text-ivory">هل تحتاج فريق؟</span>
              <select className={inputClass} value={form.needsTeam ? "yes" : "no"} onChange={(event) => updateField("needsTeam", event.target.value === "yes")}>
                <option value="yes">نعم</option>
                <option value="no">لا</option>
              </select>
            </label>
            <label>
              <span className="mb-2 block text-sm font-bold text-ivory">عدد أعضاء الفريق المطلوب</span>
              <input className={inputClass} type="number" min="0" value={form.requiredTeamMembers} onChange={(event) => updateField("requiredTeamMembers", event.target.value)} />
            </label>
            <label>
              <span className="mb-2 block text-sm font-bold text-ivory">التخصصات المطلوبة</span>
              <input className={inputClass} value={form.requiredMajors} onChange={(event) => updateField("requiredMajors", event.target.value)} />
            </label>
            <label>
              <span className="mb-2 block text-sm font-bold text-ivory">المهارات المطلوبة</span>
              <input className={inputClass} value={form.requiredSkills} onChange={(event) => updateField("requiredSkills", event.target.value)} />
            </label>
            <label>
              <span className="mb-2 block text-sm font-bold text-ivory">ملاحظات إضافية</span>
              <textarea className={inputClass} rows={3} value={form.notes} onChange={(event) => updateField("notes", event.target.value)} />
            </label>
          </div>
        </StudentCard>

        {blocked ? <BlockedFeatureNotice message="يرجى إكمال ملفك البحثي قبل استخدام هذه الميزة." /> : null}
        {error ? (
          <p className="rounded-2xl border border-red-300/30 bg-red-950/25 px-4 py-3 text-sm font-bold text-red-100">
            {error}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => saveIdea("مسودة")}
            className="rounded-full border border-gold/35 px-6 py-3 font-extrabold text-ivory transition hover:border-gold hover:bg-gold/10"
          >
            حفظ كمسودة
          </button>
          <button
            type="button"
            onClick={() => saveIdea("قيد المراجعة")}
            className="rounded-full bg-gold px-6 py-3 font-extrabold text-navy shadow-glow transition hover:bg-gold-light"
          >
            إرسال للمراجعة
          </button>
        </div>
      </form>
    </div>
  );
}
