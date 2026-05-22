import { AuthShell } from "@/components/auth/AuthShell";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="استعادة الحساب"
      title="إعادة تعيين كلمة المرور"
      description="أدخل بريدك الجامعي وسنرسل لك رابطًا آمنًا لإعادة تعيين كلمة المرور عبر Supabase."
    >
      <div className="mb-8">
        <p className="text-sm font-extrabold text-gold-light">مِسبار — حيث يُصنع الباحثون</p>
        <h1 className="mt-3 text-3xl font-extrabold text-ivory">نسيت كلمة المرور؟</h1>
        <p className="mt-3 leading-8 text-muted">
          سيتم إرسال رابط إعادة التعيين إلى البريد الإلكتروني المرتبط بحسابك.
        </p>
      </div>

      <ForgotPasswordForm />
    </AuthShell>
  );
}
