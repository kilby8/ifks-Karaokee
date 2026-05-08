export type LrcLine = {
  timeMs: number;
  text: string;
};

const LRC_TIME_RE = /\[(\d{2}):(\d{2})(?:\.(\d{1,3}))?\]/g;

export function parseLrc(content: string): LrcLine[] {
  const lines: LrcLine[] = [];

  for (const rawLine of content.split('\n')) {
    const timeMatches = [...rawLine.matchAll(LRC_TIME_RE)];
    if (!timeMatches.length) continue;

    const text = rawLine.replace(LRC_TIME_RE, '').trim();
    for (const match of timeMatches) {
      const mm = Number(match[1]);
      const ss = Number(match[2]);
      const fraction = match[3] || '0';
      let ms = Number(fraction.slice(0, 3));
      if (fraction.length === 1) ms *= 100;
      else if (fraction.length === 2) ms *= 10;
      lines.push({ timeMs: mm * 60000 + ss * 1000 + ms, text });
    }
  }

  return lines.sort((a, b) => a.timeMs - b.timeMs);
}
