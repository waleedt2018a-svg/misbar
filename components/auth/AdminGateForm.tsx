"use client";

import { useState } from "react";
import { useActionState } from "react";
import { adminGateLoginAction } from "@/app/misbar-gate/actions";

const inputClass =
  "w-full rounded-2xl border border-[#D8D2C2] bg-[#F8F6EF] px-4 py-3 text-[#1F1F1F] outline-none transition placeholder:text-[#6B7280]/55 focus:border-[#C9A45C] focus:bg-white focus:ring-4 focus:ring-[#C9A45C]/15";

function EyeIcon({ visible }: { visible: boolean }) {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="3" />
      {visible ? <path d="M4 20 20 4" /> : null}
    </svg>
  );
}

export function AdminGateForm() {
  const [state, formAction, pending] = useActionState(adminGateLoginAction, {});
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="grid gap-5" noValidate>
      <label>
        <span className="mb-2 block text-sm font-extrabold text-[#1F1F1F]">البريد الإلكتروني</span>
        <input className={inputClass} name="email" type="email" autoComplete="email" inputMode="email" required />
      </label>

      <label>
        <span className="mb-2 block text-sm font-extrabold text-[#1F1F1F]">كلمة المرور</span>
        <span className="relative block">
          <input className={`${inputClass} pl-12`} name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required />
          <button
            type="button"
            title="إظهار / إخفاء كلمة المرور"
            aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
            onClick={() => setShowPassword((current) => !current)}
            className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-[#C9A45C] opacity-65 transition hover:bg-[#C9A45C]/10 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#C9A45C]/35"
          >
            <EyeIcon visible={showPassword} />
          </button>
        </span>
      </label>

      {state.message ? (
        <p className="rounded-2xl border border-[#B94A48]/35 bg-[#FFF7F6] px-4 py-3 text-sm font-extrabold text-[#B94A48]">
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[#1F1F1F] px-6 py-3 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(31,31,31,0.18)] transition hover:bg-[#C9A45C] hover:text-[#1F1F1F] disabled:cursor-not-allowed disabled:opacity-65"
      >
        {pending ? "جاري التحقق" : "دخول الإدارة"}
      </button>
    </form>
  );
}
