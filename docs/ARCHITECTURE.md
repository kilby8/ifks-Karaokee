# IKFS Android (Expo) Architecture

## 1) Local Metadata Engine

Pipeline:

1. `scanDirectory()` discovers local karaoke files (`zip`, `mp3`, `cdg`, `lrc`, `mp4`).
2. `parseKaraokeFilename()` normalizes inconsistent names (e.g. `Artist - Title [MP3+G].zip`, `Title_Artist.cdg`).
3. `classifyWithOnDeviceModel()` uses on-device AI labels (genre/mood/quality hints).
4. `upsertTrack()` writes normalized rows to SQLite (`tracks`, `recent_singers`, FTS table).

Performance notes:

- batched transactions
- normalized search column + FTS5
- indexed fields for artist/title/popularity/recency

## 2) Lyric Sync & Rendering

- `.lrc`: parsed into millisecond timestamp lines.
- `.cdg`: decoded as frame stream (`300 fps ticks` style model; render at active playback time).
- `LyricSyncEngine` resolves active frame/line at `audioPositionMs`.
- `LyricCanvasRenderer` draws current + upcoming line on a canvas layer (Skia template).

## 3) Smart Search

- token normalization + lightweight edit-distance scoring.
- rank formula:
  - fuzzy text relevance
  - `is_top_hit` boost
  - recent singer recency boost
- SQL prefilter + in-memory ranking keeps response fast for 50k+ entries.

## 4) AI Quality + Vocal Check (Gemini Nano)

- extract 10-second local snippet (offline).
- pass local waveform features + prompt to Gemini Nano bridge.
- return:
  - `qualityScore` (0-1)
  - `hasLeadVocals`
  - `isInstrumentalOnly`
  - `notes`

## 5) Tech stack mapping

- Frontend: React Native (Expo)
- Storage: SQLite (`expo-sqlite`)
- Audio control: `expo-av` template hooks for playback timing (pitch/tempo pluggable)
- Styling: dark-mode KJ theme tokens in `src/ui/theme.ts`
