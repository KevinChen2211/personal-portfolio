// Inline images in `app/data/*` prose use a custom marker instead of standard
// markdown: `![IMAGE:/path/to/photo.jpg|Alt text]`, where the alt text is
// optional.
//
// Anything that reads a path back out of a marker must go through here. The
// alt text was added after several call sites had each grown their own
// `!\[IMAGE:(.+?)\]` regex, and every one of them started returning
// "/photo.jpg|Alt text" as an image src.
export const IMAGE_MARKER_PATTERN = /!\[IMAGE:([^\]|]+?)(?:\|([^\]]*))?\]/;

export interface ImageMarker {
  path: string;
  alt?: string;
}

export function parseImageMarker(marker: string): ImageMarker | null {
  const match = marker.match(IMAGE_MARKER_PATTERN);
  if (!match) return null;

  const alt = match[2]?.trim();
  return { path: match[1].trim(), alt: alt || undefined };
}

// The first inline image in a body of prose, used for card thumbnails, Open
// Graph images and sitemap entries.
export function extractFirstImagePath(content: string): string | undefined {
  return parseImageMarker(content)?.path;
}
