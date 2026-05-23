import { redirect } from "next/navigation";
import type { AdminRole, Role } from "@/lib/auth/types";
import { getAccessToken, getProfile, getUserFromToken, touchAdminSeen } from "@/lib/supabase/rest";

const roleRedirects: Record<Role, string> = {
  student: "/student",
  faculty: "/faculty",
  admin: "/admin",
  chief_admin: "/admin",
  super_admin: "/admin"
};

export const adminRoles: AdminRole[] = ["super_admin", "chief_admin", "admin"];

export async function requireRole(expectedRole: Role) {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    redirect("/login");
  }

  const user = await getUserFromToken(accessToken);

  if (!user) {
    redirect("/login");
  }

  const profile = await getProfile(accessToken, user.id);

  if (profile?.status === "banned") {
    redirect("/login?restricted=1");
  }

  if (!profile || profile.role !== expectedRole) {
    redirect(profile ? roleRedirects[profile.role] : "/login");
  }

  return profile;
}

export async function requireAdminRole() {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    redirect("/login");
  }

  const user = await getUserFromToken(accessToken);

  if (!user) {
    redirect("/login");
  }

  const profile = await getProfile(accessToken, user.id);

  if (!profile) {
    redirect("/login");
  }

  if (profile.status === "banned") {
    redirect("/login?restricted=1");
  }

  if (!adminRoles.includes(profile.role as AdminRole)) {
    redirect("/");
  }

  if (profile.admin_status === "inactive") {
    redirect("/misbar-gate?inactive=1");
  }

  await touchAdminSeen(accessToken, user.id);

  return profile;
}
