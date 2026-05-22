import type { AdminRole, Role } from "@/lib/auth/types";

export type ReviewStatus = "قيد المراجعة" | "منشورة" | "مرفوضة" | "بحاجة لتعديل";
export type UserStatus = "active" | "inactive" | "banned";
export type ReportStatus = "open" | "under_review" | "resolved" | "dismissed";

export type AdminReviewItem = {
  id: string;
  title: string;
  ownerName: string;
  college: string;
  field: string;
  description: string;
  status: ReviewStatus;
  submittedAt: string;
  internalNote?: string;
  decisionReason?: string;
  requestedEditReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  moderatorRecommendation?: "approve" | "reject" | "request_edit";
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  college: string;
  status: UserStatus;
  warningsCount: number;
  createdAt: string;
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
  role: AdminRole;
  createdAt: string;
};

export type AdminActivityLog = {
  id: string;
  adminUserId: string;
  adminEmail: string;
  adminRole: AdminRole;
  actionType: string;
  targetType: string;
  targetId: string;
  targetTitleOrEmail: string;
  reason?: string;
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
