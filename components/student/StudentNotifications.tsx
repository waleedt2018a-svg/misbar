"use client";

import { mockNotifications } from "@/data/student";
import { EmptyState } from "@/components/student/EmptyState";
import { StudentCard } from "@/components/student/StudentCard";
import { StudentSectionHeader } from "@/components/student/StudentSectionHeader";

export function StudentNotifications() {
  const notifications = Array.isArray(mockNotifications) ? mockNotifications : [];

  return (
    <div>
      <StudentSectionHeader
        title="الإشعارات"
        description="آخر التنبيهات المتعلقة بالفرص البحثية والأفكار وبيانات التواصل."
      />

      {notifications.length === 0 ? (
        <EmptyState message="لا توجد إشعارات جديدة" />
      ) : (
        <div className="grid gap-4">
          {notifications.map((notification, index) => (
            <StudentCard key={notification.id || `notification-${index}`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-xl font-extrabold text-ivory">
                  {notification.title || "إشعار"}
                </h3>
                <span className="text-sm text-muted">{notification.createdAt || "غير محدد"}</span>
              </div>
              <p className="mt-3 leading-8 text-muted">
                {notification.message || "لا توجد تفاصيل إضافية."}
              </p>
              {!notification.read ? (
                <span className="mt-4 inline-flex rounded-full bg-gold px-3 py-1 text-xs font-extrabold text-navy">
                  جديد
                </span>
              ) : null}
            </StudentCard>
          ))}
        </div>
      )}
    </div>
  );
}
