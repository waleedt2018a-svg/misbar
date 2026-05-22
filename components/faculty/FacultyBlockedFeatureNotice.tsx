import Link from "next/link";

export function FacultyBlockedFeatureNotice() {
  return (
    <div className="rounded-3xl border border-gold/30 bg-gold/10 p-5">
      <p className="font-extrabold text-gold">يرجى إكمال ملفك الأكاديمي قبل استخدام هذه الميزة.</p>
      <Link
        href="/faculty/profile"
        className="mt-4 inline-flex rounded-full bg-gold px-5 py-2.5 text-sm font-extrabold text-navy transition hover:bg-gold-light"
      >
        إكمال الملف الأكاديمي
      </Link>
    </div>
  );
}
