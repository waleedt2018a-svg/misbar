import { CardShell } from "@/components/CardShell";
import type { ResearchProject } from "@/lib/public/supabase-data";

type ResearchCardProps = {
  project: ResearchProject;
};

export function ResearchCard({ project }: ResearchCardProps) {
  return (
    <CardShell>
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-sm font-bold text-gold-light">
          {project.field}
        </span>
        <span className="text-sm text-muted">{project.researcher}</span>
      </div>
      <h3 className="mt-5 text-2xl font-extrabold leading-8 text-ivory">{project.title}</h3>
      <p className="mt-4 flex-1 leading-8 text-muted">{project.description}</p>
      <button className="mt-6 w-fit rounded-full border border-gold/35 px-5 py-2.5 text-sm font-extrabold text-ivory transition hover:border-gold hover:bg-gold/10">
        عرض التفاصيل
      </button>
    </CardShell>
  );
}
