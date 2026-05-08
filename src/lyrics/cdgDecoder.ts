export type CdgFrame = {
  atMs: number;
  bitmap: Uint8ClampedArray;
  width: number;
  height: number;
};

export type CdgDecoder = {
  decodeFrames: (cdgBinary: Uint8Array) => CdgFrame[];
};

export const createCdgDecoder = (): CdgDecoder => ({
  decodeFrames(cdgBinary: Uint8Array) {
    void cdgBinary;
    return [];
  },
});
