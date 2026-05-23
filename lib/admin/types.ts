import type { AdminRole, Role } from "@/lib/auth/types";

export type ReviewStatus = "قيد المراجعة" | "منشورة" | "مرفوضة" | "بحاجة لتعديل" | "متوقف نشرها";
export type UserStatus = "active" | "inactive" | "banned";
export type AdminStatus = "active" | "inactive";
export type ReportStatus = "pending" | "open" | "under_review" | "approved" | "rejected" | "needs_revision" | "resolved" | "dismissed";
export type AdminActionType =
  | "approve"
  | "reject"
  | "request_edit"
  | "pause"
  | "unpublish"
  | "send_warning"
  | "admin_login"
  | "toggle_admin_status";

export type AdminReviewItem = {
  id: string;
  title: string;
  ownerName: string;
  ownerEmail?: string;
  college: string;
  field: string;
  description: string;
  status: ReviewStatus;
  submittedAt: string;
  internalNote?: string;
  decisionReason?: string;
  rejectionReason?: string;
  requestedEditReason?: string;
  editReason?: string;
  pauseReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  college: string;
  major?: string | null;
  status: UserStatus;
  adminStatus?: AdminStatus;
  warningsCount: number;
  createdAt: string;
  lastAdminLoginAt?: string | null;
  lastAdminSeenAt?: string | null;
  lastAdminActionAt?: string | null;
};

export type AdminWarning = {
  id: string;
  userId: string;
  userName: string;
  reason: string;
  details: string;
  issuedBy: string;
  createdAt: string;
};

export type AdminReport = {
  id: string;
  reporter: string;
  reportedTarget: string;
  reason: string;
  details: string;
  status: ReportStatus;
  createdAt: string;
};

export type ManagedAdmin = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: AdminRole;
  adminStatus: AdminStatus;
  createdAt: string;
  lastAdminLoginAt?: string | null;
  lastAdminSeenAt?: string | null;
  lastAdminActionAt?: string | null;
};

export type AdminActivityLog = {
  id: string;
  adminUserId: string;
  adminName: string;
  adminEmail: string;
  adminRole: AdminRole;
  actionType: AdminActionType;
  targetType: "idea" | "opportunity" | "user" | "report" | "admin";
  targetId: string;
  targetTitleOrEmail: string;
  reason?: string;
  restrictedToSuper?: boolean;
  metadata: Record<string, string>;
  createdAt: string;
};

export type ControlCenterItem = {
  id: string;
  titleOrName: string;
  type: string;
  owner: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};
