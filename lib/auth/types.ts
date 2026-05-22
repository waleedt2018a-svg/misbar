export type PublicRole = "student" | "faculty";
export type AdminRole = "super_admin" | "admin" | "moderator";
export type Role = PublicRole | AdminRole;
export type Gender = "ذكر" | "أنثى";
export type AcademicRank = "أستاذ" | "أستاذ مشارك" | "أستاذ مساعد" | "محاضر" | "معيد";

export type Profile = {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  role: Role;
  gender: Gender;
  college: string;
  major: string | null;
  department: string | null;
  academic_level: string | null;
  academic_rank: AcademicRank | null;
  academic_title: string | null;
  created_at: string;
  status?: "active" | "inactive" | "banned";
  warnings_count?: number;
  banned_at?: string | null;
  ban_reason?: string | null;
};
