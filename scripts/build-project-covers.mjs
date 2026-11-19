// Renders the illustrated project title cards, drawn as SVG in
// scripts/project-covers, to PNGs the projects page can use like photos.
// Rerun after editing one:
//
//   node scripts/build-project-covers.mjs
//
// Writes public/projects-images/<name>-cover.png at 1200 x 1600 (3:4, the
// shape of a project card). Write non-ASCII text as XML entities (&#215;):
// the SVG renderer rejects raw UTF-8.

import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const source = fileURLToPath(new URL("./project-covers/", import.meta.url));
const target = fileURLToPath(new URL("../public/projects-images/", import.meta.url));

for (const file of readdirSync(source).filter((name) => name.endsWith(".svg"))) {
  const name = file.replace(/\.svg$/, "-cover.png");
  const info = await sharp(source + file)
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toFile(target + name);
  console.log(`${file} -> ${name} (${Math.round(info.size / 1024)} KB)`);
}
