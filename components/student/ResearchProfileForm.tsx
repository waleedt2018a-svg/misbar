"use client";

import { useEffect, useState } from "react";
import {
  emptyResearchProfile,
  getResearchProfile,
  saveResearchProfile
} from "@/lib/student/storage";
import type { ResearchProfileDraft } from "@/lib/student/types";
import { StudentCard } from "@/components/student/StudentCard";
import { StudentSectionHeader } from "@/components/student/StudentSectionHeader";

const textInputClass =
  "w-full rounded-2xl border border-gold/20 bg-navy/70 px-4 py-3 text-ivory outline-none transition placeholder:text-muted/55 focus:border-gold focus:ring-4 focus:ring-gold/10";

function Field({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-ivory">{label}</span>
      {children}
    </label>
  );
}

export function ResearchProfileForm() {
  const [profile, setProfile] = useState<ResearchProfileDraft>(emptyResearchProfile);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setProfile(getResearchProfile());
  }, []);

  function updateField(field: keyof ResearchProfileDraft, value: string) {
    setProfile((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const savedProfile = saveResearchProfile(profile);
    setProfile(savedProfile);
    setMessage(
      savedProfile.isComplete
        ? "تم حفظ الملف البحثي واكتماله."
        : "تم حفظ الملف، لكن يرجى إكمال ملفك البحثي قبل استخدام الميزات البحثية."
    );
  }

  return (
    <div>
      <StudentSectionHeader
        title="ملفي البحثي"
        description="هذا الملف لا يُظهر بيانات التواصل، ويُستخدم لتقديم ملخص بحثي عند التقديم على الفرص أو أفكار الطلاب."
      />

      <form onSubmit={handleSubmit} className="space-y-5">
        <StudentCard>
          <div className="grid gap-5">
            <Field label="نبذة تعريفية">
              <textarea
                className={textInputClass}
                rows={4}
                value={profile.bio}
                onChange={(event) => updateField("bio", event.target.value)}
                required
              />
            </Field>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="الاهتمامات البحثية">
                <textarea
                  className={textInputClass}
                  rows={3}
                  value={profile.researchInterests}
                  onChange={(event) => updateField("researchInterests", event.target.value)}
                  required
                />
              </Field>
              <Field label="المهارات البحثية">
                <textarea
                  className={textInputClass}
                  rows={3}
                  value={profile.researchSkills}
                  onChange={(event) => updateField("researchSkills", event.target.value)}
                  required
                />
              </Field>
              <Field label="المهارات التقنية">
                <textarea
                  className={textInputClass}
                  rows={3}
                  value={profile.technicalSkills}
                  onChange={(event) => updateField("technicalSkills", event.target.value)}
                  required
                />
              </Field>
              <Field label="الخبرات السابقة">
                <textarea
                  className={textInputClass}
                  rows={3}
                  value={profile.experiences}
                  onChange={(event) => updateField("experiences", event.target.value)}
                  required
                />
              </Field>
            </div>
            <Field label="الإنجازات">
              <textarea
                className={textInputClass}
                rows={3}
                value={profile.achievements}
                onChange={(event) => updateField("achievements", event.target.value)}
                required
              />
            </Field>
          </div>
        </StudentCard>

        <StudentCard>
          <h3 className="mb-5 text-xl font-extrabold text-ivory">روابط اختيارية</h3>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="LinkedIn">
              <input
                className={textInputClass}
                type="url"
                value={profile.linkedinUrl}
                onChange={(event) => updateField("linkedinUrl", event.target.value)}
              />
            </Field>
            <Field label="ORCID">
              <input
                className={textInputClass}
                type="url"
                value={profile.orcidUrl}
                onChange={(event) => updateField("orcidUrl", event.target.value)}
              />
            </Field>
            <Field label="Google Scholar">
              <input
                className={textInputClass}
                type="url"
                value={profile.googleScholarUrl}
                onChange={(event) => updateField("googleScholarUrl", event.target.value)}
              />
            </Field>
            <Field label="رابط السيرة الذاتية CV">
              <input
                className={textInputClass}
                type="url"
                value={profile.cvUrl}
                onChange={(event) => updateField("cvUrl", event.target.value)}
              />
            </Field>
          </div>
        </StudentCard>

        {message ? (
          <p className="rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm font-bold text-gold-light">
            {message}
          </p>
        ) : null}

        <button
          type="submit"
          className="rounded-full bg-gold px-7 py-3 font-extrabold text-navy shadow-glow transition hover:bg-gold-light"
        >
          حفظ الملف البحثي
        </button>
      </form>
    </div>
  );
}
