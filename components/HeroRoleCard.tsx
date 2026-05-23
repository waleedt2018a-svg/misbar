type HeroRoleCardProps = {
  title: string;
  description: string;
  ctaHref: string;
  index: string;
};

export function HeroRoleCard({ title, description, ctaHref, index }: HeroRoleCardProps) {
  return (
    <article className="research-flow-card fine-card group rounded-3xl p-5">
      <div className="relative z-10 flex items-start gap-4">
        <span className="research-step-number grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold/40 bg-gold/10 text-sm font-extrabold text-gold-light">
          {index}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-extrabold text-ivory">{title}</h3>
          <p className="mt-2 leading-7 text-muted">{description}</p>
          <a href={ctaHref} className="research-flow-cta mt-4 inline-flex rounded-full bg-gold px-5 py-2 text-sm font-extrabold text-navy shadow-glow">
            استكشف
          </a>
        </div>
      </div>
    </article>
  );
}
