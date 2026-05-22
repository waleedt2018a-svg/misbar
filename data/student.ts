export type ApplicationStatus = "قيد المراجعة" | "مقبول" | "مرفوض" | "قائمة انتظار";
export type IdeaStatus = "مسودة" | "قيد المراجعة" | "منشورة" | "مرفوضة" | "مكتملة";
export type WorkMode = "حضوري" | "عن بعد" | "مختلط";

export type StudentOpportunity = {
  id: string;
  title: string;
  facultyName: string;
  college: string;
  department: string;
  field: string;
  description: string;
  requiredSkills: string[];
  requiredMajors: string[];
  requiredStudents: number;
  workMode: WorkMode;
  status: "مفتوحة" | "مغلقة";
};

export type StudentIdeaSummary = {
  id: string;
  title: string;
  field: string;
  status: IdeaStatus;
  needsSupervisor: boolean;
  needsTeam: boolean;
  requiredTeamMembers: number;
  acceptedTeamMembers: number;
  createdAt: string;
};

export type IncomingIdeaJoinRequest = {
  id: string;
  ideaTitle: string;
  ideaRequiredTeamMembers: number;
  acceptedTeamMembers: number;
  studentName: string;
  college: string;
  major: string;
  academicLevel: string;
  researchSkills: string[];
  technicalSkills: string[];
  researchInterests: string[];
  bio: string;
  achievements?: string;
  status: ApplicationStatus;
};

export type StudentRequest = {
  id: string;
  title: string;
  type: string;
  date: string;
  status: ApplicationStatus;
  otherParty: string;
};

export type StudentNotification = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export const studentOpportunities: StudentOpportunity[] = [
  {
    id: "opp-energy-ai",
    title: "تحليل استهلاك الطاقة في المباني الجامعية",
    facultyName: "د. ريم القحطاني",
    college: "كلية الهندسة",
    department: "الهندسة الكهربائية",
    field: "الذكاء الاصطناعي والطاقة",
    description:
      "فرصة بحثية لتحليل بيانات استهلاك الطاقة وبناء نموذج يساعد على تحسين كفاءة التشغيل.",
    requiredSkills: ["تحليل بيانات", "Python", "كتابة علمية"],
    requiredMajors: ["علوم الحاسب", "هندسة الحاسب", "هندسة كهربائية"],
    requiredStudents: 3,
    workMode: "مختلط",
    status: "مفتوحة"
  },
  {
    id: "opp-health-surveys",
    title: "دراسة مؤشرات جودة النوم لدى الطلاب",
    facultyName: "د. خالد اليامي",
    college: "كلية الطب",
    department: "طب الأسرة والمجتمع",
    field: "الصحة العامة",
    description:
      "جمع وتحليل بيانات استبيانية لفهم العوامل المؤثرة على جودة النوم والأداء الأكاديمي.",
    requiredSkills: ["إحصاء تطبيقي", "تصميم استبيانات", "مراجعة أدبيات"],
    requiredMajors: ["الطب والجراحة", "علوم صحة المجتمع", "الإحصاء وبحوث العمليات"],
    requiredStudents: 4,
    workMode: "عن بعد",
    status: "مفتوحة"
  },
  {
    id: "opp-cyber-cloud",
    title: "حوكمة أمن البيانات البحثية في السحابة",
    facultyName: "د. ماجد الحربي",
    college: "كلية علوم الحاسب والمعلومات",
    department: "قسم تقنية المعلومات",
    field: "الأمن السيبراني",
    description:
      "مراجعة نماذج حماية البيانات البحثية وتصميم إطار أولي لإدارة الصلاحيات والتشفير.",
    requiredSkills: ["أمن معلومات", "توثيق تقني", "تحليل مخاطر"],
    requiredMajors: ["تقنية المعلومات", "نظم المعلومات", "علوم الحاسب"],
    requiredStudents: 2,
    workMode: "حضوري",
    status: "مغلقة"
  }
];

export const starterIdeas: StudentIdeaSummary[] = [
  {
    id: "idea-smart-light",
    title: "أثر الإضاءة الذكية على التركيز داخل قاعات الدراسة",
    field: "هندسة وعلوم سلوكية",
    status: "مسودة",
    needsSupervisor: true,
    needsTeam: true,
    requiredTeamMembers: 4,
    acceptedTeamMembers: 1,
    createdAt: "2026-05-12"
  }
];

export const incomingJoinRequests: IncomingIdeaJoinRequest[] = [
  {
    id: "join-1",
    ideaTitle: "أثر الإضاءة الذكية على التركيز داخل قاعات الدراسة",
    ideaRequiredTeamMembers: 4,
    acceptedTeamMembers: 1,
    studentName: "سارة العبدالله",
    college: "كلية علوم الحاسب والمعلومات",
    major: "علوم الحاسب",
    academicLevel: "السنة الرابعة",
    researchSkills: ["مراجعة أدبيات", "تحليل بيانات"],
    technicalSkills: ["Python", "تصور بيانات"],
    researchInterests: ["التعلم الذكي", "تحليل السلوك"],
    bio: "طالبة مهتمة بتطبيقات البيانات في تحسين تجربة التعلم داخل البيئة الجامعية.",
    achievements: "مشاركة في ملصق بحثي عن جودة البيئة التعليمية.",
    status: "قيد المراجعة"
  },
  {
    id: "join-2",
    ideaTitle: "أثر الإضاءة الذكية على التركيز داخل قاعات الدراسة",
    ideaRequiredTeamMembers: 4,
    acceptedTeamMembers: 1,
    studentName: "فيصل الزهراني",
    college: "كلية الهندسة",
    major: "هندسة كهربائية",
    academicLevel: "السنة الخامسة",
    researchSkills: ["تصميم تجارب", "كتابة تقارير"],
    technicalSkills: ["MATLAB", "حساسات وقياس"],
    researchInterests: ["الطاقة", "الأنظمة الذكية"],
    bio: "طالب يعمل على مشاريع قياس وتحكم ويرغب في دعم الجانب التقني للفكرة.",
    status: "قيد المراجعة"
  }
];

export const mockRequests: StudentRequest[] = [
  {
    id: "req-1",
    title: "تحليل استهلاك الطاقة في المباني الجامعية",
    type: "طلب على فرصة بحثية",
    date: "2026-05-18",
    status: "قيد المراجعة",
    otherParty: "د. ريم القحطاني"
  },
  {
    id: "req-2",
    title: "منصة توصية بمصادر بحثية لطلاب السنة الأولى",
    type: "طلب انضمام لفكرة طالب",
    date: "2026-05-14",
    status: "مقبول",
    otherParty: "عبدالعزيز المطيري"
  },
  {
    id: "req-3",
    title: "أثر الإضاءة الذكية على التركيز داخل قاعات الدراسة",
    type: "طلب وارد على فكرتي",
    date: "2026-05-10",
    status: "قائمة انتظار",
    otherParty: "سارة العبدالله"
  }
];

export const mockNotifications: StudentNotification[] = [
  {
    id: "note-1",
    title: "قبول في فرصة بحثية",
    message: "تم قبولك في فرصة بحثية.",
    read: false,
    createdAt: "2026-05-19"
  },
  {
    id: "note-2",
    title: "طلب انضمام جديد",
    message: "طالب مهتم بالانضمام إلى فكرتك.",
    read: false,
    createdAt: "2026-05-18"
  },
  {
    id: "note-3",
    title: "تذكير بالملف البحثي",
    message: "يرجى إكمال ملفك البحثي.",
    read: true,
    createdAt: "2026-05-17"
  },
  {
    id: "note-4",
    title: "مشاركة بيانات التواصل",
    message: "تم مشاركة بيانات التواصل معك.",
    read: true,
    createdAt: "2026-05-15"
  }
];
