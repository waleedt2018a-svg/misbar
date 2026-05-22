import type { Metadata } from "next";
import Link from "next/link";
import { AdminGateForm } from "@/components/auth/AdminGateForm";

export const metadata: Metadata = {
  title: "بوابة إدارة مِسبار"
};

export default function MisbarGatePage() {
  return (
    <main className="site-shell flex min-h-screen items-center justify-center px-5 py-10 text-ivory sm:px-8">
      <section className="w-full max-w-lg rounded-[2rem] border border-gold/20 bg-white p-6 shadow-soft-card sm:p-8">
        <Link href="/" className="mb-7 grid h-14 w-14 place-items-center rounded-2xl border border-gold/45 bg-gold/10 shadow-glow">
          <span className="text-2xl font-extrabold text-gold">م</span>
        </Link>

        <p className="text-sm font-extrabold text-gold">مدخل مخفي</p>
        <h1 className="mt-3 text-3xl font-extrabold text-ivory">بوابة إدارة مِسبار</h1>
        <p className="mt-3 leading-8 text-muted">
          هذه البوابة مخصصة لفريق الإدارة فقط.
        </p>

        <div className="mt-8">
          <AdminGateForm />
        </div>
      </section>
    </main>
  );
}
