"use client";

import { useMemo, useState } from "react";
import { AdminCard } from "@/components/admin/AdminCard";
import type { AdminActivityLog } from "@/lib/admin/types";
import type { AdminRole } from "@/lib/auth/types";

export function AdminActivityLogList({
  role,
  adminEmail,
  logs: activityLogs
}: {
  role: AdminRole;
  adminEmail: string;
  logs: AdminActivityLog[];
}) {
  const [mode, setMode] = useState<"table" | "timeline">("table");
  const [filters, setFilters] = useState({ email: "", actionType: "", targetType: "", date: "", role: "", search: "" });

  const logs = useMemo(
    () =>
      activityLogs
        .filter((log) => {
          if (role === "admin") return log.adminEmail === adminEmail;
          if (role === "chief_admin") return !log.restrictedToSuper;
          return true;
        })
        .filter((log) =>
          (!filters.email || log.adminEmail.includes(filters.email)) &&
          (!filters.actionType || log.actionType.includes(filters.actionType)) &&
          (!filters.targetType || log.targetType.includes(filters.targetType)) &&
          (!filters.date || log.createdAt.startsWith(filters.date)) &&
          (!filters.role || log.adminRole === filters.role) &&
          (!filters.search || `${log.targetTitleOrEmail} ${log.reason ?? ""}`.includes(filters.search))
        ),
    [activityLogs, adminEmail, filters, role]
  );

  function updateFilter(name: keyof typeof filters, value: string) {
    setFilters((current) => ({ ...current, [name]: value }));
  }

  return (
    <div className="grid gap-5">
      <AdminCard>
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          <input className="admin-input rounded-2xl px-3 py-2 text-sm" placeholder="البريد" value={filters.email} onChange={(event) => updateFilter("email", event.target.value)} />
          <input className="admin-input rounded-2xl px-3 py-2 text-sm" placeholder="الإجراء" value={filters.actionType} onChange={(event) => updateFilter("actionType", event.target.value)} />
          <input className="admin-input rounded-2xl px-3 py-2 text-sm" placeholder="العنصر" value={filters.targetType} onChange={(event) => updateFilter("targetType", event.target.value)} />
          <input className="admin-input rounded-2xl px-3 py-2 text-sm" placeholder="YYYY-MM-DD" value={filters.date} onChange={(event) => updateFilter("date", event.target.value)} />
          <select className="admin-input rounded-2xl px-3 py-2 text-sm" value={filters.role} onChange={(event) => updateFilter("role", event.target.value)}>
            <option value="">كل الرتب</option>
            <option value="super_admin">super_admin</option>
            <option value="chief_admin">chief_admin</option>
            <option value="admin">admin</option>
          </select>
          <input className="admin-input rounded-2xl px-3 py-2 text-sm" placeholder="بحث" value={filters.search} onChange={(event) => updateFilter("search", event.target.value)} />
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={() => setMode("table")} className={`rounded-full px-4 py-2 text-sm font-extrabold ${mode === "table" ? "bg-[#1F1F1F] text-white" : "border border-[#D8D2C2] text-[#1F1F1F]"}`}>جدول</button>
          <button onClick={() => setMode("timeline")} className={`rounded-full px-4 py-2 text-sm font-extrabold ${mode === "timeline" ? "bg-[#1F1F1F] text-white" : "border border-[#D8D2C2] text-[#1F1F1F]"}`}>خط زمني</button>
        </div>
      </AdminCard>

      <AdminCard>
        {mode === "table" ? (
          <>
            <div className="hidden grid-cols-[0.8fr_1fr_0.7fr_0.7fr_1.1fr_1fr_0.8fr] gap-3 border-b border-[#D8D2C2] pb-3 text-xs font-extrabold text-[#C9A45C] xl:grid">
              <span>الوقت</span><span>الأدمن</span><span>الرتبة</span><span>الإجراء</span><span>العنصر</span><span>السبب</span><span>التفاصيل</span>
            </div>
            <div className="grid gap-3 pt-3">
              {logs.map((log) => (
                <div key={log.id} className="admin-table-row grid gap-3 rounded-2xl px-4 py-3 text-sm text-[#6B7280] xl:grid-cols-[0.8fr_1fr_0.7fr_0.7fr_1.1fr_1fr_0.8fr]">
                  <p>{log.createdAt}</p>
                  <p className="font-extrabold text-[#1F1F1F]">{log.adminEmail}</p>
                  <p>{log.adminRole}</p>
                  <p className="font-extrabold text-[#C9A45C]">{log.actionType}</p>
                  <p>{log.targetTitleOrEmail}</p>
                  <p>{log.reason || "لا يوجد سبب"}</p>
                  <p>{JSON.stringify(log.metadata)}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="grid gap-4">
            {logs.map((log) => (
              <div key={log.id} className="border-r-4 border-[#C9A45C] bg-[#F8F6EF] px-5 py-4">
                <p className="text-xs font-extrabold text-[#C9A45C]">{log.createdAt}</p>
                <h3 className="mt-2 text-lg font-extrabold text-[#1F1F1F]">{log.adminEmail} نفذ {log.actionType}</h3>
                <p className="mt-1 text-sm text-[#6B7280]">{log.targetTitleOrEmail} — {log.reason || "لا يوجد سبب"}</p>
              </div>
            ))}
          </div>
        )}
        {!logs.length ? <p className="py-10 text-center text-lg font-extrabold text-[#6B7280]">لا توجد سجلات نشاط بعد</p> : null}
      </AdminCard>
    </div>
  );
}
