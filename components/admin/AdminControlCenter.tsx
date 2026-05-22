"use client";

import { controlCenterSections } from "@/data/admin";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";

const dangerousActions = new Set(["حذف", "حظر/فك حظر", "تغيير صلاحية"]);

export function AdminControlCenter() {
  function confirmAction(action: string) {
    if (!dangerousActions.has(action)) {
      return;
    }

    window.confirm(`تأكيد إجراء: ${action}`);
  }

  return (
    <div className="grid gap-6">
      {controlCenterSections.map((section) => (
        <AdminCard key={section.title}>
          <h3 className="text-2xl font-extrabold text-ivory">{section.title}</h3>
          <div className="mt-5 grid gap-4">
            {section.items.map((item) => (
              <div key={item.id} className="rounded-3xl border border-gold/15 bg-white p-4">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                  <div>
                    <AdminStatusBadge status={item.status} />
                    <h4 className="mt-3 text-xl font-extrabold text-ivory">{item.titleOrName}</h4>
                    <div className="mt-3 grid gap-2 text-sm leading-7 text-muted md:grid-cols-3">
                      <p><span className="font-bold text-ivory">النوع: </span>{item.type}</p>
                      <p><span className="font-bold text-ivory">المالك: </span>{item.owner}</p>
                      <p><span className="font-bold text-ivory">تاريخ الإنشاء: </span>{item.createdAt}</p>
                      <p><span className="font-bold text-ivory">آخر تحديث: </span>{item.updatedAt}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["عرض", "تعديل", "اعتماد", "رفض", "طلب تعديل", "حذف", "حظر/فك حظر", "إرسال تنبيه", "تغيير صلاحية"].map((action) => (
                      <button
                        key={action}
                        onClick={() => confirmAction(action)}
                        className="rounded-full border border-gold/35 px-4 py-2 text-xs font-extrabold text-ivory transition hover:border-gold hover:bg-gold/10"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      ))}
    </div>
  );
}
