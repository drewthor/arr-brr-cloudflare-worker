const BRRR_API_BASE = "https://api.brrr.now/v1";

export interface BrrrNotification {
  title: string;
  subtitle?: string;
  message: string;
  open_url?: string;
}

export async function sendBrrrNotification(
  secret: string,
  notification: BrrrNotification,
): Promise<Response> {
  const url = `${BRRR_API_BASE}/${secret}`;
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(notification),
  });
}
