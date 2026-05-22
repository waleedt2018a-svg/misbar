"use client";

import { useEffect, useState } from "react";
import type { FacultyAcademicProfileDraft } from "@/lib/faculty/types";
import {
  emptyFacultyAcademicProfile,
  getFacultyAcademicProfile,
  saveFacultyAcademicProfile
} from "@/lib/faculty/storage";

const inputClass =
  "w-full rounded-2xl border border-gold/20 bg-white px-4 py-3 text-ivory outline-none transition placeholder:text-muted/55 focus:border-gold focus:ring-4 focus:ring-gold/10";

function Field({
  label,
  name,
  value,
  onChange,
  rows = 1,
  placeholder
}: {
  label: string;
  name: keyof FacultyAcademicProfileDraft;
  value: string;
  onChange: (name: keyof FacultyAcademicProfileDraft, value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-ivory">{label}</span>
      {rows > 1 ? (
        <textarea
          className={inputClass}
          rows={rows}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(name, event.target.value)}
        />
      ) : (
        <input
          className={inputClass}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(name, event.target.value)}
        />
      )}
    </label>
  );
}

export function FacultyAcademicProfileForm() {
  const [profile, setProfile] = useState<FacultyAcademicProfileDraft>(emptyFacultyAcademicProfile);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setProfile(getFacultyAcademicProfile());
  }, []);

  function updateField(name: keyof FacultyAcademicProfileDraft, value: string) {
    setSaved(false);
    setProfile((currentProfile) => ({ ...currentProfile, [name]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfile(saveFacultyAcademicProfile(profile));
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <Field label="نبذة أكاديمية" name="academicBio" value={profile.academicBio} onChange={updateField} rows={4} />
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="الاهتمامات البحثية" name="researchInterests" value={profile.researchInterests} onChange={updateField} placeholder="افصل بينها بفواصل" />
        <Field label="المجالات البحثية" name="researchFields" value={profile.researchFields} onChange={updateField} placeholder="افصل بينها بفواصل" />
      </div>
      <Field label="الخبرات البحثية" name="researchExperience" value={profile.researchExperience} onChange={updateField} rows={3} />
      <Field label="الأبحاث المنشورة" name="publications" value={profile.publications} onChange={updateField} rows={3} />
      <Field label="المشاريع السابقة" name="previousProjects" value={profile.previousProjects} onChange={updateField} rows={3} />

      <div className="rounded-3xl border border-gold/20 bg-gold/5 p-5">
        <h3 className="mb-5 text-xl font-extrabold text-ivory">روابط اختيارية</h3>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Google Scholar" name="googleScholarUrl" value={profile.googleScholarUrl} onChange={updateField} />
          <Field label="ORCID" name="orcidUrl" value={profile.orcidUrl} onChange={updateField} />
          <Field label="ResearchGate" name="researchgateUrl" value={profile.researchgateUrl} onChange={updateField} />
          <Field label="LinkedIn" name="linkedinUrl" value={profile.linkedinUrl} onChange={updateField} />
          <Field label="رابط السيرة الذاتية CV" name="cvUrl" value={profile.cvUrl} onChange={updateField} />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-bold text-muted">
          حالة الملف: {profile.isComplete ? "مكتمل" : "غير مكتمل"}
        </p>
        {saved ? (
          <p className="rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm font-bold text-gold">
            تم حفظ الملف الأكاديمي.
          </p>
        ) : null}
        <button
          type="submit"
          className="rounded-full bg-gold px-7 py-3 font-extrabold text-navy shadow-glow transition hover:bg-gold-light"
        >
          حفظ الملف الأكاديمي
        </button>
      </div>
    </form>
  );
}
