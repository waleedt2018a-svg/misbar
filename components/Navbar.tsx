import Link from "next/link";
import { logoutAction } from "@/app/auth/actions";
import type { Profile } from "@/lib/auth/types";

const navItems = [
  { label: "الرئيسية", href: "#" },
  { label: "المشاريع البحثية", href: "#research" },
  { label: "فرص الطلاب", href: "#opportunities" },
  { label: "مجلة مِسبار الطلابية", href: "#journal" },
  { label: "Paper Lab", href: "#paper-lab" },
  { label: "من نحن", href: "#footer" }
];

const studentMenuItems = [
  { label: "معلوماتي الشخصية", href: "/student/contact-settings" },
  { label: "ملفي البحثي", href: "/student/profile" },
  { label: "لوحة الطالب", href: "/student" },
  { label: "الفرص البحثية", href: "/student/opportunities" },
  { label: "أفكاري البحثية", href: "/student/ideas" },
  { label: "طلباتي", href: "/student/requests" },
  { label: "الإشعارات", href: "/student/notifications" }
];

const facultyMenuItems = [
  { label: "معلوماتي الشخصية", href: "/faculty/contact-settings" },
  { label: "ملفي الأكاديمي", href: "/faculty/profile" },
  { label: "لوحة عضو هيئة التدريس", href: "/faculty" },
  { label: "فرصي البحثية", href: "/faculty/opportunities" },
  { label: "المتقدمون على فرصي", href: "/faculty/applicants" },
  { label: "أفكار الطلاب", href: "/faculty/student-ideas" },
  { label: "الطلبات", href: "/faculty/requests" },
  { label: "الإشعارات", href: "/faculty/notifications" }
];

const adminMenuItems = [
  { label: "لوحة الإدارة", href: "/admin" },
  { label: "مراجعة الفرص البحثية", href: "/admin/opportunities-review" },
  { label: "مراجعة أفكار الطلاب", href: "/admin/student-ideas-review" },
  { label: "إدارة المستخدمين", href: "/admin/users" },
  { label: "البلاغات", href: "/admin/reports" },
  { label: "التنبيهات", href: "/admin/warnings" },
  { label: "إدارة الأدمنز", href: "/admin/admins" },
  { label: "الإشعارات", href: "/admin/notifications" }
];

type NavbarProps = {
  profile?: Profile | null;
};

function AccountMenu({ profile }: { profile: Profile }) {
  const menuItems =
    profile.role === "student"
      ? studentMenuItems
      : profile.role === "faculty"
        ? facultyMenuItems
        : adminMenuItems;

  return (
    <details className="group relative">
      <summary className="flex cursor-pointer list-none items-center gap-3 rounded-full border border-gold/25 bg-white px-3 py-2 text-sm font-extrabold text-ivory shadow-sm transition hover:border-gold/60 hover:bg-gold/10">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-gold/15 text-gold" aria-hidden="true">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21a8 8 0 0 0-16 0" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </span>
        <span className="hidden sm:block">الملف الشخصي</span>
      </summary>

      <div className="absolute left-0 top-[calc(100%+0.75rem)] z-50 w-64 overflow-hidden rounded-3xl border border-gold/20 bg-white p-2 text-right shadow-soft-card">
        <div className="border-b border-gold/15 px-3 py-3">
          <p className="text-sm font-extrabold text-ivory">{profile.full_name}</p>
          <p className="mt-1 text-xs text-muted">{profile.email}</p>
        </div>

        <div className="py-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-2xl px-3 py-2.5 text-sm font-bold text-muted transition hover:bg-gold/10 hover:text-gold"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <form action={logoutAction} className="border-t border-gold/15 pt-2">
          <button
            type="submit"
            className="w-full rounded-2xl px-3 py-2.5 text-right text-sm font-extrabold text-muted transition hover:bg-gold/10 hover:text-gold"
          >
            تسجيل الخروج
          </button>
        </form>
      </div>
    </details>
  );
}

export function Navbar({ profile }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-gold/15 bg-navy/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl border border-gold/45 bg-gold/10 shadow-glow">
            <span className="text-xl font-extrabold text-gold">م</span>
          </div>
          <div className="leading-tight">
            <p className="text-lg font-extrabold text-ivory">مِسبار</p>
            <p className="text-xs text-muted">حيث يُصنع الباحثون</p>
          </div>
        </Link>

        <div className="hidden items-center gap-6 text-sm font-medium text-muted lg:flex">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="transition hover:text-gold">
              {item.label}
            </a>
          ))}
        </div>

        {profile ? (
          <AccountMenu profile={profile} />
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-full border border-gold/25 px-4 py-2 text-sm font-bold text-ivory transition hover:border-gold/60 hover:bg-gold/10"
            >
              تسجيل الدخول
            </Link>
            <Link
              href="/signup"
              className="hidden rounded-full bg-gold px-4 py-2 text-sm font-extrabold text-navy shadow-glow transition hover:bg-gold-light sm:inline-flex"
            >
              إنشاء حساب
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
