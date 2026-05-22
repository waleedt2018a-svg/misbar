import type {
  AdminActivityLog,
  AdminReport,
  AdminReviewItem,
  AdminUser,
  AdminWarning,
  ManagedAdmin
} from "@/lib/admin/types";

export const pendingOpportunities: AdminReviewItem[] = [
  {
    id: "opp-review-1",
    title: "تحليل بيانات الطاقة في المباني الجامعية",
    ownerName: "د. ريم القحطاني",
    college: "كلية الهندسة",
    field: "الذكاء الاصطناعي والطاقة",
    description: "فرصة بحثية لتطوير نموذج أولي يساعد على فهم أنماط استهلاك الطاقة وتحسين كفاءة التشغيل.",
    status: "قيد المراجعة",
    submittedAt: "2026-05-21"
  },
  {
    id: "opp-review-2",
    title: "حوكمة أمن البيانات البحثية في السحابة",
    ownerName: "د. ماجد الحربي",
    college: "كلية علوم الحاسب والمعلومات",
    field: "الأمن السيبراني",
    description: "مراجعة نماذج حماية البيانات البحثية وتصميم إطار أولي لإدارة الصلاحيات والتشفير.",
    status: "قيد المراجعة",
    submittedAt: "2026-05-20"
  }
];

export const pendingStudentIdeas: AdminReviewItem[] = [
  {
    id: "idea-review-1",
    title: "أثر الإضاءة الذكية على التركيز داخل قاعات الدراسة",
    ownerName: "عبدالعزيز المطيري",
    college: "كلية الهندسة",
    field: "هندسة وعلوم سلوكية",
    description: "فكرة لدراسة علاقة شدة الإضاءة ودرجة حرارتها بمؤشرات التركيز والانتباه داخل القاعات.",
    status: "قيد المراجعة",
    submittedAt: "2026-05-19"
  },
  {
    id: "idea-review-2",
    title: "تصنيف أولي لمؤشرات جودة النوم لدى الطلاب",
    ownerName: "نورة السبيعي",
    college: "كلية الطب",
    field: "الصحة العامة والذكاء الاصطناعي",
    description: "نموذج تصنيفي أولي يعتمد على استبيانات مختصرة ومؤشرات سلوكية غير حساسة.",
    status: "قيد المراجعة",
    submittedAt: "2026-05-18"
  }
];

export const adminUsers: AdminUser[] = [
  {
    id: "user-1",
    name: "سارة العبدالله",
    email: "sarah@student.ksu.edu.sa",
    role: "student",
    college: "كلية علوم الحاسب والمعلومات",
    status: "active",
    warningsCount: 1,
    createdAt: "2026-05-10"
  },
  {
    id: "user-2",
    name: "د. ريم القحطاني",
    email: "reem@ksu.edu.sa",
    role: "faculty",
    college: "كلية الهندسة",
    status: "active",
    warningsCount: 0,
    createdAt: "2026-05-08"
  },
  {
    id: "user-3",
    name: "فيصل الزهراني",
    email: "faisal@student.ksu.edu.sa",
    role: "student",
    college: "كلية الهندسة",
    status: "banned",
    warningsCount: 3,
    createdAt: "2026-05-05"
  }
];

export const adminWarnings: AdminWarning[] = [
  {
    id: "warning-1",
    userId: "user-3",
    userName: "فيصل الزهراني",
    reason: "محتوى مخالف",
    details: "نُشر وصف فرصة/فكرة يتضمن معلومات غير مناسبة للمراجعة العامة.",
    issuedBy: "مشرف النظام",
    createdAt: "2026-05-20"
  }
];

export const adminReports: AdminReport[] = [
  {
    id: "report-1",
    reporter: "سارة العبدالله",
    reportedTarget: "فكرة بحثية: تصنيف أولي لمؤشرات جودة النوم",
    reason: "معلومات حساسة",
    details: "يحتاج المحتوى لمراجعة صياغة البيانات الصحية قبل النشر.",
    status: "open",
    createdAt: "2026-05-21"
  },
  {
    id: "report-2",
    reporter: "د. ريم القحطاني",
    reportedTarget: "مستخدم: فيصل الزهراني",
    reason: "سلوك غير مناسب",
    details: "تكرار رسائل غير مهنية ضمن طلبات الانضمام.",
    status: "under_review",
    createdAt: "2026-05-18"
  }
];

export const managedAdmins: ManagedAdmin[] = [
  {
    id: "admin-1",
    name: "مدير مِسبار",
    email: "admin@ksu.edu.sa",
    role: "super_admin",
    createdAt: "2026-05-01"
  },
  {
    id: "admin-2",
    name: "مشرف المحتوى",
    email: "moderator@ksu.edu.sa",
    role: "moderator",
    createdAt: "2026-05-11"
  }
];

export const adminActivityLogs: AdminActivityLog[] = [
  {
    id: "log-1",
    adminUserId: "admin-1",
    adminEmail: "admin@ksu.edu.sa",
    adminRole: "super_admin",
    actionType: "approve_content",
    targetType: "research_opportunity",
    targetId: "opp-review-1",
    targetTitleOrEmail: "تحليل بيانات الطاقة في المباني الجامعية",
    reason: "",
    metadata: { status: "published" },
    createdAt: "2026-05-22 10:30"
  },
  {
    id: "log-2",
    adminUserId: "admin-2",
    adminEmail: "moderator@ksu.edu.sa",
    adminRole: "moderator",
    actionType: "send_warning",
    targetType: "user",
    targetId: "user-3",
    targetTitleOrEmail: "faisal@student.ksu.edu.sa",
    reason: "سلوك غير مناسب",
    metadata: { warning_count: "3" },
    createdAt: "2026-05-22 12:10"
  },
  {
    id: "log-3",
    adminUserId: "admin-1",
    adminEmail: "admin@ksu.edu.sa",
    adminRole: "admin",
    actionType: "ban_user",
    targetType: "user",
    targetId: "user-3",
    targetTitleOrEmail: "faisal@student.ksu.edu.sa",
    reason: "تكرار التنبيهات",
    metadata: { duration: "temporary" },
    createdAt: "2026-05-22 13:45"
  }
];

export const controlCenterSections = [
  {
    title: "جميع المستخدمين",
    items: adminUsers.map((user) => ({
      id: user.id,
      titleOrName: user.name,
      type: "مستخدم",
      owner: user.email,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: "2026-05-22"
    }))
  },
  {
    title: "جميع الفرص البحثية",
    items: pendingOpportunities.map((item) => ({
      id: item.id,
      titleOrName: item.title,
      type: "فرصة بحثية",
      owner: item.ownerName,
      status: item.status,
      createdAt: item.submittedAt,
      updatedAt: "2026-05-22"
    }))
  },
  {
    title: "جميع الأفكار البحثية",
    items: pendingStudentIdeas.map((item) => ({
      id: item.id,
      titleOrName: item.title,
      type: "فكرة طالب",
      owner: item.ownerName,
      status: item.status,
      createdAt: item.submittedAt,
      updatedAt: "2026-05-22"
    }))
  },
  {
    title: "جميع المشاريع",
    items: [
      {
        id: "project-1",
        titleOrName: "مختبر قراءة الأوراق العلمية",
        type: "مشروع",
        owner: "فريق مِسبار",
        status: "نشط",
        createdAt: "2026-05-10",
        updatedAt: "2026-05-22"
      }
    ]
  },
  {
    title: "جميع البلاغات",
    items: adminReports.map((report) => ({
      id: report.id,
      titleOrName: report.reason,
      type: "بلاغ",
      owner: report.reporter,
      status: report.status,
      createdAt: report.createdAt,
      updatedAt: "2026-05-22"
    }))
  },
  {
    title: "جميع التنبيهات",
    items: adminWarnings.map((warning) => ({
      id: warning.id,
      titleOrName: warning.reason,
      type: "تنبيه",
      owner: warning.userName,
      status: "مرسل",
      createdAt: warning.createdAt,
      updatedAt: warning.createdAt
    }))
  },
  {
    title: "جميع الأدمنز",
    items: managedAdmins.map((admin) => ({
      id: admin.id,
      titleOrName: admin.name,
      type: admin.role,
      owner: admin.email,
      status: "active",
      createdAt: admin.createdAt,
      updatedAt: "2026-05-22"
    }))
  }
];
