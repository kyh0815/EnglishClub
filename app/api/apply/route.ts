import { NextResponse } from "next/server";
import { landingContent, levelOptions, TEAM_CAPACITY } from "@/lib/content";
import { sendNotification } from "@/lib/notifications";
import {
  countApplicationsByLevel,
  createServerSupabaseClient,
  getTeamApplicationStatuses
} from "@/lib/server/applications";

type ApplyRequest = {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  contact?: unknown;
  level?: unknown;
  motivation?: unknown;
  availability?: unknown;
  source?: unknown;
  website?: unknown;
};

const MAX_SHORT = 200;
const MAX_LONG = 1200;

function clean(value: unknown, maxLength: number): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
}

function isValidPhone(value: string): boolean {
  const phone = /^[0-9+\-\s().]{8,20}$/;
  return phone.test(value);
}

function isValidEmail(value: string): boolean {
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email.test(value);
}

function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

export async function POST(request: Request) {
  let body: ApplyRequest;

  try {
    body = (await request.json()) as ApplyRequest;
  } catch {
    return jsonError("요청을 확인할 수 없어요. 잠시 후 다시 시도해주세요.");
  }

  const honeypot = clean(body.website, MAX_SHORT);
  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, MAX_SHORT);
  const phone = clean(body.phone, MAX_SHORT) || clean(body.contact, MAX_SHORT);
  const email = clean(body.email, MAX_SHORT);
  const level = clean(body.level, MAX_SHORT);
  const motivation = clean(body.motivation, MAX_LONG);
  const availability = email || clean(body.availability, MAX_LONG);
  const source = landingContent.apply.source;

  if (!name || !phone || !level) {
    return jsonError("이름, 전화번호, 영어 레벨을 입력해주세요.");
  }

  if (!isValidPhone(phone)) {
    return jsonError("전화번호 형식으로 입력해주세요.");
  }

  if (email && !isValidEmail(email)) {
    return jsonError("이메일 형식으로 입력해주세요.");
  }

  if (!levelOptions.includes(level as (typeof levelOptions)[number])) {
    return jsonError("영어 레벨을 선택해주세요.");
  }

  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return jsonError("신청 설정이 아직 완료되지 않았어요. 잠시 후 다시 시도해주세요.", 500);
  }

  try {
    const matchedTeam = landingContent.teams.find((team) => team.levelOption === level);

    if (matchedTeam) {
      const currentCount = await countApplicationsByLevel(supabase, level, source);

      if (currentCount >= TEAM_CAPACITY) {
        return jsonError(`${matchedTeam.name}은 현재 모집이 마감됐어요.`, 409);
      }
    } else {
      const statuses = await getTeamApplicationStatuses(supabase);
      const hasOpenTeam = Object.values(statuses).some((team) => !team.isClosed);

      if (!hasOpenTeam) {
        return jsonError("현재 모든 반의 모집이 마감됐어요.", 409);
      }
    }
  } catch {
    return jsonError("모집 현황을 확인하지 못했어요. 잠시 후 다시 시도해주세요.", 500);
  }

  const { error } = await supabase.from("applications").insert({
    name,
    contact: phone,
    level,
    motivation: motivation || null,
    availability: availability || null,
    source,
    status: "new"
  });

  if (error) {
    return jsonError("신청 저장에 실패했어요. 잠시 후 다시 시도해주세요.", 500);
  }

  await sendNotification({
    name,
    phone,
    email: email || null,
    level,
    motivation: motivation || null,
    source
  });

  return NextResponse.json({ ok: true });
}
