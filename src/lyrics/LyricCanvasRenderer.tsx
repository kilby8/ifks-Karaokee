import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import { Canvas } from '@shopify/react-native-skia';
import { CdgFrame } from './cdgDecoder';
import { LrcLine } from './lrcParser';
import { getSyncedLyricState } from './lyricSyncEngine';
import { darkKJTheme } from '../ui/theme';

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

  return (
    <View style={{ width, height }}>
      <Canvas style={{ width, height }}>
      </Canvas>
      <Text
        style={{
          position: 'absolute',
          left: darkKJTheme.spacing.lg,
          bottom: darkKJTheme.spacing.xl + darkKJTheme.spacing.lg,
          fontSize: 28,
          color: darkKJTheme.colors.textPrimary,
        }}
      >
        {state.activeLine?.text || ''}
      </Text>
      <Text
        style={{
          position: 'absolute',
          left: darkKJTheme.spacing.lg,
          bottom: darkKJTheme.spacing.lg,
          fontSize: 28,
          color: darkKJTheme.colors.textPrimary,
          opacity: 0.55,
        }}
      >
        {state.nextLine?.text || ''}
      </Text>
    </View>
  );
}
