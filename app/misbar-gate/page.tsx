import type { Metadata } from "next";
import Link from "next/link";
import { AdminGateForm } from "@/components/auth/AdminGateForm";

export const metadata: Metadata = {
  title: "بوابة إدارة مِسبار"
};

export default async function MisbarGatePage({
  searchParams
}: {
  searchParams?: Promise<{ inactive?: string }>;
}) {
  const resolvedSearchParams = await searchParams;

  return (
    <main className="admin-os relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10 text-[#1F1F1F] sm:px-8">
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[36vw] min-w-80 bg-[#1F1F1F]" />
      <section className="relative z-10 grid w-full max-w-6xl overflow-hidden rounded-[2.4rem] border border-[#D8D2C2] bg-white shadow-[0_30px_90px_rgba(31,31,31,0.18)] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="admin-panel-dark p-8 text-white sm:p-10">
          <Link href="/" className="grid h-16 w-16 place-items-center rounded-3xl border border-[#C9A45C]/50 bg-[#C9A45C]/15">
            <span className="text-3xl font-extrabold text-[#EFE1BD]">م</span>
          </Link>
          <div className="mt-16">
            <p className="text-sm font-extrabold text-[#EFE1BD]">بوابة إدارة مِسبار</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight">بوابة إدارة مِسبار</h1>
            <p className="mt-4 text-lg leading-9 text-white/70">دخول فريق الإدارة</p>
          </div>
          <div className="mt-14 rounded-3xl border border-white/10 bg-white/7 p-5">
            <p className="text-sm font-extrabold text-[#EFE1BD]">تنبيه أمني</p>
            <p className="mt-2 leading-8 text-white/68">هذه الصفحة مخصصة للمصرح لهم فقط</p>
          </div>
        </div>

        <div className="p-7 sm:p-10">
          <div className="mb-8">
            <p className="text-sm font-extrabold text-[#C9A45C]">تحقق الصلاحية</p>
            <h2 className="mt-2 text-3xl font-extrabold text-[#1F1F1F]">تسجيل دخول الإدارة</h2>
            <p className="mt-3 leading-8 text-[#6B7280]">استخدم حسابك الإداري المعتمد للوصول إلى مركز تشغيل مِسبار.</p>
          </div>

          {resolvedSearchParams?.inactive ? (
            <p className="mb-6 rounded-2xl border border-[#B94A48]/30 bg-[#FFF7F6] px-4 py-3 text-sm font-extrabold text-[#B94A48]">
              تم إيقاف صلاحياتك من قبل إدارة مِسبار.
            </p>
          ) : null}

          <AdminGateForm />
        </div>
      </section>
    </main>
  );
}
