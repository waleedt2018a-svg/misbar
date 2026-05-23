"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { processAdminInboxItemAction } from "@/app/admin/actions";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import type { AdminReviewAction, PersistedAdminReviewItem } from "@/lib/admin/review-persistence";

const typeLabels: Record<PersistedAdminReviewItem["targetType"], string> = {
  idea: "أفكار الطلاب",
  opportunity: "فرص بحثية",
  report: "بلاغات"
};

const tabs = [
  { label: "الكل", value: "all" },
  { label: "أفكار الطلاب", value: "idea" },
  { label: "فرص بحثية", value: "opportunity" },
  { label: "بلاغات", value: "report" },
  { label: "عاجل", value: "urgent" }
];

export function AdminInbox({ items }: { items: PersistedAdminReviewItem[] }) {
  const router = useRouter();
  const [inboxItems, setInboxItems] = useState(items);
  const [activeTab, setActiveTab] = useState("all");
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState("");

  useEffect(() => setInboxItems(items), [items]);

  useEffect(() => {
    const interval = window.setInterval(() => router.refresh(), 8000);
    return () => window.clearInterval(interval);
  }, [router]);

  const filteredItems = useMemo(() => {
    if (activeTab === "all") return inboxItems;
    if (activeTab === "urgent") return inboxItems.filter((item) => item.targetType === "report" || item.content.length > 140);
    return inboxItems.filter((item) => item.targetType === activeTab);
  }, [activeTab, inboxItems]);

  async function handleItem(item: PersistedAdminReviewItem, action: AdminReviewAction) {
    const reason = reasons[item.id]?.trim() ?? "";

    if ((action === "reject" || action === "request_edit") && !reason) {
      setMessage("لا يمكن تنفيذ الإجراء دون كتابة السبب");
      return;
    }

    setBusyId(item.id);
    const result = await processAdminInboxItemAction({
      source: item.source,
      targetId: item.id,
      targetTitle: item.title,
      targetType: item.targetType,
      action,
      reason
    });
    setBusyId("");
    setMessage(result.message);

    if (result.ok) {
      setInboxItems((current) => current.filter((currentItem) => currentItem.id !== item.id));
      router.refresh();
    }
  }

  return (
    <div className="grid gap-5">
      <AdminCard className="p-3 sm:p-3">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`rounded-full px-4 py-2 text-sm font-extrabold transition ${
                activeTab === tab.value
                  ? "bg-[#1F1F1F] text-white"
                  : "border border-[#D8D2C2] bg-white text-[#6B7280] hover:border-[#C9A45C] hover:text-[#1F1F1F]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </AdminCard>

      {message ? <p className="rounded-2xl border border-[#C9A45C]/35 bg-[#EFE1BD]/70 px-4 py-3 text-sm font-bold text-[#1F1F1F]">{message}</p> : null}

      {filteredItems.length ? (
        filteredItems.map((item) => (
          <AdminCard key={`${item.source}-${item.id}`}>
            <div className="grid gap-5 xl:grid-cols-[1fr_18rem]">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#EFE1BD] px-3 py-1 text-xs font-extrabold text-[#1F1F1F]">{typeLabels[item.targetType]}</span>
                  <AdminStatusBadge status={item.status} />
                  <span className="rounded-full border border-[#B94A48]/25 bg-[#FFF7F6] px-3 py-1 text-xs font-extrabold text-[#B94A48]">
                    {item.targetType === "report" ? "عاجل" : "متوسط"}
                  </span>
                </div>
                <h3 className="mt-4 text-2xl font-extrabold leading-9 text-[#1F1F1F]">{item.title}</h3>
                <div className="mt-3 grid gap-2 text-sm text-[#6B7280] md:grid-cols-3">
                  <p><span className="font-bold text-[#1F1F1F]">المصدر: </span>{item.source}</p>
                  <p><span className="font-bold text-[#1F1F1F]">تاريخ الإرسال: </span>{item.createdAt}</p>
                  <p><span className="font-bold text-[#1F1F1F]">الحالة: </span>{item.status}</p>
                </div>
                <p className="mt-4 max-w-4xl leading-8 text-[#6B7280]">{item.content || "لا يوجد وصف إضافي."}</p>
              </div>

              <div className="rounded-3xl border border-[#D8D2C2] bg-[#F8F6EF] p-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-extrabold text-[#1F1F1F]">سبب القرار</span>
                  <textarea
                    className="admin-input min-h-28 w-full rounded-2xl px-4 py-3 text-sm"
                    value={reasons[item.id] ?? ""}
                    onChange={(event) => setReasons((current) => ({ ...current, [item.id]: event.target.value }))}
                  />
                </label>
                <div className="mt-4 grid gap-2">
                  <button disabled={busyId === item.id} onClick={() => handleItem(item, "approve")} className="rounded-full bg-[#3C7A57] px-5 py-2.5 text-sm font-extrabold text-white disabled:opacity-60">اعتماد</button>
                  <button disabled={busyId === item.id} onClick={() => handleItem(item, "reject")} className="rounded-full bg-[#B94A48] px-5 py-2.5 text-sm font-extrabold text-white disabled:opacity-60">رفض</button>
                  <button disabled={busyId === item.id} onClick={() => handleItem(item, "request_edit")} className="rounded-full border border-[#C9A45C] bg-white px-5 py-2.5 text-sm font-extrabold text-[#1F1F1F] disabled:opacity-60">طلب تعديل</button>
                  <button disabled className="rounded-full border border-[#D8D2C2] px-5 py-2.5 text-sm font-extrabold text-[#6B7280] opacity-70">عرض التفاصيل</button>
                </div>
              </div>
            </div>
          </AdminCard>
        ))
      ) : (
        <AdminCard>
          <p className="py-10 text-center text-lg font-extrabold text-[#6B7280]">لا توجد عناصر في الوارد حاليًا.</p>
        </AdminCard>
      )}
    </div>
  );
}
