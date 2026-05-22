import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <AuthShell
      eyebrow="بوابة الانضمام"
      title="أنشئ حسابك في مِسبار"
      description="اختر مسارك البحثي، وأكمل بياناتك الجامعية لبدء استخدام المنصة."
    >
      <div className="mb-8">
        <p className="text-sm font-extrabold text-gold-light">مِسبار — حيث يُصنع الباحثون</p>
        <h1 className="mt-3 text-3xl font-extrabold text-ivory">إنشاء حساب</h1>
        <p className="mt-3 leading-8 text-muted">
          الحسابات العامة متاحة للطلاب وأعضاء هيئة التدريس فقط.
        </p>
      </div>

      <SignupForm />

      <p className="mt-6 text-center text-sm text-muted">
        لديك حساب؟{" "}
        <Link href="/login" className="font-extrabold text-gold-light hover:text-gold">
          تسجيل الدخول
        </Link>
      </p>
    </AuthShell>
  );
}
