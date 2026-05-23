"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  getFacultyApplicants,
  getFacultyCompletionStatus,
  getFacultyOpportunities
} from "@/lib/faculty/storage";
import { FacultyCard } from "@/components/faculty/FacultyCard";

const baseActions = [
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
  }
];

export function FacultyHome() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState([
    { label: "فرصي المنشورة", value: 0 },
    { label: "طلبات الطلاب", value: 0 },
    { label: "فرص بانتظار المراجعة", value: 0 },
    { label: "حالة ملفي البحثي", value: "0%" }
  ]);
  const [completionStatus, setCompletionStatus] = useState({
    profileComplete: false,
    contactComplete: false,
    fullyComplete: false,
    progress: 0
  });

  useEffect(() => {
    function syncCompletionStatus() {
      const status = getFacultyCompletionStatus();
      const opportunities = getFacultyOpportunities();

      setCompletionStatus(status);
      setDashboardStats([
        { label: "فرصي المنشورة", value: opportunities.filter((opportunity) => opportunity.status === "منشورة").length },
        { label: "طلبات الطلاب", value: getFacultyApplicants().length },
        { label: "فرص بانتظار المراجعة", value: opportunities.filter((opportunity) => opportunity.status === "قيد المراجعة").length },
        { label: "حالة ملفي البحثي", value: status.fullyComplete ? "مكتمل" : `${status.progress}%` }
      ]);
      setIsLoading(false);
    }

    syncCompletionStatus();
    window.addEventListener("misbar:faculty-profile-updated", syncCompletionStatus);

    return () => window.removeEventListener("misbar:faculty-profile-updated", syncCompletionStatus);
  }, []);

  const actions = useMemo(() => {
    const profileAction = completionStatus.fullyComplete
      ? {
          title: "ملفك البحثي مكتمل",
          description: "يمكنك مراجعة بياناتك الأكاديمية وتعديلها متى احتجت.",
          href: "/faculty/profile",
          label: "مراجعة الملف"
        }
      : {
          title: "إكمال الملف الأكاديمي",
          description: "أضف نبذتك واهتماماتك وخبراتك وروابطك الأكاديمية قبل استخدام الميزات الجادة.",
          href: "/faculty/profile",
          label: "تحديث الملف"
        };

    return [...baseActions, profileAction];
  }, [completionStatus.fullyComplete]);

  return (
    <div className="grid gap-6">
      {isLoading ? (
        <FacultyCard>
          <p className="font-bold text-gold">جاري تحميل لوحة عضو هيئة التدريس...</p>
        </FacultyCard>
      ) : null}

      {!isLoading && !completionStatus.profileComplete ? (
        <FacultyCard>
          <p className="text-lg font-extrabold leading-9 text-gold">مرحبًا بك في مِسبار. ابدأ من إكمال ملفك البحثي حتى تصبح تجربتك أدق وأكثر فائدة.</p>
          <Link href="/faculty/profile" className="mt-4 inline-flex rounded-full bg-gold px-5 py-2.5 text-sm font-extrabold text-navy shadow-glow transition hover:bg-gold-light">
            إكمال ملفي البحثي
          </Link>
        </FacultyCard>
      ) : null}

      {!isLoading && completionStatus.profileComplete && !completionStatus.contactComplete ? (
        <FacultyCard>
          <p className="text-lg font-extrabold leading-9 text-gold">تبقّى فقط تحديد طريقة التواصل</p>
          <p className="mt-2 leading-8 text-muted">لن تظهر بيانات التواصل إلا حسب التفضيل الذي تختاره.</p>
          <Link href="/faculty/contact-settings" className="mt-4 inline-flex rounded-full bg-gold px-5 py-2.5 text-sm font-extrabold text-navy shadow-glow transition hover:bg-gold-light">
            إكمال إعدادات التواصل
          </Link>
        </FacultyCard>
      ) : null}

      <FacultyCard>
        <p className="text-sm font-extrabold text-gold">مركز التحكم</p>
        <h2 className="mt-3 text-3xl font-extrabold text-ivory">لوحة عضو هيئة التدريس</h2>
        <p className="mt-4 max-w-4xl text-lg leading-9 text-muted">
          هذه لوحة عضو هيئة التدريس في منصة مِسبار، يمكنك من خلالها إنشاء الفرص البحثية،
          مراجعة الطلاب المتقدمين، وإبداء الاهتمام بأفكار الطلاب.
        </p>
      </FacultyCard>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <FacultyCard key={stat.label} className="p-4 sm:p-5">
            <p className="text-sm font-bold text-muted">{stat.label}</p>
            <p className="mt-3 text-3xl font-extrabold text-gold">{stat.value}</p>
          </FacultyCard>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {actions.map((action) => (
          <FacultyCard key={action.href}>
            <h3 className="text-xl font-extrabold text-ivory">{action.title}</h3>
            <p className="mt-3 leading-8 text-muted">{action.description}</p>
            <Link href={action.href} className="mt-5 inline-flex rounded-full border border-gold/35 px-5 py-2.5 text-sm font-extrabold text-ivory transition hover:border-gold hover:bg-gold/10">
              {action.label}
            </Link>
          </FacultyCard>
        ))}
      </div>
    </div>
  );
}
