"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { FacultyAcademicProfileDraft } from "@/lib/faculty/types";
import {
  emptyFacultyAcademicProfile,
  getFacultyAcademicProfile,
  getFacultyContactSettings,
  isFacultyAcademicProfileComplete,
  isFacultyContactSettingsComplete,
  saveFacultyAcademicProfile,
  splitList
} from "@/lib/faculty/storage";

const inputClass =
  "w-full rounded-2xl border border-gold/20 bg-white px-4 py-3 text-ivory outline-none transition placeholder:text-muted/55 focus:border-gold focus:ring-4 focus:ring-gold/10";

function Field({
  label,
  name,
  value,
  onChange,
  rows = 1,
  helper,
  required,
  placeholder
}: {
  label: string;
  name: keyof FacultyAcademicProfileDraft;
  value: string;
  onChange: (name: keyof FacultyAcademicProfileDraft, value: string) => void;
  rows?: number;
  helper?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-sm font-bold text-ivory">
        {label}
        {required ? <span className="rounded-full bg-gold/15 px-2 py-0.5 text-xs text-gold">مطلوب</span> : null}
      </span>
      {rows > 1 ? (
        <textarea className={inputClass} rows={rows} value={value} placeholder={placeholder} required={required} onChange={(event) => onChange(name, event.target.value)} />
      ) : (
        <input className={inputClass} value={value} placeholder={placeholder} required={required} onChange={(event) => onChange(name, event.target.value)} />
      )}
      {helper ? <span className="mt-2 block text-sm leading-7 text-muted">{helper}</span> : null}
    </label>
  );
}

function BuilderStep({
  number,
  title,
  description,
  complete,
  children
}: {
  number: string;
  title: string;
  description: string;
  complete: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={`rounded-3xl border p-5 transition sm:p-6 ${complete ? "border-gold/35 bg-gold/5" : "border-gold/20 bg-white"}`}>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border text-sm font-extrabold ${complete ? "border-gold bg-gold text-navy" : "border-gold/35 bg-gold/10 text-gold"}`}>
            {number}
          </span>
          <div>
            <h3 className="text-xl font-extrabold text-ivory">{title}</h3>
            <p className="mt-2 leading-7 text-muted">{description}</p>
          </div>
        </div>
        <span className={`w-fit rounded-full px-3 py-1 text-xs font-extrabold ${complete ? "bg-gold/15 text-gold" : "bg-navy/70 text-muted"}`}>
          {complete ? "مكتمل" : "بانتظارك"}
        </span>
      </div>
      <div className="grid gap-5">{children}</div>
    </section>
  );
}

export function FacultyAcademicProfileForm() {
  const [profile, setProfile] = useState<FacultyAcademicProfileDraft>(emptyFacultyAcademicProfile);
  const [contactComplete, setContactComplete] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setProfile(getFacultyAcademicProfile());
    setContactComplete(isFacultyContactSettingsComplete(getFacultyContactSettings()));
  }, []);

  function updateField(name: keyof FacultyAcademicProfileDraft, value: string) {
    setMessage("");
    setProfile((currentProfile) => ({ ...currentProfile, [name]: value }));
  }

  const stepState = useMemo(() => {
    return {
      bio: Boolean(profile.academicBio.trim()),
      interests: splitList(profile.researchInterests).length > 0,
      expertise: splitList(profile.researchFields).length > 0,
      experience: Boolean(profile.researchExperience.trim() || profile.publications.trim() || profile.previousProjects.trim()),
      links: Boolean(profile.googleScholarUrl || profile.orcidUrl || profile.researchgateUrl || profile.linkedinUrl || profile.cvUrl)
    };
  }, [profile]);

  const profileComplete = isFacultyAcademicProfileComplete(profile);
  const progress = Math.round(
    ((stepState.bio ? 1 : 0) +
      (stepState.interests ? 1 : 0) +
      (stepState.expertise ? 1 : 0) +
      (contactComplete ? 1 : 0)) * 25
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const savedProfile = saveFacultyAcademicProfile(profile);
    setProfile(savedProfile);
    setMessage(
      savedProfile.isComplete
        ? contactComplete
          ? "ملفك البحثي مكتمل"
          : "تم حفظ الملف الأكاديمي. تبقّى فقط تحديد طريقة التواصل."
        : "تم حفظ التغييرات. أكمل الحقول المطلوبة حتى يظهر ملفك الأكاديمي كمكتمل."
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="rounded-3xl border border-gold/20 bg-white p-5 shadow-soft-card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-extrabold text-gold">اكتمال الملف: {progress}%</p>
            <h2 className="mt-2 text-2xl font-extrabold text-ivory">
              {profileComplete && contactComplete ? "ملفك البحثي مكتمل" : "ملف أكاديمي موجه وواضح"}
            </h2>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-navy sm:w-64">
            <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <p className="mt-4 leading-8 text-muted">
          لن تظهر بيانات التواصل إلا حسب التفضيل الذي تختاره. يمكنك تعديل هذه الإعدادات لاحقًا.
        </p>
      </div>

      <BuilderStep number="01" title="نبذة تعريفية" description="عرّف باهتماماتك الأكاديمية ومسار إشرافك البحثي." complete={stepState.bio}>
        <Field label="نبذة أكاديمية" name="academicBio" value={profile.academicBio} onChange={updateField} rows={4} required helper="اكتب نبذة مختصرة تساعد الطلبة على فهم مسارك البحثي." />
      </BuilderStep>

      <BuilderStep number="02" title="الاهتمامات والمهارات البحثية" description="حدّد المجالات والاهتمامات التي تستقبل ضمنها طلبات الطلاب." complete={stepState.interests && stepState.expertise}>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="الاهتمامات البحثية" name="researchInterests" value={profile.researchInterests} onChange={updateField} required placeholder="افصل بينها بفواصل" helper="مثال: تعليم طبي، ذكاء اصطناعي، تحليل بيانات." />
          <Field label="مجالات الخبرة" name="researchFields" value={profile.researchFields} onChange={updateField} required placeholder="افصل بينها بفواصل" helper="هذه تمثل الخبرة البحثية المطلوبة لإكمال الملف." />
        </div>
      </BuilderStep>

      <BuilderStep number="03" title="الخبرات والإنجازات" description="أضف ما يدعم قرار الطالب عند اختيار المشرف المناسب." complete={stepState.experience}>
        <Field label="الخبرات البحثية" name="researchExperience" value={profile.researchExperience} onChange={updateField} rows={3} />
        <Field label="الأبحاث المنشورة" name="publications" value={profile.publications} onChange={updateField} rows={3} />
        <Field label="المشاريع السابقة" name="previousProjects" value={profile.previousProjects} onChange={updateField} rows={3} />
      </BuilderStep>

      <BuilderStep number="04" title="الروابط الأكاديمية الاختيارية" description="أضف روابطك الأكاديمية عندما تكون جاهزة." complete={stepState.links}>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Google Scholar" name="googleScholarUrl" value={profile.googleScholarUrl} onChange={updateField} />
          <Field label="ORCID" name="orcidUrl" value={profile.orcidUrl} onChange={updateField} />
          <Field label="ResearchGate" name="researchgateUrl" value={profile.researchgateUrl} onChange={updateField} />
          <Field label="LinkedIn" name="linkedinUrl" value={profile.linkedinUrl} onChange={updateField} />
          <Field label="رابط السيرة الذاتية CV" name="cvUrl" value={profile.cvUrl} onChange={updateField} />
        </div>
      </BuilderStep>

      <BuilderStep number="05" title="تفضيل مشاركة بيانات التواصل" description="هذه خطوة مطلوبة لإكمال التجربة، وتُدار من صفحة إعدادات التواصل." complete={contactComplete}>
        <div className="flex flex-col gap-3 rounded-2xl border border-gold/20 bg-gold/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="leading-8 text-muted">{contactComplete ? "تم تحديد طريقة مشاركة بيانات التواصل." : "تبقّى فقط تحديد طريقة التواصل"}</p>
          <Link href="/faculty/contact-settings" className="w-fit rounded-full border border-gold/35 px-5 py-2.5 text-sm font-extrabold text-ivory transition hover:border-gold hover:bg-gold/10">
            إكمال إعدادات التواصل
          </Link>
        </div>
      </BuilderStep>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {message ? <p className="rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm font-bold text-gold">{message}</p> : null}
        <button type="submit" className="rounded-full bg-gold px-7 py-3 font-extrabold text-navy shadow-glow transition hover:bg-gold-light">
          حفظ الملف الأكاديمي
        </button>
      </div>
    </form>
  );
}
