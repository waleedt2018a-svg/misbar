type HeroRoleCardProps = {
  title: string;
  description: string;
  index: string;
};

export function HeroRoleCard({ title, description, index }: HeroRoleCardProps) {
  return (
    <article className="fine-card rounded-3xl p-5">
      <div className="flex items-start gap-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold/40 bg-gold/10 text-sm font-extrabold text-gold-light">
          {index}
        </span>
        <div>
          <h3 className="text-xl font-extrabold text-ivory">{title}</h3>
          <p className="mt-2 leading-7 text-muted">{description}</p>
        </div>
      </div>
    </article>
  );
}
