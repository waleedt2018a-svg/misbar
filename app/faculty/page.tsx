import Link from "next/link";
import { FacultyCard } from "@/components/faculty/FacultyCard";

const actions = [
  {
    title: "إنشاء فرصة بحثية",
    description: "ابدأ بصياغة فرصة واضحة للطلاب، واحفظها كمسودة أو أرسلها للمراجعة.",
    href: "/faculty/opportunities/new",
    label: "إنشاء فرصة"
  },
  {
    title: "مراجعة المتقدمين",
    description: "اطلع على ملفات الطلاب المتقدمين دون كشف بيانات التواصل قبل القبول.",
    href: "/faculty/applicants",
    label: "عرض المتقدمين"
  },
  {
    title: "استكشاف أفكار الطلاب",
    description: "راجع أفكار الطلاب التي تحتاج مشرفًا وأبدِ اهتمامك عند اكتمال ملفك الأكاديمي.",
    href: "/faculty/student-ideas",
    label: "استكشاف الأفكار"
  },
  {
    title: "إكمال الملف الأكاديمي",
    description: "أضف نبذتك واهتماماتك وخبراتك وروابطك الأكاديمية قبل استخدام الميزات الجادة.",
    href: "/faculty/profile",
    label: "تحديث الملف"
  }
];

export default function FacultyDashboardPage() {
  return (
    <div className="grid gap-6">
      <FacultyCard>
        <p className="text-sm font-extrabold text-gold">مركز التحكم</p>
        <h2 className="mt-3 text-3xl font-extrabold text-ivory">لوحة عضو هيئة التدريس</h2>
        <p className="mt-4 max-w-4xl text-lg leading-9 text-muted">
          هذه لوحة عضو هيئة التدريس في منصة مِسبار، يمكنك من خلالها إنشاء الفرص البحثية،
          مراجعة الطلاب المتقدمين، وإبداء الاهتمام بأفكار الطلاب.
        </p>
      </FacultyCard>

      <div className="grid gap-4 md:grid-cols-2">
        {actions.map((action) => (
          <FacultyCard key={action.href}>
            <h3 className="text-xl font-extrabold text-ivory">{action.title}</h3>
            <p className="mt-3 leading-8 text-muted">{action.description}</p>
            <Link
              href={action.href}
              className="mt-5 inline-flex rounded-full border border-gold/35 px-5 py-2.5 text-sm font-extrabold text-ivory transition hover:border-gold hover:bg-gold/10"
            >
              {action.label}
            </Link>
          </FacultyCard>
        ))}
      </div>
    </div>
  );
}
