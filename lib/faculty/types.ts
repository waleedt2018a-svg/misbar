export type FacultyAcademicProfileDraft = {
  academicBio: string;
  researchInterests: string;
  researchFields: string;
  researchExperience: string;
  publications: string;
  previousProjects: string;
  googleScholarUrl: string;
  orcidUrl: string;
  researchgateUrl: string;
  linkedinUrl: string;
  cvUrl: string;
  isComplete: boolean;
};

export type FacultyContactPreference = "email" | "phone" | "both" | "";

export type FacultyContactSettingsDraft = {
  email: string;
  phoneNumber: string;
  preference: FacultyContactPreference;
};

export type FacultyOpportunityStatus = "مسودة" | "قيد المراجعة" | "منشورة" | "مغلقة" | "مرفوضة";
export type FacultyApplicantStatus = "قيد المراجعة" | "مقبول" | "مرفوض" | "قائمة انتظار";
export type FacultySupervisionInterestStatus = "قيد المراجعة" | "مقبول" | "مرفوض";
export type FacultyWorkMode = "حضوري" | "عن بعد" | "مختلط";

export type StoredFacultyOpportunity = {
  id: string;
  title: string;
  description: string;
  researchField: string;
  college: string;
  department: string;
  requiredSkills: string;
  requiredMajors: string;
  requiredStudents: number;
  workMode: FacultyWorkMode;
  duration: string;
  deadline: string;
  notes: string;
  status: FacultyOpportunityStatus;
  createdAt: string;
};

export type FacultyApplicant = {
  id: string;
  opportunityTitle: string;
  studentName: string;
  college: string;
  major: string;
  academicLevel: string;
  researchSkills: string[];
  technicalSkills: string[];
  researchInterests: string[];
  bio: string;
  achievements?: string;
  status: FacultyApplicantStatus;
  contactEmail?: string;
  contactPhone?: string;
  contactPreference?: FacultyContactPreference;
};

export type FacultyStudentIdea = {
  id: string;
  title: string;
  studentName: string;
  college: string;
  major: string;
  field: string;
  researchProblem: string;
  description: string;
  needsSupervisor: boolean;
  needsTeam: boolean;
  requiredSkills: string[];
  interestStatus?: FacultySupervisionInterestStatus;
};

export type FacultyRequest = {
  id: string;
  title: string;
  type: string;
  otherParty: string;
  date: string;
  status: FacultyApplicantStatus | FacultySupervisionInterestStatus;
};

export type FacultyNotification = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};
