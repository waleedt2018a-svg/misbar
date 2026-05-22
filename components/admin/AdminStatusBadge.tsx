export function AdminStatusBadge({ status }: { status: string }) {
  const className =
    status === "منشورة" || status === "resolved" || status === "active"
      ? "bg-gold text-navy"
      : status === "مرفوضة" || status === "banned" || status === "dismissed"
        ? "border border-red-300/60 bg-red-950/25 text-red-100"
        : "border border-gold/30 bg-gold/10 text-gold";

  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-extrabold ${className}`}>{status}</span>;
}
