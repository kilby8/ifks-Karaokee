import { ParsedFilename, parseKaraokeFilename } from './filenameParser';
import { TrackRow, upsertTrack } from '../db/database';

export type LocalAIClassification = {
  genre?: string;
  mood?: string;
  topHitScore?: number;
  confidence?: number;
};

export type FileRecord = {
  path: string;
  name: string;
};

export type LocalModelClassifier = (entry: ParsedFilename) => Promise<LocalAIClassification>;

function normalizeSearch(artist: string, title: string) {
  return `${artist} ${title}`.toLowerCase().replace(/\s+/g, ' ').trim();
}

function toTrackId(path: string) {
  return `track:${path.toLowerCase()}`;
}

function isTopHit(classification: LocalAIClassification) {
  return (classification.topHitScore || 0) >= 0.7 ? 1 : 0;
}

export async function indexLocalLibrary(
  files: FileRecord[],
  classifyWithOnDeviceModel: LocalModelClassifier
) {
  for (const file of files) {
    const parsed = parseKaraokeFilename(file.name);
    const classification = await classifyWithOnDeviceModel(parsed);

    const row: TrackRow = {
      id: toTrackId(file.path),
      artist: parsed.artist,
      title: parsed.title,
      extension: parsed.extension,
      source_path: file.path,
      search_text: normalizeSearch(parsed.artist, parsed.title),
      is_top_hit: isTopHit(classification),
      play_count: 0,
      last_sung_at: null,
      metadata_json: JSON.stringify(classification),
    };

    upsertTrack(row);
  }
}
