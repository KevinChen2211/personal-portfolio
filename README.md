# Kevin Chen · Under Construction

A dramatic, single-page “build log” that lets visitors know the full portfolio relaunch is in progress. The page combines motion-friendly gradients, caution-strip accents, and progress snapshots so people can follow along or reach out for work while the real site ships.

![Under construction preview](public/window.svg)

## Features

- Rich hero with progress meter, live milestone chips, and CTA buttons
- Build log cards that highlight what is done, shipping, or queued
- Contact + availability card so inquiries never miss a beat
- Tailwind-powered layout with soft glassmorphism and caution-pattern touches
- Metadata tuned for sharing (`app/layout.tsx`)

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4 (via `@import "tailwindcss"`)
- TypeScript

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run the dev server**

   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000` to see the under-construction page.

3. **Lint / type-check**

   ```bash
   npm run lint
   ```

4. **Create a production build (optional)**

   ```bash
   npm run build && npm start
   ```

## Project Structure

- `app/page.tsx` — the entire under-construction experience
- `app/layout.tsx` — global font loading + metadata
- `app/globals.css` — Tailwind import plus theme tokens
- `public/` — decorative assets (logos, window illustration, etc.)

## Customization Tips

- Update hero copy, progress %, or milestone chips inside `app/page.tsx`.
- Reorder the `highlights` and `updates` arrays to refresh the cards without changing layout code.
- Swap the CTA destinations (`mailto:` or social links) to match your communication preferences.
- Add analytics or waitlist forms by extending the `Build log updates` card grid.

## Deployment

Deploy anywhere that supports Node.js hosting (Vercel, Netlify, Render, etc.). On Vercel, the defaults work out of the box:

```bash
npm run build
```

Set the project to “Next.js” and point it at the main branch—no extra config required.

## Contact

- Email: `hello@kevinchen.design`
- Time zone: GMT-8 (Pacific)
- Availability: 2 collaboration slots while the site ships

If you ship improvements, feel free to open a PR or reach out first. Thanks for watching the build unfold!
