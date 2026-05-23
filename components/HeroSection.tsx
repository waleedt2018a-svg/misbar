import { HeroRoleCard } from "@/components/HeroRoleCard";

const roles = [
  {
    title: "لأعضاء هيئة التدريس",
    description: "استعرض فرص الإشراف البحثي وتواصل مع الطلبة لبناء مشاريع علمية متميزة.",
    ctaHref: "#opportunities"
  },
  {
    title: "للطلاب",
    description: "قدّم على الفرص البحثية أو شارك فكرتك لتبدأ رحلتك في البحث العلمي.",
    ctaHref: "#ideas"
  },
  {
    title: "للمجتمع",
    description: "اطّلع على مخرجات بحثية موثوقة ومشاريع طلابية متميزة.",
    ctaHref: "#research"
  }
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-5 pb-16 pt-16 sm:px-8 lg:pb-24 lg:pt-24">
      <div className="orbit-field" aria-hidden="true">
        <span style={{ "--angle": "16deg" } as React.CSSProperties} />
        <span style={{ "--angle": "58deg", inset: "18%" } as React.CSSProperties} />
        <span style={{ "--angle": "108deg", inset: "27%" } as React.CSSProperties} />
      </div>
      <div className="circuit-lines" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-sm font-bold text-gold-light">
            مِسبار — منصة بحثية طلابية
          </div>
          <h1 className="arabic-kashida text-5xl font-extrabold leading-[1.15] text-ivory sm:text-6xl lg:text-7xl">
            منصة مِسبار البحثية
          </h1>
          <p className="mt-5 text-3xl font-extrabold text-gold-light sm:text-4xl">
            حيث يُصنع الباحثون
          </p>
          <p className="mt-6 max-w-2xl text-xl leading-10 text-muted">
            نظام تقني متكامل يربط أطراف العملية البحثية في بيئة علمية رائدة
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#research"
              className="rounded-full bg-gold px-7 py-3 text-center text-base font-extrabold text-navy shadow-glow transition hover:bg-gold-light"
            >
              استكشف المشاريع
            </a>
            <a
              href="#ideas"
              className="rounded-full border border-gold/35 px-7 py-3 text-center text-base font-extrabold text-ivory transition hover:border-gold hover:bg-gold/10"
            >
              ابدأ فكرتك
            </a>
          </div>
        </div>

        <div className="research-gateway-panel glass-panel relative rounded-[2rem] p-4 sm:p-6">
          <div className="absolute -inset-1 -z-10 rounded-[2.2rem] bg-gold/10 blur-2xl" />
          <div className="mb-5 flex items-center justify-between border-b border-gold/15 pb-4">
            <p className="text-sm font-bold text-gold-light">بوابة البحث</p>
            <div className="flex gap-1.5">
              <span className="h-2 w-2 rounded-full bg-gold-light" />
              <span className="h-2 w-2 rounded-full bg-gold/55" />
              <span className="h-2 w-2 rounded-full bg-muted/45" />
            </div>
          </div>
          <div className="research-flow relative grid gap-4">
            {roles.map((role, index) => (
              <HeroRoleCard
                key={role.title}
                title={role.title}
                description={role.description}
                ctaHref={role.ctaHref}
                index={`0${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
