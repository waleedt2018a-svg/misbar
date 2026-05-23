import type { AdminRole } from "@/lib/auth/types";

export function canManageEverything(role: AdminRole) {
  return role === "super_admin";
}

export function canApproveContent(role: AdminRole) {
  return role === "super_admin" || role === "chief_admin" || role === "admin";
}

export function canDeleteContent(role: AdminRole) {
  return role === "super_admin";
}

export function canBanUsers(role: AdminRole) {
  return role === "super_admin";
}

export function canManageAdmins(role: AdminRole) {
  return role === "super_admin" || role === "chief_admin";
}

export function canControlAdminStatus(currentRole: AdminRole, targetRole: AdminRole) {
  if (currentRole === "super_admin") {
    return targetRole !== "super_admin";
  }

  if (currentRole === "chief_admin") {
    return targetRole === "admin";
  }

  return false;
}

export function canChangeAdminRole(role: AdminRole) {
  return role === "super_admin";
}

export function canViewAuditLogs(role: AdminRole) {
  return role === "super_admin" || role === "chief_admin" || role === "admin";
}

export function canSendWarnings(role: AdminRole) {
  return role === "super_admin" || role === "chief_admin" || role === "admin";
}

export function roleLabel(role: AdminRole) {
  const labels: Record<AdminRole, string> = {
    super_admin: "سوبر أدمن",
    chief_admin: "رئيس الأدمنز",
    admin: "أدمن"
  };

  return labels[role];
}
