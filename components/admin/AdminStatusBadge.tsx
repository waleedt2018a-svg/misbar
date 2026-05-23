export function AdminStatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const className =
    normalized === "active" || status === "منشورة" || status === "resolved"
      ? "border border-emerald-300/60 bg-emerald-950/25 text-emerald-100"
      : normalized === "inactive" || status === "مرفوضة" || status === "banned" || status === "dismissed"
        ? "border border-red-300/60 bg-red-950/25 text-red-100"
        : "border border-gold/30 bg-gold/10 text-gold";

  const label =
    normalized === "active"
      ? "نشط"
      : normalized === "inactive"
        ? "متوقف"
        : normalized === "banned"
          ? "محظور"
          : status;

  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-extrabold ${className}`}>{label}</span>;
}
