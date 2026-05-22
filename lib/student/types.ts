import type { ApplicationStatus, IdeaStatus } from "@/data/student";

export type ResearchProfileDraft = {
  bio: string;
  researchInterests: string;
  researchSkills: string;
  technicalSkills: string;
  experiences: string;
  achievements: string;
  linkedinUrl: string;
  orcidUrl: string;
  googleScholarUrl: string;
  cvUrl: string;
  isComplete: boolean;
};

export type ContactPreference = "email" | "phone" | "both" | "";

export type ContactSettingsDraft = {
  email: string;
  phoneNumber: string;
  preference: ContactPreference;
};

export type StoredOpportunityApplication = {
  id: string;
  opportunityId: string;
  title: string;
  facultyName: string;
  status: ApplicationStatus;
  createdAt: string;
};

export type StoredStudentIdea = {
  id: string;
  title: string;
  researchProblem: string;
  description: string;
  field: string;
  needsSupervisor: boolean;
  needsTeam: boolean;
  requiredTeamMembers: number;
  acceptedTeamMembers: number;
  requiredMajors: string;
  requiredSkills: string;
  notes: string;
  status: IdeaStatus;
  createdAt: string;
};
