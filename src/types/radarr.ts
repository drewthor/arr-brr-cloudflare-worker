// Radarr webhook payload types
// Reference: https://github.com/Radarr/Radarr/tree/develop/src/NzbDrone.Core/Notifications/Webhook

export type RadarrEventType =
  | "Test"
  | "Grab"
  | "Download"
  | "Rename"
  | "MovieAdded"
  | "MovieDelete"
  | "MovieFileDelete"
  | "Health"
  | "HealthRestored"
  | "ApplicationUpdate"
  | "ManualInteractionRequired";

export interface RadarrLanguage {
  id: number;
  name: string;
}

export interface RadarrImage {
  coverType: string;
  url: string;
  remoteUrl: string;
}

export interface RadarrMovie {
  id: number;
  title: string;
  year: number;
  filePath: string;
  releaseDate: string;
  folderPath: string;
  tmdbId: number;
  imdbId: string;
  overview: string;
  genres: string[];
  images: RadarrImage[];
  tags: string[];
  originalLanguage: RadarrLanguage;
}

export interface RadarrRemoteMovie {
  tmdbId: number;
  imdbId: string;
  title: string;
  year: number;
}

export interface RadarrMovieFileMediaInfo {
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

export interface RadarrMovieFile {
  id: number;
  relativePath: string;
  path: string;
  quality: string;
  qualityVersion: number;
  releaseGroup: string;
  sceneName: string;
  indexerFlags: string;
  size: number;
  dateAdded: string;
  languages: RadarrLanguage[];
  mediaInfo?: RadarrMovieFileMediaInfo;
  sourcePath?: string;
  recycleBinPath?: string;
}

export interface RadarrRelease {
  quality: string;
  qualityVersion: number;
  releaseGroup: string;
  releaseTitle: string;
  indexer: string;
  size: number;
  customFormatScore: number;
  customFormats: string[];
  languages: RadarrLanguage[];
  indexerFlags: string[];
}

export interface RadarrGrabbedRelease {
  releaseTitle: string;
  indexer: string;
  size: number;
  indexerFlags: string[];
}

export interface RadarrCustomFormat {
  id: number;
  name: string;
}

export interface RadarrCustomFormatInfo {
  customFormats: RadarrCustomFormat[];
  customFormatScore: number;
}

export interface RadarrRenamedMovieFile extends RadarrMovieFile {
  previousRelativePath: string;
  previousPath: string;
}

export interface RadarrDownloadClientItem {
  quality: string;
  qualityVersion: number;
  title: string;
  indexer: string;
  size: number;
}

export interface RadarrDownloadStatusMessage {
  title: string;
  messages: string[];
}

// --- Payload types per event ---

interface RadarrBasePayload {
  eventType: RadarrEventType;
  instanceName: string;
  applicationUrl: string;
}

export interface RadarrTestPayload extends RadarrBasePayload {
  eventType: "Test";
  movie: RadarrMovie;
  remoteMovie: RadarrRemoteMovie;
  release: RadarrRelease;
}

export interface RadarrGrabPayload extends RadarrBasePayload {
  eventType: "Grab";
  movie: RadarrMovie;
  remoteMovie: RadarrRemoteMovie;
  release: RadarrRelease;
  downloadClient: string;
  downloadClientType: string;
  downloadId: string;
  customFormatInfo: RadarrCustomFormatInfo;
}

export interface RadarrDownloadPayload extends RadarrBasePayload {
  eventType: "Download";
  movie: RadarrMovie;
  remoteMovie: RadarrRemoteMovie;
  movieFile: RadarrMovieFile;
  isUpgrade: boolean;
  downloadClient: string;
  downloadClientType: string;
  downloadId: string;
  deletedFiles: RadarrMovieFile[];
  customFormatInfo: RadarrCustomFormatInfo;
  release: RadarrGrabbedRelease;
}

export interface RadarrRenamePayload extends RadarrBasePayload {
  eventType: "Rename";
  movie: RadarrMovie;
  renamedMovieFiles: RadarrRenamedMovieFile[];
}

export interface RadarrMovieAddedPayload extends RadarrBasePayload {
  eventType: "MovieAdded";
  movie: RadarrMovie;
  addMethod: string;
}

export interface RadarrMovieDeletePayload extends RadarrBasePayload {
  eventType: "MovieDelete";
  movie: RadarrMovie;
  deletedFiles: boolean;
  movieFolderSize: number;
}

export interface RadarrMovieFileDeletePayload extends RadarrBasePayload {
  eventType: "MovieFileDelete";
  movie: RadarrMovie;
  movieFile: RadarrMovieFile;
  deleteReason: string;
}

export interface RadarrHealthPayload extends RadarrBasePayload {
  eventType: "Health";
  level: string;
  message: string;
  type: string;
  wikiUrl: string;
}

export interface RadarrHealthRestoredPayload extends RadarrBasePayload {
  eventType: "HealthRestored";
  level: string;
  message: string;
  type: string;
  wikiUrl: string;
}

export interface RadarrApplicationUpdatePayload extends RadarrBasePayload {
  eventType: "ApplicationUpdate";
  message: string;
  previousVersion: string;
  newVersion: string;
}

export interface RadarrManualInteractionRequiredPayload
  extends RadarrBasePayload {
  eventType: "ManualInteractionRequired";
  movie: RadarrMovie;
  downloadInfo: RadarrDownloadClientItem;
  downloadClient: string;
  downloadClientType: string;
  downloadId: string;
  downloadStatus: string;
  downloadStatusMessages: RadarrDownloadStatusMessage[];
  customFormatInfo: RadarrCustomFormatInfo;
  release: RadarrGrabbedRelease;
}

export type RadarrWebhookPayload =
  | RadarrTestPayload
  | RadarrGrabPayload
  | RadarrDownloadPayload
  | RadarrRenamePayload
  | RadarrMovieAddedPayload
  | RadarrMovieDeletePayload
  | RadarrMovieFileDeletePayload
  | RadarrHealthPayload
  | RadarrHealthRestoredPayload
  | RadarrApplicationUpdatePayload
  | RadarrManualInteractionRequiredPayload;
