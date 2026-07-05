import { NextResponse } from "next/server";
import { authorizeAdminRequest } from "@/lib/server/admin";
import {
  createServerSupabaseClient,
  isApplicationStatus,
  listApplications,
  type ApplicationListFilters
} from "@/lib/server/applications";

export const dynamic = "force-dynamic";

function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

export async function GET(request: Request) {
  const admin = await authorizeAdminRequest(request);

  if (!admin.ok) {
    return jsonError(admin.message, admin.status);
  }

  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return jsonError("Supabase 서버 설정이 필요해요.", 500);
  }

  const url = new URL(request.url);
  const status = url.searchParams.get("status")?.trim() ?? "";
  const level = url.searchParams.get("level")?.trim() ?? "";
  const applicationDate = url.searchParams.get("applicationDate")?.trim() ?? "";
  const filters: ApplicationListFilters = {};

  if (status) {
    if (!isApplicationStatus(status)) {
      return jsonError("신청 상태를 확인해주세요.");
    }

    filters.status = status;
  }

  if (level) {
    filters.level = level;
  }

  if (applicationDate) {
    filters.applicationDate = applicationDate;
  }

  try {
    const applications = await listApplications(supabase, filters);

    return NextResponse.json(
      {
        ok: true,
        applications,
        viewerEmail: admin.email
      },
      {
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );
  } catch {
    return jsonError("신청 목록을 불러오지 못했어요.", 500);
  }
}
