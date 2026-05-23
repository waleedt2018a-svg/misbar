import { AdminCard } from "@/components/admin/AdminCard";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import type { AdminReport } from "@/lib/admin/types";

export function AdminReports({ reports }: { reports: AdminReport[] }) {
  if (!reports.length) {
    return <AdminCard><p className="py-10 text-center text-lg font-extrabold text-[#6B7280]">لا توجد بيانات حاليًا</p></AdminCard>;
  }

  return (
    <div className="grid gap-5">
      {reports.map((report) => (
        <AdminCard key={report.id}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <AdminStatusBadge status={report.status} />
              <h3 className="mt-4 text-2xl font-extrabold text-[#1F1F1F]">{report.reason}</h3>
              <p className="mt-2 text-sm text-[#6B7280]">{report.reportedTarget}</p>
            </div>
            <p className="text-sm text-[#6B7280]">{report.createdAt}</p>
          </div>
          <div className="mt-5 grid gap-3 text-sm leading-7 text-[#6B7280] md:grid-cols-2">
            <p><span className="font-bold text-[#1F1F1F]">المبلّغ: </span>{report.reporter || "غير محدد"}</p>
            <p><span className="font-bold text-[#1F1F1F]">العنصر: </span>{report.reportedTarget}</p>
          </div>
          <p className="mt-3 leading-8 text-[#6B7280]">{report.details || "لا توجد تفاصيل."}</p>
        </AdminCard>
      ))}
    </div>
  );
}
