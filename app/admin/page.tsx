import Link from "next/link";
import {
  adminActivityLogs,
  adminReports,
  adminUsers,
  adminWarnings,
  pendingOpportunities,
  pendingStudentIdeas
} from "@/data/admin";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { requireAdminRole } from "@/lib/auth/guards";
import {
  canManageEverything,
  canManageAdmins,
  canViewAuditLogs,
  roleLabel
} from "@/lib/admin/permissions";
import type { AdminRole } from "@/lib/auth/types";

const priorityCards = [
  { label: "مراجعة الفرص البحثية", href: "/admin/opportunities-review" },
  { label: "مراجعة أفكار الطلاب", href: "/admin/student-ideas-review" },
  { label: "إدارة المستخدمين", href: "/admin/users" },
  { label: "البلاغات المفتوحة", href: "/admin/reports" },
  { label: "سجل نشاط الأدمنز", href: "/admin/activity-log", requiresLogAccess: true }
];

export default async function AdminDashboardPage() {
  const profile = await requireAdminRole();
  const role = profile.role as AdminRole;
  const stats = [
    { label: "بانتظار المراجعة", value: pendingOpportunities.length + pendingStudentIdeas.length },
    { label: "مستخدمون نشطون", value: adminUsers.filter((user) => user.status === "active").length },
    { label: "بلاغات مفتوحة", value: adminReports.filter((report) => report.status === "open").length },
    { label: "تنبيهات مرسلة", value: adminWarnings.length }
  ];
  const visiblePriorityCards = priorityCards.filter((card) => !card.requiresLogAccess || canViewAuditLogs(role));
  const quickActions = [
    canManageAdmins(role) ? { label: "إضافة أدمن", href: "/admin/admins" } : null,
    { label: "إرسال تنبيه", href: "/admin/warnings" },
    { label: "مراجعة البلاغات", href: "/admin/reports" },
    canManageEverything(role) ? { label: "الذهاب لمركز التحكم", href: "/admin/control-center" } : null
  ].filter(Boolean) as Array<{ label: string; href: string }>;

  return (
    <div className="grid gap-6">
      <AdminSectionHeader
        title="مرحبًا بك في لوحة إدارة مِسبار"
        description="واجهة مركزة للمراجعة، الصلاحيات، البلاغات، والتنبيهات حسب رتبتك الإدارية."
      />

      <AdminCard>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-extrabold text-gold">رتبة الدخول</p>
            <h3 className="mt-2 text-3xl font-extrabold text-ivory">{roleLabel(role)}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href} className="rounded-full border border-gold/35 px-5 py-2.5 text-sm font-extrabold text-ivory transition hover:border-gold hover:bg-gold/10">
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </AdminCard>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <AdminCard key={stat.label}>
            <p className="text-sm font-bold text-muted">{stat.label}</p>
            <p className="mt-4 text-4xl font-extrabold text-gold">{stat.value}</p>
          </AdminCard>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {visiblePriorityCards.map((card) => (
          <Link key={card.href} href={card.href} className="fine-card rounded-3xl p-5 transition hover:border-gold/50 hover:bg-gold/5">
            <p className="text-lg font-extrabold leading-8 text-ivory">{card.label}</p>
          </Link>
        ))}
      </div>

      <AdminCard>
        <h3 className="text-2xl font-extrabold text-ivory">آخر إجراءات الإدارة</h3>
        <div className="mt-5 grid gap-3">
          {adminActivityLogs.slice(0, 3).map((log) => (
            <div key={log.id} className="rounded-2xl border border-gold/15 bg-white px-4 py-3">
              <p className="font-extrabold text-ivory">{log.actionType}</p>
              <p className="mt-1 text-sm text-muted">
                {log.adminEmail} — {log.targetTitleOrEmail} — {log.createdAt}
              </p>
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}
