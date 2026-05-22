"use client";

import { starterFacultyOpportunities } from "@/data/faculty";
import type {
  FacultyAcademicProfileDraft,
  FacultyApplicant,
  FacultyContactPreference,
  FacultyContactSettingsDraft,
  FacultyStudentIdea,
  StoredFacultyOpportunity
} from "@/lib/faculty/types";

export const emptyFacultyAcademicProfile: FacultyAcademicProfileDraft = {
  academicBio: "",
  researchInterests: "",
  researchFields: "",
  researchExperience: "",
  publications: "",
  previousProjects: "",
  googleScholarUrl: "",
  orcidUrl: "",
  researchgateUrl: "",
  linkedinUrl: "",
  cvUrl: "",
  isComplete: false
};

const profileKey = "misbar.faculty.academicProfile";
const contactKey = "misbar.faculty.contactSettings";
const opportunitiesKey = "misbar.faculty.opportunities";
const applicantsKey = "misbar.faculty.applicants";
const studentIdeasKey = "misbar.faculty.studentIdeas";

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? (JSON.parse(rawValue) as T) : fallback;
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
    // Faculty dashboard should remain usable even if local storage is unavailable.
  }
}

function validContactPreference(value: unknown): FacultyContactPreference {
  return value === "email" || value === "phone" || value === "both" ? value : "";
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

export function isFacultyAcademicProfileComplete(
  profile?: Partial<FacultyAcademicProfileDraft> | null
) {
  const normalized = {
    ...emptyFacultyAcademicProfile,
    ...profile,
    academicBio: text(profile?.academicBio),
    researchInterests: text(profile?.researchInterests),
    researchFields: text(profile?.researchFields),
    researchExperience: text(profile?.researchExperience),
    publications: text(profile?.publications),
    previousProjects: text(profile?.previousProjects)
  };

  return Boolean(
    normalized.academicBio.trim() &&
      splitList(normalized.researchInterests).length > 0 &&
      splitList(normalized.researchFields).length > 0 &&
      normalized.researchExperience.trim() &&
      normalized.publications.trim() &&
      normalized.previousProjects.trim()
  );
}

function normalizeFacultyAcademicProfile(
  profile?: Partial<FacultyAcademicProfileDraft> | null
): FacultyAcademicProfileDraft {
  const normalized: FacultyAcademicProfileDraft = {
    academicBio: text(profile?.academicBio),
    researchInterests: text(profile?.researchInterests),
    researchFields: text(profile?.researchFields),
    researchExperience: text(profile?.researchExperience),
    publications: text(profile?.publications),
    previousProjects: text(profile?.previousProjects),
    googleScholarUrl: text(profile?.googleScholarUrl),
    orcidUrl: text(profile?.orcidUrl),
    researchgateUrl: text(profile?.researchgateUrl),
    linkedinUrl: text(profile?.linkedinUrl),
    cvUrl: text(profile?.cvUrl),
    isComplete: false
  };

  return {
    ...normalized,
    isComplete: isFacultyAcademicProfileComplete(normalized)
  };
}

export function getFacultyAcademicProfile() {
  return normalizeFacultyAcademicProfile(
    readJson<Partial<FacultyAcademicProfileDraft> | null>(profileKey, null)
  );
}

export function saveFacultyAcademicProfile(profile: FacultyAcademicProfileDraft) {
  const nextProfile = normalizeFacultyAcademicProfile(profile);
  writeJson(profileKey, nextProfile);
  return nextProfile;
}

export function getFacultyContactSettings(email = "", phoneNumber = "") {
  const settings = readJson<Partial<FacultyContactSettingsDraft> | null>(contactKey, null);

  return {
    email: text(settings?.email) || email,
    phoneNumber: text(settings?.phoneNumber) || phoneNumber,
    preference: validContactPreference(settings?.preference)
  };
}

export function saveFacultyContactSettings(settings: FacultyContactSettingsDraft) {
  writeJson(contactKey, {
    email: text(settings.email),
    phoneNumber: text(settings.phoneNumber),
    preference: validContactPreference(settings.preference)
  });
}

export function getFacultyOpportunities() {
  return readJson<StoredFacultyOpportunity[]>(opportunitiesKey, starterFacultyOpportunities);
}

export function saveFacultyOpportunities(opportunities: StoredFacultyOpportunity[]) {
  writeJson(opportunitiesKey, Array.isArray(opportunities) ? opportunities : []);
}

export function getFacultyApplicants(fallback: FacultyApplicant[]) {
  return readJson<FacultyApplicant[]>(applicantsKey, fallback);
}

export function saveFacultyApplicants(applicants: FacultyApplicant[]) {
  writeJson(applicantsKey, applicants);
}

export function getFacultyStudentIdeas(fallback: FacultyStudentIdea[]) {
  return readJson<FacultyStudentIdea[]>(studentIdeasKey, fallback);
}

export function saveFacultyStudentIdeas(ideas: FacultyStudentIdea[]) {
  writeJson(studentIdeasKey, ideas);
}
