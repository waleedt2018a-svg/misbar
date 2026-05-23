import Link from "next/link";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { requireAdminRole } from "@/lib/auth/guards";
import { roleLabel } from "@/lib/admin/permissions";
import { getAdminInboxItems, getAdminProcessedItems } from "@/lib/admin/review-persistence";
import {
  getAdminActivityLogsFromSupabase,
  getAdminAnalytics,
  getManagedAdminsFromSupabase,
  getReportsFromSupabase,
  getWarningsFromSupabase
} from "@/lib/admin/supabase-data";
import { getAccessToken } from "@/lib/supabase/rest";
import type { AdminRole } from "@/lib/auth/types";

function Metric({ label, value, tone = "gold" }: { label: string; value: number | string; tone?: "gold" | "dark" | "danger" | "success" }) {
  const color = tone === "danger" ? "text-[#B94A48]" : tone === "success" ? "text-[#3C7A57]" : tone === "dark" ? "text-[#1F1F1F]" : "text-[#C9A45C]";
  return <AdminCard><p className="text-sm font-bold text-[#6B7280]">{label}</p><p className={`mt-3 text-4xl font-extrabold ${color}`}>{value}</p></AdminCard>;
}

function MiniBar({ label, value, max }: { label: string; value: number; max: number }) {
  const width = max > 0 ? Math.max(6, Math.round((value / max) * 100)) : 0;
  return (
    <div>
      <div className="mb-2 flex justify-between text-xs font-bold text-[#6B7280]"><span>{label}</span><span>{value}</span></div>
      <div className="h-2 rounded-full bg-[#EFE1BD]"><div className="h-2 rounded-full bg-[#C9A45C]" style={{ width: `${width}%` }} /></div>
    </div>
  );
}

function OperationCard({ title, href, description }: { title: string; href: string; description: string }) {
  return (
    <Link href={href} className="admin-card group rounded-3xl p-5 transition hover:-translate-y-0.5 hover:border-[#C9A45C]">
      <p className="text-xs font-extrabold text-[#C9A45C]">عملية سريعة</p>
      <h3 className="mt-3 text-2xl font-extrabold text-[#1F1F1F]">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-[#6B7280]">{description}</p>
      <span className="mt-5 inline-flex rounded-full bg-[#1F1F1F] px-4 py-2 text-sm font-extrabold text-white transition group-hover:bg-[#C9A45C] group-hover:text-[#1F1F1F]">فتح</span>
    </Link>
  );
}

function formatArabicDateTime(value?: string | null) {
  if (!value) return "لم يتم تسجيل دخول إداري سابق";

  try {
    return new Intl.DateTimeFormat("ar-SA", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date(value));
  } catch {
    return "لم يتم تسجيل دخول إداري سابق";
  }
}

export default async function AdminDashboardPage() {
  const profile = await requireAdminRole();
  const role = profile.role as AdminRole;
  const accessToken = await getAccessToken();
  const inboxItems = accessToken ? await getAdminInboxItems(accessToken) : [];
  const processedItems = accessToken ? await getAdminProcessedItems(accessToken) : [];
  const logs = accessToken ? await getAdminActivityLogsFromSupabase(accessToken) : [];
  const admins = accessToken ? await getManagedAdminsFromSupabase(accessToken) : [];
  const warnings = accessToken ? await getWarningsFromSupabase(accessToken) : [];
  const reports = accessToken ? await getReportsFromSupabase(accessToken) : [];
  const analytics = accessToken ? await getAdminAnalytics(accessToken, processedItems) : null;
  const visibleLogs = role === "admin" ? logs.filter((log) => log.adminEmail === profile.email) : role === "chief_admin" ? logs.filter((log) => !log.restrictedToSuper) : logs;
  const chartMax = Math.max(analytics?.pendingReview ?? 0, processedItems.length, analytics?.registeredBeneficiaries ?? 0, 1);
  const contentMax = Math.max(...Object.values(analytics?.contentByStatus ?? { empty: 0 }), 1);

  return (
    <div className="grid gap-6">
      <section className="admin-card-dark overflow-hidden rounded-[2rem] p-6 text-white sm:p-8">
        <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
          <div>
            <p className="text-sm font-extrabold text-[#EFE1BD]">مركز القيادة</p>
            <h2 className="mt-3 text-4xl font-extrabold">مركز إدارة مِسبار</h2>
            <p className="mt-4 max-w-3xl text-lg leading-9 text-white/70">لوحة تشغيلية لمراجعة المحتوى، متابعة قرارات الإدارة، وإدارة صلاحيات المنصة.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/7 p-5">
            <p className="text-xs font-extrabold text-[#EFE1BD]">الأدمن الحالي</p>
            <h3 className="mt-2 text-2xl font-extrabold">{profile.full_name}</h3>
            <p className="mt-1 text-sm text-white/60">{profile.email}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#EFE1BD] px-3 py-1 text-xs font-extrabold text-[#1F1F1F]">{roleLabel(role)}</span>
              <span className="rounded-full border border-emerald-300/30 px-3 py-1 text-xs font-extrabold text-emerald-100">{profile.admin_status === "inactive" ? "متوقف" : "نشط"}</span>
            </div>
            <p className="mt-4 text-xs text-white/55">آخر دخول: {formatArabicDateTime(profile.last_admin_login_at)}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <OperationCard title="الوارد الإداري" href="/admin/inbox" description="قائمة العمليات التي تنتظر قرارًا." />
        <OperationCard title="مراجعة المحتوى" href="/admin/inbox" description="اعتماد أو رفض أو طلب تعديل من مصدر واحد." />
        <OperationCard title="إدارة المستخدمين" href="/admin/users" description="بحث وتحليل الحسابات المسجلة." />
        <OperationCard title="سجل النشاط" href="/admin/activity-log" description="تدقيق القرارات الإدارية الحساسة." />
        <OperationCard title="إدارة الأدمنز" href="/admin/admins" description="حالة وصلاحيات فريق الإدارة." />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Metric label="عدد أفكار الطلاب" value={analytics?.studentIdeas ?? 0} />
        <Metric label="عدد الفرص البحثية" value={analytics?.facultyOpportunities ?? 0} />
        <Metric label="الأبحاث/المحتوى المنشور" value={analytics?.publishedContent ?? 0} tone="success" />
        <Metric label="المستفيدون المسجلون" value={analytics?.registeredBeneficiaries ?? 0} tone="dark" />
        <Metric label="عناصر بانتظار المراجعة" value={analytics?.pendingReview ?? inboxItems.length} tone="danger" />
        <Metric label="الطلاب النشطون" value={analytics?.activeStudents ?? 0} tone="success" />
        <Metric label="أعضاء هيئة التدريس النشطون" value={analytics?.activeFaculty ?? 0} tone="success" />
        <Metric label="عدد الأدمنز" value={analytics?.admins ?? admins.length} tone="dark" />
        <Metric label="عناصر تمت معالجتها اليوم" value={analytics?.processedToday ?? 0} />
        <Metric label="بلاغات مفتوحة" value={analytics?.openReports ?? 0} tone="danger" />
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <AdminCard>
          <h3 className="text-xl font-extrabold text-[#1F1F1F]">pending vs processed</h3>
          <div className="mt-5 grid gap-4">
            <MiniBar label="قيد المراجعة" value={analytics?.pendingReview ?? inboxItems.length} max={chartMax} />
            <MiniBar label="تمت المعالجة" value={processedItems.length} max={chartMax} />
          </div>
        </AdminCard>
        <AdminCard>
          <h3 className="text-xl font-extrabold text-[#1F1F1F]">users by role</h3>
          <div className="mt-5 grid gap-4">
            {Object.entries(analytics?.usersByRole ?? {}).map(([key, value]) => <MiniBar key={key} label={key} value={value} max={chartMax} />)}
            {!Object.keys(analytics?.usersByRole ?? {}).length ? <p className="text-sm font-bold text-[#6B7280]">لا توجد بيانات حاليًا</p> : null}
          </div>
        </AdminCard>
        <AdminCard>
          <h3 className="text-xl font-extrabold text-[#1F1F1F]">content by status</h3>
          <div className="mt-5 grid gap-4">
            {Object.entries(analytics?.contentByStatus ?? {}).map(([key, value]) => <MiniBar key={key} label={key} value={value} max={contentMax} />)}
            {!Object.keys(analytics?.contentByStatus ?? {}).length ? <p className="text-sm font-bold text-[#6B7280]">لا توجد بيانات حاليًا</p> : null}
          </div>
        </AdminCard>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <AdminCard>
          <h3 className="text-2xl font-extrabold text-[#1F1F1F]">آخر النشاطات</h3>
          <div className="mt-5 grid gap-3">
            {visibleLogs.slice(0, 6).map((log) => (
              <div key={log.id} className="border-r-4 border-[#C9A45C] bg-[#F8F6EF] px-4 py-3 text-sm">
                <p className="font-extrabold text-[#1F1F1F]">{log.adminEmail} نفذ {log.actionType}</p>
                <p className="text-[#6B7280]">{log.targetTitleOrEmail} — {log.reason || "لا يوجد سبب"} — {log.createdAt}</p>
              </div>
            ))}
            {!visibleLogs.length ? <p className="rounded-2xl bg-[#F8F6EF] px-4 py-5 text-center font-bold text-[#6B7280]">لا توجد سجلات نشاط بعد</p> : null}
          </div>
        </AdminCard>
        <AdminCard>
          <h3 className="text-2xl font-extrabold text-[#1F1F1F]">تنبيهات حرجة</h3>
          <div className="mt-5 grid gap-3">
            {[...reports.filter((report) => report.status === "open" || report.status === "pending"), ...warnings].slice(0, 6).map((item) => (
              <div key={item.id} className="rounded-2xl border border-[#B94A48]/20 bg-[#FFF7F6] px-4 py-3 text-sm">
                <p className="font-extrabold text-[#B94A48]">{"reason" in item ? item.reason : "تنبيه"}</p>
                <p className="mt-1 text-[#6B7280]">{"details" in item ? item.details : ""}</p>
              </div>
            ))}
            {!reports.length && !warnings.length ? <p className="rounded-2xl bg-[#F8F6EF] px-4 py-5 text-center font-bold text-[#6B7280]">لا توجد بيانات حاليًا</p> : null}
          </div>
        </AdminCard>
      </section>
    </div>
  );
}
