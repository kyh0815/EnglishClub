import { createClient } from "@supabase/supabase-js";

type AdminAuthResult =
  | {
      ok: true;
      email: string;
    }
  | {
      ok: false;
      message: string;
      status: number;
    };

function getAllowedAdminEmails(): Set<string> {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

function getBearerToken(request: Request): string {
  const authorization = request.headers.get("authorization") ?? "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);

  return match?.[1]?.trim() ?? "";
}

export async function authorizeAdminRequest(request: Request): Promise<AdminAuthResult> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const allowedEmails = getAllowedAdminEmails();

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      ok: false,
      message: "관리자 인증 설정이 아직 완료되지 않았어요.",
      status: 500
    };
  }

  if (allowedEmails.size === 0) {
    return {
      ok: false,
      message: "관리자 이메일 설정이 필요해요.",
      status: 403
    };
  }

  const token = getBearerToken(request);

  if (!token) {
    return {
      ok: false,
      message: "로그인이 필요해요.",
      status: 401
    };
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const {
    data: { user },
    error
  } = await supabase.auth.getUser(token);

  const email = user?.email?.toLowerCase();

  if (error || !email) {
    return {
      ok: false,
      message: "로그인을 다시 확인해주세요.",
      status: 401
    };
  }

  if (!allowedEmails.has(email)) {
    return {
      ok: false,
      message: "관리자 권한이 없는 계정이에요.",
      status: 403
    };
  }

  return {
    ok: true,
    email
  };
}
