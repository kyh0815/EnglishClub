import { NextResponse } from "next/server";
import { landingContent } from "@/lib/content";
import { createServerSupabaseClient } from "@/lib/server/applications";

type InquiryRequest = {
  name?: unknown;
  contact?: unknown;
  message?: unknown;
  website?: unknown;
};

const MAX_SHORT = 200;
const MAX_MESSAGE = 1600;

function clean(value: unknown, maxLength: number): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
}

function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

export async function POST(request: Request) {
  let body: InquiryRequest;

  try {
    body = (await request.json()) as InquiryRequest;
  } catch {
    return jsonError("요청을 확인할 수 없어요. 잠시 후 다시 시도해주세요.");
  }

  const honeypot = clean(body.website, MAX_SHORT);
  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, MAX_SHORT);
  const contact = clean(body.contact, MAX_SHORT);
  const message = clean(body.message, MAX_MESSAGE);

  if (!contact || !message) {
    return jsonError("연락처와 문의 내용을 입력해주세요.");
  }

  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return jsonError("문의 설정이 아직 완료되지 않았어요. 잠시 후 다시 시도해주세요.", 500);
  }

  const { error } = await supabase.from("inquiries").insert({
    name: name || null,
    contact,
    message,
    source: landingContent.inquiry.source,
    status: "new"
  });

  if (error) {
    return jsonError("문의 저장에 실패했어요. 잠시 후 다시 시도해주세요.", 500);
  }

  return NextResponse.json({ ok: true });
}
