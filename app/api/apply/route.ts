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
  gender?: unknown;
  phone?: unknown;
  email?: unknown;
  contact?: unknown;
  level?: unknown;
  overseasExperience?: unknown;
  internationalSchool?: unknown;
  motivation?: unknown;
  availability?: unknown;
  source?: unknown;
  website?: unknown;
};

const MAX_SHORT = 200;
const MAX_LONG = 1200;
const GENDER_OPTIONS = ["남자", "여자", "Others"] as const;
const OVERSEAS_EXPERIENCE_OPTIONS = ["없음", "1~2년", "3년 이상"] as const;
const INTERNATIONAL_SCHOOL_OPTIONS = ["없음", "있음"] as const;

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
  const gender = clean(body.gender, MAX_SHORT);
  const phone = clean(body.phone, MAX_SHORT) || clean(body.contact, MAX_SHORT);
  const email = clean(body.email, MAX_SHORT);
  const level = clean(body.level, MAX_SHORT);
  const overseasExperience = clean(body.overseasExperience, MAX_SHORT);
  const internationalSchool = clean(body.internationalSchool, MAX_SHORT);
  const motivation = clean(body.motivation, MAX_LONG);
  const legacyAvailability = clean(body.availability, MAX_LONG);
  const availability = [
    email ? `이메일: ${email}` : "",
    `성별: ${gender}`,
    `영어권 해외 거주 경험: ${overseasExperience}`,
    `국제 학교 경험: ${internationalSchool}`,
    legacyAvailability ? `기타: ${legacyAvailability}` : ""
  ]
    .filter(Boolean)
    .join("\n");
  const source = landingContent.apply.source;

  if (!name || !gender || !phone || !level || !overseasExperience || !internationalSchool) {
    return jsonError("필수 항목을 모두 입력해주세요.");
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

  if (!GENDER_OPTIONS.includes(gender as (typeof GENDER_OPTIONS)[number])) {
    return jsonError("성별을 선택해주세요.");
  }

  if (
    !OVERSEAS_EXPERIENCE_OPTIONS.includes(
      overseasExperience as (typeof OVERSEAS_EXPERIENCE_OPTIONS)[number]
    )
  ) {
    return jsonError("영어권 해외 거주 경험을 선택해주세요.");
  }

  if (
    !INTERNATIONAL_SCHOOL_OPTIONS.includes(
      internationalSchool as (typeof INTERNATIONAL_SCHOOL_OPTIONS)[number]
    )
  ) {
    return jsonError("국제 학교 경험을 선택해주세요.");
  }

  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return jsonError("신청 설정이 아직 완료되지 않았어요. 잠시 후 다시 시도해주세요.", 500);
  }

  try {
    const matchedTeam = landingContent.teams.find((team) => team.levelOption === level);

    if (matchedTeam) {
      if (matchedTeam.status === "준비중") {
        return jsonError(`${matchedTeam.name}은 현재 준비중이에요.`, 409);
      }

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
