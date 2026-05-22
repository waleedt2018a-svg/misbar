import { AdminCard } from "@/components/admin/AdminCard";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";

const notifications = [
  "فرصة بحثية جديدة بانتظار المراجعة.",
  "فكرة طالب جديدة بانتظار المراجعة.",
  "بلاغ جديد يحتاج متابعة.",
  "مستخدم وصل إلى 3 تنبيهات."
];

export default function AdminNotificationsPage() {
  return (
    <div>
      <AdminSectionHeader title="الإشعارات" description="تنبيهات موجزة لفريق إدارة مِسبار." />
      <div className="grid gap-4">
        {notifications.map((notification, index) => (
          <AdminCard key={notification}>
            <div className="flex items-start justify-between gap-4">
              <p className="font-extrabold text-ivory">{notification}</p>
              {index < 2 ? (
                <span className="rounded-full bg-gold px-3 py-1 text-xs font-extrabold text-navy">جديد</span>
              ) : null}
            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
