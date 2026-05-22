"use client";

import { useActionState } from "react";
import { adminGateLoginAction } from "@/app/misbar-gate/actions";
import { SubmitButton } from "@/components/auth/SubmitButton";

const inputClass =
  "w-full rounded-2xl border border-gold/20 bg-white px-4 py-3 text-ivory outline-none transition placeholder:text-muted/55 focus:border-gold focus:ring-4 focus:ring-gold/10";

export function AdminGateForm() {
  const [state, formAction] = useActionState(adminGateLoginAction, {});

  return (
    <form action={formAction} className="grid gap-5" noValidate>
      <label>
        <span className="mb-2 block text-sm font-bold text-ivory">البريد الإلكتروني</span>
        <input
          className={inputClass}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
        />
      </label>

      <label>
        <span className="mb-2 block text-sm font-bold text-ivory">كلمة المرور</span>
        <input
          className={inputClass}
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>

      {state.message ? (
        <p className="rounded-2xl border border-red-300/60 bg-red-950/25 px-4 py-3 text-sm font-bold text-red-100">
          {state.message}
        </p>
      ) : null}

      <SubmitButton pendingText="جاري التحقق">دخول الإدارة</SubmitButton>
    </form>
  );
}
