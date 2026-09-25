# QR Code Generator

A fast, private QR code generator. Paste a link, get a scannable QR code, and download it as **PNG or SVG**. Everything runs in the browser, and your history is saved locally.

It rebuilds [qrcode.rldhaka.com](https://qrcode.rldhaka.com/) and fixes several problems with the original:

| Original                                                                      | This version                                                                                     |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Needed a server round-trip (`apiqr…/GenerateQRCode`) and stored files on disk | Generated **instantly on the client**, with no backend                                           |
| History lost on refresh                                                       | History **persisted in localStorage** (max 50), with per-item delete + undo and a "Clear all"    |
| "Download" opened a cross-origin SVG named `.png`                             | Real **PNG** (any size from 256 to 1024px) and **SVG** downloads with meaningful filenames       |
| Accepted any `new URL()` input (e.g. `javascript:`)                           | Only allows **http/https**, auto-adds `https://`, 2048-character limit                           |
| No customization                                                              | Colors, dot and corner styles, margin, error correction, **centre logo**, and a contrast warning |
| `<title>v0 App</title>`, dead footer links                                    | Full metadata, OG image, sitemap, robots, manifest, and real Privacy/Terms pages                 |
| Icon buttons without labels                                                   | Accessible labels and tooltips, keyboard support, dark mode                                      |

## Tech stack

- **Next.js 16** (App Router, fully static) · **React 19** · **TypeScript**
- **Tailwind CSS v4** plus shadcn/ui-style components on **Radix UI** (in `components/ui`)
- **qr-code-styling** for QR rendering · **zustand** (persist) for history and settings
- **react-hook-form + zod** for validation · **sonner** for toasts · **next-themes** · **lucide-react** · Geist font
- **Vitest + Testing Library** (unit) · **Playwright + jsQR** (E2E; the tests decode the downloaded PNGs)

## Getting started

```bash
npm install
cp .env.example .env.local   # optional: set NEXT_PUBLIC_SITE_URL
npm run dev                  # http://localhost:3000
```

## Scripts

| Command                       | What it does                                                            |
| ----------------------------- | ----------------------------------------------------------------------- |
| `npm run dev`                 | Dev server (Turbopack)                                                  |
| `npm run build` / `npm start` | Production build / serve                                                |
| `npm run check`               | Type-check, lint and unit tests                                         |
| `npm test`                    | Unit tests (Vitest)                                                     |
| `npm run test:e2e`            | E2E tests, desktop and mobile (builds and starts the app automatically) |
| `npm run format`              | Prettier (with Tailwind class sorting)                                  |

E2E tests need a Playwright browser. Install one with `npx playwright install chromium`, or point to an existing Chromium with `PLAYWRIGHT_CHROMIUM_PATH=/path/to/chrome`. To test against a server that's already running, set `E2E_BASE_URL=http://localhost:3000`.

## Project structure

```
app/                 layout, home page, privacy/terms, robots, sitemap, manifest, OG image, icon
components/
  qr/                qr-app (state orchestration), generator form, result card,
                     customizer, history + history item, download menu
  ui/                button, card, input, label, select, slider, dropdown, tooltip, alert-dialog, sonner
  site-header, site-footer, theme toggle/provider, legal-page
lib/
  qr.ts              generate SVG, PNG rasterising, downloads, clipboard, contrast helpers
  validators.ts      zod URL schema (http/https only, normalisation)
  logo.ts            logo upload validation and downscaling (≤256px)
  safe-storage.ts    localStorage wrapper that trims history when the quota is full
  site.ts            site name, URL and contact details
store/               zustand stores: history (persisted) and settings (persisted)
types/qr.ts          QrItem / QrOptions
tests/               unit tests    e2e/   Playwright specs
```

## Deployment

The app is fully static, so it runs on **Vercel** with no configuration. For **Cloudflare Pages** or any static host, add `output: "export"` to `next.config.ts` and deploy the `out/` folder. Set `NEXT_PUBLIC_SITE_URL` to the production domain so canonical URLs, the sitemap and OG tags are correct.

## Quality (verified)

- 25 unit tests and 18 E2E tests (9 × desktop and mobile) pass
- Lighthouse on the production build: Performance 96, Accessibility 100, Best Practices 100, SEO 100
- No horizontal scroll at 390px, and no console errors

## Next steps (Phase 4 in the plan, optional)

Add a backend (Postgres plus a Next.js Route Handler or ASP.NET Core) for dynamic, trackable QR codes: `/r/:shortId` redirects, scan analytics, accounts and synced history.
