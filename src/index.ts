import {
  Env,
  isSonarrEventEnabled,
  isRadarrEventEnabled,
} from "./env";
import { sendBrrrNotification } from "./brrr";
import { formatSonarrNotification } from "./formatters/sonarr";
import { formatRadarrNotification } from "./formatters/radarr";
import type { SonarrWebhookPayload, SonarrEventType } from "./types/sonarr";
import type { RadarrWebhookPayload, RadarrEventType } from "./types/radarr";

const SONARR_EVENT_TYPES: Set<string> = new Set<SonarrEventType>([
  "Test",
  "Grab",
  "Download",
  "Rename",
  "SeriesAdd",
  "SeriesDelete",
  "EpisodeFileDelete",
  "Health",
  "HealthRestored",
  "ApplicationUpdate",
  "ManualInteractionRequired",
]);

const RADARR_EVENT_TYPES: Set<string> = new Set<RadarrEventType>([
  "Test",
  "Grab",
  "Download",
  "Rename",
  "MovieAdded",
  "MovieDelete",
  "MovieFileDelete",
  "Health",
  "HealthRestored",
  "ApplicationUpdate",
  "ManualInteractionRequired",
]);

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  const encoder = new TextEncoder();
  const bufA = encoder.encode(a);
  const bufB = encoder.encode(b);
  if (bufA.byteLength !== bufB.byteLength) return false;
  // Use a constant-time comparison to avoid timing attacks
  let result = 0;
  for (let i = 0; i < bufA.byteLength; i++) {
    result |= bufA[i] ^ bufB[i];
  }
  return result === 0;
}

function verifyWebhookSecret(
  request: Request,
  expectedSecret: string,
): boolean {
  const provided = request.headers.get("X-Webhook-Secret");
  if (!provided) return false;
  return timingSafeEqual(provided, expectedSecret);
}

async function handleSonarrWebhook(
  request: Request,
  env: Env,
): Promise<Response> {
  if (!verifyWebhookSecret(request, env.SONARR_WEBHOOK_SECRET)) {
    return new Response("Unauthorized", { status: 401 });
  }

  let payload: SonarrWebhookPayload;
  try {
    payload = (await request.json()) as SonarrWebhookPayload;
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  if (!payload.eventType || !SONARR_EVENT_TYPES.has(payload.eventType)) {
    return new Response(`Unknown event type: ${payload.eventType}`, {
      status: 400,
    });
  }

  // Check if event is enabled (upgrade is a Download with isUpgrade=true)
  const isUpgrade =
    payload.eventType === "Download"
      ? (payload as { isUpgrade?: boolean }).isUpgrade
      : undefined;

  if (!isSonarrEventEnabled(env, payload.eventType, isUpgrade)) {
    return new Response("Event disabled", { status: 200 });
  }

  const notification = formatSonarrNotification(payload);

  try {
    const brrResponse = await sendBrrrNotification(
      env.BRRR_SECRET,
      notification,
    );
    if (!brrResponse.ok) {
      console.error(
        `brrr API returned ${brrResponse.status}: ${await brrResponse.text()}`,
      );
      return new Response("Failed to send notification", { status: 502 });
    }
  } catch (err) {
    console.error("Failed to send brrr notification:", err);
    return new Response("Failed to send notification", { status: 502 });
  }

  return new Response("OK", { status: 200 });
}

async function handleRadarrWebhook(
  request: Request,
  env: Env,
): Promise<Response> {
  if (!verifyWebhookSecret(request, env.RADARR_WEBHOOK_SECRET)) {
    return new Response("Unauthorized", { status: 401 });
  }

  let payload: RadarrWebhookPayload;
  try {
    payload = (await request.json()) as RadarrWebhookPayload;
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  if (!payload.eventType || !RADARR_EVENT_TYPES.has(payload.eventType)) {
    return new Response(`Unknown event type: ${payload.eventType}`, {
      status: 400,
    });
  }

  // Check if event is enabled (upgrade is a Download with isUpgrade=true)
  const isUpgrade =
    payload.eventType === "Download"
      ? (payload as { isUpgrade?: boolean }).isUpgrade
      : undefined;

  if (!isRadarrEventEnabled(env, payload.eventType, isUpgrade)) {
    return new Response("Event disabled", { status: 200 });
  }

  const notification = formatRadarrNotification(payload);

  try {
    const brrResponse = await sendBrrrNotification(
      env.BRRR_SECRET,
      notification,
    );
    if (!brrResponse.ok) {
      console.error(
        `brrr API returned ${brrResponse.status}: ${await brrResponse.text()}`,
      );
      return new Response("Failed to send notification", { status: 502 });
    }
  } catch (err) {
    console.error("Failed to send brrr notification:", err);
    return new Response("Failed to send notification", { status: 502 });
  }

  return new Response("OK", { status: 200 });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const url = new URL(request.url);

    switch (url.pathname) {
      case "/webhook/sonarr":
        return handleSonarrWebhook(request, env);
      case "/webhook/radarr":
        return handleRadarrWebhook(request, env);
      default:
        return new Response("Not Found", { status: 404 });
    }
  },
} satisfies ExportedHandler<Env>;
