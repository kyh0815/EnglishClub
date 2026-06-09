import { NextResponse } from "next/server";
import { landingContent } from "@/lib/content";
import { createServerSupabaseClient } from "@/lib/server/applications";

type InquiryRequest = {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
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

function isValidPhone(value: string): boolean {
  const phone = /^[0-9+\-\s().]{8,20}$/;
  return phone.test(value);
}

function isValidEmail(value: string): boolean {
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email.test(value);
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
  const phone = clean(body.phone, MAX_SHORT);
  const email = clean(body.email, MAX_SHORT);
  const message = clean(body.message, MAX_MESSAGE);

  if (!name || !phone || !message) {
    return jsonError("이름, 휴대폰번호, 문의사항을 입력해주세요.");
  }

  if (!isValidPhone(phone)) {
    return jsonError("휴대폰번호 형식으로 입력해주세요.");
  }

  if (email && !isValidEmail(email)) {
    return jsonError("이메일 형식으로 입력해주세요.");
  }

  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return jsonError("문의 설정이 아직 완료되지 않았어요. 잠시 후 다시 시도해주세요.", 500);
  }

  const { error } = await supabase.from("inquiries").insert({
    name,
    contact: email ? `${phone} / ${email}` : phone,
    message,
    source: landingContent.inquiry.source,
    status: "new"
  });

  if (error) {
    return jsonError("문의 저장에 실패했어요. 잠시 후 다시 시도해주세요.", 500);
  }

  return NextResponse.json({ ok: true });
}
