import type { AdminRole } from "@/lib/auth/types";

export type AdminReviewSource = "student_research_ideas" | "research_opportunities" | "reports";
export type AdminReviewStatus = "pending" | "approved" | "rejected" | "needs_revision";
export type AdminReviewAction = "approve" | "reject" | "request_edit";

export type PersistedAdminReviewItem = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  status: AdminReviewStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewReason: string | null;
  source: AdminReviewSource;
  targetType: "idea" | "opportunity" | "report";
};

type RawReviewRow = {
  id: string;
  title?: string | null;
  content?: string | null;
  description?: string | null;
  research_problem?: string | null;
  details?: string | null;
  reason?: string | null;
  created_at?: string | null;
  status?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  review_reason?: string | null;
};

type AdminActor = {
  id: string;
  full_name: string;
  email: string;
  role: AdminRole;
};

const sourceTargets: Record<AdminReviewSource, PersistedAdminReviewItem["targetType"]> = {
  student_research_ideas: "idea",
  research_opportunities: "opportunity",
  reports: "report"
};

const actionStatus: Record<AdminReviewAction, AdminReviewStatus> = {
  approve: "approved",
  reject: "rejected",
  request_edit: "needs_revision"
};

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Supabase environment variables are missing");
  }

  return { url, anonKey };
}

function getHeaders(token: string) {
  const { anonKey } = getSupabaseConfig();

  return {
    apikey: anonKey,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };
}

function mapRow(row: RawReviewRow, source: AdminReviewSource): PersistedAdminReviewItem {
  const title = row.title ?? row.reason ?? "عنصر إداري";
  const content = row.content ?? row.description ?? row.research_problem ?? row.details ?? "";

  return {
    id: row.id,
    title,
    content,
    createdAt: row.created_at ?? "",
    status: (row.status ?? "pending") as AdminReviewStatus,
    reviewedBy: row.reviewed_by ?? null,
    reviewedAt: row.reviewed_at ?? null,
    reviewReason: row.review_reason ?? null,
    source,
    targetType: sourceTargets[source]
  };
}

async function fetchSource(
  accessToken: string,
  source: AdminReviewSource,
  processed: boolean
) {
  const { url } = getSupabaseConfig();
  const statusFilter = processed ? "status=neq.pending" : "status=eq.pending";
  const response = await fetch(
    `${url}/rest/v1/${source}?select=*&${statusFilter}&order=created_at.desc`,
    {
      headers: getHeaders(accessToken),
      cache: "no-store"
    }
  );

  if (!response.ok) {
    return [];
  }

  const rows = (await response.json()) as RawReviewRow[];
  return rows.map((row) => mapRow(row, source));
}

export async function getAdminInboxItems(accessToken: string) {
  const results = await Promise.all([
    fetchSource(accessToken, "student_research_ideas", false),
    fetchSource(accessToken, "research_opportunities", false),
    fetchSource(accessToken, "reports", false)
  ]);

  return results.flat();
}

export async function getAdminProcessedItems(accessToken: string) {
  const results = await Promise.all([
    fetchSource(accessToken, "student_research_ideas", true),
    fetchSource(accessToken, "research_opportunities", true),
    fetchSource(accessToken, "reports", true)
  ]);

  return results.flat();
}

export async function persistAdminReviewDecision(params: {
  accessToken: string;
  actor: AdminActor;
  source: AdminReviewSource;
  targetId: string;
  targetTitle: string;
  targetType: PersistedAdminReviewItem["targetType"];
  action: AdminReviewAction;
  reason?: string;
}) {
  const { url } = getSupabaseConfig();
  const status = actionStatus[params.action];
  const reviewedAt = new Date().toISOString();
  const reason = params.action === "approve" ? null : params.reason?.trim() ?? "";

  const updateResponse = await fetch(`${url}/rest/v1/${params.source}?id=eq.${encodeURIComponent(params.targetId)}`, {
    method: "PATCH",
    headers: {
      ...getHeaders(params.accessToken),
      Prefer: "return=minimal"
    },
    body: JSON.stringify({
      status,
      reviewed_by: params.actor.email,
      reviewed_at: reviewedAt,
      review_reason: reason
    }),
    cache: "no-store"
  });

  if (!updateResponse.ok) {
    return { ok: false, message: "تعذر تحديث حالة العنصر في قاعدة البيانات." };
  }

  await fetch(`${url}/rest/v1/admin_activity_logs`, {
    method: "POST",
    headers: {
      ...getHeaders(params.accessToken),
      Prefer: "return=minimal"
    },
    body: JSON.stringify({
      admin_user_id: params.actor.id,
      admin_name: params.actor.full_name,
      admin_email: params.actor.email,
      admin_role: params.actor.role,
      action_type: params.action,
      target_type: params.targetType,
      target_id: params.targetId,
      target_title_or_email: params.targetTitle,
      reason: reason ?? "",
      metadata: { status, source: params.source },
      created_at: reviewedAt
    }),
    cache: "no-store"
  }).catch(() => null);

  return { ok: true, message: "تم تحديث القرار وحفظه لجميع الأدمنز." };
}
