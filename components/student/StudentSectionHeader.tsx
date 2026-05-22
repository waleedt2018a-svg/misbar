type StudentSectionHeaderProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function StudentSectionHeader({ title, description, action }: StudentSectionHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-3xl font-extrabold text-ivory">{title}</h2>
        {description ? <p className="mt-3 max-w-3xl leading-8 text-muted">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
