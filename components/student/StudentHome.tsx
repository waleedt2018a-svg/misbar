"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getOpportunityApplications,
  getStoredIdeas,
  getStudentCompletionStatus
} from "@/lib/student/storage";
import { StudentCard } from "@/components/student/StudentCard";

const actions = [
  {
    title: "أكمل ملفك البحثي",
    description: "حدّث اهتماماتك ومهاراتك وروابطك البحثية حتى تظهر فرص أكثر ملاءمة لمسارك.",
    href: "/student/profile",
    label: "تحديث الملف البحثي"
  },
  {
    title: "استكشف الفرص البحثية",
    description: "راجع الفرص المتاحة من المشرفين، واختر ما يناسب تخصصك واهتماماتك.",
    href: "/student/opportunities",
    label: "عرض الفرص"
  },
  {
    title: "نظّم أفكارك البحثية",
    description: "أنشئ أفكارك وتابع احتياجها لمشرف أو فريق بحثي من صفحة أفكاري.",
    href: "/student/ideas",
    label: "إدارة الأفكار"
  }
];

export function StudentHome() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState([
    { label: "طلباتي على الفرص", value: 0 },
    { label: "أفكاري البحثية", value: 0 },
    { label: "الرسائل/التنبيهات", value: 0 },
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
      const status = getStudentCompletionStatus();

      setCompletionStatus(status);
      setDashboardStats([
        { label: "طلباتي على الفرص", value: getOpportunityApplications().length },
        { label: "أفكاري البحثية", value: getStoredIdeas().length },
        { label: "الرسائل/التنبيهات", value: 0 },
        { label: "حالة ملفي البحثي", value: status.fullyComplete ? "مكتمل" : `${status.progress}%` }
      ]);
      setIsLoading(false);
    }

    syncCompletionStatus();
    window.addEventListener("misbar:student-profile-updated", syncCompletionStatus);

    return () => window.removeEventListener("misbar:student-profile-updated", syncCompletionStatus);
  }, []);

  return (
    <div className="grid gap-6">
      {isLoading ? (
        <StudentCard>
          <p className="font-bold text-gold-light">جاري تحميل لوحة الطالب...</p>
        </StudentCard>
      ) : null}

      {!isLoading && !completionStatus.profileComplete ? (
        <StudentCard>
          <p className="text-lg font-extrabold leading-9 text-gold-light">
            مرحبًا بك في مِسبار. ابدأ من إكمال ملفك البحثي حتى تصبح تجربتك أدق وأكثر فائدة.
          </p>
          <Link
            href="/student/profile"
            className="mt-4 inline-flex rounded-full bg-gold px-5 py-2.5 text-sm font-extrabold text-navy shadow-glow transition hover:bg-gold-light"
          >
            إكمال ملفي البحثي
          </Link>
        </StudentCard>
      ) : null}

      {!isLoading && completionStatus.profileComplete && !completionStatus.contactComplete ? (
        <StudentCard>
          <p className="text-lg font-extrabold leading-9 text-gold-light">تبقّى فقط تحديد طريقة التواصل</p>
          <p className="mt-2 leading-8 text-muted">
            لن تظهر بيانات التواصل إلا حسب التفضيل الذي تختاره.
          </p>
          <Link
            href="/student/contact-settings"
            className="mt-4 inline-flex rounded-full bg-gold px-5 py-2.5 text-sm font-extrabold text-navy shadow-glow transition hover:bg-gold-light"
          >
            إكمال إعدادات التواصل
          </Link>
        </StudentCard>
      ) : null}

      <StudentCard>
        <p className="text-sm font-extrabold text-gold-light">مركز التحكم</p>
        <h2 className="mt-3 text-3xl font-extrabold text-ivory">لوحة الطالب</h2>
        <p className="mt-4 max-w-4xl text-lg leading-9 text-muted">
          هذه المساحة مخصصة لإدارة خطواتك داخل مِسبار: ملفك البحثي، الفرص المناسبة، أفكارك،
          وطلباتك.
        </p>
      </StudentCard>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StudentCard key={stat.label} className="p-4 sm:p-5">
            <p className="text-sm font-bold text-muted">{stat.label}</p>
            <p className="mt-3 text-3xl font-extrabold text-gold-light">{stat.value}</p>
          </StudentCard>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {actions.map((action) => (
          <StudentCard key={action.href}>
            <h3 className="text-xl font-extrabold text-ivory">{action.title}</h3>
            <p className="mt-3 leading-8 text-muted">{action.description}</p>
            <Link
              href={action.href}
              className="mt-5 inline-flex rounded-full border border-gold/35 px-5 py-2.5 text-sm font-extrabold text-ivory transition hover:border-gold hover:bg-gold/10"
            >
              {action.label}
            </Link>
          </StudentCard>
        ))}
      </div>
    </div>
  );
}
