export type ParsedFilename = {
  artist: string;
  title: string;
  extension: string;
  rawName: string;
};

function cleanToken(value: string) {
  return value
    .replace(/\[(.*?)\]/g, '')
    .replace(/\((.*?)\)/g, '')
    .replace(/[._]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function parseKaraokeFilename(fileName: string): ParsedFilename {
  const extension = (fileName.split('.').pop() || '').toLowerCase();
  const rawName = fileName.replace(/\.[^/.]+$/, '');
  const normalized = cleanToken(rawName);

  let artist = 'Unknown Artist';
  let title = normalized || 'Unknown Title';

  const dashFormat = normalized.match(/^(.+?)\s*-\s*(.+)$/);
  if (dashFormat) {
    artist = dashFormat[1].trim();
    title = dashFormat[2].trim();
    return { artist, title, extension, rawName };
  }

  const underscore = normalized.split(' ');
  if (underscore.length > 1) {
    title = underscore[0].trim();
    artist = underscore.slice(1).join(' ').trim();
  }

  return { artist, title, extension, rawName };
}
