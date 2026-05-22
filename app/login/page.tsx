import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage({
  searchParams
}: {
  searchParams?: Promise<{ restricted?: string }>;
}) {
  const params = await searchParams;

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

      {params?.restricted === "1" ? (
        <p className="mb-5 rounded-2xl border border-red-300/60 bg-red-950/25 px-4 py-3 text-sm font-bold text-red-100">
          تم تقييد حسابك مؤقتًا، يرجى التواصل مع إدارة مِسبار.
        </p>
      ) : null}

      <LoginForm />
    </AuthShell>
  );
}
