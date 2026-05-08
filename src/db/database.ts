import * as SQLite from 'expo-sqlite';

export type TrackRow = {
  id: string;
  artist: string;
  title: string;
  extension: string;
  source_path: string;
  search_text: string;
  is_top_hit: number;
  play_count: number;
  last_sung_at: number | null;
  metadata_json: string | null;
};

export const db = SQLite.openDatabaseSync('ikfs.db');

export function initDatabase() {
  db.execSync(`
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = NORMAL;
    CREATE TABLE IF NOT EXISTS tracks (
      id TEXT PRIMARY KEY,
      artist TEXT NOT NULL,
      title TEXT NOT NULL,
      extension TEXT NOT NULL,
      source_path TEXT NOT NULL UNIQUE,
      search_text TEXT NOT NULL,
      is_top_hit INTEGER NOT NULL DEFAULT 0,
      play_count INTEGER NOT NULL DEFAULT 0,
      last_sung_at INTEGER,
      metadata_json TEXT
    );
    CREATE TABLE IF NOT EXISTS recent_singers (
      singer_name TEXT PRIMARY KEY,
      last_sung_at INTEGER NOT NULL
    );
    CREATE VIRTUAL TABLE IF NOT EXISTS tracks_fts USING fts5(
      title,
      artist,
      content='tracks',
      content_rowid='rowid'
    );
    CREATE INDEX IF NOT EXISTS idx_tracks_top_hit ON tracks(is_top_hit);
    CREATE INDEX IF NOT EXISTS idx_tracks_last_sung ON tracks(last_sung_at DESC);
    CREATE INDEX IF NOT EXISTS idx_tracks_artist_title ON tracks(artist, title);
  `);
}

export function upsertTrack(track: TrackRow) {
  db.runSync(
    `INSERT INTO tracks (id, artist, title, extension, source_path, search_text, is_top_hit, play_count, last_sung_at, metadata_json)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(source_path) DO UPDATE SET
      artist=excluded.artist,
      title=excluded.title,
      extension=excluded.extension,
      search_text=excluded.search_text,
      is_top_hit=excluded.is_top_hit,
      metadata_json=excluded.metadata_json`,
    [
      track.id,
      track.artist,
      track.title,
      track.extension,
      track.source_path,
      track.search_text,
      track.is_top_hit,
      track.play_count,
      track.last_sung_at,
      track.metadata_json,
    ]
  );

  db.runSync(
    `DELETE FROM tracks_fts
     WHERE rowid = (SELECT rowid FROM tracks WHERE source_path = ?)`,
    [track.source_path]
  );

  db.runSync(
    `INSERT INTO tracks_fts(rowid, title, artist)
     SELECT rowid, title, artist FROM tracks WHERE source_path = ?`,
    [track.source_path]
  );
}
