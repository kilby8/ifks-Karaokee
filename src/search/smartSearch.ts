import { db } from '../db/database';

export type SearchResult = {
  id: string;
  artist: string;
  title: string;
  score: number;
  is_top_hit: number;
  last_sung_at: number | null;
};

function normalize(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function editDistance(a: string, b: string): number {
  const matrix = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i += 1) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
    }
  }
  return matrix[a.length][b.length];
}

function scoreResult(query: string, candidate: { artist: string; title: string; is_top_hit: number; last_sung_at: number | null }) {
  const target = normalize(`${candidate.artist} ${candidate.title}`);
  const q = normalize(query);
  const maxLen = Math.max(1, target.length, q.length);
  const fuzzyScore = 1 - editDistance(q, target.slice(0, Math.max(target.length, q.length))) / maxLen;
  const topHitBoost = candidate.is_top_hit ? 0.2 : 0;
  const now = Date.now();
  const recentWeight =
    candidate.last_sung_at && now > candidate.last_sung_at
      ? Math.max(0, 0.15 - (now - candidate.last_sung_at) / (1000 * 60 * 60 * 24 * 60))
      : 0;
  return fuzzyScore + topHitBoost + recentWeight;
}

export function smartSearch(query: string, limit = 40): SearchResult[] {
  const rows = db.getAllSync<{
    id: string;
    artist: string;
    title: string;
    is_top_hit: number;
    last_sung_at: number | null;
  }>(
    `SELECT id, artist, title, is_top_hit, last_sung_at
     FROM tracks
     WHERE search_text LIKE ?
     ORDER BY is_top_hit DESC, last_sung_at DESC
     LIMIT 300`,
    [`%${normalize(query)}%`]
  );

  return rows
    .map((row) => ({ ...row, score: scoreResult(query, row) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
