import type {
  FacultyApplicant,
  FacultyNotification,
  FacultyRequest,
  FacultyStudentIdea,
  StoredFacultyOpportunity
} from "@/lib/faculty/types";

export const starterFacultyOpportunities: StoredFacultyOpportunity[] = [
  {
    id: "faculty-opp-ai-energy",
    title: "تحليل بيانات الطاقة في المباني الجامعية",
    description: "فرصة بحثية لتطوير نموذج أولي يساعد على فهم أنماط استهلاك الطاقة وتحسين كفاءة التشغيل.",
    researchField: "الذكاء الاصطناعي والطاقة",
    college: "كلية الهندسة",
    department: "الهندسة الكهربائية",
    requiredSkills: "تحليل بيانات، Python، كتابة علمية",
    requiredMajors: "الهندسة الكهربائية، علوم الحاسب، نظم المعلومات",
    requiredStudents: 3,
    workMode: "مختلط",
    duration: "12 أسبوعًا",
    deadline: "2026-06-30",
    notes: "يفضل وجود خبرة أولية في تنظيف البيانات.",
    status: "منشورة",
    createdAt: "2026-05-18"
  }
];

export const mockFacultyApplicants: FacultyApplicant[] = [
  {
    id: "applicant-1",
    opportunityTitle: "تحليل بيانات الطاقة في المباني الجامعية",
    studentName: "سارة العبدالله",
    college: "كلية علوم الحاسب والمعلومات",
    major: "علوم الحاسب",
    academicLevel: "السنة الرابعة",
    researchSkills: ["مراجعة أدبيات", "تحليل بيانات"],
    technicalSkills: ["Python", "تصور بيانات"],
    researchInterests: ["الطاقة الذكية", "النمذجة التنبؤية"],
    bio: "طالبة مهتمة بتطبيقات البيانات في تحسين بيئة التعلم والتشغيل داخل الجامعة.",
    achievements: "مشاركة في ملصق بحثي عن جودة البيئة التعليمية.",
    status: "قيد المراجعة",
    contactEmail: "student@example.com",
    contactPhone: "0500000000",
    contactPreference: "email"
  },
  {
    id: "applicant-2",
    opportunityTitle: "تحليل بيانات الطاقة في المباني الجامعية",
    studentName: "فيصل الزهراني",
    college: "كلية الهندسة",
    major: "هندسة كهربائية",
    academicLevel: "السنة الخامسة",
    researchSkills: ["تصميم تجارب", "كتابة تقارير"],
    technicalSkills: ["MATLAB", "حساسات وقياس"],
    researchInterests: ["الطاقة", "الأنظمة الذكية"],
    bio: "طالب يعمل على مشاريع قياس وتحكم ويرغب في دعم الجانب التقني للفرصة.",
    status: "قائمة انتظار",
    contactEmail: "student2@example.com",
    contactPhone: "0550000000",
    contactPreference: "both"
  }
];

export const mockFacultyStudentIdeas: FacultyStudentIdea[] = [
  {
    id: "student-idea-smart-light",
    title: "أثر الإضاءة الذكية على التركيز داخل قاعات الدراسة",
    studentName: "عبدالعزيز المطيري",
    college: "كلية الهندسة",
    major: "هندسة كهربائية",
    field: "هندسة وعلوم سلوكية",
    researchProblem: "صعوبة قياس أثر بيئة القاعة على تركيز الطلاب بصورة عملية.",
    description: "فكرة لدراسة علاقة شدة الإضاءة ودرجة حرارتها بمؤشرات التركيز والانتباه داخل القاعات.",
    needsSupervisor: true,
    needsTeam: true,
    requiredSkills: ["تصميم تجارب", "تحليل بيانات", "كتابة علمية"],
    interestStatus: "قيد المراجعة"
  },
  {
    id: "student-idea-health-ai",
    title: "تصنيف أولي لمؤشرات جودة النوم لدى الطلاب",
    studentName: "نورة السبيعي",
    college: "كلية الطب",
    major: "طب وجراحة",
    field: "الصحة العامة والذكاء الاصطناعي",
    researchProblem: "تشتت بيانات جودة النوم وصعوبة تحويلها إلى مؤشرات مبكرة قابلة للمتابعة.",
    description: "بناء نموذج تصنيفي أولي يعتمد على استبيانات مختصرة ومؤشرات سلوكية غير حساسة.",
    needsSupervisor: true,
    needsTeam: false,
    requiredSkills: ["إحصاء تطبيقي", "تصميم استبيانات", "تحليل بيانات"]
  }
];

export const mockFacultyRequests: FacultyRequest[] = [
  {
    id: "faculty-req-1",
    title: "تحليل بيانات الطاقة في المباني الجامعية",
    type: "طلب طالب على فرصة بحثية",
    otherParty: "سارة العبدالله",
    date: "2026-05-20",
    status: "قيد المراجعة"
  },
  {
    id: "faculty-req-2",
    title: "أثر الإضاءة الذكية على التركيز داخل قاعات الدراسة",
    type: "اهتمام بالإشراف على فكرة طالب",
    otherParty: "عبدالعزيز المطيري",
    date: "2026-05-19",
    status: "قيد المراجعة"
  },
  {
    id: "faculty-req-3",
    title: "تصنيف أولي لمؤشرات جودة النوم لدى الطلاب",
    type: "اهتمام بالإشراف على فكرة طالب",
    otherParty: "نورة السبيعي",
    date: "2026-05-15",
    status: "مقبول"
  }
];

export const mockFacultyNotifications: FacultyNotification[] = [
  {
    id: "faculty-note-1",
    title: "طالب جديد تقدم على فرصتك البحثية.",
    message: "يوجد طلب جديد بانتظار المراجعة على إحدى فرصك البحثية.",
    read: false,
    createdAt: "2026-05-21"
  },
  {
    id: "faculty-note-2",
    title: "تم قبول اهتمامك بالإشراف على فكرة طالب.",
    message: "وافق الطالب على اهتمامك، وسيتم مشاركة بيانات التواصل حسب إعدادات الخصوصية.",
    read: false,
    createdAt: "2026-05-20"
  },
  {
    id: "faculty-note-3",
    title: "يرجى إكمال ملفك الأكاديمي.",
    message: "إكمال الملف الأكاديمي مطلوب قبل إنشاء فرصة مرسلة للمراجعة أو إبداء اهتمام بالإشراف.",
    read: true,
    createdAt: "2026-05-18"
  }
];
