import { AdminCard } from "@/components/admin/AdminCard";

export function AdminAccessDenied() {
  return (
    <AdminCard>
      <p className="text-xl font-extrabold text-[#B94A48]">ليست لديك صلاحية لتنفيذ هذا الإجراء.</p>
      <p className="mt-3 leading-8 text-[#6B7280]">
        هذه الصفحة مخصصة للرتب الإدارية الأعلى داخل نظام مِسبار.
      </p>
    </AdminCard>
  );
}
