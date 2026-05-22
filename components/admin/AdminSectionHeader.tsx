export function AdminSectionHeader({
  title,
  description
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-3xl font-extrabold text-ivory">{title}</h2>
      {description ? <p className="mt-3 max-w-3xl leading-8 text-muted">{description}</p> : null}
    </div>
  );
}
