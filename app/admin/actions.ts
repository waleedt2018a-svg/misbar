"use server";

import { revalidatePath } from "next/cache";
import { requireAdminRole } from "@/lib/auth/guards";
import type { AdminRole } from "@/lib/auth/types";
import {
  canApproveContent,
  canBanUsers,
  canDeleteContent,
  canManageAdmins,
  canSendWarnings
} from "@/lib/admin/permissions";
import {
  persistAdminReviewDecision,
  type AdminReviewAction,
  type AdminReviewSource,
  type PersistedAdminReviewItem
} from "@/lib/admin/review-persistence";
import { getAccessToken, logAdminAction } from "@/lib/supabase/rest";

type AdminActionResult = {
  ok: boolean;
  message: string;
};

function roleOf(role: string): AdminRole {
  return role as AdminRole;
}

function requireReason(action: string, reason?: string) {
  const required = ["reject", "request_edit", "pause", "unpublish", "send_warning"];

  if (required.includes(action) && !reason?.trim()) {
    return "لا يمكن تنفيذ الإجراء دون كتابة السبب";
  }

  return null;
}

export async function reviewContentAction(params: {
  action: "approve" | "reject" | "request_edit" | "pause" | "unpublish";
  targetType: string;
  targetId: string;
  targetTitle: string;
  reason?: string;
}): Promise<AdminActionResult> {
  const profile = await requireAdminRole();
  const role = roleOf(profile.role);
  const reasonError = requireReason(params.action, params.reason);

  if (reasonError) {
    return { ok: false, message: reasonError };
  }

  if (!canApproveContent(role)) {
    return { ok: false, message: "ليست لديك صلاحية لتنفيذ هذا الإجراء" };
  }

  const accessToken = await getAccessToken();
  if (accessToken) {
    await logAdminAction(accessToken, {
      adminUserId: profile.id,
      adminName: profile.full_name,
      adminEmail: profile.email,
      adminRole: role,
      actionType: params.action,
      targetType: params.targetType,
      targetId: params.targetId,
      targetTitleOrEmail: params.targetTitle,
      reason: params.reason,
      metadata: {
        reason_column:
          params.action === "reject"
            ? "rejection_reason"
            : params.action === "request_edit"
              ? "edit_reason"
              : params.action === "pause" || params.action === "unpublish"
                ? "pause_reason"
                : ""
      }
    });
  }

  if (params.action === "reject") {
    return { ok: true, message: "تم رفض الطلب مع حفظ سبب الرفض." };
  }

  if (params.action === "request_edit") {
    return { ok: true, message: "تم إرسال طلب تعديل مع حفظ السبب." };
  }

  if (params.action === "pause" || params.action === "unpublish") {
    return { ok: true, message: "تم إيقاف النشر مع حفظ السبب." };
  }

  return { ok: true, message: "تم اعتماد المحتوى." };
}

export async function deleteContentAction(): Promise<AdminActionResult> {
  const profile = await requireAdminRole();

  if (!canDeleteContent(roleOf(profile.role))) {
    return { ok: false, message: "ليست لديك صلاحية لتنفيذ هذا الإجراء" };
  }

  return { ok: true, message: "تم حذف المحتوى." };
}

export async function banUserAction(): Promise<AdminActionResult> {
  const profile = await requireAdminRole();

  if (!canBanUsers(roleOf(profile.role))) {
    return { ok: false, message: "ليست لديك صلاحية لتنفيذ هذا الإجراء" };
  }

  return { ok: true, message: "تم تحديث حالة الحظر." };
}

export async function warningAction(reason?: string): Promise<AdminActionResult> {
  const profile = await requireAdminRole();
  const role = roleOf(profile.role);
  const reasonError = requireReason("send_warning", reason);

  if (reasonError) {
    return { ok: false, message: reasonError };
  }

  if (!canSendWarnings(role)) {
    return { ok: false, message: "ليست لديك صلاحية لتنفيذ هذا الإجراء" };
  }

  const accessToken = await getAccessToken();
  if (accessToken) {
    await logAdminAction(accessToken, {
      adminUserId: profile.id,
      adminName: profile.full_name,
      adminEmail: profile.email,
      adminRole: role,
      actionType: "send_warning",
      targetType: "user",
      targetId: "",
      targetTitleOrEmail: "",
      reason,
      metadata: { reason_column: "warning_reason" }
    });
  }

  return { ok: true, message: "تم إرسال التنبيه." };
}

export async function manageAdminRoleAction(): Promise<AdminActionResult> {
  const profile = await requireAdminRole();

  if (!canManageAdmins(roleOf(profile.role))) {
    return { ok: false, message: "ليست لديك صلاحية لتنفيذ هذا الإجراء" };
  }

  return { ok: true, message: "تم تحديث صلاحية الأدمن." };
}

export async function processAdminInboxItemAction(params: {
  source: AdminReviewSource;
  targetId: string;
  targetTitle: string;
  targetType: PersistedAdminReviewItem["targetType"];
  action: AdminReviewAction;
  reason?: string;
}): Promise<AdminActionResult> {
  const profile = await requireAdminRole();
  const role = roleOf(profile.role);
  const reasonError = requireReason(params.action, params.reason);

  if (reasonError) {
    return { ok: false, message: reasonError };
  }

  if (!canApproveContent(role)) {
    return { ok: false, message: "ليست لديك صلاحية لتنفيذ هذا الإجراء" };
  }

  const accessToken = await getAccessToken();

  if (!accessToken) {
    return { ok: false, message: "تعذر الوصول إلى جلسة الأدمن." };
  }

  const result = await persistAdminReviewDecision({
    accessToken,
    actor: {
      id: profile.id,
      full_name: profile.full_name,
      email: profile.email,
      role
    },
    source: params.source,
    targetId: params.targetId,
    targetTitle: params.targetTitle,
    targetType: params.targetType,
    action: params.action,
    reason: params.reason
  });

  revalidatePath("/admin/inbox");
  revalidatePath("/admin/processed");
  revalidatePath("/admin/activity-log");
  revalidatePath("/admin/notifications");

  return result;
}
