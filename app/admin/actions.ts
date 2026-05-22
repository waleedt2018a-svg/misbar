"use server";

import { requireAdminRole } from "@/lib/auth/guards";
import type { AdminRole } from "@/lib/auth/types";
import {
  canApproveContent,
  canBanUsers,
  canDeleteContent,
  canManageAdmins,
  canSendWarnings
} from "@/lib/admin/permissions";

type AdminActionResult = {
  ok: boolean;
  message: string;
};

function roleOf(role: string): AdminRole {
  return role as AdminRole;
}

export async function reviewContentAction(params: {
  action: "approve" | "reject" | "request_edit" | "recommend_approve" | "recommend_reject" | "recommend_edit";
  targetType: string;
  targetId: string;
  targetTitle: string;
  reason?: string;
}): Promise<AdminActionResult> {
  const profile = await requireAdminRole();
  const role = roleOf(profile.role);
  const needsReason = params.action === "reject" || params.action === "request_edit";

  if (needsReason && !params.reason?.trim()) {
    return { ok: false, message: "لا يمكن تنفيذ هذا الإجراء دون كتابة السبب." };
  }

  if (params.action.startsWith("recommend_")) {
    return { ok: true, message: "تم حفظ توصية المشرف." };
  }

  if (!canApproveContent(role)) {
    return { ok: false, message: "لا تملك صلاحية اعتماد أو رفض المحتوى." };
  }

  if (params.action === "reject") {
    return { ok: true, message: "تم رفض الطلب مع توضيح السبب." };
  }

  if (params.action === "request_edit") {
    return { ok: true, message: "تم إرسال طلب تعديل لصاحب المحتوى." };
  }

  return { ok: true, message: "تم اعتماد المحتوى." };
}

export async function deleteContentAction(): Promise<AdminActionResult> {
  const profile = await requireAdminRole();

  if (!canDeleteContent(roleOf(profile.role))) {
    return { ok: false, message: "لا تملك صلاحية حذف المحتوى." };
  }

  return { ok: true, message: "تم حذف المحتوى." };
}

export async function banUserAction(): Promise<AdminActionResult> {
  const profile = await requireAdminRole();

  if (!canBanUsers(roleOf(profile.role))) {
    return { ok: false, message: "لا تملك صلاحية حظر المستخدمين." };
  }

  return { ok: true, message: "تم تحديث حالة الحظر." };
}

export async function warningAction(): Promise<AdminActionResult> {
  const profile = await requireAdminRole();

  if (!canSendWarnings(roleOf(profile.role))) {
    return { ok: false, message: "لا تملك صلاحية إرسال التنبيهات." };
  }

  return { ok: true, message: "تم إرسال التنبيه." };
}

export async function manageAdminRoleAction(): Promise<AdminActionResult> {
  const profile = await requireAdminRole();

  if (!canManageAdmins(roleOf(profile.role))) {
    return { ok: false, message: "لا تملك صلاحية إدارة أدوار الأدمنز." };
  }

  return { ok: true, message: "تم تحديث صلاحية الأدمن." };
}
