type FacultyStatusBadgeProps = {
  status: string;
};

export function FacultyStatusBadge({ status }: FacultyStatusBadgeProps) {
  const className =
    status === "مقبول" || status === "منشورة"
      ? "bg-gold text-navy"
      : status === "مرفوض" || status === "مرفوضة"
        ? "border border-red-300/60 bg-red-950/25 text-red-100"
        : "border border-gold/30 bg-gold/10 text-gold";

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-extrabold ${className}`}>
      {status}
    </span>
  );
}
