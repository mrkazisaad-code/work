# Koeos website

A single-page static site built from *Koeos website: design and content specification* (21 Oct 2026). The only server dependency is the contact form endpoint.

## Commands

```sh
npm install
npm run dev          # Astro dev server (the form endpoint is not available here)
npm run build        # static build to dist/ + content guardrails
npm run preview      # serves dist/ with /api/contact on http://localhost:4321 (console delivery)
npm run check:content -- --release   # fails while owner items below are still open
npm run gen:map      # regenerate the A7 Europe outline (build-time only)
npm run gen:og       # regenerate og.png and PNG icons
```

QA scripts (need `npm run preview` running): `node qa/shots.mjs [--w=360,768] [--reduced] [--nojs]` for screenshots, and `node qa/interact.mjs` for the interaction checks (popovers, dialogs, menu, header, form, reduced motion, no-JS).

## Architecture

- **Astro 5, static output, TypeScript.** No UI framework. All CSS is inlined into the HTML, so the first response carries the styles.
- **Design tokens** are CSS custom properties in `src/styles/global.css`: palette, fluid type scale (mobile value at 360px up to desktop value at 1440px), spacing, grid and motion timings.
- **Fonts** are self-hosted Latin-subset WOFF2 files (`public/fonts`): Schibsted Grotesk 500/700, IBM Plex Sans 400/600 and IBM Plex Mono 500. They use `font-display: swap`, the two heading weights are preloaded, and the fallback faces carry metric overrides so the font swap causes no layout shift. The page makes no requests to Google.
- **Sections** live one per component in `src/components/sections/`. The copy follows section 7 of the spec word for word.
- **Diagrams** are inline SVG (A3 to A7). A4 and A8 are drawn in the DOM, and A1 uses one 2D canvas. The A6 and A7 diagrams each come in two compositions (wide and compact) so their labels stay at about 11px on every screen, rather than shrinking.
- **The HTML holds the final state** of every scene: drawn lines, lit nodes, outcome counters and final figures. Initial states are applied only under `html.js.motion`. The `motion` class is set by a tiny inline script when `prefers-reduced-motion` is not `reduce`. With JavaScript off or reduced motion on, every section renders complete.
- **JavaScript** is one module of about 7.6 KB gzip (`src/scripts/`). Each enhancement runs inside a try/catch. If one fails, the page drops back to the static final state.
- **Source markers** use the native Popover API. Click, tap, keyboard, Escape and outside click all work without JavaScript. The script adds positioning next to the marker and opening on hover.
- **Contact form**:
  - `server/contact/` holds a provider-agnostic handler built on web-standard `Request`/`Response`, with shared validation (also used in the browser), a honeypot, rate limiting (5 per IP per 10 minutes, using a salted hash of the IP and never the raw address) and pluggable delivery (email API or webhook).
  - `functions/api/contact.ts` is the Cloudflare Pages adapter. To change provider, write a new adapter around `handleContact`.
  - Nothing is stored beyond the time it takes to deliver the message.
  - Without JavaScript the form posts natively and the handler returns a minimal HTML page.

### Deploying the form (Cloudflare Pages example)

Set `EMAIL_API_KEY`, `CONTACT_TO`, `CONTACT_FROM` and `RATE_SALT`, and optionally a `RATE_KV` KV binding, which shares rate limits across instances. You can set `CONTACT_WEBHOOK_URL` to deliver to a webhook instead. Use an EU-region mail provider.

## Before launch: owner inputs

`npm run build` lists these after every build.

| Item | Where |
|---|---|
| Confirm the contact email. The spec shows both `[hello@koeos.io]` (placeholder) and `info@koeos.io` (section 11); the site uses `info@koeos.io`. | `CONTACT_EMAIL` in `src/config/site.ts` |
| Confirm the LinkedIn URL | `LINKEDIN_URL` in `src/config/site.ts` |
| Logistics card: the clause “through the company’s acquisition” is withheld until confirmed. Set the flag to `true` to restore the spec wording. | `CONTENT_FLAGS.ACQUISITION_WORDING_CONFIRMED` |
| Confirm “180 people” (counter and BPO card) | `CONTENT_FLAGS.TEAM_180_CONFIRMED` |
| Source 3 (Sequoia, “Services: The New Software”): article URL and date not verified; the link currently points to sequoiacap.com | `src/data/sources.ts` |
| Source 7: replace the Wikipedia link with the European Commission’s own page | `src/data/sources.ts` |
| Privacy notice wording needs owner/legal review | `src/pages/privacy.astro` |
