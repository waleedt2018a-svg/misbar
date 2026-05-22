"use server";

import { redirect } from "next/navigation";
import { adminRoles } from "@/lib/auth/guards";
import type { AdminRole } from "@/lib/auth/types";
import { getString } from "@/lib/auth/validation";
import {
  clearAuthCookies,
  getProfile,
  getUserFromToken,
  setAuthCookies,
  signInWithSupabase
} from "@/lib/supabase/rest";

export type AdminGateState = {
  message?: string;
};

export async function adminGateLoginAction(
  _previousState: AdminGateState,
  formData: FormData
): Promise<AdminGateState> {
  const email = getString(formData, "email").toLowerCase();
  const password = getString(formData, "password");

  if (!email || !password) {
    return { message: "بيانات الدخول غير صحيحة." };
  }

  const { data, error } = await signInWithSupabase(email, password);

  if (error || !data?.access_token) {
    return { message: "بيانات الدخول غير صحيحة." };
  }

  const user = await getUserFromToken(data.access_token);

  if (!user) {
    return { message: "بيانات الدخول غير صحيحة." };
  }

  const profile = await getProfile(data.access_token, user.id);

  if (!profile || !adminRoles.includes(profile.role as AdminRole)) {
    await clearAuthCookies();
    return { message: "هذه البوابة مخصصة لإدارة مِسبار فقط." };
  }

  await setAuthCookies(data.access_token, data.refresh_token);
  redirect("/admin");
}
