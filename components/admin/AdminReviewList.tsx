"use client";

import { useState } from "react";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { reviewContentAction } from "@/app/admin/actions";
import { canApproveContent } from "@/lib/admin/permissions";
import type { AdminReviewItem, ReviewStatus } from "@/lib/admin/types";
import type { AdminRole } from "@/lib/auth/types";

export function AdminReviewList({
  items,
  role,
  emptyMessage
}: {
  items: AdminReviewItem[];
  role: AdminRole;
  emptyMessage: string;
}) {
  const [reviewItems, setReviewItems] = useState(items);
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<Record<string, string>>({});
  const canDecide = canApproveContent(role);

  async function updateItem(
    item: AdminReviewItem,
    status: ReviewStatus,
    action: "approve" | "reject" | "request_edit" | "pause" | "unpublish"
  ) {
    const reason = reasons[item.id]?.trim() ?? "";
    const result = await reviewContentAction({
      action,
      targetType: item.id.startsWith("idea") ? "idea" : "opportunity",
      targetId: item.id,
      targetTitle: item.title,
      reason
    });

    setMessages((current) => ({ ...current, [item.id]: result.message }));

    if (!result.ok) {
      return;
    }

    setReviewItems((currentItems) =>
      currentItems.map((currentItem) =>
        currentItem.id === item.id
          ? {
              ...currentItem,
              status,
              rejectionReason: action === "reject" ? reason : currentItem.rejectionReason,
              editReason: action === "request_edit" ? reason : currentItem.editReason,
              pauseReason: action === "pause" || action === "unpublish" ? reason : currentItem.pauseReason,
              reviewedBy: "admin",
              reviewedAt: new Date().toISOString()
            }
          : currentItem
      )
    );
  }

  if (!reviewItems.length) {
    return (
      <div className="rounded-3xl border border-gold/20 bg-white p-8 text-center text-muted shadow-soft-card">
        <p className="font-bold">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      {reviewItems.map((item) => (
        <AdminCard key={item.id}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <AdminStatusBadge status={item.status} />
              <h3 className="mt-4 text-2xl font-extrabold leading-9 text-ivory">{item.title}</h3>
              <p className="mt-2 text-sm font-bold text-gold">{item.ownerName}</p>
            </div>
            <p className="text-sm text-muted">{item.submittedAt}</p>
          </div>
          <div className="mt-5 grid gap-3 text-sm leading-7 text-muted md:grid-cols-2">
            <p><span className="font-bold text-ivory">الكلية: </span>{item.college}</p>
            <p><span className="font-bold text-ivory">المجال: </span>{item.field}</p>
          </div>
          <p className="mt-4 leading-8 text-muted">{item.description}</p>

          {item.rejectionReason ? <p className="mt-4 rounded-2xl border border-gold/20 bg-gold/5 px-4 py-3 text-sm font-bold text-muted">سبب الرفض: {item.rejectionReason}</p> : null}
          {item.editReason ? <p className="mt-4 rounded-2xl border border-gold/20 bg-gold/5 px-4 py-3 text-sm font-bold text-muted">سبب طلب التعديل: {item.editReason}</p> : null}
          {item.pauseReason ? <p className="mt-4 rounded-2xl border border-gold/20 bg-gold/5 px-4 py-3 text-sm font-bold text-muted">سبب إيقاف النشر: {item.pauseReason}</p> : null}

          {canDecide ? (
            <div className="mt-5 grid gap-3">
              <label>
                <span className="mb-2 block text-sm font-bold text-ivory">سبب الرفض أو طلب التعديل أو إيقاف النشر</span>
                <textarea
                  className="w-full rounded-2xl border border-gold/20 bg-white px-4 py-3 text-ivory outline-none focus:border-gold focus:ring-4 focus:ring-gold/10"
                  rows={3}
                  value={reasons[item.id] ?? ""}
                  onChange={(event) => setReasons((current) => ({ ...current, [item.id]: event.target.value }))}
                />
              </label>
              {messages[item.id] ? (
                <p className="rounded-2xl border border-gold/20 bg-gold/5 px-4 py-3 text-sm font-bold text-gold">
                  {messages[item.id]}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-2">
                <button onClick={() => updateItem(item, "منشورة", "approve")} className="rounded-full bg-gold px-5 py-2.5 text-sm font-extrabold text-navy">اعتماد</button>
                <button onClick={() => updateItem(item, "مرفوضة", "reject")} className="rounded-full border border-gold/35 px-5 py-2.5 text-sm font-extrabold text-ivory">رفض</button>
                <button onClick={() => updateItem(item, "بحاجة لتعديل", "request_edit")} className="rounded-full border border-gold/35 px-5 py-2.5 text-sm font-extrabold text-ivory">طلب تعديل</button>
                <button onClick={() => updateItem(item, "متوقف نشرها", "pause")} className="rounded-full border border-red-300/50 px-5 py-2.5 text-sm font-extrabold text-red-100">إيقاف نشر</button>
              </div>
            </div>
          ) : null}
        </AdminCard>
      ))}
    </div>
  );
}
