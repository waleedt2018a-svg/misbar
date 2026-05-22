type CardShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function CardShell({ children, className = "" }: CardShellProps) {
  return (
    <article className={`fine-card flex h-full flex-col rounded-3xl p-6 ${className}`}>
      {children}
    </article>
  );
}
