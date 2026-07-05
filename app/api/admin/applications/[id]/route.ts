import { NextResponse } from "next/server";
import { authorizeAdminRequest } from "@/lib/server/admin";
import {
  createServerSupabaseClient,
  isApplicationStatus,
  updateApplication,
  type ApplicationUpdateInput
} from "@/lib/server/applications";

const MAX_ADMIN_NOTE = 2000;

type UpdateApplicationRequest = {
  adminNote?: unknown;
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

  let body: UpdateApplicationRequest;

  try {
    body = (await request.json()) as UpdateApplicationRequest;
  } catch {
    return jsonError("요청을 확인할 수 없어요.");
  }

  const update: ApplicationUpdateInput = {};

  if (typeof body.status !== "undefined") {
    const status = clean(body.status, 80);

    if (!isApplicationStatus(status)) {
      return jsonError("신청 상태를 확인해주세요.");
    }

    update.status = status;
  }

  if (typeof body.adminNote !== "undefined") {
    update.adminNote = clean(body.adminNote, MAX_ADMIN_NOTE) || null;
  }

  if (!update.status && !Object.prototype.hasOwnProperty.call(update, "adminNote")) {
    return jsonError("변경할 내용이 없어요.");
  }

  const { id } = await params;

  try {
    const application = await updateApplication(supabase, id, update);

    return NextResponse.json({
      ok: true,
      application
    });
  } catch {
    return jsonError("신청 정보를 저장하지 못했어요.", 500);
  }
}
