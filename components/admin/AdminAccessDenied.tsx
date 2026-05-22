import { AdminCard } from "@/components/admin/AdminCard";

export function AdminAccessDenied() {
  return (
    <AdminCard>
      <p className="text-xl font-extrabold text-ivory">لا تملك صلاحية الوصول لهذه الصفحة.</p>
      <p className="mt-3 leading-8 text-muted">
        هذه الميزة متاحة فقط لصاحب صلاحية أعلى داخل فريق إدارة مِسبار.
      </p>
    </AdminCard>
  );
}
