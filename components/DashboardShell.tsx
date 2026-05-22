import Link from "next/link";

type DashboardShellProps = {
  title: string;
  name?: string;
};

export function DashboardShell({ title, name }: DashboardShellProps) {
  return (
    <main className="site-shell min-h-screen bg-navy px-5 py-8 text-ivory sm:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center">
        <div className="glass-panel w-full rounded-[2rem] p-8 sm:p-12">
          <Link href="/" className="mb-8 grid h-14 w-14 place-items-center rounded-2xl border border-gold/45 bg-gold/10 shadow-glow">
            <span className="text-2xl font-extrabold text-gold-light">م</span>
          </Link>
          <p className="text-sm font-extrabold text-gold-light">مِسبار — حيث يُصنع الباحثون</p>
          <h1 className="mt-4 text-4xl font-extrabold text-ivory">{title}</h1>
          <p className="mt-5 text-xl leading-9 text-muted">مرحبًا بك في منصة مِسبار</p>
          {name ? <p className="mt-3 font-bold text-gold-light">{name}</p> : null}
        </div>
      </section>
    </main>
  );
}
