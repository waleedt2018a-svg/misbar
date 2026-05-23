import { AdminCard } from "@/components/admin/AdminCard";
import type { AdminWarning } from "@/lib/admin/types";

export function AdminWarnings({ warnings }: { warnings: AdminWarning[] }) {
  if (!warnings.length) {
    return <AdminCard><p className="py-10 text-center text-lg font-extrabold text-[#6B7280]">لا توجد بيانات حاليًا</p></AdminCard>;
  }

  return (
    <div className="grid gap-5">
      {warnings.map((warning) => (
        <AdminCard key={warning.id}>
          <h3 className="text-xl font-extrabold text-[#1F1F1F]">{warning.reason || "تنبيه إداري"}</h3>
          <div className="mt-4 grid gap-3 text-sm leading-7 text-[#6B7280] md:grid-cols-3">
            <p><span className="font-bold text-[#1F1F1F]">المستخدم: </span>{warning.userName || warning.userId || "غير محدد"}</p>
            <p><span className="font-bold text-[#1F1F1F]">صدر بواسطة: </span>{warning.issuedBy || "غير محدد"}</p>
            <p><span className="font-bold text-[#1F1F1F]">التاريخ: </span>{warning.createdAt}</p>
          </div>
          <p className="mt-3 leading-8 text-[#6B7280]">{warning.details || "لا توجد تفاصيل."}</p>
        </AdminCard>
      ))}
    </div>
  );
}
