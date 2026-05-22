export function FacultyEmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-3xl border border-gold/20 bg-white p-8 text-center text-muted shadow-soft-card">
      <p className="font-bold">{message}</p>
    </div>
  );
}
