import { CardShell } from "@/components/CardShell";
import type { StudentIdea } from "@/lib/public/supabase-data";

type IdeaCardProps = {
  idea: StudentIdea;
};

export function IdeaCard({ idea }: IdeaCardProps) {
  return (
    <CardShell>
      <span className="w-fit rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-sm font-bold text-gold-light">
        {idea.major}
      </span>
      <h3 className="mt-5 text-2xl font-extrabold leading-8 text-ivory">{idea.title}</h3>
      <p className="mt-4 leading-8 text-muted">{idea.problem}</p>
      <div className="mt-5 rounded-2xl border border-gold/15 bg-navy/45 p-4">
        <p className="text-sm text-muted">الدعم المطلوب</p>
        <p className="mt-1 font-extrabold text-gold-light">{idea.support}</p>
      </div>
      <button className="mt-6 w-fit rounded-full border border-gold/35 px-5 py-2.5 text-sm font-extrabold text-ivory transition hover:border-gold hover:bg-gold/10">
        مهتم بالإشراف
      </button>
    </CardShell>
  );
}
