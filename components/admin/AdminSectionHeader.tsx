export function AdminSectionHeader({
  title,
  description,
  eyebrow = "نظام مِسبار الإداري"
}: {
  title: string;
  description?: string;
  eyebrow?: string;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 border-b border-[#D8D2C2] pb-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs font-extrabold text-[#C9A45C]">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-extrabold text-[#1F1F1F]">{title}</h2>
        {description ? <p className="mt-3 max-w-3xl leading-8 text-[#6B7280]">{description}</p> : null}
      </div>
    </div>
  );
}
