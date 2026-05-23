"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  emptyResearchProfile,
  getContactSettings,
  getResearchProfile,
  isContactSettingsComplete,
  isResearchProfileComplete,
  saveResearchProfile,
  splitList
} from "@/lib/student/storage";
import type { ResearchProfileDraft } from "@/lib/student/types";
import { StudentCard } from "@/components/student/StudentCard";
import { StudentSectionHeader } from "@/components/student/StudentSectionHeader";

const textInputClass =
  "w-full rounded-2xl border border-gold/20 bg-navy/70 px-4 py-3 text-ivory outline-none transition placeholder:text-muted/55 focus:border-gold focus:ring-4 focus:ring-gold/10";

function Field({
  label,
  helper,
  required,
  children
}: {
  label: string;
  helper?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-sm font-bold text-ivory">
        {label}
        {required ? <span className="rounded-full bg-gold/15 px-2 py-0.5 text-xs text-gold-light">مطلوب</span> : null}
      </span>
      {children}
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
    <StudentCard className={complete ? "border-gold/35 bg-gold/5" : ""}>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border text-sm font-extrabold ${complete ? "border-gold bg-gold text-navy" : "border-gold/35 bg-gold/10 text-gold-light"}`}>
            {number}
          </span>
          <div>
            <h3 className="text-xl font-extrabold text-ivory">{title}</h3>
            <p className="mt-2 leading-7 text-muted">{description}</p>
          </div>
        </div>
        <span className={`w-fit rounded-full px-3 py-1 text-xs font-extrabold ${complete ? "bg-gold/15 text-gold-light" : "bg-navy/70 text-muted"}`}>
          {complete ? "مكتمل" : "بانتظارك"}
        </span>
      </div>
      <div className="grid gap-5">{children}</div>
    </StudentCard>
  );
}

export function ResearchProfileForm() {
  const [profile, setProfile] = useState<ResearchProfileDraft>(emptyResearchProfile);
  const [contactComplete, setContactComplete] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setProfile(getResearchProfile());
    setContactComplete(isContactSettingsComplete(getContactSettings()));
  }, []);

  function updateField(field: keyof ResearchProfileDraft, value: string) {
    setMessage("");
    setProfile((current) => ({ ...current, [field]: value }));
  }

  const requiredStates = useMemo(() => {
    return {
      bio: Boolean(profile.bio.trim()),
      interests: splitList(profile.researchInterests).length > 0,
      skills: splitList(profile.researchSkills).length > 0,
      experience: Boolean(profile.experiences.trim() || profile.achievements.trim()),
      links: Boolean(profile.linkedinUrl || profile.orcidUrl || profile.googleScholarUrl || profile.cvUrl)
    };
  }, [profile]);

  const profileComplete = isResearchProfileComplete(profile);
  const progress = Math.round(
    ((requiredStates.bio ? 1 : 0) +
      (requiredStates.interests ? 1 : 0) +
      (requiredStates.skills ? 1 : 0) +
      (contactComplete ? 1 : 0)) * 25
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const savedProfile = saveResearchProfile(profile);
    setProfile(savedProfile);
    setMessage(
      savedProfile.isComplete
        ? contactComplete
          ? "ملفك البحثي مكتمل"
          : "تم حفظ الملف البحثي. تبقّى فقط تحديد طريقة التواصل."
        : "تم حفظ التغييرات. أكمل الحقول المطلوبة حتى يظهر ملفك البحثي كمكتمل."
    );
  }

  return (
    <div>
      <StudentSectionHeader
        title="ملفي البحثي"
        description="ابن ملفك خطوة بخطوة ليعكس اهتماماتك ومهاراتك، مع تحكم واضح في طريقة مشاركة بيانات التواصل."
      />

      <div className="mb-6 rounded-3xl border border-gold/20 bg-white p-5 shadow-soft-card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-extrabold text-gold-light">اكتمال الملف: {progress}%</p>
            <h2 className="mt-2 text-2xl font-extrabold text-ivory">
              {profileComplete && contactComplete
                ? "ملفك البحثي مكتمل"
                : profileComplete
                  ? "تبقّى فقط تحديد طريقة التواصل"
                  : contactComplete
                    ? "تبقّى إكمال الملف البحثي"
                    : "أكمل بيانات الملف والتواصل"}
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

      <form onSubmit={handleSubmit} className="space-y-5">
        <BuilderStep number="01" title="نبذة تعريفية" description="اكتب تعريفًا مختصرًا وواضحًا عن مسارك واهتمامك البحثي." complete={requiredStates.bio}>
          <Field label="نبذة تعريفية" required helper="مثال: طالب مهتم بتحليل البيانات الصحية وتصميم حلول بحثية قابلة للتطبيق.">
            <textarea
              className={textInputClass}
              rows={4}
              value={profile.bio}
              onChange={(event) => updateField("bio", event.target.value)}
              required
            />
          </Field>
        </BuilderStep>

        <BuilderStep number="02" title="الاهتمامات والمهارات البحثية" description="أضف اهتماماتك ومهاراتك مفصولة بفواصل أو أسطر." complete={requiredStates.interests && requiredStates.skills}>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="الاهتمامات البحثية" required helper="اكتب المجالات التي ترغب بالعمل عليها.">
              <textarea className={textInputClass} rows={3} value={profile.researchInterests} onChange={(event) => updateField("researchInterests", event.target.value)} required />
            </Field>
            <Field label="المهارات البحثية" required helper="مثل: مراجعة أدبيات، تحليل بيانات، تصميم استبيانات.">
              <textarea className={textInputClass} rows={3} value={profile.researchSkills} onChange={(event) => updateField("researchSkills", event.target.value)} required />
            </Field>
            <Field label="المهارات التقنية" helper="حقل اختياري يضيف قوة لملفك.">
              <textarea className={textInputClass} rows={3} value={profile.technicalSkills} onChange={(event) => updateField("technicalSkills", event.target.value)} />
            </Field>
          </div>
        </BuilderStep>

        <BuilderStep number="03" title="الخبرات والإنجازات" description="أضف ما يبرز جاهزيتك البحثية. هذه الحقول اختيارية لكنها تساعد في تقييم الملاءمة." complete={requiredStates.experience}>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="الخبرات السابقة">
              <textarea className={textInputClass} rows={3} value={profile.experiences} onChange={(event) => updateField("experiences", event.target.value)} />
            </Field>
            <Field label="الإنجازات">
              <textarea className={textInputClass} rows={3} value={profile.achievements} onChange={(event) => updateField("achievements", event.target.value)} />
            </Field>
          </div>
        </BuilderStep>

        <BuilderStep number="04" title="الروابط الأكاديمية الاختيارية" description="أضف روابطك الأكاديمية عندما تكون جاهزة." complete={requiredStates.links}>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="LinkedIn"><input className={textInputClass} type="url" value={profile.linkedinUrl} onChange={(event) => updateField("linkedinUrl", event.target.value)} /></Field>
            <Field label="ORCID"><input className={textInputClass} type="url" value={profile.orcidUrl} onChange={(event) => updateField("orcidUrl", event.target.value)} /></Field>
            <Field label="Google Scholar"><input className={textInputClass} type="url" value={profile.googleScholarUrl} onChange={(event) => updateField("googleScholarUrl", event.target.value)} /></Field>
            <Field label="رابط السيرة الذاتية CV"><input className={textInputClass} type="url" value={profile.cvUrl} onChange={(event) => updateField("cvUrl", event.target.value)} /></Field>
          </div>
        </BuilderStep>

        <BuilderStep number="05" title="تفضيل مشاركة بيانات التواصل" description="هذه خطوة مطلوبة لإكمال التجربة، وتُدار من صفحة إعدادات التواصل." complete={contactComplete}>
          <div className="flex flex-col gap-3 rounded-2xl border border-gold/20 bg-gold/5 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="leading-8 text-muted">
              {contactComplete ? "تم تحديد طريقة مشاركة بيانات التواصل." : "تبقّى فقط تحديد طريقة التواصل"}
            </p>
            <Link href="/student/contact-settings" className="w-fit rounded-full border border-gold/35 px-5 py-2.5 text-sm font-extrabold text-ivory transition hover:border-gold hover:bg-gold/10">
              إكمال إعدادات التواصل
            </Link>
          </div>
        </BuilderStep>

        {message ? <p className="rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm font-bold text-gold-light">{message}</p> : null}

        <button type="submit" className="rounded-full bg-gold px-7 py-3 font-extrabold text-navy shadow-glow transition hover:bg-gold-light">
          حفظ الملف البحثي
        </button>
      </form>
    </div>
  );
}
