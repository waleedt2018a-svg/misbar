"use client";

import { useEffect, useState } from "react";
import type { FacultyContactPreference, FacultyContactSettingsDraft } from "@/lib/faculty/types";
import { getFacultyContactSettings, saveFacultyContactSettings } from "@/lib/faculty/storage";

const preferences: Array<{ title: string; description: string; icon: string; value: Exclude<FacultyContactPreference, ""> }> = [
  { title: "مشاركة البريد الإلكتروني فقط", description: "مناسب للتواصل الرسمي مع الطلبة بعد قبول الطلب.", icon: "@", value: "email" },
  { title: "مشاركة رقم الجوال فقط", description: "للتنسيق السريع عند الحاجة إلى تواصل مباشر.", icon: "☎", value: "phone" },
  { title: "مشاركة البريد الإلكتروني ورقم الجوال", description: "يفتح القناتين للطلبات المقبولة ويختصر التنسيق.", icon: "✓", value: "both" }
];

export function FacultyContactSettingsForm({
  email,
  phoneNumber
}: {
  email: string;
  phoneNumber: string;
}) {
  const [settings, setSettings] = useState<FacultyContactSettingsDraft>({
    email,
    phoneNumber,
    preference: ""
  });
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(getFacultyContactSettings(email, phoneNumber));
  }, [email, phoneNumber]);

  function selectPreference(preference: Exclude<FacultyContactPreference, "">) {
    setError("");
    setSaved(false);
    setSettings((current) => ({ ...current, preference }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!settings.preference) {
      setError("اختر طريقة مشاركة بيانات التواصل لإكمال الإعدادات.");
      setSaved(false);
      return;
    }

    saveFacultyContactSettings(settings);
    setError("");
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="rounded-3xl border border-gold/20 bg-white p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-extrabold text-gold">تفضيل مشاركة بيانات التواصل</p>
            <h2 className="mt-2 text-2xl font-extrabold text-ivory">
              {settings.preference ? "ملفك البحثي مكتمل" : "تبقّى فقط تحديد طريقة التواصل"}
            </h2>
            <p className="mt-3 leading-8 text-muted">لن تظهر بيانات التواصل إلا حسب التفضيل الذي تختاره. يمكنك تعديل هذه الإعدادات لاحقًا.</p>
          </div>
          <span className={`w-fit rounded-full px-4 py-2 text-sm font-extrabold ${settings.preference ? "bg-gold/15 text-gold" : "bg-navy/70 text-muted"}`}>
            {settings.preference ? "مكتمل" : "مطلوب"}
          </span>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label>
          <span className="mb-2 block text-sm font-bold text-ivory">البريد الإلكتروني</span>
          <input className="w-full rounded-2xl border border-gold/20 bg-white px-4 py-3 text-muted outline-none" value={settings.email} readOnly />
        </label>
        <label>
          <span className="mb-2 block text-sm font-bold text-ivory">رقم الجوال</span>
          <input
            className="w-full rounded-2xl border border-gold/20 bg-white px-4 py-3 text-ivory outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/10"
            value={settings.phoneNumber}
            onChange={(event) => {
              setSaved(false);
              setSettings((current) => ({ ...current, phoneNumber: event.target.value }));
            }}
          />
        </label>
      </div>

      <div>
        <p className="mb-4 font-extrabold text-ivory">اختر طريقة التواصل</p>
        <div className="grid gap-3 md:grid-cols-3">
          {preferences.map((preference) => {
            const selected = settings.preference === preference.value;

            return (
              <label
                key={preference.value}
                className={`cursor-pointer rounded-3xl border p-5 transition hover:-translate-y-0.5 hover:shadow-soft-card ${
                  selected ? "border-gold bg-gold/15 text-ivory shadow-glow" : "border-gold/20 bg-white text-muted hover:border-gold/50"
                }`}
              >
                <input type="radio" name="preference" value={preference.value} className="sr-only" checked={selected} required onChange={() => selectPreference(preference.value)} />
                <span className={`mb-4 grid h-11 w-11 place-items-center rounded-2xl border text-lg font-extrabold ${selected ? "border-gold bg-gold text-navy" : "border-gold/25 bg-gold/10 text-gold"}`}>
                  {preference.icon}
                </span>
                <span className="block text-lg font-extrabold text-ivory">{preference.title}</span>
                <span className="mt-2 block leading-7 text-muted">{preference.description}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {error ? <p className="rounded-2xl border border-red-300/30 bg-red-950/25 px-4 py-3 text-sm font-bold text-red-100">{error}</p> : null}
        {saved ? <p className="rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm font-bold text-gold">تم حفظ إعدادات التواصل. يمكنك تعديل هذه الإعدادات لاحقًا.</p> : null}
        <button type="submit" className="rounded-full bg-gold px-7 py-3 font-extrabold text-navy shadow-glow transition hover:bg-gold-light">
          حفظ إعدادات التواصل
        </button>
      </div>
    </form>
  );
}
