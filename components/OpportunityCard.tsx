import { CardShell } from "@/components/CardShell";
import type { Opportunity } from "@/data/home";

type OpportunityCardProps = {
  opportunity: Opportunity;
};

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const isOpen = opportunity.status === "مفتوحة";

  return (
    <CardShell>
      <div className="flex items-center justify-between gap-3">
        <span
          className={`rounded-full px-3 py-1 text-sm font-extrabold ${
            isOpen ? "bg-gold text-navy" : "border border-muted/30 text-muted"
          }`}
        >
          {opportunity.status}
        </span>
        <span className="text-sm text-muted">{opportunity.department}</span>
      </div>
      <h3 className="mt-5 text-2xl font-extrabold leading-8 text-ivory">{opportunity.title}</h3>
      <p className="mt-3 font-bold text-gold-light">{opportunity.faculty}</p>
      <p className="mt-4 leading-8 text-muted">{opportunity.skills}</p>
      <button className="mt-6 w-fit rounded-full border border-gold/35 px-5 py-2.5 text-sm font-extrabold text-ivory transition hover:border-gold hover:bg-gold/10">
        إبداء الاهتمام
      </button>
    </CardShell>
  );
}
