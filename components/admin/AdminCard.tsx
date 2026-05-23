export function AdminCard({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <article className={`admin-card rounded-3xl p-5 sm:p-6 ${className}`}>{children}</article>;
}
