import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { IdeaCard } from "@/components/IdeaCard";
import { JournalCard } from "@/components/JournalCard";
import { Navbar } from "@/components/Navbar";
import { OpportunityCard } from "@/components/OpportunityCard";
import { PaperLabCard } from "@/components/PaperLabCard";
import { ResearchCard } from "@/components/ResearchCard";
import { SectionTitle } from "@/components/SectionTitle";
import type { Profile } from "@/lib/auth/types";
import { getAccessToken, getProfile, getUserFromToken } from "@/lib/supabase/rest";
import {
  ideas,
  journalEntries,
  opportunities,
  paperLabs,
  researchProjects
} from "@/data/home";
import {
  mockRequests,
  starterIdeas,
  studentOpportunities as dashboardOpportunities
} from "@/data/student";

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

function StudentWelcomeCard({ profile }: { profile: Profile }) {
  const stats = [
    { label: "فرص متاحة", value: dashboardOpportunities.length },
    { label: "طلباتي", value: mockRequests.length },
    { label: "أفكاري", value: starterIdeas.length }
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
          {stats.map((stat) => (
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
              يمكنك من خلال مِسبار إنشاء فرص بحثية، مراجعة الطلاب المهتمين، والاطلاع على أفكار الطلاب المناسبة لإشرافك.
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
  const profile = await getCurrentProfile();

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
          description="نماذج بحثية قابلة للتعاون بين أعضاء هيئة التدريس والطلاب ضمن مجالات علمية دقيقة."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {researchProjects.map((project) => (
            <ResearchCard key={project.title} project={project} />
          ))}
        </div>
      </section>

      <section id="journal" className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
        <SectionTitle
          eyebrow="مخرجات طلابية"
          title="مجلة مِسبار الطلابية"
          description="مساحة نشر أكاديمية تجمع المقترحات والملصقات والمسودات والأوراق المنشورة للباحثين الطلاب."
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {journalEntries.map((entry) => (
            <JournalCard key={entry.title} entry={entry} />
          ))}
        </div>
      </section>

      <section id="opportunities" className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
        <SectionTitle
          eyebrow="انضمام بحثي"
          title="فرص بحثية"
          description="فرص معلنة من المشرفين للطلاب المهتمين بالمشاركة في مشاريع بحثية قائمة."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {opportunities.map((opportunity) => (
            <OpportunityCard key={opportunity.title} opportunity={opportunity} />
          ))}
        </div>
      </section>

      <section id="ideas" className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
        <SectionTitle
          eyebrow="بدايات أصيلة"
          title="أفكار الطلاب"
          description="أفكار بحثية طلابية تبحث عن مشرفين أو فرق أو جهات بحثية لتحويلها إلى مشاريع مكتملة."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {ideas.map((idea) => (
            <IdeaCard key={idea.title} idea={idea} />
          ))}
        </div>
      </section>

      <section id="paper-lab" className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
        <SectionTitle
          eyebrow="قراءة وتحليل"
          title="Paper Lab"
          description="مساحة منظمة لتفكيك الأوراق العلمية ومناقشة مناهجها ونتائجها مع باحثين طلاب."
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {paperLabs.map((paperLab) => (
            <PaperLabCard key={paperLab.title} paperLab={paperLab} />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
