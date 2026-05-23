import { notFound } from "next/navigation";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import {
  getAdminActivityLogsFromSupabase,
  getAdminUsersFromSupabase,
  getReportsFromSupabase,
  getReviewItemsByOwner,
  getWarningsFromSupabase
} from "@/lib/admin/supabase-data";
import { requireAdminRole } from "@/lib/auth/guards";
import { getAccessToken } from "@/lib/supabase/rest";

function EmptyState({ label }: { label: string }) {
  return <div className="rounded-2xl border border-[#D8D2C2] bg-[#F8F6EF] px-4 py-6 text-center text-sm font-bold text-[#6B7280]">{label}</div>;
}

export default async function AdminUserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminRole();
  const { id } = await params;
  const accessToken = await getAccessToken();
  const users = accessToken ? await getAdminUsersFromSupabase(accessToken) : [];
  const user = users.find((item) => item.id === id);

  if (!user) notFound();

  const logs = accessToken ? await getAdminActivityLogsFromSupabase(accessToken) : [];
  const warnings = accessToken ? await getWarningsFromSupabase(accessToken) : [];
  const reports = accessToken ? await getReportsFromSupabase(accessToken) : [];
  const reviewItems = accessToken ? await getReviewItemsByOwner(accessToken, user.id, user.email) : { ideaRows: [], opportunityRows: [] };
  const userWarnings = warnings.filter((warning) => warning.userId === user.id || warning.userName === user.name);
  const userReports = reports.filter((report) => report.reporter === user.id || report.reportedTarget.includes(user.email) || report.reportedTarget.includes(user.name));
  const decisions = logs.filter((log) => log.targetId === user.id || log.targetTitleOrEmail === user.email || log.adminEmail === user.email);

  return (
    <div className="grid gap-6">
      <AdminSectionHeader title={`ملف المستخدم: ${user.name}`} description="صفحة استخبارات تشغيلية تعتمد على بيانات Supabase فقط." />

      <section className="admin-card-dark rounded-[2rem] p-6 text-white">
        <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
          <div>
            <p className="text-sm font-extrabold text-[#EFE1BD]">هوية المستخدم</p>
            <h2 className="mt-3 text-4xl font-extrabold">{user.name}</h2>
            <p className="mt-2 text-white/60">{user.email || "لا يوجد بريد"}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/7 p-4">
            <AdminStatusBadge status={user.adminStatus || user.status} />
            <p className="mt-4 text-sm text-white/60">الدور</p>
            <p className="text-xl font-extrabold">{user.role}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <AdminCard>
          <h3 className="text-2xl font-extrabold text-[#1F1F1F]">المعلومات والاتصال</h3>
          <div className="mt-5 grid gap-3 text-sm text-[#6B7280]">
            <p><span className="font-bold text-[#1F1F1F]">الجوال: </span>{user.phone || "لا يوجد"}</p>
            <p><span className="font-bold text-[#1F1F1F]">الكلية/القسم: </span>{user.college || "لا يوجد"}</p>
            <p><span className="font-bold text-[#1F1F1F]">التخصص: </span>{user.major || "لا يوجد"}</p>
            <p><span className="font-bold text-[#1F1F1F]">تاريخ الإنشاء: </span>{user.createdAt || "لا يوجد"}</p>
            <p><span className="font-bold text-[#1F1F1F]">آخر نشاط: </span>{user.lastActivity || "لا يوجد"}</p>
          </div>
        </AdminCard>

        <AdminCard>
          <h3 className="text-2xl font-extrabold text-[#1F1F1F]">قرارات مرتبطة بالمستخدم</h3>
          <div className="mt-5 grid gap-3">
            {decisions.length ? decisions.map((decision) => (
              <div key={decision.id} className="border-r-4 border-[#C9A45C] bg-[#F8F6EF] px-4 py-3 text-sm">
                <p className="font-extrabold text-[#1F1F1F]">{decision.actionType}</p>
                <p className="mt-1 text-[#6B7280]">{decision.targetTitleOrEmail} — {decision.reason || "لا يوجد سبب"} — {decision.createdAt}</p>
              </div>
            )) : <EmptyState label="لا توجد سجلات نشاط بعد" />}
          </div>
        </AdminCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <AdminCard><h3 className="text-xl font-extrabold text-[#1F1F1F]">الأفكار المقدمة</h3><div className="mt-4 grid gap-3">{reviewItems.ideaRows.length ? reviewItems.ideaRows.map((idea: any) => <p key={idea.id} className="admin-table-row rounded-2xl px-4 py-3 text-sm text-[#6B7280]">{idea.title}</p>) : <EmptyState label="لا توجد بيانات حاليًا" />}</div></AdminCard>
        <AdminCard><h3 className="text-xl font-extrabold text-[#1F1F1F]">الفرص المقدمة</h3><div className="mt-4 grid gap-3">{reviewItems.opportunityRows.length ? reviewItems.opportunityRows.map((item: any) => <p key={item.id} className="admin-table-row rounded-2xl px-4 py-3 text-sm text-[#6B7280]">{item.title}</p>) : <EmptyState label="لا توجد بيانات حاليًا" />}</div></AdminCard>
        <AdminCard><h3 className="text-xl font-extrabold text-[#1F1F1F]">الطلبات</h3><div className="mt-4"><EmptyState label="لا توجد بيانات حاليًا" /></div></AdminCard>
        <AdminCard><h3 className="text-xl font-extrabold text-[#1F1F1F]">التنبيهات</h3><div className="mt-4 grid gap-3">{userWarnings.length ? userWarnings.map((warning) => <p key={warning.id} className="admin-table-row rounded-2xl px-4 py-3 text-sm text-[#6B7280]">{warning.reason} — {warning.createdAt}</p>) : <EmptyState label="لا توجد بيانات حاليًا" />}</div></AdminCard>
        <AdminCard><h3 className="text-xl font-extrabold text-[#1F1F1F]">البلاغات</h3><div className="mt-4 grid gap-3">{userReports.length ? userReports.map((report) => <p key={report.id} className="admin-table-row rounded-2xl px-4 py-3 text-sm text-[#6B7280]">{report.reason} — {report.createdAt}</p>) : <EmptyState label="لا توجد بيانات حاليًا" />}</div></AdminCard>
        <AdminCard><h3 className="text-xl font-extrabold text-[#1F1F1F]">طلبات التقديم</h3><div className="mt-4"><EmptyState label="لا توجد بيانات حاليًا" /></div></AdminCard>
      </div>
    </div>
  );
}
