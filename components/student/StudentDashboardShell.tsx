"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "الرئيسية", href: "/" },
  { label: "الفرص البحثية", href: "/student/opportunities" },
  { label: "أفكاري البحثية", href: "/student/ideas" },
  { label: "طلبات الانضمام لفكرتي", href: "/student/idea-join-requests" },
  { label: "طلباتي", href: "/student/requests" },
  { label: "ملفي البحثي", href: "/student/profile" },
  { label: "إعدادات التواصل", href: "/student/contact-settings" },
  { label: "الإشعارات", href: "/student/notifications" }
];

type StudentDashboardShellProps = {
  studentName: string;
  children: React.ReactNode;
};

export function StudentDashboardShell({ studentName, children }: StudentDashboardShellProps) {
  const pathname = usePathname() ?? "/student";

  return (
    <main className="site-shell min-h-screen bg-navy text-ivory">
      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-6 sm:px-8 lg:grid-cols-[18rem_1fr]">
        <aside className="glass-panel h-fit rounded-[2rem] p-5 lg:sticky lg:top-6">
          <Link href="/" className="mb-6 flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl border border-gold/45 bg-gold/10 text-xl font-extrabold text-gold-light shadow-glow">
              م
            </span>
            <span>
              <span className="block text-lg font-extrabold text-ivory">مِسبار</span>
              <span className="block text-xs text-muted">لوحة الطالب</span>
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
                      ? "border-gold bg-gold/15 text-gold-light"
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
            <p className="text-sm font-extrabold text-gold-light">مِسبار — حيث يُصنع الباحثون</p>
            <h1 className="mt-2 text-2xl font-extrabold text-ivory sm:text-3xl">
              مرحبًا، {studentName}
            </h1>
          </header>

          {children}
        </section>
      </div>
    </main>
  );
}
