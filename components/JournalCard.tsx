import { CardShell } from "@/components/CardShell";
import type { JournalEntry } from "@/data/home";

type JournalCardProps = {
  entry: JournalEntry;
};

export function JournalCard({ entry }: JournalCardProps) {
  return (
    <CardShell>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-gold px-3 py-1 text-sm font-extrabold text-navy">
          {entry.outputType}
        </span>
        <span className="rounded-full border border-gold/25 px-3 py-1 text-sm font-bold text-gold-light">
          {entry.field}
        </span>
        <span className="text-sm text-muted">{entry.date}</span>
      </div>
      <h3 className="mt-5 text-2xl font-extrabold leading-9 text-ivory">{entry.title}</h3>
      <p className="mt-3 leading-8 text-muted">{entry.authors}</p>
      <button className="mt-6 w-fit rounded-full border border-gold/35 px-5 py-2.5 text-sm font-extrabold text-ivory transition hover:border-gold hover:bg-gold/10">
        قراءة البحث
      </button>
    </CardShell>
  );
}
