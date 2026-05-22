import { mockFacultyNotifications } from "@/data/faculty";
import { FacultyCard } from "@/components/faculty/FacultyCard";
import { FacultyEmptyState } from "@/components/faculty/FacultyEmptyState";

export function FacultyNotifications() {
  if (!mockFacultyNotifications.length) {
    return <FacultyEmptyState message="لا توجد إشعارات جديدة" />;
  }

  return (
    <div className="grid gap-4">
      {mockFacultyNotifications.map((notification) => (
        <FacultyCard key={notification.id}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-xl font-extrabold text-ivory">{notification.title}</h3>
              <p className="mt-3 leading-8 text-muted">{notification.message}</p>
            </div>
            <span className="text-sm text-muted">{notification.createdAt}</span>
          </div>
          {!notification.read ? (
            <span className="mt-4 inline-flex rounded-full bg-gold px-3 py-1 text-xs font-extrabold text-navy">
              جديد
            </span>
          ) : null}
        </FacultyCard>
      ))}
    </div>
  );
}
