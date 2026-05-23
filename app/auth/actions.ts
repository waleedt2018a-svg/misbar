"use server";

import { redirect } from "next/navigation";
import type { PublicRole } from "@/lib/auth/types";
import { getString, validateSignup, type AuthErrors } from "@/lib/auth/validation";
import {
  clearAuthCookies,
  getProfile,
  getUserFromToken,
  insertProfile,
  sendPasswordResetEmail,
  setAuthCookies,
  signInWithSupabase,
  signUpWithSupabase
} from "@/lib/supabase/rest";

export type AuthState = {
  message?: string;
  success?: boolean;
  errors?: AuthErrors;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeSupabaseError(error: string): AuthState {
  const lowerError = error.toLowerCase();

  if (
    lowerError.includes("already registered") ||
    lowerError.includes("already been registered") ||
    lowerError.includes("user already") ||
    lowerError.includes("email exists")
  ) {
    return {
      message: "البريد الإلكتروني مستخدم مسبقًا",
      errors: { email: "البريد الإلكتروني مستخدم مسبقًا" }
    };
  }

  if (
    lowerError.includes("invalid email") ||
    lowerError.includes("unable to validate email") ||
    lowerError.includes("email address is invalid")
  ) {
    return {
      message: "صيغة البريد الإلكتروني غير صحيحة",
      errors: { email: "صيغة البريد الإلكتروني غير صحيحة" }
    };
  }

  if (lowerError.includes("password")) {
    return {
      message: "كلمة المرور غير مقبولة، يرجى اختيار كلمة مرور أقوى",
      errors: { password: "كلمة المرور غير مقبولة، يرجى اختيار كلمة مرور أقوى" }
    };
  }

  if (lowerError.includes("rate limit") || lowerError.includes("too many")) {
    return {
      message: "تم إرسال طلبات كثيرة، يرجى المحاولة لاحقًا",
      errors: {}
    };
  }

  return {
    message: `حدث خطأ أثناء تنفيذ الطلب: ${error}`,
    errors: {}
  };
}

export async function signupAction(
  _previousState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const role = getString(formData, "role") as PublicRole;
  const validation = validateSignup({
    role,
    fullName: getString(formData, "fullName"),
    email: getString(formData, "email"),
    phoneNumber: getString(formData, "phoneNumber"),
    password: getString(formData, "password"),
    gender: getString(formData, "gender") as never,
    college: getString(formData, "college"),
    major: getString(formData, "major"),
    department: getString(formData, "department"),
    academicLevel: getString(formData, "academicLevel"),
    academicRank: getString(formData, "academicRank") as never
  });

  if (!validation.ok) {
    return { message: validation.message, errors: validation.errors };
  }

  const password = getString(formData, "password");

  const { data, error } = await signUpWithSupabase({
    email: validation.profile.email,
    password,
    fullName: validation.profile.full_name,
    role: validation.profile.role
  });

  if (error) {
    return normalizeSupabaseError(error);
  }

  if (!data?.user) {
    return {
      message: "لم يتم استلام بيانات المستخدم بعد إنشاء الحساب"
    };
  }

  if (!data.access_token) {
    return {
      message:
        "تم إنشاء الحساب، لكن لم يتم إنشاء جلسة مباشرة. يرجى تسجيل الدخول باستخدام بيانات الحساب."
    };
  }

  await setAuthCookies(data.access_token, data.refresh_token);

  const { error: profileError } = await insertProfile(data.access_token, {
    id: data.user.id,
    ...validation.profile
  });

  if (profileError) {
    return {
      message: `تم إنشاء حساب الدخول، لكن تعذر حفظ ملف المستخدم: ${profileError}`
    };
  }

  redirect(role === "student" ? "/student" : "/faculty");
}

export async function loginAction(
  _previousState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = getString(formData, "email").toLowerCase();
  const password = getString(formData, "password");
  const errors: AuthErrors = {};

  if (!email) {
    errors.email = "يرجى إدخال البريد الجامعي";
  } else if (!emailPattern.test(email)) {
    errors.email = "صيغة البريد الإلكتروني غير صحيحة";
  }

  if (!password) {
    errors.password = "كلمة المرور مطلوبة";
  }

  if (Object.keys(errors).length > 0) {
    return { message: Object.values(errors)[0], errors };
  }

  const { data, error } = await signInWithSupabase(email, password);

  if (error) {
    return { message: "بيانات الدخول غير صحيحة" };
  }

  if (!data?.access_token) {
    return { message: "لم يتم إنشاء جلسة دخول صالحة" };
  }

  await setAuthCookies(data.access_token, data.refresh_token);

  const user = await getUserFromToken(data.access_token);

  if (!user) {
    return { message: "تعذر التحقق من جلسة الدخول الحالية" };
  }

  const profile = await getProfile(data.access_token, user.id);

  if (!profile) {
    return { message: "لم يتم العثور على ملف المستخدم المرتبط بهذا الحساب" };
  }

  redirect("/");
}

export async function logoutAction() {
  await clearAuthCookies();
  redirect("/");
}

export async function forgotPasswordAction(
  _previousState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = getString(formData, "email").toLowerCase();

  if (!email) {
    return {
      message: "يرجى إدخال البريد الجامعي",
      errors: { email: "يرجى إدخال البريد الجامعي" }
    };
  }

  if (!emailPattern.test(email)) {
    return {
      message: "صيغة البريد الإلكتروني غير صحيحة",
      errors: { email: "صيغة البريد الإلكتروني غير صحيحة" }
    };
  }

  const { error } = await sendPasswordResetEmail(email);

  if (error) {
    return normalizeSupabaseError(error);
  }

  return {
    success: true,
    message: "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني"
  };
}
