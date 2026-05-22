"use client";

import { useEffect, useState } from "react";
import type { FacultyContactPreference, FacultyContactSettingsDraft } from "@/lib/faculty/types";
import { getFacultyContactSettings, saveFacultyContactSettings } from "@/lib/faculty/storage";

const preferences: Array<{ label: string; value: FacultyContactPreference }> = [
  { label: "مشاركة البريد الإلكتروني فقط", value: "email" },
  { label: "مشاركة رقم الجوال فقط", value: "phone" },
  { label: "مشاركة البريد الإلكتروني ورقم الجوال", value: "both" }
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
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(getFacultyContactSettings(email, phoneNumber));
  }, [email, phoneNumber]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!settings.preference) {
      return;
    }

    saveFacultyContactSettings(settings);
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        <label>
          <span className="mb-2 block text-sm font-bold text-ivory">البريد الإلكتروني</span>
          <input
            className="w-full rounded-2xl border border-gold/20 bg-white px-4 py-3 text-muted outline-none"
            value={settings.email}
            readOnly
          />
        </label>
        <label>
          <span className="mb-2 block text-sm font-bold text-ivory">رقم الجوال</span>
          <input
            className="w-full rounded-2xl border border-gold/20 bg-white px-4 py-3 text-ivory outline-none"
            value={settings.phoneNumber}
            onChange={(event) => {
              setSaved(false);
              setSettings((current) => ({ ...current, phoneNumber: event.target.value }));
            }}
          />
        </label>
      </div>

      <div>
        <p className="mb-4 font-extrabold text-ivory">تفضيل مشاركة بيانات التواصل</p>
        <div className="grid gap-3 md:grid-cols-3">
          {preferences.map((preference) => (
            <label
              key={preference.value}
              className={`cursor-pointer rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                settings.preference === preference.value
                  ? "border-gold bg-gold/15 text-gold"
                  : "border-gold/20 bg-white text-muted hover:border-gold/50"
              }`}
            >
              <input
                type="radio"
                name="preference"
                value={preference.value}
                className="sr-only"
                checked={settings.preference === preference.value}
                onChange={() => {
                  setSaved(false);
                  setSettings((current) => ({ ...current, preference: preference.value }));
                }}
              />
              {preference.label}
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {!settings.preference ? (
          <p className="text-sm font-bold text-red-100">يجب اختيار طريقة تواصل واحدة على الأقل.</p>
        ) : null}
        {saved ? (
          <p className="rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm font-bold text-gold">
            تم حفظ إعدادات التواصل.
          </p>
        ) : null}
        <button
          type="submit"
          className="rounded-full bg-gold px-7 py-3 font-extrabold text-navy shadow-glow transition hover:bg-gold-light"
        >
          حفظ إعدادات التواصل
        </button>
      </div>
    </form>
  );
}
