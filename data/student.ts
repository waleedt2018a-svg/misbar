export type ApplicationStatus = string;
export type IdeaStatus = string;
export type WorkMode = string;

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
  status: string;
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
