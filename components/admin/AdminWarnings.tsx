"use client";

import { useState } from "react";
import { adminUsers, adminWarnings } from "@/data/admin";
import { AdminCard } from "@/components/admin/AdminCard";
import type { AdminWarning } from "@/lib/admin/types";

export function AdminWarnings({ issuedBy }: { issuedBy: string }) {
  const [warnings, setWarnings] = useState<AdminWarning[]>(adminWarnings);
  const [form, setForm] = useState({ userId: adminUsers[0]?.id ?? "", reason: "", details: "" });

  function submitWarning(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const user = adminUsers.find((item) => item.id === form.userId);

    if (!user || !form.reason.trim()) {
      return;
    }

    setWarnings((current) => [
      {
        id: `warning-${Date.now()}`,
        userId: user.id,
        userName: user.name,
        reason: form.reason,
        details: form.details,
        issuedBy,
        createdAt: new Date().toISOString().slice(0, 10)
      },
      ...current
    ]);
    setForm({ userId: adminUsers[0]?.id ?? "", reason: "", details: "" });
  }

  return (
    <div className="grid gap-6">
      <AdminCard>
        <form onSubmit={submitWarning} className="grid gap-4">
          <h3 className="text-xl font-extrabold text-ivory">إرسال تنبيه</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <label>
              <span className="mb-2 block text-sm font-bold text-ivory">المستخدم</span>
              <select className="w-full rounded-2xl border border-gold/20 bg-white px-4 py-3 text-ivory outline-none" value={form.userId} onChange={(event) => setForm((current) => ({ ...current, userId: event.target.value }))}>
                {adminUsers.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
              </select>
            </label>
            <label>
              <span className="mb-2 block text-sm font-bold text-ivory">سبب التنبيه</span>
              <input className="w-full rounded-2xl border border-gold/20 bg-white px-4 py-3 text-ivory outline-none" value={form.reason} onChange={(event) => setForm((current) => ({ ...current, reason: event.target.value }))} />
            </label>
          </div>
          <label>
            <span className="mb-2 block text-sm font-bold text-ivory">التفاصيل</span>
            <textarea className="w-full rounded-2xl border border-gold/20 bg-white px-4 py-3 text-ivory outline-none" rows={3} value={form.details} onChange={(event) => setForm((current) => ({ ...current, details: event.target.value }))} />
          </label>
          <button className="w-fit rounded-full bg-gold px-6 py-3 font-extrabold text-navy">إرسال التنبيه</button>
        </form>
      </AdminCard>

      {warnings.map((warning) => (
        <AdminCard key={warning.id}>
          <h3 className="text-xl font-extrabold text-ivory">{warning.reason}</h3>
          <div className="mt-4 grid gap-3 text-sm leading-7 text-muted md:grid-cols-3">
            <p><span className="font-bold text-ivory">المستخدم: </span>{warning.userName}</p>
            <p><span className="font-bold text-ivory">صدر بواسطة: </span>{warning.issuedBy}</p>
            <p><span className="font-bold text-ivory">التاريخ: </span>{warning.createdAt}</p>
          </div>
          <p className="mt-3 leading-8 text-muted">{warning.details}</p>
        </AdminCard>
      ))}
    </div>
  );
}
