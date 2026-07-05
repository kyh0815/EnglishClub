export type ApplicationNotificationPayload = {
  applicationDate: string;
  applicationId: string;
  gender: string;
  internationalSchool: string;
  level: string;
  motivation?: string | null;
  name: string;
  phone: string;
  email?: string | null;
  overseasExperience: string;
  source?: string | null;
  speakingTestScore: string;
};

type ResendEmailResponse = {
  id?: string;
  message?: string;
  name?: string;
};

const RESEND_EMAIL_ENDPOINT = "https://api.resend.com/emails";
const ERROR_MESSAGE_MAX_LENGTH = 500;

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} 설정이 필요해요.`);
  }

  return value;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function truncateErrorMessage(message: string): string {
  return message.slice(0, ERROR_MESSAGE_MAX_LENGTH);
}

function getRecipients(): string[] {
  return requiredEnv("ADMIN_NOTIFICATION_EMAIL")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

function getPlainText(payload: ApplicationNotificationPayload): string {
  return [
    "The Round 새 신청이 도착했어요.",
    "",
    `이름: ${payload.name}`,
    `전화번호: ${payload.phone}`,
    `이메일: ${payload.email || "-"}`,
    `성별: ${payload.gender}`,
    `수업 가능 일자: ${payload.applicationDate}`,
    `레벨: ${payload.level}`,
    `영어 회화 점수: ${payload.speakingTestScore}`,
    `영어권 해외 거주 경험: ${payload.overseasExperience}`,
    `국제 학교 경험: ${payload.internationalSchool}`,
    `지원 동기: ${payload.motivation || "-"}`,
    `유입: ${payload.source || "-"}`,
    `신청 ID: ${payload.applicationId}`
  ].join("\n");
}

function getHtml(payload: ApplicationNotificationPayload): string {
  const rows = [
    ["이름", payload.name],
    ["전화번호", payload.phone],
    ["이메일", payload.email || "-"],
    ["성별", payload.gender],
    ["수업 가능 일자", payload.applicationDate],
    ["레벨", payload.level],
    ["영어 회화 점수", payload.speakingTestScore],
    ["영어권 해외 거주 경험", payload.overseasExperience],
    ["국제 학교 경험", payload.internationalSchool],
    ["지원 동기", payload.motivation || "-"],
    ["유입", payload.source || "-"],
    ["신청 ID", payload.applicationId]
  ];

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif; color: #171512; line-height: 1.6;">
      <h1 style="font-size: 20px; margin: 0 0 16px;">The Round 새 신청이 도착했어요.</h1>
      <table style="border-collapse: collapse; width: 100%; max-width: 640px;">
        <tbody>
          ${rows
            .map(
              ([label, value]) => `
                <tr>
                  <th style="width: 160px; padding: 10px 12px; border: 1px solid #e7e1d3; background: #f7f5ef; text-align: left; vertical-align: top; font-size: 13px;">
                    ${escapeHtml(label)}
                  </th>
                  <td style="padding: 10px 12px; border: 1px solid #e7e1d3; vertical-align: top; font-size: 14px; white-space: pre-wrap;">
                    ${escapeHtml(value)}
                  </td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

async function sendResendEmail(payload: ApplicationNotificationPayload): Promise<string> {
  const apiKey = requiredEnv("RESEND_API_KEY");
  const from = requiredEnv("NOTIFICATION_FROM_EMAIL");
  const recipients = getRecipients();

  if (recipients.length === 0) {
    throw new Error("ADMIN_NOTIFICATION_EMAIL 설정이 필요해요.");
  }

  const response = await fetch(RESEND_EMAIL_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `application-${payload.applicationId}-operator`,
      "User-Agent": "english-club-the-round/1.0"
    },
    body: JSON.stringify({
      from,
      to: recipients,
      subject: `[The Round] 새 신청: ${payload.name} / ${payload.level}`,
      html: getHtml(payload),
      text: getPlainText(payload),
      tags: [
        {
          name: "type",
          value: "operator_application"
        },
        {
          name: "source",
          value: (payload.source || "unknown").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 80)
        }
      ]
    })
  });
  const result = (await response.json().catch(() => ({}))) as ResendEmailResponse;

  if (!response.ok) {
    throw new Error(
      truncateErrorMessage(
        result.message || result.name || `Resend email request failed: ${response.status}`
      )
    );
  }

  if (!result.id) {
    throw new Error("Resend 응답에서 메일 ID를 확인하지 못했어요.");
  }

  return result.id;
}

export async function sendNotification(
  payload: ApplicationNotificationPayload
): Promise<void> {
  await sendResendEmail(payload);
}
