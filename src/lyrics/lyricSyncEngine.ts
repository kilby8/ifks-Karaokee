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
  let activeLine: LrcLine | null = null;
  let nextLine: LrcLine | null = null;
  for (let i = 0; i < lrcLines.length; i += 1) {
    if (lrcLines[i].timeMs <= positionMs) {
      activeLine = lrcLines[i];
      nextLine = lrcLines[i + 1] || null;
    }
  }

  let activeCdgFrame: CdgFrame | null = null;
  for (let i = 0; i < cdgFrames.length; i += 1) {
    if (cdgFrames[i].atMs <= positionMs) activeCdgFrame = cdgFrames[i];
    else break;
  }

  return { activeLine, nextLine, activeCdgFrame };
}
