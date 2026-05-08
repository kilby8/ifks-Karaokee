import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Canvas, Text as SkiaText, useFont } from '@shopify/react-native-skia';
import { CdgFrame } from './cdgDecoder';
import { LrcLine } from './lrcParser';
import { getSyncedLyricState } from './lyricSyncEngine';

type Props = {
  width: number;
  height: number;
  playbackMs: number;
  lrcLines: LrcLine[];
  cdgFrames: CdgFrame[];
};

export function LyricCanvasRenderer({ width, height, playbackMs, lrcLines, cdgFrames }: Props) {
  const state = useMemo(
    () => getSyncedLyricState(playbackMs, lrcLines, cdgFrames),
    [playbackMs, lrcLines, cdgFrames]
  );
  const font = useFont(undefined, 28);

  return (
    <View>
      <Canvas style={{ width, height }}>
        {font && (
          <>
            <SkiaText x={40} y={height - 80} text={state.activeLine?.text || ''} font={font} />
            <SkiaText
              x={40}
              y={height - 40}
              text={state.nextLine?.text || ''}
              font={font}
              opacity={0.55}
            />
          </>
        )}
      </Canvas>
    </View>
  );
}
