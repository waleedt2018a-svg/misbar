import Link from "next/link";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

export function AuthShell({ eyebrow, title, description, children }: AuthShellProps) {
  return (
    <main className="site-shell min-h-screen bg-navy px-5 py-8 text-ivory sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-[2rem] border border-gold/20 bg-navy-2/70 shadow-soft-card backdrop-blur-xl lg:grid-cols-[0.82fr_1.18fr]">
          <aside className="relative hidden border-l border-gold/15 p-10 lg:block">
            <div className="orbit-field" aria-hidden="true">
              <span style={{ "--angle": "22deg" } as React.CSSProperties} />
              <span style={{ "--angle": "74deg", inset: "22%" } as React.CSSProperties} />
            </div>
            <div className="relative z-10">
              <Link href="/" className="mb-7 grid h-14 w-14 place-items-center rounded-2xl border border-gold/45 bg-gold/10 shadow-glow">
                <span className="text-2xl font-extrabold text-gold-light">م</span>
              </Link>
              <p className="text-sm font-extrabold text-gold-light">{eyebrow}</p>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight text-ivory">
                {title}
              </h1>
              <p className="mt-5 text-lg leading-9 text-muted">{description}</p>
            </div>
          </aside>

          <div className="p-5 sm:p-8 lg:p-10">{children}</div>
        </section>
      </div>
    </main>
  );
}
