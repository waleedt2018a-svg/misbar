import type { AdminRole } from "@/lib/auth/types";

export function canManageEverything(role: AdminRole) {
  return role === "super_admin";
}

export function canApproveContent(role: AdminRole) {
  return role === "super_admin" || role === "admin";
}

export function canDeleteContent(role: AdminRole) {
  return role === "super_admin" || role === "admin";
}

export function canBanUsers(role: AdminRole) {
  return role === "super_admin" || role === "admin";
}

export function canManageAdmins(role: AdminRole) {
  return role === "super_admin";
}

export function canViewAuditLogs(role: AdminRole) {
  return role === "super_admin" || role === "admin";
}

export function canSendWarnings(role: AdminRole) {
  return role === "super_admin" || role === "admin" || role === "moderator";
}

export function roleLabel(role: AdminRole) {
  const labels: Record<AdminRole, string> = {
    super_admin: "سوبر أدمن",
    admin: "أدمن",
    moderator: "مشرف"
  };

  return labels[role];
}
