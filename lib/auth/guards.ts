import { redirect } from "next/navigation";
import type { Role } from "@/lib/auth/types";
import { getAccessToken, getProfile, getUserFromToken } from "@/lib/supabase/rest";

const roleRedirects: Record<Role, string> = {
  student: "/student",
  faculty: "/faculty",
  admin: "/admin"
};

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

  if (!profile || profile.role !== expectedRole) {
    redirect(profile ? roleRedirects[profile.role] : "/login");
  }

  return profile;
}
