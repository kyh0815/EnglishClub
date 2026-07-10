import { NextResponse } from "next/server";
import { authorizeAdminRequest } from "@/lib/server/admin";
import {
  createServerSupabaseClient,
  updateMessageTemplate,
  type MessageTemplateInput
} from "@/lib/server/applications";

const MAX_TEMPLATE_BODY = 4000;
const MAX_TEMPLATE_TITLE = 120;

type TemplateRequest = {
  body?: unknown;
  title?: unknown;
  variables?: unknown;
};

function clean(value: unknown, maxLength: number): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
}

function cleanVariables(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => clean(item, 80))
    .filter(Boolean)
    .slice(0, 20);
}

function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

function parseTemplateInput(body: TemplateRequest): MessageTemplateInput | null {
  const title = clean(body.title, MAX_TEMPLATE_TITLE);
  const templateBody = clean(body.body, MAX_TEMPLATE_BODY);

  if (!title || !templateBody) {
    return null;
  }

  return {
    body: templateBody,
    title,
    variables: cleanVariables(body.variables)
  };
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

  let body: TemplateRequest;

  try {
    body = (await request.json()) as TemplateRequest;
  } catch {
    return jsonError("요청을 확인할 수 없어요.");
  }

  const input = parseTemplateInput(body);

  if (!input) {
    return jsonError("템플릿 제목과 내용을 입력해주세요.");
  }

  const { id } = await params;

  try {
    const template = await updateMessageTemplate(supabase, id, input);

    return NextResponse.json({
      ok: true,
      template
    });
  } catch {
    return jsonError("메시지 템플릿을 저장하지 못했어요.", 500);
  }
}
