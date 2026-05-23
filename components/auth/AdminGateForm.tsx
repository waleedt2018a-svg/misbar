"use client";

import { useActionState } from "react";
import { adminGateLoginAction } from "@/app/misbar-gate/actions";

const inputClass =
  "w-full rounded-2xl border border-[#D8D2C2] bg-[#F8F6EF] px-4 py-3 text-[#1F1F1F] outline-none transition placeholder:text-[#6B7280]/55 focus:border-[#C9A45C] focus:bg-white focus:ring-4 focus:ring-[#C9A45C]/15";

export function AdminGateForm() {
  const [state, formAction, pending] = useActionState(adminGateLoginAction, {});

  return (
    <form action={formAction} className="grid gap-5" noValidate>
      <label>
        <span className="mb-2 block text-sm font-extrabold text-[#1F1F1F]">البريد الإلكتروني</span>
        <input className={inputClass} name="email" type="email" autoComplete="email" inputMode="email" required />
      </label>

      <label>
        <span className="mb-2 block text-sm font-extrabold text-[#1F1F1F]">كلمة المرور</span>
        <input className={inputClass} name="password" type="password" autoComplete="current-password" required />
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
