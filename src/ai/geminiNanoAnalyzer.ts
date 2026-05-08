import { NativeModules } from 'react-native';

export type KaraokeQualityReport = {
  qualityScore: number;
  hasLeadVocals: boolean;
  isInstrumentalOnly: boolean;
  notes: string;
};

type GeminiNanoBridge = {
  analyzeKaraokeSnippet: (params: { filePath: string; startMs: number; durationMs: number }) => Promise<KaraokeQualityReport>;
};

const { GeminiNanoModule } = NativeModules as { GeminiNanoModule?: GeminiNanoBridge };

export async function analyzeKaraokeFileWithGeminiNano(
  filePath: string,
  startMs = 0,
  durationMs = 10_000
): Promise<KaraokeQualityReport> {
  if (!GeminiNanoModule) {
    throw new Error('Gemini Nano native module is not linked. Add Android bridge implementation.');
  }

  return GeminiNanoModule.analyzeKaraokeSnippet({ filePath, startMs, durationMs });
}
