// Sonarr webhook payload types
// Reference: https://github.com/Sonarr/Sonarr/tree/develop/src/NzbDrone.Core/Notifications/Webhook

export type SonarrEventType =
  | "Test"
  | "Grab"
  | "Download"
  | "Rename"
  | "SeriesAdd"
  | "SeriesDelete"
  | "EpisodeFileDelete"
  | "Health"
  | "HealthRestored"
  | "ApplicationUpdate"
  | "ManualInteractionRequired";

export interface SonarrLanguage {
  id: number;
  name: string;
}

export interface SonarrImage {
  coverType: string;
  url: string;
  remoteUrl: string;
}

export interface SonarrSeries {
  id: number;
  title: string;
  titleSlug: string;
  path: string;
  tvdbId: number;
  tvMazeId: number;
  tmdbId: number;
  imdbId: string;
  type: string;
  year: number;
  genres: string[];
  images: SonarrImage[];
  tags: string[];
  originalLanguage: SonarrLanguage;
}

export interface SonarrEpisode {
  id: number;
  episodeNumber: number;
  seasonNumber: number;
  title: string;
  overview?: string;
  airDate?: string;
  airDateUtc?: string;
  seriesId: number;
  tvdbId: number;
}

export interface SonarrEpisodeFileMediaInfo {
  audioChannels: number;
  audioCodec: string;
  audioLanguages: string[];
  height: number;
  width: number;
  subtitles: string[];
  videoCodec: string;
  videoDynamicRange: string;
  videoDynamicRangeType: string;
}

export interface SonarrEpisodeFile {
  id: number;
  relativePath: string;
  path: string;
  quality: string;
  qualityVersion: number;
  releaseGroup: string;
  sceneName: string;
  size: number;
  dateAdded: string;
  languages: SonarrLanguage[];
  mediaInfo?: SonarrEpisodeFileMediaInfo;
  sourcePath?: string;
  recycleBinPath?: string;
}

export interface SonarrRelease {
  quality: string;
  qualityVersion: number;
  releaseGroup: string;
  releaseTitle: string;
  indexer: string;
  size: number;
  customFormatScore: number;
  customFormats: string[];
  languages: SonarrLanguage[];
  indexerFlags: string[];
}

export interface SonarrGrabbedRelease {
  releaseTitle: string;
  indexer: string;
  size?: number;
  indexerFlags: string[];
  releaseType?: string;
}

export interface SonarrCustomFormat {
  id: number;
  name: string;
}

export interface SonarrCustomFormatInfo {
  customFormats: SonarrCustomFormat[];
  customFormatScore: number;
}

export interface SonarrRenamedEpisodeFile extends SonarrEpisodeFile {
  previousRelativePath: string;
  previousPath: string;
}

export interface SonarrDownloadClientItem {
  quality: string;
  qualityVersion: number;
  title: string;
  indexer: string;
  size: number;
}

export interface SonarrDownloadStatusMessage {
  title: string;
  messages: string[];
}

// --- Payload types per event ---

interface SonarrBasePayload {
  eventType: SonarrEventType;
  instanceName: string;
  applicationUrl: string;
}

export interface SonarrTestPayload extends SonarrBasePayload {
  eventType: "Test";
  series: SonarrSeries;
  episodes: SonarrEpisode[];
}

export interface SonarrGrabPayload extends SonarrBasePayload {
  eventType: "Grab";
  series: SonarrSeries;
  episodes: SonarrEpisode[];
  release: SonarrRelease;
  downloadClient: string;
  downloadClientType: string;
  downloadId: string;
  customFormatInfo: SonarrCustomFormatInfo;
}

export interface SonarrDownloadPayload extends SonarrBasePayload {
  eventType: "Download";
  series: SonarrSeries;
  episodes: SonarrEpisode[];
  episodeFile: SonarrEpisodeFile;
  isUpgrade: boolean;
  downloadClient: string;
  downloadClientType: string;
  downloadId: string;
  deletedFiles: SonarrEpisodeFile[];
  customFormatInfo: SonarrCustomFormatInfo;
  release: SonarrGrabbedRelease;
}

export interface SonarrRenamePayload extends SonarrBasePayload {
  eventType: "Rename";
  series: SonarrSeries;
  renamedEpisodeFiles: SonarrRenamedEpisodeFile[];
}

export interface SonarrSeriesAddPayload extends SonarrBasePayload {
  eventType: "SeriesAdd";
  series: SonarrSeries;
}

export interface SonarrSeriesDeletePayload extends SonarrBasePayload {
  eventType: "SeriesDelete";
  series: SonarrSeries;
  deletedFiles: boolean;
}

export interface SonarrEpisodeFileDeletePayload extends SonarrBasePayload {
  eventType: "EpisodeFileDelete";
  series: SonarrSeries;
  episodes: SonarrEpisode[];
  episodeFile: SonarrEpisodeFile;
  deleteReason: string;
}

export interface SonarrHealthPayload extends SonarrBasePayload {
  eventType: "Health";
  level: string;
  message: string;
  type: string;
  wikiUrl: string;
}

export interface SonarrHealthRestoredPayload extends SonarrBasePayload {
  eventType: "HealthRestored";
  level: string;
  message: string;
  type: string;
  wikiUrl: string;
}

export interface SonarrApplicationUpdatePayload extends SonarrBasePayload {
  eventType: "ApplicationUpdate";
  message: string;
  previousVersion: string;
  newVersion: string;
}

export interface SonarrManualInteractionRequiredPayload
  extends SonarrBasePayload {
  eventType: "ManualInteractionRequired";
  series: SonarrSeries;
  episodes: SonarrEpisode[];
  downloadInfo: SonarrDownloadClientItem;
  downloadClient: string;
  downloadClientType: string;
  downloadId: string;
  downloadStatus: string;
  downloadStatusMessages: SonarrDownloadStatusMessage[];
  customFormatInfo: SonarrCustomFormatInfo;
  release: SonarrGrabbedRelease;
}

export type SonarrWebhookPayload =
  | SonarrTestPayload
  | SonarrGrabPayload
  | SonarrDownloadPayload
  | SonarrRenamePayload
  | SonarrSeriesAddPayload
  | SonarrSeriesDeletePayload
  | SonarrEpisodeFileDeletePayload
  | SonarrHealthPayload
  | SonarrHealthRestoredPayload
  | SonarrApplicationUpdatePayload
  | SonarrManualInteractionRequiredPayload;
