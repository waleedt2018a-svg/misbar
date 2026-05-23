import type { AdminActivityLog, AdminReport, AdminWarning, ManagedAdmin } from "@/lib/admin/types";
import type { AdminRole, Role } from "@/lib/auth/types";
import type { PersistedAdminReviewItem } from "@/lib/admin/review-persistence";

export type AdminUserRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  college: string;
  major: string;
  status: string;
  adminStatus: string;
  createdAt: string;
  lastActivity: string;
  lastAdminLoginAt: string | null;
  lastAdminSeenAt: string | null;
  lastAdminActionAt: string | null;
};

export type AdminAnalytics = {
  studentIdeas: number;
  facultyOpportunities: number;
  publishedContent: number;
  registeredBeneficiaries: number;
  activeStudents: number;
  activeFaculty: number;
  admins: number;
  pendingReview: number;
  processedToday: number;
  openReports: number;
  usersByRole: Record<string, number>;
  contentByStatus: Record<string, number>;
};

export type AdminNotification = AdminActivityLog & {
  isRead: boolean;
};

type ProfileRow = {
  id?: string;
  user_id?: string;
  full_name?: string | null;
  email?: string | null;
  phone_number?: string | null;
  role?: Role | null;
  college?: string | null;
  major?: string | null;
  department?: string | null;
  status?: string | null;
  admin_status?: string | null;
  created_at?: string | null;
  last_admin_login_at?: string | null;
  last_admin_seen_at?: string | null;
  last_admin_action_at?: string | null;
};

type ActivityLogRow = {
  id: string;
  admin_user_id?: string | null;
  admin_name?: string | null;
  admin_email?: string | null;
  admin_role?: AdminRole | null;
  action_type?: string | null;
  target_type?: AdminActivityLog["targetType"] | null;
  target_id?: string | null;
  target_title_or_email?: string | null;
  reason?: string | null;
  restricted_to_super?: boolean | null;
  metadata?: Record<string, string> | null;
  created_at?: string | null;
};

type ReportRow = {
  id: string;
  title?: string | null;
  reason?: string | null;
  content?: string | null;
  details?: string | null;
  status?: AdminReport["status"] | string | null;
  created_at?: string | null;
  reporter_id?: string | null;
  reported_user_id?: string | null;
  reviewed_by?: string | null;
};

type WarningRow = {
  id: string;
  user_id?: string | null;
  user_name?: string | null;
  reason?: string | null;
  warning_reason?: string | null;
  details?: string | null;
  issued_by?: string | null;
  created_at?: string | null;
};

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Supabase environment variables are missing");
  }

  return { url, anonKey };
}

function headers(accessToken: string) {
  const { anonKey } = getSupabaseConfig();
  return {
    apikey: anonKey,
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json"
  };
}

async function getRows<T>(accessToken: string, path: string): Promise<T[]> {
  const { url } = getSupabaseConfig();

  try {
    const response = await fetch(`${url}/rest/v1/${path}`, {
      headers: headers(accessToken),
      cache: "no-store"
    });

    if (!response.ok) return [];
    return (await response.json()) as T[];
  } catch {
    return [];
  }
}

async function postRows(accessToken: string, table: string, rows: Array<Record<string, string>>) {
  const { url } = getSupabaseConfig();

  try {
    const response = await fetch(`${url}/rest/v1/${table}`, {
      method: "POST",
      headers: {
        ...headers(accessToken),
        Prefer: "resolution=ignore-duplicates,return=minimal"
      },
      body: JSON.stringify(rows),
      cache: "no-store"
    });

    return response.ok;
  } catch {
    return false;
  }
}

async function getCount(accessToken: string, table: string, filter = "") {
  const { url } = getSupabaseConfig();

  try {
    const response = await fetch(`${url}/rest/v1/${table}?select=id${filter}`, {
      method: "HEAD",
      headers: {
        ...headers(accessToken),
        Prefer: "count=exact"
      },
      cache: "no-store"
    });

    if (!response.ok) return 0;
    const range = response.headers.get("content-range");
    return Number(range?.split("/")?.[1] ?? 0) || 0;
  } catch {
    return 0;
  }
}

function mapUser(row: ProfileRow): AdminUserRecord {
  const role = row.role ?? "student";
  const lastActivity = row.last_admin_action_at ?? row.last_admin_seen_at ?? row.created_at ?? "";

  return {
    id: row.id ?? row.user_id ?? "",
    name: row.full_name ?? "مستخدم",
    email: row.email ?? "",
    phone: row.phone_number ?? "",
    role,
    college: row.college ?? "",
    major: row.major ?? row.department ?? "",
    status: row.status ?? "active",
    adminStatus: row.admin_status ?? "active",
    createdAt: row.created_at ?? "",
    lastActivity,
    lastAdminLoginAt: row.last_admin_login_at ?? null,
    lastAdminSeenAt: row.last_admin_seen_at ?? null,
    lastAdminActionAt: row.last_admin_action_at ?? null
  };
}

export async function getAdminUsersFromSupabase(accessToken: string) {
  const rows = await getRows<ProfileRow>(accessToken, "profiles?select=*&order=created_at.desc");
  return rows.map(mapUser).filter((user) => user.id);
}

export async function getManagedAdminsFromSupabase(accessToken: string): Promise<ManagedAdmin[]> {
  const users = await getAdminUsersFromSupabase(accessToken);
  return users
    .filter((user) => ["super_admin", "chief_admin", "admin"].includes(user.role))
    .map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role as AdminRole,
      adminStatus: user.adminStatus === "inactive" ? "inactive" : "active",
      createdAt: user.createdAt,
      lastAdminLoginAt: user.lastAdminLoginAt,
      lastAdminSeenAt: user.lastAdminSeenAt,
      lastAdminActionAt: user.lastAdminActionAt
    }));
}

export async function getAdminActivityLogsFromSupabase(accessToken: string): Promise<AdminActivityLog[]> {
  const rows = await getRows<ActivityLogRow>(accessToken, "admin_activity_logs?select=*&order=created_at.desc");
  return rows.map((row) => ({
    id: row.id,
    adminUserId: row.admin_user_id ?? "",
    adminName: row.admin_name ?? "",
    adminEmail: row.admin_email ?? "",
    adminRole: row.admin_role ?? "admin",
    actionType: (row.action_type ?? "approve") as AdminActivityLog["actionType"],
    targetType: row.target_type ?? "user",
    targetId: row.target_id ?? "",
    targetTitleOrEmail: row.target_title_or_email ?? "",
    reason: row.reason ?? "",
    restrictedToSuper: row.restricted_to_super ?? false,
    metadata: row.metadata ?? {},
    createdAt: row.created_at ?? ""
  }));
}

function isSensitiveNotification(log: AdminActivityLog) {
  return ["reject", "request_edit", "pause", "unpublish", "send_warning", "toggle_admin_status"].includes(log.actionType);
}

export async function getAdminNotificationsFromSupabase(accessToken: string, adminUserId: string) {
  const logs = (await getAdminActivityLogsFromSupabase(accessToken)).filter(isSensitiveNotification);
  const reads = await getRows<{ notification_id?: string }>(
    accessToken,
    `admin_notification_reads?select=notification_id&admin_user_id=eq.${encodeURIComponent(adminUserId)}`
  );
  const readIds = new Set(reads.map((read) => read.notification_id).filter(Boolean));

  return logs.map((log) => ({
    ...log,
    isRead: readIds.has(log.id)
  })) satisfies AdminNotification[];
}

export async function getUnreadAdminNotificationCount(accessToken: string, adminUserId: string) {
  const notifications = await getAdminNotificationsFromSupabase(accessToken, adminUserId);
  return notifications.filter((notification) => !notification.isRead).length;
}

export async function markAdminNotificationsRead(accessToken: string, adminUserId: string, notificationIds: string[]) {
  const uniqueIds = Array.from(new Set(notificationIds)).filter(Boolean);

  if (!uniqueIds.length) return true;

  return postRows(
    accessToken,
    "admin_notification_reads",
    uniqueIds.map((notificationId) => ({
      admin_user_id: adminUserId,
      notification_id: notificationId
    }))
  );
}

export async function getReportsFromSupabase(accessToken: string): Promise<AdminReport[]> {
  const rows = await getRows<ReportRow>(accessToken, "reports?select=*&order=created_at.desc");
  return rows.map((row) => ({
    id: row.id,
    reporter: row.reporter_id ?? row.reviewed_by ?? "",
    reportedTarget: row.title ?? row.reason ?? "بلاغ",
    reason: row.reason ?? row.title ?? "بلاغ",
    details: row.details ?? row.content ?? "",
    status: (row.status ?? "open") as AdminReport["status"],
    createdAt: row.created_at ?? ""
  }));
}

export async function getWarningsFromSupabase(accessToken: string): Promise<AdminWarning[]> {
  const rows = await getRows<WarningRow>(accessToken, "admin_warnings?select=*&order=created_at.desc");
  return rows.map((row) => ({
    id: row.id,
    userId: row.user_id ?? "",
    userName: row.user_name ?? row.user_id ?? "",
    reason: row.warning_reason ?? row.reason ?? "",
    details: row.details ?? "",
    issuedBy: row.issued_by ?? "",
    createdAt: row.created_at ?? ""
  }));
}

export async function getReviewItemsByOwner(accessToken: string, userId: string, email: string) {
  const ideaRows = await getRows<any>(
    accessToken,
    `student_research_ideas?select=*&or=(owner_id.eq.${encodeURIComponent(userId)},reviewed_by.eq.${encodeURIComponent(email)})&order=created_at.desc`
  );
  const opportunityRows = await getRows<any>(
    accessToken,
    `research_opportunities?select=*&or=(owner_id.eq.${encodeURIComponent(userId)},faculty_id.eq.${encodeURIComponent(userId)},reviewed_by.eq.${encodeURIComponent(email)})&order=created_at.desc`
  );
  return { ideaRows, opportunityRows };
}

export async function getAdminAnalytics(accessToken: string, processedItems: PersistedAdminReviewItem[]) {
  const users = await getAdminUsersFromSupabase(accessToken);
  const admins = users.filter((user) => ["super_admin", "chief_admin", "admin"].includes(user.role));
  const today = new Date().toISOString().slice(0, 10);
  const studentIdeas = await getCount(accessToken, "student_research_ideas");
  const researchOpportunities = await getCount(accessToken, "research_opportunities");
  const publishedIdeas = await getCount(accessToken, "student_research_ideas", "&status=eq.approved");
  const publishedOpportunities = await getCount(accessToken, "research_opportunities", "&status=eq.approved");
  const pendingIdeas = await getCount(accessToken, "student_research_ideas", "&status=eq.pending");
  const pendingOpportunities = await getCount(accessToken, "research_opportunities", "&status=eq.pending");
  const pendingReports = await getCount(accessToken, "reports", "&status=eq.pending");
  const openReports = await getCount(accessToken, "reports", "&status=eq.pending");
  const contentStatuses = ["pending", "approved", "rejected", "needs_revision"];
  const contentByStatus: Record<string, number> = {};

  for (const status of contentStatuses) {
    contentByStatus[status] =
      (await getCount(accessToken, "student_research_ideas", `&status=eq.${status}`)) +
      (await getCount(accessToken, "research_opportunities", `&status=eq.${status}`)) +
      (await getCount(accessToken, "reports", `&status=eq.${status}`));
  }

  return {
    studentIdeas,
    facultyOpportunities: researchOpportunities,
    publishedContent: publishedIdeas + publishedOpportunities,
    registeredBeneficiaries: users.filter((user) => user.role === "student" || user.role === "faculty").length,
    activeStudents: users.filter((user) => user.role === "student" && user.status === "active").length,
    activeFaculty: users.filter((user) => user.role === "faculty" && user.status === "active").length,
    admins: admins.length,
    pendingReview: pendingIdeas + pendingOpportunities + pendingReports,
    processedToday: processedItems.filter((item) => item.reviewedAt?.startsWith(today)).length,
    openReports,
    usersByRole: users.reduce<Record<string, number>>((acc, user) => {
      acc[user.role] = (acc[user.role] ?? 0) + 1;
      return acc;
    }, {}),
    contentByStatus
  } satisfies AdminAnalytics;
}
