import type { SonarrEventType } from "./types/sonarr";
import type { RadarrEventType } from "./types/radarr";

export interface Env {
  // Secrets (set via `wrangler secret put`)
  BRRR_SECRET: string;
  SONARR_WEBHOOK_SECRET: string;
  RADARR_WEBHOOK_SECRET: string;

  // Sonarr event toggles
  SONARR_ON_GRAB: string;
  SONARR_ON_DOWNLOAD: string;
  SONARR_ON_UPGRADE: string;
  SONARR_ON_RENAME: string;
  SONARR_ON_SERIES_ADD: string;
  SONARR_ON_SERIES_DELETE: string;
  SONARR_ON_EPISODE_FILE_DELETE: string;
  SONARR_ON_HEALTH: string;
  SONARR_ON_HEALTH_RESTORED: string;
  SONARR_ON_APPLICATION_UPDATE: string;
  SONARR_ON_MANUAL_INTERACTION_REQUIRED: string;

  // Radarr event toggles
  RADARR_ON_GRAB: string;
  RADARR_ON_DOWNLOAD: string;
  RADARR_ON_UPGRADE: string;
  RADARR_ON_RENAME: string;
  RADARR_ON_MOVIE_ADDED: string;
  RADARR_ON_MOVIE_DELETE: string;
  RADARR_ON_MOVIE_FILE_DELETE: string;
  RADARR_ON_HEALTH: string;
  RADARR_ON_HEALTH_RESTORED: string;
  RADARR_ON_APPLICATION_UPDATE: string;
  RADARR_ON_MANUAL_INTERACTION_REQUIRED: string;
}

const sonarrEventVarMap: Record<SonarrEventType, keyof Env> = {
  Test: "SONARR_ON_GRAB", // Test events are always allowed; mapped but not checked
  Grab: "SONARR_ON_GRAB",
  Download: "SONARR_ON_DOWNLOAD",
  Rename: "SONARR_ON_RENAME",
  SeriesAdd: "SONARR_ON_SERIES_ADD",
  SeriesDelete: "SONARR_ON_SERIES_DELETE",
  EpisodeFileDelete: "SONARR_ON_EPISODE_FILE_DELETE",
  Health: "SONARR_ON_HEALTH",
  HealthRestored: "SONARR_ON_HEALTH_RESTORED",
  ApplicationUpdate: "SONARR_ON_APPLICATION_UPDATE",
  ManualInteractionRequired: "SONARR_ON_MANUAL_INTERACTION_REQUIRED",
};

const radarrEventVarMap: Record<RadarrEventType, keyof Env> = {
  Test: "RADARR_ON_GRAB", // Test events are always allowed; mapped but not checked
  Grab: "RADARR_ON_GRAB",
  Download: "RADARR_ON_DOWNLOAD",
  Rename: "RADARR_ON_RENAME",
  MovieAdded: "RADARR_ON_MOVIE_ADDED",
  MovieDelete: "RADARR_ON_MOVIE_DELETE",
  MovieFileDelete: "RADARR_ON_MOVIE_FILE_DELETE",
  Health: "RADARR_ON_HEALTH",
  HealthRestored: "RADARR_ON_HEALTH_RESTORED",
  ApplicationUpdate: "RADARR_ON_APPLICATION_UPDATE",
  ManualInteractionRequired: "RADARR_ON_MANUAL_INTERACTION_REQUIRED",
};

/**
 * Check if a Sonarr event type is enabled.
 * "Download" events with isUpgrade=true check SONARR_ON_UPGRADE instead.
 * Test events are always enabled.
 */
export function isSonarrEventEnabled(
  env: Env,
  eventType: SonarrEventType,
  isUpgrade?: boolean,
): boolean {
  if (eventType === "Test") return true;
  if (eventType === "Download" && isUpgrade) {
    return env.SONARR_ON_UPGRADE !== "false";
  }
  const varName = sonarrEventVarMap[eventType];
  return env[varName] !== "false";
}

/**
 * Check if a Radarr event type is enabled.
 * "Download" events with isUpgrade=true check RADARR_ON_UPGRADE instead.
 * Test events are always enabled.
 */
export function isRadarrEventEnabled(
  env: Env,
  eventType: RadarrEventType,
  isUpgrade?: boolean,
): boolean {
  if (eventType === "Test") return true;
  if (eventType === "Download" && isUpgrade) {
    return env.RADARR_ON_UPGRADE !== "false";
  }
  const varName = radarrEventVarMap[eventType];
  return env[varName] !== "false";
}
