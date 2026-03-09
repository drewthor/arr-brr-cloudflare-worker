import type { BrrrNotification } from "../brrr";
import type {
  RadarrWebhookPayload,
  RadarrDownloadPayload,
} from "../types/radarr";

function formatMovie(title: string, year: number): string {
  return year ? `${title} (${year})` : title;
}

export function formatRadarrNotification(
  payload: RadarrWebhookPayload,
): BrrrNotification {
  const title = payload.instanceName || "Radarr";
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
      const movie = formatMovie(payload.movie.title, payload.movie.year);
      return {
        title,
        subtitle: "Grab",
        message: movie,
        open_url: openUrl,
      };
    }

    case "Download": {
      const p = payload as RadarrDownloadPayload;
      const movie = formatMovie(p.movie.title, p.movie.year);
      return {
        title,
        subtitle: p.isUpgrade ? "Upgrade" : "Download",
        message: movie,
        open_url: openUrl,
      };
    }

    case "Rename": {
      const movie = formatMovie(payload.movie.title, payload.movie.year);
      return {
        title,
        subtitle: "Rename",
        message: movie,
        open_url: openUrl,
      };
    }

    case "MovieAdded": {
      const movie = formatMovie(payload.movie.title, payload.movie.year);
      return {
        title,
        subtitle: "Movie Added",
        message: movie,
        open_url: openUrl,
      };
    }

    case "MovieDelete": {
      const movie = formatMovie(payload.movie.title, payload.movie.year);
      const suffix = payload.deletedFiles ? " (files deleted)" : "";
      return {
        title,
        subtitle: "Movie Deleted",
        message: `${movie}${suffix}`,
        open_url: openUrl,
      };
    }

    case "MovieFileDelete": {
      const movie = formatMovie(payload.movie.title, payload.movie.year);
      return {
        title,
        subtitle: "Movie File Deleted",
        message: movie,
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
      const movie = formatMovie(payload.movie.title, payload.movie.year);
      return {
        title,
        subtitle: "Manual Interaction Required",
        message: movie,
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
