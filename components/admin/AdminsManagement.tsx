"use client";

import { useState } from "react";
import { managedAdmins } from "@/data/admin";
import { AdminCard } from "@/components/admin/AdminCard";
import type { ManagedAdmin } from "@/lib/admin/types";
import type { AdminRole } from "@/lib/auth/types";

export function AdminsManagement() {
  const [admins, setAdmins] = useState<ManagedAdmin[]>(managedAdmins);
  const [email, setEmail] = useState("");

  function addAdmin(role: AdminRole) {
    if (!email.trim()) {
      return;
    }

    setAdmins((current) => [
      {
        id: `admin-${Date.now()}`,
        name: email.split("@")[0],
        email,
        role,
        createdAt: new Date().toISOString().slice(0, 10)
      },
      ...current
    ]);
    setEmail("");
  }

  function changeRole(id: string, role: AdminRole) {
    setAdmins((current) => current.map((admin) => (admin.id === id ? { ...admin, role } : admin)));
  }

  function removeAdmin(id: string) {
    setAdmins((current) => current.filter((admin) => admin.id !== id));
  }

  return (
    <div className="grid gap-6">
      <AdminCard>
        <h3 className="text-xl font-extrabold text-ivory">إضافة أدمن بالبريد الإلكتروني</h3>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            className="w-full rounded-2xl border border-gold/20 bg-white px-4 py-3 text-ivory outline-none"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@ksu.edu.sa"
          />
          <button onClick={() => addAdmin("admin")} className="rounded-full bg-gold px-5 py-2.5 text-sm font-extrabold text-navy">إضافة admin</button>
          <button onClick={() => addAdmin("moderator")} className="rounded-full border border-gold/35 px-5 py-2.5 text-sm font-extrabold text-ivory">إضافة moderator</button>
        </div>
      </AdminCard>

      {admins.map((admin) => (
        <AdminCard key={admin.id}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-xl font-extrabold text-ivory">{admin.name}</h3>
              <p className="mt-2 text-sm text-muted">{admin.email}</p>
              <p className="mt-2 text-sm font-bold text-gold">{admin.role}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => changeRole(admin.id, "admin")} className="rounded-full border border-gold/35 px-4 py-2 text-sm font-extrabold text-ivory">admin</button>
              <button onClick={() => changeRole(admin.id, "moderator")} className="rounded-full border border-gold/35 px-4 py-2 text-sm font-extrabold text-ivory">moderator</button>
              {admin.role !== "super_admin" ? (
                <button onClick={() => removeAdmin(admin.id)} className="rounded-full border border-gold/35 px-4 py-2 text-sm font-extrabold text-ivory">إزالة دور الإدارة</button>
              ) : null}
            </div>
          </div>
        </AdminCard>
      ))}
    </div>
  );
}
