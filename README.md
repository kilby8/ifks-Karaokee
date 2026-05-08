# ifks-Karaokee

IKFS boilerplate for a high-performance Expo/React Native karaoke manager.

## Architecture

See `/home/runner/work/ifks-Karaokee/ifks-Karaokee/docs/ARCHITECTURE.md` for the full architecture and integration notes.

## Boilerplate modules

- `src/db/database.ts`: SQLite schema, indexes, and FTS setup.
- `src/metadata/filenameParser.ts`: inconsistent karaoke filename parsing.
- `src/metadata/metadataEngine.ts`: directory scan + local AI categorization + DB upsert.
- `src/lyrics/lrcParser.ts`: `.lrc` parser.
- `src/lyrics/cdgDecoder.ts`: `.cdg` frame decoder interface.
- `src/lyrics/lyricSyncEngine.ts`: frame-perfect timeline synchronization.
- `src/lyrics/LyricCanvasRenderer.tsx`: canvas-based rendering template.
- `src/search/smartSearch.ts`: fuzzy search with Top Hits + Recent Singer weighting.
- `src/ai/geminiNanoAnalyzer.ts`: Gemini Nano 10-second quality/vocal analysis template.
- `src/ui/theme.ts`: dark mode KJ theme tokens.
