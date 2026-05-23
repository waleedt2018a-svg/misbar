import { AdminAccessDenied } from "@/components/admin/AdminAccessDenied";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { getAdminNotificationsFromSupabase, markAdminNotificationsRead } from "@/lib/admin/supabase-data";
import { requireAdminRole } from "@/lib/auth/guards";
import { getAccessToken } from "@/lib/supabase/rest";
import type { AdminRole } from "@/lib/auth/types";

export default async function AdminNotificationsPage() {
  const profile = await requireAdminRole();
  const role = profile.role as AdminRole;
  const canView = role === "super_admin" || role === "chief_admin";
  const accessToken = await getAccessToken();
  const notifications = canView && accessToken
    ? await getAdminNotificationsFromSupabase(accessToken, profile.id)
    : [];

  if (canView && accessToken) {
    await markAdminNotificationsRead(
      accessToken,
      profile.id,
      notifications.filter((notification) => !notification.isRead).map((notification) => notification.id)
    );
  }

  return (
    <div>
      <AdminSectionHeader title="الإشعارات الحساسة" description="مركز تنبيهات للقرارات التي تحتاج متابعة إدارية." />
      {canView ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {notifications.map((notification) => (
            <AdminCard key={notification.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-extrabold text-[#C9A45C]">{notification.actionType}</p>
                  <h3 className="mt-2 text-xl font-extrabold text-[#1F1F1F]">{notification.targetTitleOrEmail}</h3>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${notification.isRead ? "bg-[#F8F6EF] text-[#6B7280]" : "bg-[#FFF7F6] text-[#B94A48]"}`}>
                  {notification.isRead ? "مقروء" : "جديد"}
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-[#6B7280]">
                {notification.adminEmail} قام بـ {notification.actionType} بسبب: {notification.reason || "لا يوجد سبب"}
              </p>
              <p className="mt-4 text-xs font-bold text-[#6B7280]">{notification.createdAt}</p>
            </AdminCard>
          ))}
          {!notifications.length ? (
            <AdminCard>
              <p className="py-10 text-center text-lg font-extrabold text-[#6B7280]">لا توجد سجلات نشاط بعد</p>
            </AdminCard>
          ) : null}
        </div>
      ) : (
        <AdminAccessDenied />
      )}
    </div>
  );
}
