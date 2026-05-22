"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "الرئيسية", href: "/" },
  { label: "فرصي البحثية", href: "/faculty/opportunities" },
  { label: "المتقدمون على فرصي", href: "/faculty/applicants" },
  { label: "أفكار الطلاب", href: "/faculty/student-ideas" },
  { label: "الطلبات", href: "/faculty/requests" },
  { label: "ملفي الأكاديمي", href: "/faculty/profile" },
  { label: "إعدادات التواصل", href: "/faculty/contact-settings" },
  { label: "الإشعارات", href: "/faculty/notifications" }
];

type FacultyDashboardShellProps = {
  facultyName: string;
  children: React.ReactNode;
};

export function FacultyDashboardShell({ facultyName, children }: FacultyDashboardShellProps) {
  const pathname = usePathname() ?? "/faculty";

  return (
    <main className="site-shell min-h-screen bg-navy text-ivory">
      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-6 sm:px-8 lg:grid-cols-[18rem_1fr]">
        <aside className="glass-panel h-fit rounded-[2rem] p-5 lg:sticky lg:top-6">
          <Link href="/" className="mb-6 flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl border border-gold/45 bg-gold/10 text-xl font-extrabold text-gold shadow-glow">
              م
            </span>
            <span>
              <span className="block text-lg font-extrabold text-ivory">مِسبار</span>
              <span className="block text-xs text-muted">لوحة عضو هيئة التدريس</span>
            </span>
          </Link>

          <nav className="grid gap-2">
            {navItems.map((item) => {
              const isActive = item.href !== "/" && pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                    isActive
                      ? "border-gold bg-gold/15 text-gold"
                      : "border-transparent text-muted hover:border-gold/25 hover:bg-gold/10 hover:text-ivory"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <section className="min-w-0">
          <header className="glass-panel mb-6 rounded-[2rem] p-5 sm:p-6">
            <p className="text-sm font-extrabold text-gold">مِسبار — حيث يُصنع الباحثون</p>
            <h1 className="mt-2 text-2xl font-extrabold text-ivory sm:text-3xl">
              مرحبًا، {facultyName}
            </h1>
          </header>

          {children}
        </section>
      </div>
    </main>
  );
}
