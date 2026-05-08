import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import { Canvas } from '@shopify/react-native-skia';
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

  return (
    <View style={{ width, height }}>
      <Canvas style={{ width, height }}>
      </Canvas>
      <Text
        style={{
          position: 'absolute',
          left: 40,
          bottom: 80,
          fontSize: 28,
          color: '#F5F8FF',
        }}
      >
        {state.activeLine?.text || ''}
      </Text>
      <Text
        style={{
          position: 'absolute',
          left: 40,
          bottom: 40,
          fontSize: 28,
          color: '#F5F8FF',
          opacity: 0.55,
        }}
      >
        {state.nextLine?.text || ''}
      </Text>
    </View>
  );
}
