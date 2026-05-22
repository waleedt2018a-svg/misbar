import { CardShell } from "@/components/CardShell";
import type { PaperLab } from "@/data/home";

type PaperLabCardProps = {
  paperLab: PaperLab;
};

export function PaperLabCard({ paperLab }: PaperLabCardProps) {
  return (
    <CardShell>
      <span className="w-fit rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-sm font-bold text-gold-light">
        {paperLab.field}
      </span>
      <h3 className="mt-5 text-2xl font-extrabold leading-8 text-ivory">{paperLab.title}</h3>
      <div className="mt-5 space-y-3 leading-7 text-muted">
        <p>
          <span className="font-bold text-ivory">الورقة المختارة: </span>
          {paperLab.paper}
        </p>
        <p>
          <span className="font-bold text-ivory">المقدم: </span>
          {paperLab.presenter}
        </p>
      </div>
      <button className="mt-6 w-fit rounded-full border border-gold/35 px-5 py-2.5 text-sm font-extrabold text-ivory transition hover:border-gold hover:bg-gold/10">
        التسجيل
      </button>
    </CardShell>
  );
}
