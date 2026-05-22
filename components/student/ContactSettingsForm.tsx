"use client";

import { useEffect, useState } from "react";
import { getContactSettings, saveContactSettings } from "@/lib/student/storage";
import type { ContactPreference, ContactSettingsDraft } from "@/lib/student/types";
import { StudentCard } from "@/components/student/StudentCard";
import { StudentSectionHeader } from "@/components/student/StudentSectionHeader";

const preferences: { value: ContactPreference; label: string }[] = [
  { value: "email", label: "مشاركة البريد الإلكتروني فقط" },
  { value: "phone", label: "مشاركة رقم الجوال فقط" },
  { value: "both", label: "مشاركة البريد الإلكتروني ورقم الجوال" }
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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!settings.preference) {
      setError("يرجى اختيار طريقة واحدة على الأقل لمشاركة بيانات التواصل");
      setMessage("");
      return;
    }

    saveContactSettings(settings);
    setError("");
    setMessage("تم حفظ إعدادات التواصل. لن تظهر بياناتك إلا بعد قبول الطلب بين الطرفين.");
  }

  return (
    <div>
      <StudentSectionHeader
        title="إعدادات التواصل"
        description="بيانات التواصل لا تظهر للعامة، ولا تتم مشاركتها إلا بعد القبول بين الطرفين حسب إعدادات الخصوصية."
      />

      <form onSubmit={handleSubmit} className="space-y-5">
        <StudentCard>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-ivory">البريد الإلكتروني</span>
              <input
                className="w-full rounded-2xl border border-gold/20 bg-navy/70 px-4 py-3 text-muted outline-none"
                value={settings.email}
                readOnly
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-ivory">رقم الجوال</span>
              <input
                className="w-full rounded-2xl border border-gold/20 bg-navy/70 px-4 py-3 text-muted outline-none"
                value={settings.phoneNumber}
                readOnly
              />
            </label>
          </div>
        </StudentCard>

        <StudentCard>
          <p className="mb-4 font-extrabold text-ivory">تفضيل مشاركة بيانات التواصل</p>
          <div className="grid gap-3">
            {preferences.map((preference) => (
              <label
                key={preference.value}
                className={`cursor-pointer rounded-2xl border p-4 transition ${
                  settings.preference === preference.value
                    ? "border-gold bg-gold/15 text-gold-light"
                    : "border-gold/20 bg-navy/55 text-muted hover:border-gold/50"
                }`}
              >
                <input
                  className="sr-only"
                  type="radio"
                  name="contactPreference"
                  value={preference.value}
                  checked={settings.preference === preference.value}
                  onChange={() =>
                    setSettings((current) => ({
                      ...current,
                      preference: preference.value
                    }))
                  }
                />
                <span className="font-bold">{preference.label}</span>
              </label>
            ))}
          </div>
        </StudentCard>

        {error ? (
          <p className="rounded-2xl border border-red-300/30 bg-red-950/25 px-4 py-3 text-sm font-bold text-red-100">
            {error}
          </p>
        ) : null}
        {message ? (
          <p className="rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm font-bold text-gold-light">
            {message}
          </p>
        ) : null}

        <button
          type="submit"
          className="rounded-full bg-gold px-7 py-3 font-extrabold text-navy shadow-glow transition hover:bg-gold-light"
        >
          حفظ إعدادات التواصل
        </button>
      </form>
    </div>
  );
}
