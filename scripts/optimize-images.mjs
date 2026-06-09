#!/usr/bin/env node
/**
 * Optional one-shot image optimizer.
 *
 *   npm run optimize-images
 *
 * Walks `public/` and, for any image larger than ~600 KB, produces a
 * resized + recompressed copy that's still very high quality (max 2400px
 * on the long edge, JPEG q=82 / PNG palette). Originals are moved to
 * `public/.originals/` so the operation is reversible.
 *
 * Run this once after adding new gallery / blog photos. Next.js Image will
 * still generate AVIF/WebP at request time on top of these.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const publicDir = path.join(root, "public");
const backupDir = path.join(publicDir, ".originals");

const SIZE_THRESHOLD = 600 * 1024; // ignore files already < 600 KB
const MAX_DIMENSION = 2400;
const JPEG_QUALITY = 82;

const exts = new Set([".jpg", ".jpeg", ".png"]);

async function loadSharp() {
  try {
    return (await import("sharp")).default;
  } catch (err) {
    // Don't fail the dev/build pipeline just because sharp wasn't installed
    // (e.g. fresh clone without `npm install` yet, or a CI env that skipped
    // optional deps). Print a clear hint and bow out cleanly.
    console.warn(
      "\n[optimize-images] sharp not installed — skipping image optimization." +
        "\n[optimize-images] Run `npm install` to enable it.\n"
    );
    process.exit(0);
  }
}

async function* walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue; // skip .originals etc.
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (exts.has(path.extname(entry.name).toLowerCase())) {
      yield full;
    }
  }
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function processFile(sharp, file) {
  const stat = await fs.stat(file);
  if (stat.size < SIZE_THRESHOLD) return null;

  const rel = path.relative(publicDir, file);
  const backupPath = path.join(backupDir, rel);

  // Already processed (we have a backup) — skip.
  try {
    await fs.access(backupPath);
    return null;
  } catch {}

  const buffer = await fs.readFile(file);
  const image = sharp(buffer, { failOn: "none" }).rotate(); // honour EXIF orientation

  const metadata = await image.metadata();
  const longEdge = Math.max(metadata.width || 0, metadata.height || 0);
  const ext = path.extname(file).toLowerCase();

  let pipeline = image;
  if (longEdge > MAX_DIMENSION) {
    pipeline = pipeline.resize({
      width: metadata.width >= metadata.height ? MAX_DIMENSION : undefined,
      height: metadata.height > metadata.width ? MAX_DIMENSION : undefined,
      withoutEnlargement: true,
    });
  }

  if (ext === ".png") {
    pipeline = pipeline.png({ compressionLevel: 9, palette: true });
  } else {
    pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
  }

  const out = await pipeline.toBuffer();

  if (out.length >= stat.size) {
    return { file: rel, before: stat.size, after: stat.size, skipped: true };
  }

  await ensureDir(path.dirname(backupPath));
  await fs.rename(file, backupPath);
  await fs.writeFile(file, out);

  return { file: rel, before: stat.size, after: out.length, skipped: false };
}

const fmt = (bytes) => `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

async function main() {
  const sharp = await loadSharp();
  await ensureDir(backupDir);

  let totalBefore = 0;
  let totalAfter = 0;
  let processed = 0;

  for await (const file of walk(publicDir)) {
    const result = await processFile(sharp, file);
    if (!result) continue;
    if (result.skipped) {
      console.log(`= ${result.file} (already small enough)`);
      continue;
    }
    processed++;
    totalBefore += result.before;
    totalAfter += result.after;
    const saved = ((1 - result.after / result.before) * 100).toFixed(1);
    console.log(
      `✓ ${result.file}  ${fmt(result.before)} → ${fmt(result.after)}  (-${saved}%)`
    );
  }

  if (processed === 0) {
    console.log("Nothing to optimize.");
  } else {
    const totalSaved = ((1 - totalAfter / totalBefore) * 100).toFixed(1);
    console.log(
      `\nDone. ${processed} file(s) optimized.  ${fmt(totalBefore)} → ${fmt(
        totalAfter
      )}  (-${totalSaved}%)`
    );
    console.log(`Originals preserved in ${path.relative(root, backupDir)}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
