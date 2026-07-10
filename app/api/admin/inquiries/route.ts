import { NextResponse } from "next/server";
import { authorizeAdminRequest } from "@/lib/server/admin";
import {
  createServerSupabaseClient,
  isInquiryStatus,
  listInquiries,
  type InquiryListFilters
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
  const filters: InquiryListFilters = {};

  if (status) {
    if (!isInquiryStatus(status)) {
      return jsonError("문의 상태를 확인해주세요.");
    }

    filters.status = status;
  }

  try {
    const inquiries = await listInquiries(supabase, filters);

    return NextResponse.json(
      {
        ok: true,
        inquiries,
        viewerEmail: admin.email
      },
      {
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );
  } catch {
    return jsonError("문의 목록을 불러오지 못했어요.", 500);
  }
}
