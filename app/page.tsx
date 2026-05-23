import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { IdeaCard } from "@/components/IdeaCard";
import { Navbar } from "@/components/Navbar";
import { OpportunityCard } from "@/components/OpportunityCard";
import { ResearchCard } from "@/components/ResearchCard";
import { SectionTitle } from "@/components/SectionTitle";
import type { Profile } from "@/lib/auth/types";
import { getPublicHomeData } from "@/lib/public/supabase-data";
import { getAccessToken, getProfile, getUserFromToken } from "@/lib/supabase/rest";

async function getCurrentProfile() {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return null;
  }

  const user = await getUserFromToken(accessToken);

  if (!user) {
    return null;
  }

  return getProfile(accessToken, user.id);
}

function PublicEmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-gold/20 bg-navy-2/60 p-8 text-center">
      <h3 className="text-2xl font-extrabold text-ivory">{title}</h3>
      <p className="mx-auto mt-3 max-w-2xl leading-8 text-muted">{text}</p>
    </div>
  );
}

function StudentWelcomeCard({ profile }: { profile: Profile }) {
  const statItems = [
    { label: "طلباتي على الفرص", value: 0 },
    { label: "أفكاري البحثية", value: 0 },
    { label: "الرسائل/التنبيهات", value: 0 },
    { label: "حالة ملفي البحثي", value: 0 }
  ];

  return (
    <section className="mx-auto max-w-7xl px-5 pt-8 sm:px-8">
      <div className="rounded-3xl border border-gold/20 bg-white p-5 shadow-soft-card sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-2xl font-extrabold text-ivory">مرحبًا، {profile.full_name}</p>
            <p className="mt-3 max-w-3xl leading-8 text-muted">
              ابدأ رحلتك البحثية من خلال إكمال ملفك البحثي واستكشاف الفرص المناسبة لك.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="/student/profile"
              className="rounded-full bg-gold px-5 py-2.5 text-center text-sm font-extrabold text-navy shadow-glow transition hover:bg-gold-light"
            >
              إكمال ملفي البحثي
            </a>
            <a
              href="/student"
              className="rounded-full border border-gold/35 px-5 py-2.5 text-center text-sm font-extrabold text-ivory transition hover:border-gold hover:bg-gold/10"
            >
              الذهاب للوحة الطالب
            </a>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {statItems.map((stat) => (
            <div
              key={stat.label}
              className="inline-flex items-center gap-2 rounded-full border border-gold/15 bg-gold/5 px-3 py-2 text-sm text-muted"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-gold/15 text-xs font-extrabold text-gold">
                {stat.value}
              </span>
              <span className="font-bold">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FacultyWelcomeCard({ profile }: { profile: Profile }) {
  const displayName = `${profile.academic_title ?? ""} ${profile.full_name}`.trim();

  return (
    <section className="mx-auto max-w-7xl px-5 pt-8 sm:px-8">
      <div className="rounded-3xl border border-gold/20 bg-white p-5 shadow-soft-card sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-2xl font-extrabold text-ivory">مرحبًا، {displayName}</p>
            <p className="mt-3 max-w-3xl leading-8 text-muted">
              يمكنك من خلال مسبار إنشاء فرص بحثية، مراجعة الطلاب المهتمين، والاطلاع على أفكار الطلاب المناسبة لإشرافك.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="/faculty/opportunities/new"
              className="rounded-full bg-gold px-5 py-2.5 text-center text-sm font-extrabold text-navy shadow-glow transition hover:bg-gold-light"
            >
              إنشاء فرصة بحثية
            </a>
            <a
              href="/faculty"
              className="rounded-full border border-gold/35 px-5 py-2.5 text-center text-sm font-extrabold text-ivory transition hover:border-gold hover:bg-gold/10"
            >
              الذهاب للوحة عضو هيئة التدريس
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function Home() {
  const [profile, publicData] = await Promise.all([
    getCurrentProfile(),
    getPublicHomeData()
  ]);

  return (
    <main className="site-shell min-h-screen">
      <Navbar profile={profile} />
      {profile?.role === "student" ? <StudentWelcomeCard profile={profile} /> : null}
      {profile?.role === "faculty" ? <FacultyWelcomeCard profile={profile} /> : null}
      <HeroSection />

      <section id="research" className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
        <SectionTitle
          eyebrow="مسارات واعدة"
          title="أبحاث مميزة"
          description="مساحة لإبراز الأبحاث والمبادرات النوعية في مِسبار."
        />
        {publicData.researchProjects.length ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {publicData.researchProjects.map((project) => (
              <ResearchCard key={`${project.title}-${project.researcher}`} project={project} />
            ))}
          </div>
        ) : (
          <div className="mt-8">
            <PublicEmptyState title="لا توجد أبحاث مميزة بعد" text="نعمل على إبراز الأبحاث والمبادرات النوعية فور اعتمادها." />
          </div>
        )}
      </section>

      <section id="journal" className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
        <SectionTitle
          eyebrow="مخرجات طلابية"
          title="مجلة مسبار الطلابية"
          description="مساحة لعرض المخرجات البحثية الطلابية والمبادرات العلمية."
        />
        <div className="mt-8">
          <PublicEmptyState title="المجلة قيد الإثراء" text="ستضم هذه المساحة مخرجات طلابية موثقة ومحتوى بحثيًا منتقى." />
        </div>
      </section>

      <section id="opportunities" className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
        <SectionTitle
          eyebrow="انضمام بحثي"
          title="فرص بحثية"
          description="فرص بحثية متاحة للتقديم بالتعاون مع أعضاء هيئة التدريس."
        />
        {publicData.opportunities.length ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {publicData.opportunities.map((opportunity) => (
              <OpportunityCard key={`${opportunity.title}-${opportunity.faculty}`} opportunity={opportunity} />
            ))}
          </div>
        ) : (
          <div className="mt-8">
            <PublicEmptyState title="لا توجد فرص منشورة بعد" text="ستظهر هنا الفرص البحثية بعد اعتمادها من فريق مِسبار." />
          </div>
        )}
      </section>

      <section id="ideas" className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
        <SectionTitle
          eyebrow="بدايات أصيلة"
          title="أفكار الطلاب"
          description="أفكار بحثية طلابية قابلة للتطوير والتحويل إلى مشاريع."
        />
        {publicData.ideas.length ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {publicData.ideas.map((idea) => (
              <IdeaCard key={`${idea.title}-${idea.major}`} idea={idea} />
            ))}
          </div>
        ) : (
          <div className="mt-8">
            <PublicEmptyState title="لا توجد أفكار منشورة بعد" text="ستُعرض هنا الأفكار البحثية الطلابية بعد مراجعتها واعتمادها." />
          </div>
        )}
      </section>

      <section id="paper-lab" className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
        <SectionTitle
          eyebrow="قراءة وتحليل"
          title="Paper Lab"
          description="مساحة لقراءة الأوراق العلمية وتحليلها ومناقشة الأفكار البحثية."
        />
        <div className="mt-8">
          <PublicEmptyState title="Paper Lab قيد التجهيز" text="قريبًا مساحة لقراءة الأوراق ومناقشة الأفكار البحثية." />
        </div>
      </section>

      <Footer />
    </main>
  );
}
