"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { roleLabel } from "@/lib/admin/permissions";
import type { AdminRole } from "@/lib/auth/types";

const navItems = [
  { label: "الرئيسية الإدارية", href: "/admin", icon: "م" },
  { label: "الوارد الإداري", href: "/admin/inbox", icon: "و" },
  { label: "المعالجة والأرشيف", href: "/admin/processed", icon: "أ" },
  { label: "مركز التحكم", href: "/admin/control-center", icon: "ت" },
  { label: "إدارة المستخدمين", href: "/admin/users", icon: "ن" },
  { label: "إدارة الأدمنز", href: "/admin/admins", icon: "ص" },
  { label: "سجل النشاط", href: "/admin/activity-log", icon: "س" },
  { label: "الإشعارات", href: "/admin/notifications", icon: "ش" },
  { label: "البلاغات", href: "/admin/reports", icon: "ب" },
  { label: "التنبيهات", href: "/admin/warnings", icon: "ذ" }
];

function statusLabel(status?: string | null) {
  return status === "inactive" ? "متوقف" : "نشط";
}

export function AdminDashboardShell({
  adminName,
  adminEmail,
  role,
  adminStatus,
  unreadNotificationCount,
  children
}: {
  adminName: string;
  adminEmail: string;
  role: AdminRole;
  adminStatus?: string | null;
  lastLogin?: string | null;
  unreadNotificationCount: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "/admin";
  const visibleUnreadCount = pathname.startsWith("/admin/notifications") ? 0 : unreadNotificationCount;

  return (
    <main className="admin-os min-h-screen">
      <aside className="admin-sidebar fixed inset-y-0 right-0 z-40 hidden w-[19rem] overflow-y-auto px-4 py-5 text-white lg:block">
        <div className="rounded-3xl border border-[#EFE1BD]/15 bg-white/5 p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl border border-[#C9A45C]/50 bg-[#C9A45C]/15 text-xl font-extrabold text-[#EFE1BD]">
              م
            </span>
            <div>
              <p className="text-lg font-extrabold text-white">مِسبار</p>
              <p className="text-xs font-bold text-[#EFE1BD]/70">نظام الإدارة</p>
            </div>
          </div>
        </div>

        <nav className="mt-5 grid gap-1.5">
          {navItems.map((item) => {
            const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm font-extrabold transition ${
                  isActive
                    ? "border-[#C9A45C]/65 bg-[#C9A45C]/18 text-[#EFE1BD]"
                    : "border-transparent text-white/68 hover:border-[#EFE1BD]/20 hover:bg-white/7 hover:text-white"
                }`}
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/8 text-xs text-[#EFE1BD]">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 rounded-3xl border border-[#EFE1BD]/15 bg-white/6 p-4">
          <p className="text-xs font-extrabold text-[#EFE1BD]/70">هوية الأدمن</p>
          <p className="mt-2 text-base font-extrabold text-white">{adminName}</p>
          <p className="mt-1 text-xs text-white/55">{adminEmail}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-[#C9A45C]/40 bg-[#C9A45C]/12 px-3 py-1 text-xs font-extrabold text-[#EFE1BD]">
              {roleLabel(role)}
            </span>
            <span className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-xs font-extrabold text-emerald-100">
              {statusLabel(adminStatus)}
            </span>
          </div>
        </div>

        <Link href="/" className="mt-5 block rounded-2xl border border-white/10 px-4 py-3 text-center text-sm font-extrabold text-white/72 transition hover:border-[#C9A45C]/40 hover:text-[#EFE1BD]">
          العودة للموقع
        </Link>
      </aside>

      <div className="min-h-screen lg:pr-[19rem]">
        <header className="sticky top-0 z-30 px-4 py-4 lg:px-8">
          <div className="admin-command-bar rounded-3xl px-4 py-3">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-xs font-extrabold text-[#C9A45C]">مركز تشغيل مِسبار</p>
                <h1 className="mt-1 text-xl font-extrabold text-[#1F1F1F]">لوحة قيادة الإدارة</h1>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link href="/admin/inbox" className="rounded-full bg-[#1F1F1F] px-4 py-2 text-sm font-extrabold text-white transition hover:bg-[#2B2B2B]">
                  مراجعة الوارد
                </Link>
                <Link href="/admin/activity-log" className="rounded-full border border-[#D8D2C2] bg-white px-4 py-2 text-sm font-extrabold text-[#1F1F1F] transition hover:border-[#C9A45C]">
                  سجل النشاط
                </Link>
                <Link href="/admin/notifications" className="relative rounded-full border border-[#D8D2C2] bg-white px-4 py-2 text-sm font-extrabold text-[#1F1F1F] transition hover:border-[#C9A45C]">
                  الإشعارات
                  {visibleUnreadCount > 0 ? (
                    <span className="absolute -left-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[#B94A48] text-[10px] text-white">
                      {visibleUnreadCount}
                    </span>
                  ) : null}
                </Link>
                <span className="rounded-full border border-[#C9A45C]/45 bg-[#EFE1BD] px-4 py-2 text-sm font-extrabold text-[#1F1F1F]">
                  {roleLabel(role)}
                </span>
              </div>
            </div>
          </div>
        </header>

        <section className="px-4 pb-10 lg:px-8">
          {children}
        </section>
      </div>
    </main>
  );
}
