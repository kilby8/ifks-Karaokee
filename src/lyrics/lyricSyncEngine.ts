import { CdgFrame } from './cdgDecoder';
import { LrcLine } from './lrcParser';

export type LyricSyncState = {
  activeLine: LrcLine | null;
  nextLine: LrcLine | null;
  activeCdgFrame: CdgFrame | null;
};

export function getSyncedLyricState(
  positionMs: number,
  lrcLines: LrcLine[],
  cdgFrames: CdgFrame[]
): LyricSyncState {
  let activeLineIndex = -1;
  let left = 0;
  let right = lrcLines.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (lrcLines[mid].timeMs <= positionMs) {
      activeLineIndex = mid;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  const activeLine = activeLineIndex >= 0 ? lrcLines[activeLineIndex] : null;
  const nextLine = activeLineIndex >= 0 ? lrcLines[activeLineIndex + 1] || null : null;

  let activeCdgFrame: CdgFrame | null = null;
  for (let i = 0; i < cdgFrames.length; i += 1) {
    if (cdgFrames[i].atMs <= positionMs) activeCdgFrame = cdgFrames[i];
    else break;
  }

  return { activeLine, nextLine, activeCdgFrame };
}
