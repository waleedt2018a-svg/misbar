import { AdminReports } from "@/components/admin/AdminReports";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";

export default function AdminReportsPage() {
  return (
    <div>
      <AdminSectionHeader
        title="البلاغات"
        description="متابعة البلاغات وتغيير حالتها من مفتوح إلى قيد المراجعة أو محلول أو مستبعد."
      />
      <AdminReports />
    </div>
  );
}
