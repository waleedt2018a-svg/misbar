"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "@/app/auth/actions";
import { FormField } from "@/components/auth/FormField";
import { SubmitButton } from "@/components/auth/SubmitButton";

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, {});

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <div className="grid gap-4">
        <FormField
          label="البريد الإلكتروني الجامعي"
          name="email"
          type="email"
          placeholder="name@ksu.edu.sa"
          autoComplete="email"
          inputMode="email"
          error={state.errors?.email}
        />
        <FormField
          label="كلمة المرور"
          name="password"
          type="password"
          autoComplete="current-password"
          error={state.errors?.password}
        />
      </div>

      <div className="text-left">
        <Link href="/forgot-password" className="text-sm font-extrabold text-gold-light hover:text-gold">
          نسيت كلمة المرور؟
        </Link>
      </div>

      {state.message && (!state.errors || Object.keys(state.errors).length === 0) ? (
        <p className="rounded-2xl border border-red-300/30 bg-red-950/25 px-4 py-3 text-sm font-bold text-red-100">
          {state.message}
        </p>
      ) : null}

      <SubmitButton pendingText="جاري تسجيل الدخول">تسجيل الدخول</SubmitButton>

      <p className="text-center text-sm text-muted">
        لا تملك حسابًا؟{" "}
        <Link href="/signup" className="font-extrabold text-gold-light hover:text-gold">
          إنشاء حساب جديد
        </Link>
      </p>
    </form>
  );
}
