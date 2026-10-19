// Tells IndexNow (Bing, Yandex, Seznam, Naver) that every URL in the live
// sitemap may have changed, so they recrawl within hours instead of waiting
// for their own schedule. Run by .github/workflows/indexnow.yml after each
// production deploy.
//
// The key is the name of the public/<32 hex>.txt file, which IndexNow fetches
// from the site to confirm we own it.

import { readdirSync } from "node:fs";

const site = "https://www.kevinchen.com.au";

const keyFile = readdirSync(new URL("../public/", import.meta.url)).find(
  (name) => /^[0-9a-f]{32}\.txt$/.test(name),
);
if (!keyFile) throw new Error("No IndexNow key file in public/");
const key = keyFile.replace(/\.txt$/, "");

const sitemap = await (await fetch(`${site}/sitemap.xml`)).text();
// Page entries only: <image:loc> children also contain <loc>.
const urlList = [...sitemap.matchAll(/<url>\s*<loc>([^<]+)<\/loc>/g)].map(
  (match) => match[1],
);
if (urlList.length === 0) throw new Error("Sitemap had no URLs");

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: new URL(site).host,
    key,
    keyLocation: `${site}/${keyFile}`,
    urlList,
  }),
});

// 200 = accepted, 202 = accepted but the key is still being verified.
if (response.status !== 200 && response.status !== 202) {
  throw new Error(
    `IndexNow returned ${response.status}: ${await response.text()}`,
  );
}
console.log(`IndexNow accepted ${urlList.length} URLs (${response.status})`);
