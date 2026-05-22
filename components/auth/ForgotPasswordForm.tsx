"use client";

import Link from "next/link";
import { useActionState } from "react";
import { forgotPasswordAction } from "@/app/auth/actions";
import { FormField } from "@/components/auth/FormField";
import { SubmitButton } from "@/components/auth/SubmitButton";

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(forgotPasswordAction, {});

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <FormField
        label="البريد الإلكتروني الجامعي"
        name="email"
        type="email"
        placeholder="name@ksu.edu.sa"
        autoComplete="email"
        inputMode="email"
        error={state.errors?.email}
      />

      {state.message && (!state.errors || Object.keys(state.errors).length === 0) ? (
        <p
          className={`rounded-2xl border px-4 py-3 text-sm font-bold ${
            state.success
              ? "border-gold/30 bg-gold/10 text-gold-light"
              : "border-red-300/30 bg-red-950/25 text-red-100"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <SubmitButton pendingText="جاري إرسال الرابط">إرسال رابط إعادة التعيين</SubmitButton>

      <p className="text-center text-sm text-muted">
        تذكرت كلمة المرور؟{" "}
        <Link href="/login" className="font-extrabold text-gold-light hover:text-gold">
          تسجيل الدخول
        </Link>
      </p>
    </form>
  );
}
