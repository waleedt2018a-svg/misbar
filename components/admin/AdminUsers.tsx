"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import type { AdminUserRecord } from "@/lib/admin/supabase-data";

export function AdminUsers({ users }: { users: AdminUserRecord[] }) {
  const [filters, setFilters] = useState({ search: "", role: "", status: "" });
  const filteredUsers = useMemo(
    () =>
      users.filter((user) =>
        (!filters.search || `${user.name} ${user.email} ${user.phone}`.includes(filters.search)) &&
        (!filters.role || user.role === filters.role) &&
        (!filters.status || (user.adminStatus || user.status) === filters.status || user.status === filters.status)
      ),
    [filters, users]
  );
  const counters = {
    students: users.filter((user) => user.role === "student").length,
    faculty: users.filter((user) => user.role === "faculty").length,
    admins: users.filter((user) => ["super_admin", "chief_admin", "admin"].includes(user.role)).length,
    active: users.filter((user) => (user.adminStatus || user.status) === "active").length,
    inactive: users.filter((user) => (user.adminStatus || user.status) === "inactive" || user.status === "banned").length
  };

  function updateFilter(name: keyof typeof filters, value: string) {
    setFilters((current) => ({ ...current, [name]: value }));
  }

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-5">
        <AdminCard><p className="text-sm text-[#6B7280]">الطلاب</p><p className="mt-3 text-4xl font-extrabold text-[#C9A45C]">{counters.students}</p></AdminCard>
        <AdminCard><p className="text-sm text-[#6B7280]">أعضاء هيئة التدريس</p><p className="mt-3 text-4xl font-extrabold text-[#C9A45C]">{counters.faculty}</p></AdminCard>
        <AdminCard><p className="text-sm text-[#6B7280]">الأدمنز</p><p className="mt-3 text-4xl font-extrabold text-[#C9A45C]">{counters.admins}</p></AdminCard>
        <AdminCard><p className="text-sm text-[#6B7280]">النشطون</p><p className="mt-3 text-4xl font-extrabold text-[#3C7A57]">{counters.active}</p></AdminCard>
        <AdminCard><p className="text-sm text-[#6B7280]">الموقوفون</p><p className="mt-3 text-4xl font-extrabold text-[#B94A48]">{counters.inactive}</p></AdminCard>
      </div>

      <AdminCard>
        <div className="grid gap-3 md:grid-cols-3">
          <input className="admin-input rounded-2xl px-4 py-3 text-sm" placeholder="بحث بالاسم أو البريد أو الجوال" value={filters.search} onChange={(event) => updateFilter("search", event.target.value)} />
          <select className="admin-input rounded-2xl px-4 py-3 text-sm" value={filters.role} onChange={(event) => updateFilter("role", event.target.value)}>
            <option value="">كل الأدوار</option>
            <option value="student">student</option>
            <option value="faculty">faculty</option>
            <option value="admin">admin</option>
            <option value="chief_admin">chief_admin</option>
            <option value="super_admin">super_admin</option>
          </select>
          <select className="admin-input rounded-2xl px-4 py-3 text-sm" value={filters.status} onChange={(event) => updateFilter("status", event.target.value)}>
            <option value="">كل الحالات</option>
            <option value="active">active</option>
            <option value="inactive">inactive</option>
            <option value="banned">banned</option>
          </select>
        </div>
      </AdminCard>

      <AdminCard>
        <div className="hidden grid-cols-[1fr_1.2fr_0.7fr_0.7fr_1fr_0.7fr_0.8fr_0.7fr] gap-3 border-b border-[#D8D2C2] pb-3 text-xs font-extrabold text-[#C9A45C] xl:grid">
          <span>الاسم</span><span>البريد</span><span>الجوال</span><span>الدور</span><span>الكلية/القسم</span><span>الحالة</span><span>آخر نشاط</span><span>إجراء</span>
        </div>
        <div className="grid gap-3 pt-3">
          {filteredUsers.map((user) => (
            <div key={user.id} className="admin-table-row grid gap-3 rounded-2xl px-4 py-3 text-sm text-[#6B7280] xl:grid-cols-[1fr_1.2fr_0.7fr_0.7fr_1fr_0.7fr_0.8fr_0.7fr]">
              <p className="font-extrabold text-[#1F1F1F]">{user.name}</p>
              <p>{user.email || "لا يوجد"}</p>
              <p>{user.phone || "لا يوجد"}</p>
              <p>{user.role}</p>
              <p>{user.college || user.major || "لا يوجد"}</p>
              <AdminStatusBadge status={user.adminStatus || user.status} />
              <p>{user.lastActivity || "لا يوجد"}</p>
              <Link href={`/admin/users/${user.id}`} className="rounded-full bg-[#1F1F1F] px-3 py-2 text-center text-xs font-extrabold text-white">عرض التفاصيل</Link>
            </div>
          ))}
          {!filteredUsers.length ? <p className="py-10 text-center text-lg font-extrabold text-[#6B7280]">لا توجد بيانات حاليًا</p> : null}
        </div>
      </AdminCard>
    </div>
  );
}
