type FacultySectionHeaderProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function FacultySectionHeader({ title, description, action }: FacultySectionHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 className="text-3xl font-extrabold text-ivory">{title}</h2>
        {description ? <p className="mt-3 max-w-3xl leading-8 text-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
