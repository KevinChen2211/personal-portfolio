# Kevin Chen · Portfolio

Personal site for Kevin Chen — engineer and creative developer. A single-page home anchors the experience, with dedicated sections for projects, photography, writing, and contact.

## Features

- Landing page with scroll-aware navigation, hero animations, and a visual grid linking to each section
- **Projects** — case studies with detail pages (`/projects/[slug]`)
- **Gallery** — photo collections with full-screen viewers (`/gallery/collection/[slug]`)
- **Journal** — blog posts rendered from markdown (`/journal/[slug]`)
- **About** — bio, experience, and skills with scroll-triggered reveals
- **Contact** — inquiry and availability
- Light/dark theme toggle with shared color palettes
- First-visit loading screen and session-aware hero fade-in
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

   Visit `http://localhost:3000` to view the site locally.

3. **Lint / type-check**

   ```bash
   npm run lint
   ```

4. **Create a production build (optional)**

   ```bash
   npm run build && npm start
   ```

## Project Structure

- `app/page.tsx` — home page and section grid
- `app/projects/` — project listing and detail pages
- `app/gallery/` — gallery and collection viewers
- `app/journal/` — journal listing and post pages
- `app/about/page.tsx` — about page
- `app/contact/page.tsx` — contact page
- `app/components/` — shared UI (navbar, theme, loading screen, scroll hooks)
- `app/data/` — projects and blog content
- `app/layout.tsx` — global fonts, theme provider, and metadata
- `app/globals.css` — Tailwind import and theme tokens
- `public/` — images and static assets
