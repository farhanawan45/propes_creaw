# Props & Crew — Website

A premium, custom-coded single-page site for Props & Crew (propsncrew.co.nz),
a New Zealand event and destination management company.

Next.js (App Router) + TypeScript + Tailwind CSS v4, GSAP/ScrollTrigger,
Lenis smooth scroll, Framer Motion. Design system: Midnight/Porcelain/Saffron,
Inter Tight + Geist + Geist Mono.

## Getting started

```bash
npm install
cp .env.example .env   # fill in SMTP credentials for the contact form
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # ESLint
```

## Where everything lives

- **All copy, services, work projects, contact details, nav links** —
  `src/content/site.ts`. Single file to edit when the client sends real
  content; nothing else needs to change. The 14 service names here must
  stay exactly as given.
- **Logo** — `public/brand/logo.svg` (placeholder text mark; drop in the
  real logo SVG at the same path).
- **Hero video** — `public/videos/intro.mp4` (not included — see below)
  and its poster `public/images/hero-poster.jpg`.
- **Images** — `public/images/*.jpg`, real New Zealand/event photography
  (Unsplash, verified individually), named by section/service.
- **Contact form email delivery** — `src/lib/mailer.ts` +
  `src/app/api/contact/route.ts`, configured via `.env`.
- **Security headers** — `next.config.ts`.
- **Deployment (Hostinger VPS)** — `DEPLOYMENT.md`.

## QA scripts

`scripts/screenshot.js` and `scripts/interactive-check.js` drive a local
Playwright Chromium install to screenshot every section at 390/768/1440/1920
and exercise the fullscreen menu, service drawer and reduced-motion mode.
Run with `node scripts/screenshot.js` (dev server must be running). The
Chromium binary lives outside node_modules at
`%LOCALAPPDATA%\ms-playwright\chromium-1243` — reinstall with
`npx playwright install chromium` if it's missing (increase
`PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT` if the download stalls on a slow
connection).

## Still needs the client's real content

- **Hero video**: `public/videos/intro.mp4` doesn't exist — I could not
  safely source a specific stock video file without guessing a URL. The
  Hero component detects the missing file and falls back to a slow
  Ken Burns crossfade of 4 real NZ landscape photos, so nothing breaks.
  Drop a real cinematic NZ/event video at that exact path once available.
- **Logo**: placeholder text mark — replace with the real brand SVG.
- **Work / Selected Events**: six demo projects with real but generic NZ
  imagery — replace with real case studies in `src/content/site.ts`.
- **Contact details**: phone, email, WhatsApp number and office address in
  `src/content/site.ts` are placeholders.
- **SMTP credentials**: required in `.env` for the contact form to send
  email (validation/rate-limiting work without them; delivery will not).
- **Privacy Policy / Terms pages**: footer and form links point to
  `#privacy` / `#terms` placeholders — need real pages once legal content
  exists.
