"use client";

import type {
  ContactSettingsDraft,
  ResearchProfileDraft,
  StoredOpportunityApplication,
  StoredStudentIdea
} from "@/lib/student/types";

export const emptyResearchProfile: ResearchProfileDraft = {
  bio: "",
  researchInterests: "",
  researchSkills: "",
  technicalSkills: "",
  experiences: "",
  achievements: "",
  linkedinUrl: "",
  orcidUrl: "",
  googleScholarUrl: "",
  cvUrl: "",
  isComplete: false
};

const profileKey = "misbar.student.researchProfile";
const contactKey = "misbar.student.contactSettings";
const applicationsKey = "misbar.student.opportunityApplications";
const ideasKey = "misbar.student.ideas";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  let rawValue: string | null = null;

  try {
    rawValue = window.localStorage.getItem(key);
  } catch {
    return fallback;
  }

  if (!rawValue) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // The dashboard should keep working even when storage is blocked or full.
  }
}

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}

function normalizeResearchProfile(
  profile?: Partial<ResearchProfileDraft> | null
): ResearchProfileDraft {
  const normalizedProfile: ResearchProfileDraft = {
    bio: text(profile?.bio),
    researchInterests: text(profile?.researchInterests),
    researchSkills: text(profile?.researchSkills),
    technicalSkills: text(profile?.technicalSkills),
    experiences: text(profile?.experiences),
    achievements: text(profile?.achievements),
    linkedinUrl: text(profile?.linkedinUrl),
    orcidUrl: text(profile?.orcidUrl),
    googleScholarUrl: text(profile?.googleScholarUrl),
    cvUrl: text(profile?.cvUrl),
    isComplete: false
  };

  return {
    ...normalizedProfile,
    isComplete: isResearchProfileComplete(normalizedProfile)
  };
}

function validContactPreference(value: unknown): ContactSettingsDraft["preference"] {
  return value === "email" || value === "phone" || value === "both" ? value : "";
}

function readArray<T>(key: string) {
  const value = readJson<unknown>(key, []);
  return Array.isArray(value) ? (value as T[]) : [];
}

export function splitList(value?: string | null) {
  if (!value) {
    return [];
  }

  return value
    .split(/[،,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function isResearchProfileComplete(profile?: Partial<ResearchProfileDraft> | null) {
  const normalizedProfile = {
    ...emptyResearchProfile,
    ...profile,
    bio: text(profile?.bio),
    researchInterests: text(profile?.researchInterests),
    researchSkills: text(profile?.researchSkills),
    technicalSkills: text(profile?.technicalSkills),
    experiences: text(profile?.experiences),
    achievements: text(profile?.achievements)
  };

  return Boolean(
    normalizedProfile.bio.trim() &&
      splitList(normalizedProfile.researchInterests).length > 0 &&
      splitList(normalizedProfile.researchSkills).length > 0
  );
}

export function getResearchProfile() {
  const profile = readJson<Partial<ResearchProfileDraft> | null>(profileKey, null);
  return normalizeResearchProfile(profile);
}

export function saveResearchProfile(profile: ResearchProfileDraft) {
  const nextProfile = normalizeResearchProfile(profile);
  writeJson(profileKey, nextProfile);
  window.dispatchEvent(new Event("misbar:student-profile-updated"));
  return nextProfile;
}

export function getContactSettings(email = "", phoneNumber = "") {
  const settings = readJson<Partial<ContactSettingsDraft> | null>(contactKey, null);

  return {
    email: text(settings?.email) || email,
    phoneNumber: text(settings?.phoneNumber) || phoneNumber,
    preference: validContactPreference(settings?.preference)
  };
}

export function saveContactSettings(settings: ContactSettingsDraft) {
  writeJson(contactKey, {
    email: text(settings.email),
    phoneNumber: text(settings.phoneNumber),
    preference: validContactPreference(settings.preference)
  });
  window.dispatchEvent(new Event("misbar:student-profile-updated"));
}

export function isContactSettingsComplete(settings?: Partial<ContactSettingsDraft> | null) {
  return Boolean(validContactPreference(settings?.preference));
}

export function getStudentCompletionStatus(email = "", phoneNumber = "") {
  const researchProfile = getResearchProfile();
  const contactSettings = getContactSettings(email, phoneNumber);
  const profileComplete = isResearchProfileComplete(researchProfile);
  const contactComplete = isContactSettingsComplete(contactSettings);

  return {
    profileComplete,
    contactComplete,
    fullyComplete: profileComplete && contactComplete,
    progress: Math.round(((profileComplete ? 1 : 0) + (contactComplete ? 1 : 0)) * 50)
  };
}

export function getOpportunityApplications() {
  return readArray<StoredOpportunityApplication>(applicationsKey);
}

export function saveOpportunityApplications(applications: StoredOpportunityApplication[]) {
  writeJson(applicationsKey, Array.isArray(applications) ? applications : []);
}

export function getStoredIdeas() {
  return readArray<StoredStudentIdea>(ideasKey);
}

export function saveStoredIdeas(ideas: StoredStudentIdea[]) {
  writeJson(ideasKey, Array.isArray(ideas) ? ideas : []);
}
