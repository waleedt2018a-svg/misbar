type StudentCardProps = {
  children: React.ReactNode;
  className?: string;
};

export function StudentCard({ children, className = "" }: StudentCardProps) {
  return <article className={`fine-card rounded-3xl p-5 sm:p-6 ${className}`}>{children}</article>;
}
