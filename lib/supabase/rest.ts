import { cookies } from "next/headers";
import type { AdminRole, Profile } from "@/lib/auth/types";

const ACCESS_COOKIE = "misbar-access-token";
const REFRESH_COOKIE = "misbar-refresh-token";

type SupabaseUser = {
  id: string;
  email?: string;
  app_metadata?: {
    role?: string;
  };
  user_metadata?: {
    full_name?: string;
    role?: string;
  };
};

type AuthResponse = {
  access_token?: string;
  refresh_token?: string;
  user?: SupabaseUser;
  error?: string;
  error_description?: string;
  msg?: string;
  message?: string;
};

type ProfileInsert = Omit<Profile, "created_at">;
type AdminProfileInsert = {
  id: string;
  email: string;
  role: AdminRole;
  full_name?: string;
  phone_number?: string;
  gender?: string;
  college?: string;
};
type AdminLogPayload = {
  adminUserId: string;
  adminName: string;
  adminEmail: string;
  adminRole: string;
  actionType: string;
  targetType: string;
  targetId: string;
  targetTitleOrEmail: string;
  reason?: string;
  restrictedToSuper?: boolean;
  metadata?: Record<string, string>;
};
type ProfilePatchResult = {
  ok: boolean;
  row: Partial<Profile> | null;
  error?: string;
};

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Service configuration is missing");
  }

  return { url, anonKey };
}

function getHeaders(token?: string) {
  const { anonKey } = getSupabaseConfig();

  return {
    apikey: anonKey,
    Authorization: `Bearer ${token ?? anonKey}`,
    "Content-Type": "application/json"
  };
}

function authMessage(response: AuthResponse) {
  return (
    response.error_description ??
    response.message ??
    response.msg ??
    response.error ??
    "حدث خطأ غير متوقع"
  );
}

function profileLookupUrl(userId: string) {
  const { url } = getSupabaseConfig();
  return `${url}/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}&select=*`;
}

async function lookupProfileById(accessToken: string, userId: string) {
  const response = await fetch(profileLookupUrl(userId), {
    headers: getHeaders(accessToken),
    cache: "no-store"
  });

  if (!response.ok) {
    return {
      ok: false,
      profile: null,
      error: await response.text().catch(() => "")
    };
  }

  const rows = (await response.json()) as Profile[];

  return {
    ok: true,
    profile: rows[0] ?? null,
    error: ""
  };
}

export async function signUpWithSupabase(params: {
  email: string;
  password: string;
  fullName: string;
  role: string;
}) {
  const { url } = getSupabaseConfig();
  const response = await fetch(`${url}/auth/v1/signup`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      email: params.email,
      password: params.password,
      data: {
        full_name: params.fullName,
        role: params.role
      }
    }),
    cache: "no-store"
  });
  const body = (await response.json()) as AuthResponse;

  if (!response.ok) {
    return { data: null, error: authMessage(body) };
  }

  return { data: body, error: null };
}

export async function signInWithSupabase(email: string, password: string) {
  const { url } = getSupabaseConfig();
  const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
    cache: "no-store"
  });
  const body = (await response.json()) as AuthResponse;

  if (!response.ok) {
    return { data: null, error: authMessage(body) };
  }

  return { data: body, error: null };
}

export async function sendPasswordResetEmail(email: string) {
  const { url } = getSupabaseConfig();
  const response = await fetch(`${url}/auth/v1/recover`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ email }),
    cache: "no-store"
  });
  const body = (await response.json().catch(() => ({}))) as AuthResponse;

  if (!response.ok) {
    return { error: authMessage(body) };
  }

  return { error: null };
}

export async function getUserFromToken(accessToken: string) {
  const { url } = getSupabaseConfig();
  const response = await fetch(`${url}/auth/v1/user`, {
    headers: getHeaders(accessToken),
    cache: "no-store"
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as SupabaseUser;
}

export async function insertProfile(accessToken: string, profile: ProfileInsert) {
  const { url } = getSupabaseConfig();

  for (const column of ["id"] as const) {
    const response = await fetch(`${url}/rest/v1/profiles`, {
      method: "POST",
      headers: {
        ...getHeaders(accessToken),
        Prefer: "return=minimal"
      },
      body: JSON.stringify(profile),
      cache: "no-store"
    });

    if (response.ok) {
      console.log("[Misbar auth debug]", {
        authenticatedUserId: profile.id,
        profileLookupColumn: column,
        profileFound: true,
        action: "insertProfile"
      });

      return { error: null, column };
    }

    const body = await response.json().catch(() => null);
    console.log("[Misbar auth debug]", {
      authenticatedUserId: profile.id,
      profileLookupColumn: column,
      profileFound: false,
      action: "insertProfile"
    });

    return {
      error: body?.message ?? "تعذر حفظ ملف المستخدم",
      column
    };
  }

  console.log("[Misbar auth debug]", {
    authenticatedUserId: profile.id,
    profileLookupColumn: "id",
    profileFound: false,
    action: "insertProfile"
  });

  return { error: "تعذر حفظ ملف المستخدم" };
}

export async function getProfile(accessToken: string, userId: string) {
  const idLookup = await lookupProfileById(accessToken, userId);

  if (idLookup.ok && idLookup.profile) {
    console.log("[Misbar auth debug]", {
      authenticatedUserId: userId,
      profileLookupColumn: "id",
      profileFound: true
    });

    return idLookup.profile;
  }

  console.log("[Misbar auth debug]", {
    authenticatedUserId: userId,
    profileLookupColumn: "id",
    profileFound: false,
    idLookupOk: idLookup.ok,
    error: idLookup.error
  });

  return null;
}

function isAdminRole(role?: string): role is AdminRole {
  return role === "admin" || role === "chief_admin" || role === "super_admin";
}

export async function ensureAdminProfile(
  accessToken: string,
  user: SupabaseUser,
  fallbackRole?: string
) {
  const existingProfile = await getProfile(accessToken, user.id);

  console.log("[Misbar admin profile]", {
    authenticatedUserId: user.id,
    profileFound: Boolean(existingProfile),
    action: existingProfile ? "found" : "create_if_missing"
  });

  if (existingProfile) {
    return existingProfile;
  }

  const role = isAdminRole(user.user_metadata?.role)
    ? user.user_metadata.role
    : isAdminRole(user.app_metadata?.role)
      ? user.app_metadata.role
    : isAdminRole(fallbackRole)
      ? fallbackRole
      : null;

  if (!role) {
    console.error("[Misbar admin profile] missing admin role for profile creation", {
      authenticatedUserId: user.id,
      email: user.email
    });

    return null;
  }

  const payload: AdminProfileInsert = {
    id: user.id,
    email: user.email ?? "",
    role,
    full_name: user.user_metadata?.full_name ?? user.email ?? "Admin",
    phone_number: "",
    gender: "ذكر",
    college: "Misbar Administration"
  };
  const { url } = getSupabaseConfig();
  const response = await fetch(`${url}/rest/v1/profiles`, {
    method: "POST",
    headers: {
      ...getHeaders(accessToken),
      Prefer: "return=representation"
    },
    body: JSON.stringify(payload),
    cache: "no-store"
  });

  if (!response.ok) {
    console.error("[Misbar admin profile] profile creation failed", {
      authenticatedUserId: user.id,
      email: user.email,
      role,
      error: await response.text().catch(() => "")
    });

    return null;
  }

  const rows = (await response.json().catch(() => [])) as Profile[];
  const createdProfile = rows[0] ?? null;

  console.log("[Misbar admin profile] profile created", {
    authenticatedUserId: user.id,
    profileCreated: Boolean(createdProfile),
    role
  });

  return createdProfile;
}

async function patchProfileById(
  accessToken: string,
  userId: string,
  payload: Record<string, string | null>
): Promise<ProfilePatchResult> {
  const { url } = getSupabaseConfig();
  const response = await fetch(`${url}/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}&select=id,last_admin_login_at,last_admin_seen_at,last_admin_action_at`, {
    method: "PATCH",
    headers: {
      ...getHeaders(accessToken),
      Prefer: "return=representation"
    },
    body: JSON.stringify(payload),
    cache: "no-store"
  });

  if (!response.ok) {
    return {
      ok: false,
      row: null,
      error: await response.text().catch(() => "")
    };
  }

  const rows = (await response.json().catch(() => [])) as Partial<Profile>[];
  const row = rows[0] ?? null;

  return {
    ok: Boolean(row),
    row,
    error: row ? undefined : "No matching profile row was updated"
  };
}

export async function updateProfileFields(
  accessToken: string,
  userId: string,
  payload: Record<string, string | null>
) {
  return patchProfileById(accessToken, userId, payload);
}

export async function touchAdminLogin(accessToken: string, userId: string) {
  const now = new Date().toISOString();
  const updateResult = await updateProfileFields(accessToken, userId, {
    last_admin_login_at: now,
    last_admin_seen_at: now
  });

  if (!updateResult.ok) {
    console.error("[Misbar admin login] failed to update last_admin_login_at", {
      authenticatedUserId: userId,
      attemptedLookupColumn: "id",
      error: updateResult.error
    });

    return {
      ok: false,
      updatedAt: now,
      persistedAt: null,
      error: updateResult.error ?? "Profile row was not updated"
    };
  }

  const confirmedProfile = await getProfile(accessToken, userId);
  const persistedAt = confirmedProfile?.last_admin_login_at ?? null;
  const persistedTime = persistedAt ? new Date(persistedAt).getTime() : 0;
  const requestedTime = new Date(now).getTime();
  const confirmed = Boolean(persistedAt && Math.abs(persistedTime - requestedTime) < 5000);

  if (confirmed) {
    console.log("[Misbar admin login] last_admin_login_at saved", {
      authenticatedUserId: userId,
      profileLookupColumn: "id",
      updatedAt: now,
      persistedAt
    });
  } else {
    console.error("[Misbar admin login] last_admin_login_at update was not confirmed", {
      authenticatedUserId: userId,
      profileLookupColumn: "id",
      updatedAt: now,
      persistedAt
    });
  }

  return {
    ok: confirmed,
    updatedAt: now,
    persistedAt,
    error: confirmed ? undefined : "Profile read-back did not confirm last_admin_login_at"
  };
}

export async function touchAdminSeen(accessToken: string, userId: string) {
  await updateProfileFields(accessToken, userId, {
    last_admin_seen_at: new Date().toISOString()
  });
}

export async function logAdminAction(accessToken: string, payload: AdminLogPayload) {
  const { url } = getSupabaseConfig();
  const now = new Date().toISOString();

  await fetch(`${url}/rest/v1/admin_activity_logs`, {
    method: "POST",
    headers: {
      ...getHeaders(accessToken),
      Prefer: "return=minimal"
    },
    body: JSON.stringify({
      admin_user_id: payload.adminUserId,
      admin_name: payload.adminName,
      admin_email: payload.adminEmail,
      admin_role: payload.adminRole,
      action_type: payload.actionType,
      target_type: payload.targetType,
      target_id: payload.targetId,
      target_title_or_email: payload.targetTitleOrEmail,
      reason: payload.reason ?? "",
      restricted_to_super: payload.restrictedToSuper ?? false,
      metadata: payload.metadata ?? {},
      created_at: now
    }),
    cache: "no-store"
  }).catch(() => null);

  await updateProfileFields(accessToken, payload.adminUserId, {
    last_admin_action_at: now,
    last_admin_seen_at: now
  });
}

export async function setAuthCookies(accessToken: string, refreshToken?: string) {
  const cookieStore = await cookies();
  const secure = process.env.NODE_ENV === "production";

  cookieStore.set(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 60 * 60
  });

  if (refreshToken) {
    cookieStore.set(REFRESH_COOKIE, refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge: 60 * 60 * 24 * 30
    });
  }
}

export async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_COOKIE)?.value ?? null;
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();

  cookieStore.delete(ACCESS_COOKIE);
  cookieStore.delete(REFRESH_COOKIE);
}
