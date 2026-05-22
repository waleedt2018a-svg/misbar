import {
  academicLevels,
  academicRanks,
  academicTitleByRank,
  facultyColleges,
  genders,
  getStudentMajors,
  studentColleges
} from "@/lib/auth/options";
import type { AcademicRank, Gender, PublicRole } from "@/lib/auth/types";

export type AuthErrors = Record<string, string>;

export type SignupPayload = {
  role: PublicRole;
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  gender: Gender | "";
  college: string;
  major?: string;
  department?: string;
  academicLevel?: string;
  academicRank?: AcademicRank | "";
};

export type SignupProfileInsert = {
  full_name: string;
  email: string;
  phone_number: string;
  role: PublicRole;
  gender: Gender;
  college: string;
  major: string | null;
  department: string | null;
  academic_level: string | null;
  academic_rank: AcademicRank | null;
  academic_title: string | null;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function firstError(errors: AuthErrors) {
  return Object.values(errors)[0] ?? "يرجى تصحيح الحقول المطلوبة";
}

export function validateSignup(payload: SignupPayload):
  | { ok: true; profile: SignupProfileInsert }
  | { ok: false; message: string; errors: AuthErrors } {
  const {
    role,
    fullName,
    email,
    phoneNumber,
    password,
    gender,
    college
  } = payload;
  const normalizedEmail = email.toLowerCase();
  const errors: AuthErrors = {};

  if (!["student", "faculty"].includes(role)) {
    return {
      ok: false,
      message: "نوع الحساب غير صحيح",
      errors: { role: "نوع الحساب غير صحيح" }
    };
  }

  if (!fullName) {
    errors.fullName = "يرجى إدخال الاسم الكامل";
  }

  if (!normalizedEmail) {
    errors.email = "يرجى إدخال البريد الجامعي";
  } else if (!emailPattern.test(normalizedEmail)) {
    errors.email = "صيغة البريد الإلكتروني غير صحيحة";
  }

  if (!phoneNumber) {
    errors.phoneNumber = "يرجى إدخال رقم الجوال";
  }

  if (!password) {
    errors.password = "كلمة المرور مطلوبة";
  } else if (password.length < 6) {
    errors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
  }

  if (!gender || !genders.includes(gender)) {
    errors.gender = "يرجى اختيار الجنس";
  }

  if (!college) {
    errors.college = "يرجى اختيار الكلية";
  }

  if (role === "student") {
    const major = payload.major ?? "";
    const academicLevel = payload.academicLevel ?? "";
    const majors = gender ? getStudentMajors(college, gender) : [];

    if (normalizedEmail && emailPattern.test(normalizedEmail) && !normalizedEmail.endsWith("@student.ksu.edu.sa")) {
      errors.email = "يجب استخدام البريد الجامعي للطلاب المنتهي بـ @student.ksu.edu.sa";
    }

    if (!major) {
      errors.major = "يرجى اختيار التخصص";
    } else if (college && (!majors.length || !majors.includes(major))) {
      errors.major = "يرجى اختيار التخصص";
    }

    if (!academicLevel) {
      errors.academicLevel = "يرجى اختيار المستوى الدراسي";
    } else if (!academicLevels.includes(academicLevel)) {
      errors.academicLevel = "يرجى اختيار المستوى الدراسي";
    }

    if (Object.keys(errors).length > 0) {
      return { ok: false, message: firstError(errors), errors };
    }

    return {
      ok: true,
      profile: {
        full_name: fullName,
        email: normalizedEmail,
        phone_number: phoneNumber,
        role,
        gender: gender as Gender,
        college,
        major,
        department: null,
        academic_level: academicLevel,
        academic_rank: null,
        academic_title: null
      }
    };
  }

  const department = payload.department ?? "";
  const academicRank = payload.academicRank;
  const departments = (facultyColleges[college as keyof typeof facultyColleges] ??
    []) as readonly string[];

  if (normalizedEmail && emailPattern.test(normalizedEmail)) {
    if (normalizedEmail.endsWith("@student.ksu.edu.sa")) {
      errors.email = "لا يمكن استخدام بريد طالب لإنشاء حساب عضو هيئة تدريس";
    } else if (!normalizedEmail.endsWith("@ksu.edu.sa")) {
      errors.email = "يجب استخدام بريد عضو هيئة التدريس الرسمي المنتهي بـ @ksu.edu.sa";
    }
  }

  if (college && !(college in facultyColleges)) {
    errors.college = "يرجى اختيار الكلية";
  }

  if (!department) {
    errors.department = "يرجى اختيار القسم";
  } else if (college && !departments.includes(department)) {
    errors.department = "يرجى اختيار القسم";
  }

  if (!academicRank) {
    errors.academicRank = "يرجى اختيار المرتبة الأكاديمية";
  } else if (!academicRanks.includes(academicRank)) {
    errors.academicRank = "يرجى اختيار المرتبة الأكاديمية";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, message: firstError(errors), errors };
  }

  return {
    ok: true,
    profile: {
      full_name: fullName,
      email: normalizedEmail,
      phone_number: phoneNumber,
      role,
      gender: gender as Gender,
      college,
      major: null,
      department,
      academic_level: null,
      academic_rank: academicRank as AcademicRank,
      academic_title: academicTitleByRank[academicRank as AcademicRank]
    }
  };
}
