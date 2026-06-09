// Average adult reading speed for digital prose. Tweak if blog content
// shifts toward more dense / technical material.
const WORDS_PER_MINUTE = 150;

/**
 * Estimate reading time (in whole minutes) for a markdown blog body.
 * Strips image / video placeholders and lightweight markdown so the count
 * reflects actual prose, not syntax.
 */
export function readingTime(content: string): number {
  const text = content
    .replace(/!\[IMAGE:[^\]]+\]/g, "")
    .replace(/\[IMAGE PLACEHOLDER:[^\]]+\]/g, "")
    .replace(/\[YOUTUBE:[^\]]+\]/g, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/[#>*_~]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) return 1;
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
