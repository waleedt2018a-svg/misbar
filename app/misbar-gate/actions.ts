"use server";

import { redirect } from "next/navigation";
import { adminRoles } from "@/lib/auth/guards";
import type { AdminRole } from "@/lib/auth/types";
import { getString } from "@/lib/auth/validation";
import {
  clearAuthCookies,
  getProfile,
  getUserFromToken,
  logAdminAction,
  setAuthCookies,
  signInWithSupabase,
  touchAdminLogin
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

  if (profile.admin_status === "inactive") {
    await clearAuthCookies();
    return { message: "تم إيقاف صلاحياتك من قبل إدارة مِسبار." };
  }

  const loginTouchResult = await touchAdminLogin(data.access_token, user.id);

  if (!loginTouchResult.ok) {
    console.error("[Misbar admin gate] login timestamp write failed", {
      authenticatedUserId: user.id,
      adminEmail: profile.email,
      error: loginTouchResult.error
    });

    return { message: "تعذر تحديث وقت الدخول الإداري. حاول مرة أخرى." };
  }

  await logAdminAction(data.access_token, {
    adminUserId: user.id,
    adminName: profile.full_name,
    adminEmail: profile.email,
    adminRole: profile.role,
    actionType: "admin_login",
    targetType: "admin",
    targetId: user.id,
    targetTitleOrEmail: profile.email,
    metadata: { source: "misbar_gate" }
  });
  await setAuthCookies(data.access_token, data.refresh_token);
  redirect("/admin");
}
