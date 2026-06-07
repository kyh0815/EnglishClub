export type ApplicationNotificationPayload = {
  name: string;
  phone: string;
  email?: string | null;
  level: string;
  motivation?: string | null;
  source?: string | null;
};

export async function sendNotification(
  payload: ApplicationNotificationPayload
): Promise<void> {
  void payload;
  // No-op for now. Wire operator alerts here later without touching the form flow.
}
