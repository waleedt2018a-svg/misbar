export type ResearchProject = {
  title: string;
  field: string;
  researcher: string;
  description: string;
};

export type JournalEntry = {
  title: string;
  outputType: "Proposal" | "Poster" | "Draft" | "Published Paper";
  authors: string;
  field: string;
  date: string;
};

export type Opportunity = {
  title: string;
  faculty: string;
  department: string;
  skills: string;
  status: "مفتوحة" | "مغلقة";
};

export type StudentIdea = {
  title: string;
  major: string;
  problem: string;
  support: "مشرف" | "فريق" | "جهة بحثية";
};

export type PaperLab = {
  title: string;
  paper: string;
  presenter: string;
  field: string;
};

export const researchProjects: ResearchProject[] = [
  {
    title: "نمذجة تنبؤية لاستهلاك الطاقة في المباني الجامعية",
    field: "الذكاء الاصطناعي",
    researcher: "د. ريم القحطاني",
    description:
      "مشروع يطور نماذج تعلم آلي لقراءة أنماط الاستهلاك ورفع كفاءة التشغيل في المرافق الأكاديمية."
  },
  {
    title: "مؤشرات حيوية مبكرة لاضطرابات النوم لدى الطلاب",
    field: "العلوم الصحية",
    researcher: "أ. نورة العتيبي",
    description:
      "تحليل بيانات قياس غير جراحية لاكتشاف العلاقات بين جودة النوم والأداء المعرفي اليومي."
  },
  {
    title: "أمن البيانات البحثية في البيئات السحابية",
    field: "الأمن السيبراني",
    researcher: "د. ماجد الحربي",
    description:
      "إطار حوكمة يوازن بين سهولة التعاون البحثي ومتطلبات الخصوصية والتشفير وإدارة الصلاحيات."
  }
];

export const journalEntries: JournalEntry[] = [
  {
    title: "تحسين فرز الصور الطبية باستخدام الشبكات العميقة خفيفة الحجم",
    outputType: "Published Paper",
    authors: "سارة العبدالله، فيصل الزهراني",
    field: "الذكاء الاصطناعي الطبي",
    date: "مايو 2026"
  },
  {
    title: "تصميم ملصق بحثي حول جودة المياه في المختبرات التعليمية",
    outputType: "Poster",
    authors: "لينا السالم، محمد الشهري",
    field: "علوم البيئة",
    date: "أبريل 2026"
  },
  {
    title: "مقترح لدراسة أثر القراءة العلمية على مهارات الكتابة الأكاديمية",
    outputType: "Proposal",
    authors: "عبدالعزيز المطيري",
    field: "التربية واللغة",
    date: "مارس 2026"
  },
  {
    title: "مسودة تحليلية لمنهجيات قياس الثقة في أنظمة التوصية",
    outputType: "Draft",
    authors: "جود المالكي، ريان الدوسري",
    field: "علوم الحاسب",
    date: "فبراير 2026"
  }
];

export const opportunities: Opportunity[] = [
  {
    title: "مساعد باحث في تحليل بيانات الاستبيانات الصحية",
    faculty: "د. خالد اليامي",
    department: "كلية الطب",
    skills: "إحصاء تطبيقي، تنظيف بيانات، كتابة نتائج مختصرة",
    status: "مفتوحة"
  },
  {
    title: "تطوير لوحة متابعة لمؤشرات المختبرات",
    faculty: "د. هدى الراجحي",
    department: "كلية الهندسة",
    skills: "واجهات ويب، تصور بيانات، فهم أولي لقواعد البيانات",
    status: "مفتوحة"
  },
  {
    title: "مراجعة أدبيات حول التعلم المدمج في التعليم العالي",
    faculty: "أ. سامي القرني",
    department: "كلية التربية",
    skills: "بحث في قواعد البيانات، تلخيص علمي، توثيق مراجع",
    status: "مغلقة"
  }
];

export const ideas: StudentIdea[] = [
  {
    title: "قياس أثر الإضاءة الذكية على تركيز الطلاب في قاعات الدراسة",
    major: "هندسة كهربائية",
    problem:
      "تختلف ظروف الإضاءة داخل القاعات دون وجود مؤشر واضح يربطها بدرجة التركيز والراحة البصرية.",
    support: "مشرف"
  },
  {
    title: "منصة توصية بمصادر بحثية لطلاب السنة الأولى",
    major: "نظم معلومات",
    problem:
      "يواجه الطلاب صعوبة في اختيار مصادر موثوقة ومناسبة لمستوى مشاريعهم البحثية الأولى.",
    support: "فريق"
  },
  {
    title: "تحليل الملوثات الدقيقة في عينات المياه الرمادية",
    major: "كيمياء",
    problem:
      "الحاجة إلى فهم حضور الملوثات الدقيقة في الاستخدامات غير المباشرة للمياه داخل المنشآت.",
    support: "جهة بحثية"
  }
];

export const paperLabs: PaperLab[] = [
  {
    title: "تفكيك منهجية التجارب العشوائية",
    paper: "A Practical Guide to Randomized Evaluation",
    presenter: "مها الشمري",
    field: "منهجيات البحث"
  },
  {
    title: "قراءة نقدية في نماذج اللغة الكبيرة",
    paper: "Training Compute-Optimal Large Language Models",
    presenter: "راكان البقمي",
    field: "الذكاء الاصطناعي"
  },
  {
    title: "تحليل ورقة في أخلاقيات البيانات",
    paper: "Datasheets for Datasets",
    presenter: "دانا الجهني",
    field: "حوكمة البيانات"
  }
];
