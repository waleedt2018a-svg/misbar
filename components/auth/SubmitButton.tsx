"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  children: React.ReactNode;
  pendingText: string;
};

export function SubmitButton({ children, pendingText }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-gold px-7 py-3 text-base font-extrabold text-navy shadow-glow transition hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? pendingText : children}
    </button>
  );
}
