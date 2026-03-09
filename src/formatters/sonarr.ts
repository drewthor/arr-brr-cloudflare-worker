import type { BrrrNotification } from "../brrr";
import type {
  SonarrWebhookPayload,
  SonarrEpisode,
  SonarrDownloadPayload,
} from "../types/sonarr";

function formatEpisodes(episodes: SonarrEpisode[]): string {
  if (!episodes || episodes.length === 0) return "";
  if (episodes.length === 1) {
    const ep = episodes[0];
    const code = `S${String(ep.seasonNumber).padStart(2, "0")}E${String(ep.episodeNumber).padStart(2, "0")}`;
    return ep.title ? `${code} - ${ep.title}` : code;
  }
  // Multiple episodes: show range
  const season = episodes[0].seasonNumber;
  const epNums = episodes.map((e) => e.episodeNumber).sort((a, b) => a - b);
  return `S${String(season).padStart(2, "0")}E${String(epNums[0]).padStart(2, "0")}-E${String(epNums[epNums.length - 1]).padStart(2, "0")}`;
}

export function formatSonarrNotification(
  payload: SonarrWebhookPayload,
): BrrrNotification {
  const title = payload.instanceName || "Sonarr";
  const openUrl = payload.applicationUrl || undefined;

  switch (payload.eventType) {
    case "Test":
      return {
        title,
        subtitle: "Test",
        message: "Test notification received",
        open_url: openUrl,
      };

    case "Grab": {
      const episodes = formatEpisodes(payload.episodes);
      return {
        title,
        subtitle: "Grab",
        message: `${payload.series.title} - ${episodes}`,
        open_url: openUrl,
      };
    }

    case "Download": {
      const p = payload as SonarrDownloadPayload;
      const episodes = formatEpisodes(p.episodes);
      return {
        title,
        subtitle: p.isUpgrade ? "Upgrade" : "Download",
        message: `${p.series.title} - ${episodes}`,
        open_url: openUrl,
      };
    }

    case "Rename":
      return {
        title,
        subtitle: "Rename",
        message: payload.series.title,
        open_url: openUrl,
      };

    case "SeriesAdd":
      return {
        title,
        subtitle: "Series Added",
        message: payload.series.title,
        open_url: openUrl,
      };

    case "SeriesDelete": {
      const suffix = payload.deletedFiles ? " (files deleted)" : "";
      return {
        title,
        subtitle: "Series Deleted",
        message: `${payload.series.title}${suffix}`,
        open_url: openUrl,
      };
    }

    case "EpisodeFileDelete": {
      const episodes = formatEpisodes(payload.episodes);
      return {
        title,
        subtitle: "Episode File Deleted",
        message: `${payload.series.title} - ${episodes}`,
        open_url: openUrl,
      };
    }

    case "Health":
      return {
        title,
        subtitle: `Health ${payload.level}`,
        message: payload.message,
        open_url: openUrl,
      };

    case "HealthRestored":
      return {
        title,
        subtitle: "Health Restored",
        message: payload.message,
        open_url: openUrl,
      };

    case "ApplicationUpdate":
      return {
        title,
        subtitle: "Application Update",
        message: `${payload.previousVersion} \u2192 ${payload.newVersion}`,
        open_url: openUrl,
      };

    case "ManualInteractionRequired": {
      const episodes = formatEpisodes(payload.episodes);
      return {
        title,
        subtitle: "Manual Interaction Required",
        message: `${payload.series.title} - ${episodes}`,
        open_url: openUrl,
      };
    }

    default: {
      const _exhaustive: never = payload;
      return {
        title,
        subtitle: (payload as { eventType: string }).eventType,
        message: `Unknown event: ${(payload as { eventType: string }).eventType}`,
        open_url: openUrl,
      };
    }
  }
}
