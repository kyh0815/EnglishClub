export const APPLICATION_STATUSES = [
  "신규",
  "검토중",
  "연락완료",
  "입금대기",
  "확정",
  "거절",
  "이탈"
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const applicationStatusLabels: Record<ApplicationStatus, string> = {
  신규: "신규",
  검토중: "검토중",
  연락완료: "연락완료",
  입금대기: "입금대기",
  확정: "확정",
  거절: "거절",
  이탈: "이탈"
};

export const LEGACY_APPLICATION_STATUS_LABELS: Record<string, string> = {
  accepted: "확정",
  contacted: "연락완료",
  level_check_scheduled: "검토중",
  new: "신규",
  rejected: "거절",
  waitlist: "입금대기"
};

export function getApplicationStatusLabel(status: string): string {
  return (
    applicationStatusLabels[status as ApplicationStatus] ??
    LEGACY_APPLICATION_STATUS_LABELS[status] ??
    status
  );
}

export const INQUIRY_STATUSES = ["미답변", "답변완료", "보류"] as const;

export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];
