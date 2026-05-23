"use client";

import { useState } from "react";

type FormFieldProps = {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "numeric";
  error?: string;
};

function EyeIcon({ hidden }: { hidden: boolean }) {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="3" />
      {hidden ? null : <path d="M4 20 20 4" />}
    </svg>
  );
}

export function FormField({
  label,
  name,
  type = "text",
  required = true,
  placeholder,
  autoComplete,
  inputMode,
  error
}: FormFieldProps) {
  const errorId = `${name}-error`;
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-ivory">{label}</span>
      <span className="relative block">
        <input
          name={name}
          type={inputType}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`w-full rounded-2xl border bg-navy/70 px-4 py-3 text-ivory outline-none transition placeholder:text-muted/55 focus:border-gold focus:ring-4 focus:ring-gold/10 ${
            isPassword ? "pl-12" : ""
          } ${error ? "border-red-300/60" : "border-gold/20"}`}
        />
        {isPassword ? (
          <button
            type="button"
            title="إظهار / إخفاء كلمة المرور"
            aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
            onClick={() => setShowPassword((current) => !current)}
            className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-gold-light opacity-70 transition hover:bg-gold/10 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gold/30"
          >
            <EyeIcon hidden={!showPassword} />
          </button>
        ) : null}
      </span>
      {error ? (
        <p id={errorId} className="mt-2 text-sm font-bold text-red-100">
          {error}
        </p>
      ) : null}
    </label>
  );
}
