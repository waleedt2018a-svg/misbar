import { cookies } from "next/headers";
import type { Profile } from "@/lib/auth/types";

const ACCESS_COOKIE = "misbar-access-token";
const REFRESH_COOKIE = "misbar-refresh-token";

type SupabaseUser = {
  id: string;
  email?: string;
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

type ProfileLookupColumn = "id" | "user_id";
type ProfileInsert = Omit<Profile, "created_at">;

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Supabase environment variables are missing");
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

function profileLookupUrl(column: ProfileLookupColumn, userId: string) {
  const { url } = getSupabaseConfig();
  return `${url}/rest/v1/profiles?${column}=eq.${encodeURIComponent(userId)}&select=*`;
}

function profileInsertPayload(profile: ProfileInsert, column: ProfileLookupColumn) {
  const { id, ...profileFields } = profile;

  if (column === "id") {
    return { id, ...profileFields };
  }

  return { user_id: id, ...profileFields };
}

async function lookupProfileByColumn(
  accessToken: string,
  userId: string,
  column: ProfileLookupColumn
) {
  const response = await fetch(profileLookupUrl(column, userId), {
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

function shouldRetryProfileInsertWithUserId(message: string) {
  const normalizedMessage = message.toLowerCase();

  return (
    normalizedMessage.includes("user_id") ||
    normalizedMessage.includes("'id' column") ||
    normalizedMessage.includes("schema cache") ||
    normalizedMessage.includes("null value")
  );
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

  for (const column of ["id", "user_id"] as const) {
    const response = await fetch(`${url}/rest/v1/profiles`, {
      method: "POST",
      headers: {
        ...getHeaders(accessToken),
        Prefer: "return=minimal"
      },
      body: JSON.stringify(profileInsertPayload(profile, column)),
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
    const message = String(body?.message ?? "");

    if (column === "id" && shouldRetryProfileInsertWithUserId(message)) {
      continue;
    }

    console.log("[Misbar auth debug]", {
      authenticatedUserId: profile.id,
      profileLookupColumn: column,
      profileFound: false,
      action: "insertProfile"
    });

    return {
      error: body?.message ?? "تعذر حفظ ملف المستخدم في قاعدة البيانات",
      column
    };
  }

  console.log("[Misbar auth debug]", {
    authenticatedUserId: profile.id,
    profileLookupColumn: "user_id",
    profileFound: false,
    action: "insertProfile"
  });

  return { error: "تعذر حفظ ملف المستخدم في قاعدة البيانات", column: "user_id" as const };
}

export async function getProfile(accessToken: string, userId: string) {
  const idLookup = await lookupProfileByColumn(accessToken, userId, "id");

  if (idLookup.ok && idLookup.profile) {
    console.log("[Misbar auth debug]", {
      authenticatedUserId: userId,
      profileLookupColumn: "id",
      profileFound: true
    });

    return idLookup.profile;
  }

  const userIdLookup = await lookupProfileByColumn(accessToken, userId, "user_id");

  if (userIdLookup.ok && userIdLookup.profile) {
    console.log("[Misbar auth debug]", {
      authenticatedUserId: userId,
      profileLookupColumn: "user_id",
      profileFound: true
    });

    return userIdLookup.profile;
  }

  console.log("[Misbar auth debug]", {
    authenticatedUserId: userId,
    profileLookupColumn: userIdLookup.ok ? "user_id" : "id",
    profileFound: false,
    idLookupOk: idLookup.ok,
    userIdLookupOk: userIdLookup.ok
  });

  return null;
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
