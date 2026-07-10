# The Round 무료 베타 1기 랜딩페이지

The Round(영어 소셜 클럽)의 무료 베타 1기 신청용 단일 페이지 랜딩입니다.

## 로컬 실행

```bash
npm install
cp .env.example .env.local
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다.

## 환경변수

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_EMAILS=admin@example.com
RESEND_API_KEY=your-resend-api-key
ADMIN_NOTIFICATION_EMAIL=admin@example.com
NOTIFICATION_FROM_EMAIL=The Round <hello@mail.theroundhq.com>
```

`SUPABASE_SERVICE_ROLE_KEY`는 서버 전용 키입니다. 클라이언트 컴포넌트에서 import하거나 `NEXT_PUBLIC_` 접두사를 붙이지 마세요. 이 저장소는 public 레포이므로 실제 `.env`, `.env.local` 파일은 `.gitignore`에서 제외합니다.
`NEXT_PUBLIC_SUPABASE_ANON_KEY`는 `/admin`의 Supabase Auth 로그인에 사용되는 공개 키입니다. 실제 신청 데이터 조회/수정은 서버 Route Handler에서 `SUPABASE_SERVICE_ROLE_KEY`로만 처리합니다.
`ADMIN_EMAILS`에는 Supabase Auth에서 생성한 운영자 이메일을 쉼표로 구분해 입력합니다.
`RESEND_API_KEY`, `ADMIN_NOTIFICATION_EMAIL`, `NOTIFICATION_FROM_EMAIL`은 새 신청 운영자 메일 알림에 사용합니다. `NOTIFICATION_FROM_EMAIL`은 Resend에서 발송 가능한 인증 도메인의 주소를 사용합니다.

## Supabase 테이블 생성 SQL

Supabase SQL Editor에서 실행합니다.

```sql
create extension if not exists pgcrypto;

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  contact text not null,
  phone text,
  email text,
  gender text,
  application_date text,
  level text not null,
  speaking_test_score text,
  overseas_experience text,
  international_school text,
  motivation text,
  availability text,
  source text,
  cohort text,
  admin_memo text,
  admin_note text,
  status text not null default '신규',
  status_changed_at timestamptz,
  status_history jsonb not null default '[]'::jsonb,
  notified_at timestamptz,
  notification_error text
);

alter table public.applications enable row level security;

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text,
  contact text not null,
  message text not null,
  source text,
  admin_memo text,
  status text not null default '미답변',
  status_changed_at timestamptz,
  status_history jsonb not null default '[]'::jsonb
);

alter table public.inquiries enable row level security;

create table if not exists public.message_templates (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  title text not null,
  body text not null,
  variables text[] not null default '{}'
);

alter table public.message_templates enable row level security;
```

이 폼은 클라이언트에서 Supabase 테이블에 직접 접근하지 않습니다. 모든 insert는 `app/api/apply/route.ts`에서 service role 키로 실행됩니다.
문의 폼도 같은 방식으로 `app/api/inquiry/route.ts`에서 service role 키로 `inquiries` 테이블에 저장합니다.

신청 폼 입력값은 `applications` 테이블에 이렇게 저장합니다.

- `name`: 이름
- `contact`: 전화번호. 기존 데이터와 호환을 위해 유지합니다.
- `phone`: 전화번호
- `email`: 이메일
- `gender`: 성별
- `application_date`: 수업 가능 일자
- `level`: 영어 레벨
- `speaking_test_score`: 영어 회화 점수
- `overseas_experience`: 영어권 해외 거주 경험
- `international_school`: 국제 학교 경험
- `motivation`: 지원 동기
- `availability`: 기존 운영 화면/데이터와 호환하기 위한 신청 상세 요약
- `cohort`: 기수
- `admin_memo`: 관리자 메모
- `admin_note`: 기존 관리자 메모 호환 컬럼
- `status`: 신청 상태. 기본값은 `신규`
- `status_changed_at`: 마지막 상태 변경 시각
- `status_history`: 상태 변경 이력 JSON 배열
- `notified_at`: 마지막 알림 성공 시각
- `notification_error`: 마지막 알림 실패 내용

기존 DB에는 아래 SQL을 Supabase SQL Editor에서 별도로 실행해 컬럼을 추가합니다. 실제 운영 DB 변경 전에는 백업과 실행 시점을 먼저 확인합니다.

```sql
alter table public.applications
  add column if not exists phone text,
  add column if not exists email text,
  add column if not exists gender text,
  add column if not exists application_date text,
  add column if not exists speaking_test_score text,
  add column if not exists overseas_experience text,
  add column if not exists international_school text,
  add column if not exists cohort text,
  add column if not exists admin_memo text,
  add column if not exists admin_note text,
  add column if not exists status_changed_at timestamptz,
  add column if not exists status_history jsonb not null default '[]'::jsonb,
  add column if not exists notified_at timestamptz,
  add column if not exists notification_error text;

update public.applications
set phone = contact
where phone is null
  and contact is not null;

update public.applications
set status = case status
  when 'new' then '신규'
  when 'contacted' then '연락완료'
  when 'level_check_scheduled' then '검토중'
  when 'accepted' then '확정'
  when 'waitlist' then '입금대기'
  when 'rejected' then '거절'
  else status
end
where status in ('new', 'contacted', 'level_check_scheduled', 'accepted', 'waitlist', 'rejected');

update public.applications
set admin_memo = admin_note
where admin_memo is null
  and admin_note is not null;

alter table public.inquiries
  add column if not exists admin_memo text,
  add column if not exists status_changed_at timestamptz,
  add column if not exists status_history jsonb not null default '[]'::jsonb;

update public.inquiries
set status = '미답변'
where status = 'new';

create table if not exists public.message_templates (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  title text not null,
  body text not null,
  variables text[] not null default '{}'
);

alter table public.message_templates enable row level security;
```

문의 폼 입력값은 `inquiries` 테이블에 이렇게 저장합니다.

- `name`: 이름
- `contact`: 휴대폰번호, 이메일이 있으면 `휴대폰번호 / 이메일`
- `message`: 문의사항
- `source`: 문의 유입 source
- `admin_memo`: 관리자 메모
- `status`: 문의 상태. 기본값은 `미답변`
- `status_changed_at`: 마지막 상태 변경 시각
- `status_history`: 상태 변경 이력 JSON 배열

## Vercel 배포

1. GitHub 저장소를 Vercel 프로젝트로 연결합니다.
2. Framework Preset은 Next.js를 사용합니다.
3. Environment Variables에 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_EMAILS`를 추가합니다.
4. 배포 후 신청 폼을 제출해 Supabase `applications` 테이블에 row가 생성되는지 확인합니다.

## Admin 운영

`/admin`은 Supabase Auth 로그인 후 접근합니다. 서버 API는 로그인된 사용자의 access token을 검증하고, 이메일이 `ADMIN_EMAILS`에 포함된 경우에만 신청/문의/템플릿 목록 조회와 상태/메모 수정을 허용합니다.

Supabase Dashboard에서 운영자 계정을 먼저 생성한 뒤 `ADMIN_EMAILS`에 같은 이메일을 추가합니다. 신청 상세 컬럼, 관리자 메모, 알림 상태를 사용하려면 위의 기존 DB 컬럼 추가 SQL을 먼저 반영해야 합니다.

Admin에서 사용할 수 있는 신청 상태는 아래와 같습니다.

- `신규`
- `검토중`
- `연락완료`
- `입금대기`
- `확정`
- `거절`
- `이탈`

문의 상태는 아래와 같습니다.

- `미답변`
- `답변완료`
- `보류`

메시지 템플릿은 `message_templates` 테이블에 저장합니다. 템플릿 본문에서는 `{{이름}}`, `{{기수}}`, `{{레벨}}`, `{{수업일}}`, `{{연락처}}`, `{{상태}}` 변수를 사용할 수 있고, 신청 상세 패널에서 치환된 메시지를 클립보드에 복사합니다.

## 운영자 메일 알림

신청 저장이 성공하면 `/api/apply`에서 Resend Email API로 운영자에게 새 신청 메일을 보냅니다. 메일에는 이름, 연락처, 이메일, 성별, 수업 가능 일자, 레벨, 회화 점수, 해외 거주/국제 학교 경험, 지원 동기, 신청 ID가 포함됩니다.

메일 발송이 실패해도 신청 저장은 성공으로 유지합니다. 발송 성공 시 `applications.notified_at`을 기록하고 `notification_error`를 비우며, 실패 시 `notification_error`에 실패 내용을 남깁니다. 기존 DB에 `notified_at`, `notification_error` 컬럼이 아직 없으면 신청 접수는 유지되지만 알림 결과 기록은 건너뜁니다.

Resend 설정 순서:

1. Resend에서 발송 도메인을 인증합니다.
2. API key를 만들고 `RESEND_API_KEY`에 설정합니다.
3. 운영자 수신 주소를 `ADMIN_NOTIFICATION_EMAIL`에 설정합니다. 여러 명이면 쉼표로 구분합니다.
4. 인증된 발신 주소를 `NOTIFICATION_FROM_EMAIL`에 설정합니다.

## 콘텐츠 수정 위치

모집 상태, 정원, 기수, 레벨 옵션, source 값은 `lib/content.ts`에서 수정합니다.

- `landingContent.teams`: 초급/중급/고급 팀 설명, 정원, 모집 상태
- `cohortOptions`: 신청 폼에서 선택 가능한 기수
- `landingContent.apply.defaultCohort`: 신청 폼의 기본 기수
- `levelOptions`: 신청 폼의 영어 레벨 선택지
- `landingContent.apply.source`: Supabase에 저장되는 유입 source
- `TEAM_CAPACITY`: 기수별/반별 정원. 현재 6명이며, `/api/status`와 `/api/apply`가 이 값을 기준으로 모집 마감 여부를 판단합니다.

## 보안 메모

- `.env`, `.env.local`, `.env.*`는 커밋하지 않습니다.
- `SUPABASE_SERVICE_ROLE_KEY`는 서버 Route Handler에서만 사용합니다.
- 스팸 방지용 honeypot 필드가 채워진 요청은 서버에서 저장하지 않고 성공 응답만 반환합니다.
