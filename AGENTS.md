# AGENTS.md

Guidance for AI agents working in this repo. Keep changes small, match the existing style, and verify in the browser when touching animations.

## Project

Personal portfolio for Kevin Chen. Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4. Photography-heavy, animation-heavy, deployed on Vercel.

## Commands

```bash
npm run dev      # start dev server (runs image optimization first via predev)
npm run lint     # eslint (run after edits)
npm run build    # production build (also optimizes images via prebuild)
npm run format   # prettier
```

There is usually a dev server already running on `http://localhost:3000` (check the terminals folder before starting a new one).

## Layout

- `app/<route>/page.tsx` — routes: `page` (home), `projects`, `gallery`, `journal`, `contact`.
- Dynamic routes: `app/projects/[slug]`, `app/journal/[slug]`, `app/gallery/collection/[slug]`.
- Per-route `layout.tsx` files (projects/gallery/journal/contact) exist only to attach page `metadata` since those pages are client components; dynamic routes use `generateMetadata`.
- `app/data/projects.ts`, `app/data/blogs.ts` — all project and journal **content** lives here (prose, highlights, image markers). Edit copy here, not in the page components.
- `app/components/` — shared UI (Navbar, NavInner, LoadingScreen, useScrollAnimation). Every page uses the fixed `Navbar`; `NavInner` owns the wordmark/nav/social block and contracts `KEVIN CHEN` to `KC` after scrolling.
- `app/utils/` — markdown rendering, date, reading-time helpers.
- `app/globals.css` — theme tokens (motion durations/easings, plus `--font-serif` / `--font-serif-name` for the editorial serif stack), fonts, and global styles. The site is a single fixed cream palette (`#FAF2E6` bg / `#2C2C2C` text); there is no light/dark theme.
- `.site-container` in `app/globals.css` provides the centered 1200px desktop shell. Do not apply it to the gallery track or collection photo stage; those views intentionally remain full-viewport.
- `app/sitemap.ts`, `app/robots.ts` — generated `sitemap.xml` / `robots.txt` (update the `baseUrl` if the domain changes).
- `next.config.ts` — image optimization config (AVIF/WebP, device sizes, `images.qualities`).

## Motion

Animations use shared CSS tokens in `globals.css`: `--ease-out`, `--ease-in-out`, `--duration-fast` (600ms) through `--duration-slowest` (2400ms). Prefer these for page-level motion (home, projects, journal). Gallery keeps its own snappier timings (~0.5–1s).

A fixed `.film-grain` overlay lives in `app/template.tsx` (CSS in `globals.css`). Loading screen is name-only fade — no progress bar.

`app/utils/motion.ts` exports `usePrefersReducedMotion()` — use it to skip or shorten animations when the user prefers reduced motion.

## Content conventions (`app/data/*`)

- Inline images in prose use the marker `![IMAGE:/path/to/image.jpg]` (parsed by `app/utils/markdown.tsx`), not standard markdown image syntax with alt text.
- Project `description` is markdown prose; `highlights` is a string[] of résumé-style bullets. Preserve image markers and URLs exactly when editing copy.
- Write in a natural, first-person voice. Avoid AI-tell phrasing (e.g. "comprehensive", "robust", "world-class", "the results spoke for themselves", "isn't just X, it's Y", heavy em-dashes and rule-of-three lists).

## Gotchas

- **`next/image` with `fill`**: never set `width`, `height`, `top`, `left`, `right`, or `bottom` in its `style`. Next throws a runtime error. To bleed past edges (e.g. to hide sub-pixel seam lines during scale animations) use `transform: "scale(1.01)"` instead.
- **Image `quality`**: any custom `quality` must be listed in `images.qualities` in `next.config.ts` (currently `[60, 70, 75, 80, 85]`) or Next.js logs a dev warning. Add new values there. Every full-size render of a gallery photo uses `PHOTO_QUALITY` (85) — changing `quality` or `sizes` on one surface but not the others makes the same photo a separate `/_next/image` entry and forces a cold AVIF encode on first view.
- **Gallery animations** (`app/gallery/page.tsx`): the desktop view uses a hand-rolled rAF scroll/parallax loop that pauses when idle, plus CSS-transition-based open/close. To make a transition reliably play, commit the start frame first, then change to the end frame on a later frame (see the `pendingExpand` effect) — don't set both in the same paint. A correctly timed transition still looks broken if the image has no pixels yet, so the expanded view renders through `ExpandedPhoto`: the already-cached thumbnail variant underneath, the fullscreen variant cross-fading in on load. Keep both layers on the same `quality`/`sizes` contract as the track thumbnail.
- This is a `"use client"` page-heavy app; most interactive pages are client components.

## Verifying UI changes

For animation/layout changes, confirm in the browser (open `http://localhost:3000`, exercise the flow, screenshot) rather than relying on compile success alone. Run `npm run lint` after edits.
