"use client";

import { useState } from "react";
import { adminUsers } from "@/data/admin";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import type { AdminUser, UserStatus } from "@/lib/admin/types";
import type { AdminRole, Role } from "@/lib/auth/types";

export function AdminUsers({ role }: { role: AdminRole }) {
  const [users, setUsers] = useState<AdminUser[]>(adminUsers);
  const canBan = role === "admin" || role === "super_admin";
  const canChangeRole = role === "super_admin";

  function updateStatus(id: string, status: UserStatus) {
    setUsers((current) => current.map((user) => (user.id === id ? { ...user, status } : user)));
  }

  function updateRole(id: string, nextRole: Role) {
    setUsers((current) => current.map((user) => (user.id === id ? { ...user, role: nextRole } : user)));
  }

  function sendWarning(id: string) {
    setUsers((current) =>
      current.map((user) => (user.id === id ? { ...user, warningsCount: user.warningsCount + 1 } : user))
    );
  }

  return (
    <div className="grid gap-5">
      {users.map((user) => (
        <AdminCard key={user.id}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <AdminStatusBadge status={user.status} />
              <h3 className="mt-4 text-2xl font-extrabold text-ivory">{user.name}</h3>
              <p className="mt-2 text-sm text-muted">{user.email}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => sendWarning(user.id)} className="rounded-full border border-gold/35 px-5 py-2.5 text-sm font-extrabold text-ivory">إرسال تنبيه</button>
              {canBan ? (
                user.status === "banned" ? (
                  <button onClick={() => updateStatus(user.id, "active")} className="rounded-full bg-gold px-5 py-2.5 text-sm font-extrabold text-navy">فك الحظر</button>
                ) : (
                  <button onClick={() => updateStatus(user.id, "banned")} className="rounded-full border border-gold/35 px-5 py-2.5 text-sm font-extrabold text-ivory">حظر</button>
                )
              ) : null}
              {canBan ? (
                <button onClick={() => updateStatus(user.id, user.status === "inactive" ? "active" : "inactive")} className="rounded-full border border-gold/35 px-5 py-2.5 text-sm font-extrabold text-ivory">
                  {user.status === "inactive" ? "تفعيل" : "تعطيل"}
                </button>
              ) : null}
            </div>
          </div>
          <div className="mt-5 grid gap-3 text-sm leading-7 text-muted md:grid-cols-3">
            <p><span className="font-bold text-ivory">الدور: </span>{user.role}</p>
            <p><span className="font-bold text-ivory">الكلية: </span>{user.college}</p>
            <p><span className="font-bold text-ivory">تاريخ الإنشاء: </span>{user.createdAt}</p>
            <p><span className="font-bold text-ivory">عدد التنبيهات: </span>{user.warningsCount}</p>
          </div>
          {user.warningsCount >= 3 ? (
            <p className="mt-4 rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm font-bold text-gold">
              يوصى بمراجعة حظر هذا المستخدم بسبب تكرار التنبيهات.
            </p>
          ) : null}
          {canChangeRole ? (
            <div className="mt-5 flex flex-wrap gap-2">
              <button onClick={() => updateRole(user.id, "admin")} className="rounded-full border border-gold/35 px-4 py-2 text-sm font-extrabold text-ivory">ترقية إلى admin</button>
              <button onClick={() => updateRole(user.id, "moderator")} className="rounded-full border border-gold/35 px-4 py-2 text-sm font-extrabold text-ivory">ترقية إلى moderator</button>
              <button onClick={() => updateRole(user.id, user.email.endsWith("@student.ksu.edu.sa") ? "student" : "faculty")} className="rounded-full border border-gold/35 px-4 py-2 text-sm font-extrabold text-ivory">إزالة دور الإدارة</button>
            </div>
          ) : null}
        </AdminCard>
      ))}
    </div>
  );
}
