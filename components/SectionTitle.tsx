type SectionTitleProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-extrabold tracking-normal text-gold-light">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-extrabold text-ivory sm:text-4xl">{title}</h2>
      <div className="mt-4 h-px w-40 bg-gold-line" />
      <p className="mt-5 text-lg leading-8 text-muted">{description}</p>
    </div>
  );
}
