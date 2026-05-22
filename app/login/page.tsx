import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="بوابة الدخول"
      title="مرحبًا بك في مِسبار"
      description="سجّل دخولك للوصول إلى لوحة الطالب أو عضو هيئة التدريس أو الإدارة حسب صلاحية حسابك."
    >
      <div className="mb-8">
        <p className="text-sm font-extrabold text-gold-light">مِسبار — حيث يُصنع الباحثون</p>
        <h1 className="mt-3 text-3xl font-extrabold text-ivory">تسجيل الدخول</h1>
        <p className="mt-3 leading-8 text-muted">
          استخدم بريدك الجامعي وكلمة المرور للوصول إلى حسابك.
        </p>
      </div>

      <LoginForm />
    </AuthShell>
  );
}
