import { NextResponse } from "next/server";
import { authorizeAdminRequest } from "@/lib/server/admin";
import {
  createServerSupabaseClient,
  isInquiryStatus,
  updateInquiry,
  type InquiryUpdateInput
} from "@/lib/server/applications";

const MAX_ADMIN_MEMO = 2000;

type UpdateInquiryRequest = {
  adminMemo?: unknown;
  status?: unknown;
};

function clean(value: unknown, maxLength: number): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
}

function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await authorizeAdminRequest(request);

  if (!admin.ok) {
    return jsonError(admin.message, admin.status);
  }

  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return jsonError("Supabase 서버 설정이 필요해요.", 500);
  }

  let body: UpdateInquiryRequest;

  try {
    body = (await request.json()) as UpdateInquiryRequest;
  } catch {
    return jsonError("요청을 확인할 수 없어요.");
  }

  const update: InquiryUpdateInput = {};

  if (typeof body.status !== "undefined") {
    const status = clean(body.status, 80);

    if (!isInquiryStatus(status)) {
      return jsonError("문의 상태를 확인해주세요.");
    }

    update.status = status;
  }

  if (typeof body.adminMemo !== "undefined") {
    update.adminMemo = clean(body.adminMemo, MAX_ADMIN_MEMO) || null;
  }

  if (!update.status && !Object.prototype.hasOwnProperty.call(update, "adminMemo")) {
    return jsonError("변경할 내용이 없어요.");
  }

  const { id } = await params;

  try {
    const inquiry = await updateInquiry(supabase, id, update);

    return NextResponse.json({
      ok: true,
      inquiry
    });
  } catch {
    return jsonError("문의 정보를 저장하지 못했어요.", 500);
  }
}
