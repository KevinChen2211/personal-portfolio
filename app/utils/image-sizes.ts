import path from "node:path";
import { extractImagePaths } from "./image-marker";

export interface ImageSize {
  width: number;
  height: number;
}

async function loadSharp() {
  try {
    return (await import("sharp")).default;
  } catch {
    return null;
  }
}

// Reads the pixel size of every inline image in a body of prose so next/image
// can reserve the right box before the file downloads. Server-only: it runs
// while the journal and project pages are prerendered. Images that can't be
// read are left out, and the renderer gives them a 4:3 box instead.
export async function readImageSizes(
  content: string,
): Promise<Map<string, ImageSize>> {
  const sizes = new Map<string, ImageSize>();
  const sharp = await loadSharp();
  if (!sharp) return sizes;

  await Promise.all(
    Array.from(new Set(extractImagePaths(content)), async (src) => {
      try {
        const { width, height, orientation } = await sharp(
          path.join(process.cwd(), "public", src),
        ).metadata();
        if (!width || !height) return;
        // EXIF orientations 5-8 are stored rotated 90 degrees and served
        // upright, so the box the reader sees is the transpose.
        sizes.set(
          src,
          (orientation ?? 1) >= 5
            ? { width: height, height: width }
            : { width, height },
        );
      } catch {
        // Missing or unreadable file: it keeps the fallback box.
      }
    }),
  );

  return sizes;
}
