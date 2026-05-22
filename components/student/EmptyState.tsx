type EmptyStateProps = {
  message: string;
};

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-gold/20 bg-navy-2/60 p-8 text-center text-muted">
      {message}
    </div>
  );
}
