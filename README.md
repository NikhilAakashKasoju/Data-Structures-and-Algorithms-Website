# EduFulness — Data Structures & Algorithms

Marketing site for the DSA course, modelled on `edufulness.com/data-engineering`.

Next.js 14 (App Router) · TypeScript · Tailwind · Framer Motion · static export.

---

## Run

```bash
npm install
npm run dev        # http://localhost:3000/dsa
npm run build      # emits ./out
npm run typecheck
```

`npm run build` needs network access on first run: `next/font/google` downloads
the three font families and self-hosts them into the export. After that the
files are cached in `.next/cache`.

## Deploy

1. `npm run build`
2. **Delete everything inside** `public_html/dsa/` first — `_next/` filenames are
   content-hashed, so stale chunks accumulate forever otherwise.
3. Upload the contents of `out/` into `public_html/dsa/`.

The host is Hostinger shared hosting: PHP only, no Node runtime. Anything
server-side (contact form) will be a small PHP endpoint in its own folder, not
an `app/api/**` route handler — route handlers do not exist under
`output: "export"`.

## Architecture notes

| File | Why it exists |
| --- | --- |
| `next.config.mjs` | `output: "export"`, `basePath: "/dsa"`, `trailingSlash`, unoptimized images |
| `lib/site.ts` | `asset()` — every `public/` path must go through it or it 404s in production |
| `lib/motion.ts` | Shared entrance variants so the whole page animates as one document |
| `lib/course.ts` | Single source of truth for course facts; unverified values are `null` |
| `lib/curriculum.ts` | All 21 sections and 223 transcribed lecture rows, verbatim including source typos |
| `lib/nav.ts` | Nav model — one array drives both the rendered list and the scroll-spy observer |
| `components/Nav.tsx` | Sticky nav, IntersectionObserver scroll-spy, hamburger below `lg` |
| `components/Hero.tsx` | Hero copy, CTAs, count-up stats |
| `components/HeroVisual.tsx` | Linked-list SVG; holds the `svgRef` for reduced-motion layer 3 |
| `lib/useCountUp.ts` | rAF count-up against a real timestamp, easeOutExpo, skipped under reduced motion |
| `components/Marquee.tsx` | Keyword band. Server component — pure CSS animation, ships zero JS |
| `app/globals.css` | Theme tokens, background layers, component primitives, reduced-motion layer 1 |
| `components/ThemeScript.tsx` | Blocking inline script — sets `data-theme` before first paint, no flash |
| `components/MotionProvider.tsx` | `MotionConfig reducedMotion="user"` — reduced-motion layer 2 |
| `components/ThemeToggle.tsx` | Fixed bottom-right switch, 44×44 hit area, `aria-pressed` |

### Reduced motion is three separate layers

1. `@media (prefers-reduced-motion: reduce)` in `globals.css` → CSS animations/transitions
2. `<MotionConfig reducedMotion="user">` → Framer's JS-driven transforms, which CSS cannot reach
3. `svgRef.current.pauseAnimations()` per illustration → SVG SMIL (`<animateMotion>`), which
   neither of the above reaches

Layer 3 lands with the first illustration.

### Deliberate exceptions

Two places break a house rule on purpose. Both are commented in the source.

- **`Marquee` is full-bleed**, not inside the `max-w-[1300px]` section shell. A
  band that stops short of the viewport edge reads as a widget; one that runs
  off both edges reads as a conveyor.
- **The marquee's reduced-motion form is not "frozen"**. The blanket
  `prefers-reduced-motion` rule would leave the track at `translateX(0)` with
  most terms unreachable, so a scoped rule turns it into a horizontally
  scrollable strip instead.

### Client vs server components

| Component | Boundary | Why |
| --- | --- | --- |
| `Nav` | client | IntersectionObserver, scroll listener, open/close state, Escape handler |
| `Hero` | client | Framer entrance variants + count-up |
| `HeroVisual` | client | Pointer parallax and `pauseAnimations()` |
| `ThemeToggle` | client | `localStorage` + DOM attribute |
| `MotionProvider` | client | `MotionConfig` is a context provider |
| **`Marquee`** | **server** | Pure CSS animation, no state, no DOM reads — ships zero JS |
| `app/page.tsx` | server | Shell only; the interactive parts own their own boundaries |

### Colour

All colour resolves through CSS variables on `<html data-theme>`. **No component
carries a `dark:` class.** Palette tokens are channel triplets (`13 7 20`) so
Tailwind's `<alpha-value>` still works (`bg-bg/70`); `surface`/`line`/`chip`/
`faint` hold full `rgba()` because their alpha differs per theme.

Do not use `purple` (`#0b4fdb`) for small text on dark — it fails contrast. Use
`purple-2`.

---

## Verified facts

Source: the Udemy listing supplied by the client, fetched 2026-08-18 —
<https://www.udemy.com/course/mastering-data-structures-and-algorithms-using-c-programming/>

- Title: *Data Structures & Algorithms using C++, C and Python - 2026*
- Instructor: Atchyut Kumar · Publisher: Edufulness EFN
- 21 sections · 222 lectures · 43h 57m
- Languages: C, C++, Python
- Section titles 1–10 (see `lib/course.ts`)
- "What you'll learn" bullets, quoted verbatim

## Known Gaps

Nothing below is invented anywhere in the codebase. Each is `null` in
`lib/course.ts` and will render as a flagged placeholder until supplied.

| # | Gap | Blocks |
| --- | --- | --- |
| 1 | **Section titles 11–21 are derived, not quoted.** The client's paste carried lecture rows but no section headers. Titles 1–10 are verbatim from the Udemy listing; 11–21 were inferred from lecture contents and carry `titleVerified: false` in `lib/curriculum.ts`. Confirm before ship. | Curriculum, Phases |
| 2 | **Phase grouping.** How the 21 sections map onto the "phases" grid used on the DE site. | Phases |
| 2b | **Lecture count is 223 here vs Udemy's stated 222.** Likely the duplicated Stacks row ("Python Code : … Push(), Pop(), Display", 20:12 and 1:30). The site shows Udemy's 222. | Hero stats |
| 2c | **Two lectures have no duration** in the source paste — "Column Major Order" (Arrays) and "Multistage Graph" (Dynamic Programming). Stored as `null`. Their absence exactly explains the 43h35m ↔ 43h57m gap. | Curriculum |
| 3 | **Programme price + checkout URL** for direct EduFulness enrolment (not the Udemy listing). Until supplied, the Hero's primary CTA points at Udemy — the only checkout that verifiably exists. There is deliberately no "Enrol now" button. | Program, Hero CTA |
| 4 | **Batch structure** — weekday/weekend, programme length in months, weekly hours. | Program |
| 5 | **Next live class** — date, topic, duration, time. Needs a "nothing scheduled" state either way. | LiveClass |
| 6 | **Free resources** — YouTube playlist URLs and video counts for DSA (the DE numbers do not transfer). | Resources |
| 7 | **Contact** — WhatsApp community link, reply-to email, PHP form endpoint path. | Contact, Footer |
| 8 | **Instructor copy for DSA.** The DE site's bio (M.Tech NIT Calicut, GATE AIR 440, 110,000+ students mentored) is on record for Atchyut but should be confirmed before reuse here. | Instructor |
| 9 | **Icons** — `app/icon.png` (512×512), `app/apple-icon.png` (180×180), `app/opengraph-image.png` (1200×630, PNG/JPEG — not WebP). | Metadata |
| 10 | **Prerequisites / target audience wording** and any certificate claim. Do not assert a certificate unless the client confirms one exists. | Hero, Program |

## Build order

One section per pass.

- [x] **Nav** — sticky, scroll-spy, hamburger below `lg`
- [x] **Hero** — copy, CTAs, count-up stats, linked-list visual
- [x] **Marquee** — infinite keyword band
- [ ] **Curriculum** — *blocked on gaps 1 and 2*
- [ ] **Phases** — *blocked on gap 2*
- [ ] **Resources** — *blocked on gap 6*
- [ ] **LiveClass** — *blocked on gap 5*
- [ ] **Program** — *blocked on gaps 3 and 4*
- [ ] **Instructor** — *blocked on gap 8*
- [ ] **Contact** — *blocked on gap 7*
- [ ] **Footer**
- [x] **ThemeToggle** — fixed bottom-right (landed with the scaffold)

## Local development

The dev server serves the site at **http://localhost:3000/dsa/**, not at `/`.
A `GET /` returning 404 is `basePath` working correctly, not a fault. Newly
added component files sometimes need a dev-server restart before Fast Refresh
picks them up.
