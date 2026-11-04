# Portfolio

A frontend developer portfolio built with Next.js 16 (App Router), React 19, Tailwind CSS v4 and Framer Motion.

The site is dark-first with an optional light mode, uses a single accent colour (Signal Blue `#5B8DEF`) against a neutral near-black, and carries a consistent "engineering blueprint" motif — a 1px grid, section numbering and mono metadata labels.

---

## Getting started

```bash
npm run dev     # dev server
npm run build   # production build
npm run lint    # eslint (includes the React Compiler rules)
```

---

## Content status

**All content lives in `src/data/`. You should not need to touch a component.**

Everything below is populated from `S_shivay_resume.pdf`. Anything still wrapped in `[SQUARE BRACKETS]` was **not** on the CV and needs your input.

```powershell
findstr /s /n /c:"[" src\data\*.js
```

| File | Status |
|---|---|
| `src/data/site.js` | ✅ Name, email, location, education, languages, SEO, resume PDF — ❗ needs LinkedIn + GitHub URLs and a site URL |
| `src/data/experience.js` | ✅ Complete — both roles with all CV metrics |
| `src/data/skills.js` | ✅ Complete — 7 categories, Angular-first, nothing outside the CV |
| `src/data/certificates.js` | ✅ 6 certificates with their PDFs in `public/certificates/` (title, date and ID copied off each document), plus 3 CV-only entries listed under "Also completed" — each PDF has a first-page `.webp` beside it for the card preview; regenerate it if the PDF changes |
| `src/data/signals.js` | ❗ Testimonials still empty |
| `src/data/projects.js` | ✅ **Job24 complete** — full case study + 5 screenshots. ⚠️ The other three still need problem / challenges / result |
| `src/data/about.js` | ✅ Written |
| `src/data/process.js` | ✅ Written |

### What still needs writing (in priority order)

1. **LinkedIn and GitHub URLs** in `site.js` — the CV's LinkedIn hyperlink isn't extractable from the PDF text layer.
2. **`problem` for HRMS, Crypto Payment Portal and Job Portal (React)** — the business situation before the project existed. Job24 is written; copy its shape.
3. **`challenges`** for those three — the hardest frontend problem you actually solved. Interviewers go straight here.
4. **`result`** for those three — what changed once it shipped.
5. **Screenshots** for those three — they currently render generated wireframes labelled "Screenshot pending".
6. **Real numbers for `performance.metrics`** — see below.

### Performance: techniques vs. metrics

The Performance block on a case study renders two different things, and the distinction is deliberate:

- **`performance.techniques`** — `{ icon, label, detail, effect }` cards describing engineering that was actually done. Safe to state, and they render as a card grid. Job24 has six.
- **`performance.metrics`** — `{ label, before, after }` rows claiming a *measured* outcome. These render as a table **only when the array has entries**; an empty array renders nothing at all.

### Getting real performance numbers

Every `performance.metrics` array is empty, including Job24's. To capture some in a few minutes:

1. Open the app in Chrome, DevTools → **Lighthouse** → Analyse. Record LCP and Total Blocking Time.
2. DevTools → **Network**, hard-reload, note the transferred JS size for the dashboard route.
3. DevTools → **Performance**, record while scrolling a long list; note the frame rate.

Then fill in `{ label, before, after }`. Only add a row where you have both halves — a "before" you never measured is a guess, and a guess is the one thing an interviewer can catch you on.

### Three rules the data files enforce

1. **No invented metrics.** The `35%` / `2.5s` / `10,000+ users` figures live in `experience.js` because your CV attributes them to the **role**, not to a named project. Project `performance.metrics` arrays are empty — fill one only if that number was measured on that project.
2. **No fake social proof.** `repositories` and `testimonials` are empty and render a clearly-labelled empty state rather than invented stars or quotes.
3. **No year claims you can't defend.** `skills.js` only carries a `years` value where the CV supports it. React, Next.js and Node are listed with `years: null` — real, but not four years deep, and stated that way.

### Positioning note

The site is positioned **Angular-first** (Angular · TypeScript · RxJS · NgRx), with React/Next.js/Node presented honestly as a secondary, real-but-shallower column. SEO keywords lead with "Angular Developer". Your phone number is in `site.js` but hidden — set `showPhone: true` to display it.

### Images

Project covers default to `src: null`, which renders a generated blueprint wireframe rather than a broken image. To use a real screenshot:

1. Drop the file in `public/projects/`
2. Set `cover.src: "/projects/your-file.png"` (recommended 1600×1000)
3. Write a real `alt` describing what the interface shows

### Resume

The PDF lives at `public/resume.pdf`. Replace that one file to publish a new version — every affordance reads `site.links.resume`, so nothing else needs touching.

There are two distinct actions, and they are deliberately different:

- **Download Resume** (hero, mobile nav, contact card) — a plain `<a download>` that saves the file.
- **View Resume** (contact card, footer, `⌘K → View resume`) — opens the **in-page viewer**.

**The viewer is first-party.** `src/components/resume/` renders the PDF to canvas with pdf.js inside a dialog styled like the rest of the site — no browser plugin chrome, no Google Docs viewer, no third-party branding. It has no download, print or edit control, and the PDF's annotation layer is off so the document's own hyperlinks cannot navigate out of the dialog.

That is presentation, not protection. `/resume.pdf` is a public URL and a Download button sits right next to the viewer by design; the right-click guard on the canvas is a speed bump, nothing more.

**It costs nothing until it is opened.** pdf.js is ~436KB plus a ~1MB worker. Both sit behind a `next/dynamic` import that only resolves when the dialog mounts, so a visitor who never opens the resume never downloads a byte of it. The worker is referenced via `new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url)` and emitted as a hashed asset, so its version can never drift from the installed `pdfjs-dist` — the failure you get from hand-copying the worker into `public/`.

The text layer is left on: a bare canvas is invisible to a screen reader, and it lets a recruiter select and copy the email address. If the renderer fails for any reason, the dialog falls back to a link that opens the PDF directly.

### SEO

Set `site.seo.url` to your real domain. Until you do, the canonical URL, sitemap and OG image base are all deliberately omitted rather than published with a placeholder — and `next build` will warn about `metadataBase`, which is expected.

### Contact form

The form validates on both client and server, works without JavaScript, and carries a honeypot field for bots. A submission arrives in your inbox as a formatted email with **the sender set as `reply_to`**, so hitting Reply in Gmail answers the person who wrote in.

**It works with no configuration at all.** Nothing can send mail without *some* credential — that is what stops anyone sending as anyone — so the default is a relay that treats the recipient address itself as the credential.

Transports, in priority order. Setting any variable takes over from the one below it:

| Variable | Notes |
|---|---|
| `RESEND_API_KEY` | **Best.** [resend.com](https://resend.com) — your account, your sender, nobody else holding your visitors' messages. Sign up with `sarangprajapati06@gmail.com`, create a key, paste it in. No domain or DNS: their shared `onboarding@resend.dev` sender may only deliver to the address that owns the account, which is exactly what a contact form does. |
| `WEB3FORMS_ACCESS_KEY` | [web3forms.com](https://web3forms.com) — enter your email, the key arrives by email. No password, no account to manage. |
| `CONTACT_WEBHOOK_URL` | Any endpoint taking a JSON POST — Slack or Discord incoming webhook, Zapier, your own route. |
| *(none)* | **Default.** Relays via FormSubmit, which needs no key. One-time activation: the first submission sends an "Activate Form" email to the recipient; click the link once and it delivers from then on. |

Optional: `CONTACT_TO_EMAIL` (defaults to `site.email`) and `CONTACT_FROM_EMAIL` (Resend only, once you own a verified domain).

**On Vercel**, add the same variables under Project → Settings → Environment Variables. `.env.local` is gitignored and never ships.

The one remaining `unconfigured` state is a placeholder recipient address — genuinely nowhere to send. Even then the form says so and offers the direct email route, because silently discarding a hiring enquiry is the worst thing it could do.

Transport logic is in `src/lib/email.js`; the server action is `src/app/actions.js`.

**Worth doing before you rely on it:** the default relay is a third party, and it sees every message. Moving to Resend takes two minutes and puts delivery entirely under your own account.

### Email links

`mailto:` is the correct link for an address, but it only does something if the device has a mail client registered — a browser-only Gmail user clicks it and nothing visibly happens.

So every email affordance (contact card, footer, `⌘K → Send an email`, the form's fallback message) renders a real `<a href="mailto:">` and intercepts the click to open a compose chooser: **default mail app** first, then Gmail / Outlook.com / Yahoo compose deep links, then copy-to-clipboard. Modifier-clicks and no-JavaScript both fall through to the native `mailto:`.

`src/lib/mailto.js` builds the URLs; `src/components/contact/` holds the dialog and the link component.

---

## Architecture

```text
src/
  app/
    layout.js              fonts, metadata, JSON-LD, theme script
    page.js                composes the home sections (server component)
    actions.js             contact server action
    work/[slug]/page.js    case studies, statically generated
    opengraph-image.js     build-time social card
    sitemap.js  robots.js  not-found.js
    globals.css            design tokens + base layer
  components/
    ui/                    Button, Tag, Icon, ThemeToggle, CommandPalette
    layout/                Nav, Footer, Section, SkipLink
    sections/              one file per page section
    projects/              ProjectRow, ProjectMedia, CaseStudy, ProjectGallery
    resume/                in-page PDF viewer (dialog + pdf.js renderer)
    contact/               email compose chooser + mailto link
    motion/                Reveal, TextReveal, Magnetic, Cursor, provider
  data/                    all content (see above)
  hooks/                   useTheme, useActiveSection, usePointerFine
  lib/                     cn, seo, validation, mailto, email (server-only)
```

**Server-first.** Every section is a server component; interactivity lives in small `"use client"` leaves. The entire portfolio's text is in the initial HTML.

**Framer Motion is wrapped in `LazyMotion` with the `domAnimation` feature bundle** (roughly half the full library) and `strict` mode, so components must use `m.*` rather than `motion.*`.

**React Compiler is enabled** (`next.config.mjs`), so there is no hand-written `memo` / `useCallback` for render performance — that would fight the compiler.

---

## Design tokens

Defined once in `src/app/globals.css`:

- **Colour** — `--bg`, `--surface-1..3`, `--line`, `--text`, `--text-muted`, `--accent`. Dark is the default; `[data-theme="light"]` overrides.
- **Accent contrast** — `--accent` for fills and dots, `--accent-ink` for accent-coloured *text* (contrast-safe in both themes), `--accent-fg` for text sitting on an accent fill.
- **Type** — fluid `clamp()` scale: `text-display`, `text-h1/h2/h3`, `text-lead`, plus the `label-mono` utility for metadata.
- **Motion** — one easing curve (`--ease-out`) and four durations.
- **Z-index** — a five-step scale; no arbitrary values anywhere.

---

## Accessibility

- Skip link, semantic landmarks, one `h1` per page
- Single `:focus-visible` treatment sitewide, 2px accent ring
- Experience cards are real `<button aria-expanded>` disclosures
- Skills categories follow the ARIA tabs pattern with arrow-key navigation
- The skills panel responds to **focus as well as hover**, so it is fully keyboard-operable
- Command palette implements the combobox/listbox pattern with `aria-activedescendant`
- Mobile menu and resume viewer trap focus, close on Escape, and restore focus on close
- The resume viewer keeps pdf.js's text layer, so the document is readable by a screen reader rather than an opaque canvas
- The custom cursor never replaces the native one, and only mounts on `(pointer: fine)`
- `prefers-reduced-motion` is handled at the CSS layer *and* in every motion component

---

## Performance notes

- No smooth-scroll library — native `scroll-behavior` plus scroll-driven animations
- The hero's pointer light writes to CSS custom properties inside `requestAnimationFrame`; it triggers **zero React re-renders**
- The blueprint grid, noise and marquee are pure CSS — no canvas, no particle system
- `useSyncExternalStore` reads the theme from the DOM, avoiding a mount-time cascading render
- Case studies are statically generated at build time
