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
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

`SUPABASE_SERVICE_ROLE_KEY`는 서버 전용 키입니다. 클라이언트 컴포넌트에서 import하거나 `NEXT_PUBLIC_` 접두사를 붙이지 마세요. 이 저장소는 public 레포이므로 실제 `.env`, `.env.local` 파일은 `.gitignore`에서 제외합니다.

## Supabase 테이블 생성 SQL

Supabase SQL Editor에서 실행합니다.

```sql
create extension if not exists pgcrypto;

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  contact text not null,
  level text not null,
  motivation text,
  availability text,
  source text,
  status text not null default 'new'
);

alter table public.applications enable row level security;

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text,
  contact text not null,
  message text not null,
  source text,
  status text not null default 'new'
);

alter table public.inquiries enable row level security;
```

이 폼은 클라이언트에서 Supabase 테이블에 직접 접근하지 않습니다. 모든 insert는 `app/api/apply/route.ts`에서 service role 키로 실행됩니다.
문의 폼도 같은 방식으로 `app/api/inquiry/route.ts`에서 service role 키로 `inquiries` 테이블에 저장합니다.

현재 폼 입력값은 기존 스키마에 이렇게 저장합니다.

- `name`: 이름
- `contact`: 전화번호
- `level`: 영어 레벨
- `motivation`: 지원 동기
- `availability`: 이메일(선택)

문의 폼 입력값은 `inquiries` 테이블에 이렇게 저장합니다.

- `name`: 이름(선택)
- `contact`: 이메일 또는 전화번호
- `message`: 문의 내용
- `source`: 문의 유입 source

## Vercel 배포

1. GitHub 저장소를 Vercel 프로젝트로 연결합니다.
2. Framework Preset은 Next.js를 사용합니다.
3. Environment Variables에 `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`를 추가합니다.
4. 배포 후 신청 폼을 제출해 Supabase `applications` 테이블에 row가 생성되는지 확인합니다.

## 콘텐츠 수정 위치

모집 상태, 정원, 레벨 옵션, source 값은 `lib/content.ts`에서 수정합니다.

- `landingContent.teams`: 초급/중급/고급 팀 설명, 정원, 모집 상태
- `levelOptions`: 신청 폼의 영어 레벨 선택지
- `landingContent.apply.source`: Supabase에 저장되는 유입 source
- `TEAM_CAPACITY`: 반별 정원. 현재 6명이며, `/api/status`와 `/api/apply`가 이 값을 기준으로 모집 마감 여부를 판단합니다.

## 보안 메모

- `.env`, `.env.local`, `.env.*`는 커밋하지 않습니다.
- `SUPABASE_SERVICE_ROLE_KEY`는 서버 Route Handler에서만 사용합니다.
- 스팸 방지용 honeypot 필드가 채워진 요청은 서버에서 저장하지 않고 성공 응답만 반환합니다.
