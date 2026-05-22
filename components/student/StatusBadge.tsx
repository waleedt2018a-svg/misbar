type StatusBadgeProps = {
  status: string;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const isPositive = status === "مقبول" || status === "منشورة" || status === "مكتملة" || status === "مفتوحة";
  const isNegative = status === "مرفوض" || status === "مغلقة";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-extrabold ${
        isPositive
          ? "bg-gold text-navy"
          : isNegative
            ? "border border-red-300/40 text-red-100"
            : "border border-gold/30 bg-gold/10 text-gold-light"
      }`}
    >
      {status}
    </span>
  );
}
