"use client";

import { useMemo, useState } from "react";
import { adminActivityLogs } from "@/data/admin";
import { AdminCard } from "@/components/admin/AdminCard";

export function AdminActivityLogList() {
  const [filters, setFilters] = useState({
    email: "",
    actionType: "",
    targetType: "",
    date: "",
    role: ""
  });

  const logs = useMemo(
    () =>
      adminActivityLogs.filter((log) => {
        return (
          (!filters.email || log.adminEmail.includes(filters.email)) &&
          (!filters.actionType || log.actionType.includes(filters.actionType)) &&
          (!filters.targetType || log.targetType.includes(filters.targetType)) &&
          (!filters.date || log.createdAt.startsWith(filters.date)) &&
          (!filters.role || log.adminRole === filters.role)
        );
      }),
    [filters]
  );

  function updateFilter(name: keyof typeof filters, value: string) {
    setFilters((current) => ({ ...current, [name]: value }));
  }

  return (
    <div className="grid gap-5">
      <AdminCard>
        <div className="grid gap-3 md:grid-cols-5">
          <input className="rounded-2xl border border-gold/20 bg-white px-3 py-2 text-sm text-ivory outline-none" placeholder="البريد" value={filters.email} onChange={(event) => updateFilter("email", event.target.value)} />
          <input className="rounded-2xl border border-gold/20 bg-white px-3 py-2 text-sm text-ivory outline-none" placeholder="نوع الإجراء" value={filters.actionType} onChange={(event) => updateFilter("actionType", event.target.value)} />
          <input className="rounded-2xl border border-gold/20 bg-white px-3 py-2 text-sm text-ivory outline-none" placeholder="نوع العنصر" value={filters.targetType} onChange={(event) => updateFilter("targetType", event.target.value)} />
          <input className="rounded-2xl border border-gold/20 bg-white px-3 py-2 text-sm text-ivory outline-none" placeholder="YYYY-MM-DD" value={filters.date} onChange={(event) => updateFilter("date", event.target.value)} />
          <select className="rounded-2xl border border-gold/20 bg-white px-3 py-2 text-sm text-ivory outline-none" value={filters.role} onChange={(event) => updateFilter("role", event.target.value)}>
            <option value="">كل الرتب</option>
            <option value="super_admin">super_admin</option>
            <option value="admin">admin</option>
            <option value="moderator">moderator</option>
          </select>
        </div>
      </AdminCard>

      {logs.map((log) => (
        <AdminCard key={log.id}>
          <div className="grid gap-3 text-sm leading-7 text-muted lg:grid-cols-[1.1fr_1fr_1fr_1fr]">
            <p><span className="font-bold text-ivory">الوقت: </span>{log.createdAt}</p>
            <p><span className="font-bold text-ivory">الأدمن: </span>{log.adminEmail}</p>
            <p><span className="font-bold text-ivory">الرتبة: </span>{log.adminRole}</p>
            <p><span className="font-bold text-ivory">الإجراء: </span>{log.actionType}</p>
          </div>
          <p className="mt-3 text-lg font-extrabold text-ivory">{log.targetTitleOrEmail}</p>
          <div className="mt-3 grid gap-3 text-sm leading-7 text-muted md:grid-cols-3">
            <p><span className="font-bold text-ivory">العنصر المتأثر: </span>{log.targetType}</p>
            <p><span className="font-bold text-ivory">السبب: </span>{log.reason || "لا يوجد"}</p>
            <p><span className="font-bold text-ivory">التفاصيل: </span>{JSON.stringify(log.metadata)}</p>
          </div>
        </AdminCard>
      ))}
    </div>
  );
}
