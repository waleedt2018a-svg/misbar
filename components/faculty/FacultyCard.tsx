type FacultyCardProps = {
  children: React.ReactNode;
  className?: string;
};

export function FacultyCard({ children, className = "" }: FacultyCardProps) {
  return <article className={`fine-card rounded-3xl p-5 sm:p-6 ${className}`}>{children}</article>;
}
