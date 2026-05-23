"use client";

import { useMemo, useState } from "react";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import type { PersistedAdminReviewItem } from "@/lib/admin/review-persistence";

const typeLabels: Record<PersistedAdminReviewItem["targetType"], string> = {
  idea: "فكرة طالب",
  opportunity: "فرصة بحثية",
  report: "بلاغ"
};

export function AdminProcessed({ items }: { items: PersistedAdminReviewItem[] }) {
  const [filters, setFilters] = useState({ type: "", status: "", admin: "", date: "", reason: "", search: "" });
  const filteredItems = useMemo(
    () =>
      items.filter((item) =>
        (!filters.type || item.targetType === filters.type) &&
        (!filters.status || item.status === filters.status) &&
        (!filters.admin || (item.reviewedBy ?? "").includes(filters.admin)) &&
        (!filters.date || (item.reviewedAt ?? item.createdAt).startsWith(filters.date)) &&
        (!filters.reason || (item.reviewReason ?? "").includes(filters.reason)) &&
        (!filters.search || item.title.includes(filters.search) || item.content.includes(filters.search))
      ),
    [filters, items]
  );

  function updateFilter(name: keyof typeof filters, value: string) {
    setFilters((current) => ({ ...current, [name]: value }));
  }

  return (
    <div className="grid gap-5">
      <AdminCard>
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          <select className="admin-input rounded-2xl px-3 py-2 text-sm" value={filters.type} onChange={(event) => updateFilter("type", event.target.value)}>
            <option value="">النوع</option>
            <option value="idea">أفكار</option>
            <option value="opportunity">فرص</option>
            <option value="report">بلاغات</option>
          </select>
          <select className="admin-input rounded-2xl px-3 py-2 text-sm" value={filters.status} onChange={(event) => updateFilter("status", event.target.value)}>
            <option value="">الحالة</option>
            <option value="approved">approved</option>
            <option value="rejected">rejected</option>
            <option value="needs_revision">needs_revision</option>
            <option value="paused">paused</option>
            <option value="archived">archived</option>
            <option value="resolved">resolved</option>
          </select>
          <input className="admin-input rounded-2xl px-3 py-2 text-sm" placeholder="الأدمن" value={filters.admin} onChange={(event) => updateFilter("admin", event.target.value)} />
          <input className="admin-input rounded-2xl px-3 py-2 text-sm" placeholder="التاريخ" value={filters.date} onChange={(event) => updateFilter("date", event.target.value)} />
          <input className="admin-input rounded-2xl px-3 py-2 text-sm" placeholder="السبب" value={filters.reason} onChange={(event) => updateFilter("reason", event.target.value)} />
          <input className="admin-input rounded-2xl px-3 py-2 text-sm" placeholder="البحث" value={filters.search} onChange={(event) => updateFilter("search", event.target.value)} />
        </div>
      </AdminCard>

      <AdminCard>
        <div className="hidden grid-cols-[1.2fr_0.7fr_0.8fr_1fr_1.2fr_0.8fr] gap-3 border-b border-[#D8D2C2] pb-3 text-xs font-extrabold text-[#C9A45C] xl:grid">
          <span>العنوان</span>
          <span>النوع</span>
          <span>القرار</span>
          <span>بواسطة</span>
          <span>السبب</span>
          <span>الوقت</span>
        </div>
        <div className="grid gap-3 pt-3">
          {filteredItems.map((item) => (
            <div key={`${item.source}-${item.id}`} className="admin-table-row grid gap-3 rounded-2xl px-4 py-3 text-sm text-[#6B7280] xl:grid-cols-[1.2fr_0.7fr_0.8fr_1fr_1.2fr_0.8fr]">
              <p className="font-extrabold text-[#1F1F1F]">{item.title}</p>
              <p>{typeLabels[item.targetType]}</p>
              <AdminStatusBadge status={item.status} />
              <p>{item.reviewedBy ?? "غير محدد"}</p>
              <p>{item.reviewReason || "لا يوجد سبب مطلوب"}</p>
              <p>{item.reviewedAt ?? item.createdAt}</p>
            </div>
          ))}
          {!filteredItems.length ? <p className="py-10 text-center text-lg font-extrabold text-[#6B7280]">لا توجد قرارات مسجلة.</p> : null}
        </div>
      </AdminCard>
    </div>
  );
}
