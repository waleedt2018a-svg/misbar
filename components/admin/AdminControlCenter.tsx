import { AdminCard } from "@/components/admin/AdminCard";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import type { AdminActivityLog, AdminReport, AdminWarning, ManagedAdmin } from "@/lib/admin/types";
import type { AdminUserRecord } from "@/lib/admin/supabase-data";
import type { PersistedAdminReviewItem } from "@/lib/admin/review-persistence";

export function AdminControlCenter({
  users,
  admins,
  inboxItems,
  processedItems,
  reports,
  warnings,
  logs
}: {
  users: AdminUserRecord[];
  admins: ManagedAdmin[];
  inboxItems: PersistedAdminReviewItem[];
  processedItems: PersistedAdminReviewItem[];
  reports: AdminReport[];
  warnings: AdminWarning[];
  logs: AdminActivityLog[];
}) {
  const sections = [
    { title: "المستخدمون", count: users.length, items: users.map((user) => ({ id: user.id, title: user.name, owner: user.email, status: user.status, type: user.role })) },
    { title: "الأدمنز", count: admins.length, items: admins.map((admin) => ({ id: admin.id, title: admin.name, owner: admin.email, status: admin.adminStatus, type: admin.role })) },
    { title: "الوارد", count: inboxItems.length, items: inboxItems.map((item) => ({ id: item.id, title: item.title, owner: item.source, status: item.status, type: item.targetType })) },
    { title: "الأرشيف", count: processedItems.length, items: processedItems.map((item) => ({ id: item.id, title: item.title, owner: item.reviewedBy ?? "", status: item.status, type: item.targetType })) },
    { title: "البلاغات", count: reports.length, items: reports.map((report) => ({ id: report.id, title: report.reason, owner: report.reporter, status: report.status, type: "report" })) },
    { title: "التنبيهات", count: warnings.length, items: warnings.map((warning) => ({ id: warning.id, title: warning.reason, owner: warning.issuedBy, status: "active", type: "warning" })) },
    { title: "سجل النشاط", count: logs.length, items: logs.map((log) => ({ id: log.id, title: log.actionType, owner: log.adminEmail, status: log.adminRole, type: log.targetType })) }
  ];

  return (
    <div className="grid gap-6">
      {sections.map((section) => (
        <AdminCard key={section.title}>
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-2xl font-extrabold text-[#1F1F1F]">{section.title}</h3>
            <span className="rounded-full bg-[#EFE1BD] px-4 py-2 text-sm font-extrabold text-[#1F1F1F]">{section.count}</span>
          </div>
          <div className="mt-5 grid gap-3">
            {section.items.slice(0, 8).map((item) => (
              <div key={`${section.title}-${item.id}`} className="admin-table-row grid gap-3 rounded-2xl px-4 py-3 text-sm text-[#6B7280] md:grid-cols-[1fr_1fr_0.7fr_0.7fr]">
                <p className="font-extrabold text-[#1F1F1F]">{item.title || "بدون عنوان"}</p>
                <p>{item.owner || "غير محدد"}</p>
                <p>{item.type}</p>
                <AdminStatusBadge status={item.status || "active"} />
              </div>
            ))}
            {!section.items.length ? <p className="py-6 text-center font-bold text-[#6B7280]">لا توجد بيانات حاليًا</p> : null}
          </div>
        </AdminCard>
      ))}
    </div>
  );
}
