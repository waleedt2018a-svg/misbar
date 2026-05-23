"use client";

import Link from "next/link";
import { useState } from "react";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { canChangeAdminRole, canControlAdminStatus } from "@/lib/admin/permissions";
import type { ManagedAdmin } from "@/lib/admin/types";
import type { AdminRole } from "@/lib/auth/types";

export function AdminsManagement({
  role,
  admins,
  actionCounts
}: {
  role: AdminRole;
  admins: ManagedAdmin[];
  actionCounts: Record<string, number>;
}) {
  const [message, setMessage] = useState("");
  const visibleAdmins = role === "chief_admin" ? admins.filter((admin) => admin.role === "admin") : admins;

  function unsupportedAction(target: ManagedAdmin) {
    if (!canControlAdminStatus(role, target.role)) {
      setMessage("ليست لديك صلاحية لتنفيذ هذا الإجراء.");
      return;
    }

    window.confirm(`تأكيد تغيير حالة ${target.email}؟`);
    setMessage("تم تأكيد الإجراء بصريًا. اربط هذا الزر بإجراء Supabase عند تفعيل التحكم المباشر.");
  }

  function unsupportedRoleChange(target: ManagedAdmin) {
    if (!canChangeAdminRole(role) || target.role === "super_admin") {
      setMessage("ليست لديك صلاحية لتنفيذ هذا الإجراء.");
      return;
    }

    window.confirm(`تأكيد تغيير رتبة ${target.email}؟`);
    setMessage("تم تأكيد الإجراء بصريًا. اربط هذا الزر بإجراء Supabase عند تفعيل تغيير الرتبة المباشر.");
  }

  return (
    <div className="grid gap-5">
      {message ? <p className="rounded-2xl border border-[#C9A45C]/35 bg-[#EFE1BD]/70 px-4 py-3 text-sm font-bold text-[#1F1F1F]">{message}</p> : null}
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {visibleAdmins.map((admin) => (
          <AdminCard key={admin.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-extrabold text-[#1F1F1F]">{admin.name}</h3>
                <p className="mt-1 text-sm text-[#6B7280]">{admin.email || "لا يوجد بريد"}</p>
              </div>
              <AdminStatusBadge status={admin.adminStatus} />
            </div>
            <div className="mt-5 grid gap-3 text-sm text-[#6B7280]">
              <p><span className="font-bold text-[#1F1F1F]">الجوال: </span>{admin.phone || "لا يوجد"}</p>
              <p><span className="font-bold text-[#1F1F1F]">الرتبة: </span>{admin.role}</p>
              <p><span className="font-bold text-[#1F1F1F]">آخر دخول: </span>{admin.lastAdminLoginAt ?? "لا يوجد"}</p>
              <p><span className="font-bold text-[#1F1F1F]">آخر إجراء: </span>{admin.lastAdminActionAt ?? "لا يوجد"}</p>
              <p><span className="font-bold text-[#1F1F1F]">إجمالي الإجراءات: </span>{actionCounts[admin.email] ?? 0}</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {canControlAdminStatus(role, admin.role) ? (
                <button onClick={() => unsupportedAction(admin)} className="rounded-full bg-[#1F1F1F] px-4 py-2 text-xs font-extrabold text-white">
                  {admin.adminStatus === "active" ? "إيقاف" : "تفعيل"}
                </button>
              ) : null}
              {canChangeAdminRole(role) && admin.role !== "super_admin" ? (
                <button onClick={() => unsupportedRoleChange(admin)} className="rounded-full border border-[#D8D2C2] px-4 py-2 text-xs font-extrabold text-[#1F1F1F]">تغيير الرتبة</button>
              ) : null}
              <Link href={`/admin/activity-log?admin=${encodeURIComponent(admin.email)}`} className="rounded-full border border-[#C9A45C] px-4 py-2 text-xs font-extrabold text-[#1F1F1F]">عرض السجل</Link>
            </div>
          </AdminCard>
        ))}
      </div>
      {!visibleAdmins.length ? <AdminCard><p className="py-10 text-center text-lg font-extrabold text-[#6B7280]">لا توجد بيانات حاليًا</p></AdminCard> : null}
    </div>
  );
}
