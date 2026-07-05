export const APPLICATION_STATUSES = [
  "new",
  "contacted",
  "level_check_scheduled",
  "accepted",
  "waitlist",
  "rejected"
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const applicationStatusLabels: Record<ApplicationStatus, string> = {
  new: "새 신청",
  contacted: "연락 완료",
  level_check_scheduled: "레벨 체크 예정",
  accepted: "참여 확정",
  waitlist: "대기",
  rejected: "불가"
};
