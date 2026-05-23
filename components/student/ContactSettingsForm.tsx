"use client";

import { useEffect, useState } from "react";
import { getContactSettings, saveContactSettings } from "@/lib/student/storage";
import type { ContactPreference, ContactSettingsDraft } from "@/lib/student/types";
import { StudentCard } from "@/components/student/StudentCard";
import { StudentSectionHeader } from "@/components/student/StudentSectionHeader";

const preferences: { value: Exclude<ContactPreference, "">; title: string; description: string; icon: string }[] = [
  { value: "email", title: "مشاركة البريد الإلكتروني فقط", description: "مناسب للتواصل الرسمي والمتابعة الأكاديمية.", icon: "@" },
  { value: "phone", title: "مشاركة رقم الجوال فقط", description: "للتنسيق السريع بعد قبول الطلب بين الطرفين.", icon: "☎" },
  { value: "both", title: "مشاركة البريد الإلكتروني ورقم الجوال", description: "الخيار الأوسع عندما ترغب بتسهيل كل قنوات التواصل.", icon: "✓" }
];

type ContactSettingsFormProps = {
  email: string;
  phoneNumber: string;
};

export function ContactSettingsForm({ email, phoneNumber }: ContactSettingsFormProps) {
  const [settings, setSettings] = useState<ContactSettingsDraft>({
    email,
    phoneNumber,
    preference: ""
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setSettings(getContactSettings(email, phoneNumber));
  }, [email, phoneNumber]);

  function selectPreference(preference: Exclude<ContactPreference, "">) {
    setError("");
    setMessage("");
    setSettings((current) => ({ ...current, preference }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!settings.preference) {
      setError("اختر طريقة مشاركة بيانات التواصل لإكمال الإعدادات.");
      setMessage("");
      return;
    }

    saveContactSettings(settings);
    setError("");
    setMessage("تم حفظ إعدادات التواصل. يمكنك تعديل هذه الإعدادات لاحقًا.");
  }

  return (
    <div>
      <StudentSectionHeader
        title="إعدادات التواصل"
        description="لن تظهر بيانات التواصل إلا حسب التفضيل الذي تختاره، ولا تتم مشاركتها إلا بعد القبول بين الطرفين."
      />

      <form onSubmit={handleSubmit} className="space-y-5">
        <StudentCard>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-extrabold text-gold-light">تفضيل مشاركة بيانات التواصل</p>
              <h2 className="mt-2 text-2xl font-extrabold text-ivory">
                {settings.preference ? "ملفك البحثي مكتمل" : "تبقّى فقط تحديد طريقة التواصل"}
              </h2>
              <p className="mt-3 leading-8 text-muted">يمكنك تعديل هذه الإعدادات لاحقًا.</p>
            </div>
            <span className={`w-fit rounded-full px-4 py-2 text-sm font-extrabold ${settings.preference ? "bg-gold/15 text-gold-light" : "bg-navy/70 text-muted"}`}>
              {settings.preference ? "مكتمل" : "مطلوب"}
            </span>
          </div>
        </StudentCard>

        <StudentCard>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-ivory">البريد الإلكتروني</span>
              <input className="w-full rounded-2xl border border-gold/20 bg-navy/70 px-4 py-3 text-muted outline-none" value={settings.email} readOnly />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-ivory">رقم الجوال</span>
              <input className="w-full rounded-2xl border border-gold/20 bg-navy/70 px-4 py-3 text-muted outline-none" value={settings.phoneNumber} readOnly />
            </label>
          </div>
        </StudentCard>

        <StudentCard>
          <p className="mb-4 font-extrabold text-ivory">اختر طريقة التواصل</p>
          <div className="grid gap-3 lg:grid-cols-3">
            {preferences.map((preference) => {
              const selected = settings.preference === preference.value;

              return (
                <label
                  key={preference.value}
                  className={`cursor-pointer rounded-3xl border p-5 transition hover:-translate-y-0.5 hover:shadow-soft-card ${
                    selected ? "border-gold bg-gold/15 text-ivory shadow-glow" : "border-gold/20 bg-navy/55 text-muted hover:border-gold/50"
                  }`}
                >
                  <input className="sr-only" type="radio" name="contactPreference" value={preference.value} checked={selected} onChange={() => selectPreference(preference.value)} required />
                  <span className={`mb-4 grid h-11 w-11 place-items-center rounded-2xl border text-lg font-extrabold ${selected ? "border-gold bg-gold text-navy" : "border-gold/25 bg-gold/10 text-gold-light"}`}>
                    {preference.icon}
                  </span>
                  <span className="block text-lg font-extrabold text-ivory">{preference.title}</span>
                  <span className="mt-2 block leading-7 text-muted">{preference.description}</span>
                </label>
              );
            })}
          </div>
        </StudentCard>

        {error ? <p className="rounded-2xl border border-red-300/30 bg-red-950/25 px-4 py-3 text-sm font-bold text-red-100">{error}</p> : null}
        {message ? <p className="rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm font-bold text-gold-light">{message}</p> : null}

        <button type="submit" className="rounded-full bg-gold px-7 py-3 font-extrabold text-navy shadow-glow transition hover:bg-gold-light">
          حفظ إعدادات التواصل
        </button>
      </form>
    </div>
  );
}
