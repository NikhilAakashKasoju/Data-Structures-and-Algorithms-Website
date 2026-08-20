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
| `lib/curriculum.ts` | All 21 sections and 223 rows, verbatim and audited against screenshots. `displayTitle`/`badge`/`sectionLabel()` carry the rendered form; `kind` separates the one article from the 222 videos |
| `lib/nav.ts` | Nav model — one array drives both the rendered list and the scroll-spy observer |
| `components/Nav.tsx` | Sticky nav, IntersectionObserver scroll-spy, hamburger below `lg` |
| `components/Hero.tsx` | Hero copy, CTAs, count-up stats |
| `components/HeroVisual.tsx` | Linked-list SVG; holds the `svgRef` for reduced-motion layer 3 |
| `lib/useCountUp.ts` | rAF count-up against a real timestamp, easeOutExpo, skipped under reduced motion |
| `components/Marquee.tsx` | Keyword band. Server component — pure CSS animation, ships zero JS |
| `lib/stages.ts` | Six-stage grouping over the 21 sections; counts/durations computed, never typed |
| `components/Curriculum.tsx` | Alternating rows, scroll-scrubbed spine, `<details>` per stage |
| `components/CurriculumArt.tsx` | Six illustrations on one shared viewBox, accent passed as a prop |
| `components/Wordmark.tsx` | Shared brand glyph + name, so Nav and Footer cannot drift apart |
| `components/Footer.tsx` | Link columns driven by `NAV_ITEMS`, build-time copyright year. Server component |
| `lib/resources.ts` | Free-video list. Titles verbatim from YouTube oEmbed; one off-topic entry kept but `excluded` |
| `lib/liveClass.ts` | The one time-sensitive value on the site. `null` = nothing scheduled, which is a real state |
| `components/LiveClass.tsx` | Scheduled / nothing-scheduled panel with **client-side expiry** |
| `components/Resources.tsx` | Featured playlist + card grid, whole card is the link |
| `components/ResourceArt.tsx` | Eight compact cover drawings on one shared 120×72 viewBox |
| `app/globals.css` | Theme tokens, background layers, component primitives, reduced-motion layer 1 |
| `components/ThemeScript.tsx` | Blocking inline script — sets `data-theme` before first paint, no flash |
| `components/MotionProvider.tsx` | `MotionConfig reducedMotion="user"` — reduced-motion layer 2 |
| `components/ThemeToggle.tsx` | Fixed bottom-right switch, 44×44 hit area, `aria-pressed` |

### Reduced motion is three separate layers

1. `@media (prefers-reduced-motion: reduce)` in `globals.css` → CSS animations/transitions
2. `<MotionConfig reducedMotion="user">` → Framer's JS-driven transforms, which CSS cannot reach
3. `svgRef.current.pauseAnimations()` per illustration → SVG SMIL (`<animateMotion>`), which
   neither of the above reaches

Layer 3 currently applies to `HeroVisual`, the only component using SMIL. The
curriculum illustrations use CSS animations only, so layers 1 and 2 cover them.

### Time-sensitive content on a site with no server

`output: "export"` renders the page once, at build. Nothing re-renders the
morning after a live class, so a scheduled date left alone would keep
advertising a session that finished last week — the most damaging kind of
stale content on a course page. `components/LiveClass.tsx` handles it:

1. The **static HTML carries the scheduled state**, so a crawler and a no-JS
   reader get it, and at build time it is correct.
2. On mount the component compares the session's **end** time (not its start —
   someone arriving ten minutes late still needs the join link) to the clock,
   and swaps to the empty state if it has passed.
3. `expired` starts `false` so the first client render matches the server
   render exactly; the swap happens a frame later. No hydration mismatch.
4. It re-checks every 60s, because a reader can leave the page open across
   the end of a session.

Dates are formatted with an explicit `timeZone: "Asia/Kolkata"`. Without it
the build (UTC) and the browser (anywhere) produce different strings for the
same instant, and React logs a hydration mismatch **on a date** — the worst
thing on this panel to get quietly wrong. For the same reason `startsAt` must
carry an explicit offset: a bare `"2026-09-05T10:00"` is parsed as UTC at
build and as local time in the browser.

**Both states were exercised before shipping**: a future date renders the
scheduled panel, a past date is present in the static HTML and swaps to the
empty panel after hydration with no console errors. The site currently ships
the empty state, because `LIVE_CLASS` is `null`.

### Why the resource covers are drawn, not YouTube thumbnails

Hotlinked thumbnails were the obvious alternative. They were rejected because
they are external requests on a page that otherwise makes none, they arrive in
whatever styling each video happened to be given — so eight together read as a
jumble rather than a set — and a raster thumbnail cannot re-theme when the page
does. The drawings share one 120×72 viewBox so every card crops identically.

### The copyright year is frozen at build time

`output: "export"` means there is no server at request time, so the Footer's
`new Date().getFullYear()` resolves when you run `npm run build`, not when a
visitor loads the page. It shows the year of the **last deploy**. Rebuilding
each January is the fix; a client-side script to correct it would cost a
hydration boundary on an otherwise zero-JS component for one number.

### Deliberate exceptions

Three places break a house rule on purpose. All are commented in the source.

- **`Marquee` is full-bleed**, not inside the `max-w-[1300px]` section shell. A
  band that stops short of the viewport edge reads as a widget; one that runs
  off both edges reads as a conveyor.
- **The marquee's reduced-motion form is not "frozen"**. The blanket
  `prefers-reduced-motion` rule would leave the track at `translateX(0)` with
  most terms unreachable, so a scoped rule turns it into a horizontally
  scrollable strip instead.
- **`Curriculum` groups the syllabus into six stages that do not exist in the
  source.** The Udemy listing has 21 sections and nothing above them. The
  grouping is mechanical and lossless — a dev-time assertion in `lib/stages.ts`
  throws if the six stages do not cover sections 1–21 exactly once — and every
  row exposes its real section titles in a `<details>`, so the grouping is a
  way of reading the syllabus rather than a replacement for it. Stage names and
  blurbs are editorial; every technique named in a blurb appears in a lecture
  title. See Known Gaps 1 and 2.

### Client vs server components

| Component | Boundary | Why |
| --- | --- | --- |
| `Nav` | client | IntersectionObserver, scroll listener, open/close state, Escape handler |
| `Hero` | client | Framer entrance variants + count-up |
| `HeroVisual` | client | Pointer parallax and `pauseAnimations()` |
| `ThemeToggle` | client | `localStorage` + DOM attribute |
| `MotionProvider` | client | `MotionConfig` is a context provider |
| **`Marquee`** | **server** | Pure CSS animation, no state, no DOM reads — ships zero JS |
| **`Footer`** | **server** | No motion at all — a footer is scrolled to deliberately, so fading it in delays what the reader went looking for |
| `Wordmark` | (no boundary) | Pure function; renders on the server in `Footer`, inlines into `Nav`'s bundle |
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

Sources: the Udemy listing (fetched 2026-08-18) and **curriculum screenshots of
all 21 sections supplied by the client 2026-08-20** —
<https://www.udemy.com/course/mastering-data-structures-and-algorithms-using-c-programming/>

- Title: *Data Structures & Algorithms using C++, C and Python - 2026*
- Instructor: Atchyut Kumar · Publisher: Edufulness EFN
- 21 sections · 222 lectures · 43h 57m
- Languages: C, C++, Python
- "What you'll learn" bullets, quoted verbatim
- **All 21 section titles and all 223 curriculum rows, verbatim**

### Transcription audit — everything reconciles

Each screenshot's section header prints a lecture count and a runtime. **All 21
sections match `lib/curriculum.ts` on both figures**, and so do the totals:

| | This repo | Udemy states |
| --- | --- | --- |
| Curriculum rows | 223 (222 video + 1 article) | 222 lectures |
| Runtime | 43h 57m 54s | 43h 57m |

The article is **"Column Major Order"** in section 2 — a document, not a video,
shown with a page icon rather than a play icon. It carries `kind: "article"` and
`duration: null`. That one row is the entire explanation of 223-vs-222; nothing
was guessed to close the gap. Udemy's own per-section headers count it (section
2 says "16 lectures"), while its course header does not — the UI follows the
section headers per row and the course header for stage totals, and labels the
article where it appears.

**What the audit caught.** The client's paste ran each duration onto the end of
its title with no separator, so any row whose title ends in an index digit is
ambiguous: `"AVL Tree - Deletion : L-14:09"` is either *L-* + 14:09 or *L-1* +
4:09. Thirteen such rows were resolved with an explicit override table rather
than a heuristic. Twelve were right first time; the audit found **one that was
not** — that AVL row, read as 14:09 instead of 4:09, put section 10 exactly ten
minutes over. Correcting it brought the course total to Udemy's figure to the
minute. Without the per-section runtimes in the screenshots this would have
shipped undetected.

### Verbatim data, corrected display

`title` is exactly what the source says. `displayTitle` holds what to render,
and is set only where the source title fights the page:

| Section | Source `title` | Rendered |
| --- | --- | --- |
| 2 | `1. Arrays` | Arrays |
| 4 | `2.1 Recursion : Exclusive` | Recursion : Exclusive |
| 10 | `BONUS LECTURE - ADVANCED DATA STRUCTURE : 6. AVL Trees - Exclusive` | AVL Trees - Exclusive + a "Bonus · Advanced" badge |
| 14 | `Aymptotic Notations` | Asymptotic Notations |

Udemy's own enumeration is internally inconsistent — "Basic Stuff" is
unnumbered, then 1–6 with a "2.1" wedged in, then "Binary Search Trees" and
"Heaps" unnumbered again — so it would collide with the page's own 01–21
numbering. It is stripped for display and preserved in the data. Section 14's
`Aymptotic` is Udemy's typo, not ours. **Worth fixing on Udemy itself.**

## Known Gaps

Nothing below is invented anywhere in the codebase. Each unsupplied value is
`null` in `lib/course.ts` and renders as a flagged placeholder.

| # | Gap | Blocks |
| --- | --- | --- |
| 2 | **Stage grouping is ours, not the client's.** The six stages in `lib/stages.ts` — their membership, names and blurbs — were derived to make 21 sections readable. If the course has its own phase structure, replace this with it. | Curriculum |
| 3 | **Programme price + checkout URL** for direct EduFulness enrolment (not the Udemy listing). Until supplied, the Hero's primary CTA points at Udemy — the only checkout that verifiably exists. There is deliberately no "Enrol now" button. | Program, Hero CTA |
| 4 | **Batch structure** — weekday/weekend, programme length in months, weekly hours. | Program |
| 5 | **Next live class** — `startsAt` (ISO **with** offset), `topic`, `durationMinutes`, `joinUrl`. Until then `LIVE_CLASS` is `null` and the panel honestly says nothing is scheduled. Set the object in `lib/liveClass.ts` and rebuild; it expires itself afterwards. | LiveClass |
| 6a | **Playlist video count.** The Resources section claims no count for the playlist, because YouTube rate-limited the playlist page and a count is exactly the kind of number not to guess. Supply it and it goes in. | Resources |
| 6b | **One supplied link is off-topic.** `Qnvl2EHRK30` is *"Day 5: GROUP BY & HAVING Clause \| Primary Key \| MS SQL and Azure Data Factory \| Interview Questions"* — SQL/ADF, not DSA. It is in `lib/resources.ts` with `excluded: true` and is **not rendered**. Remove `excluded` if it was intended. | Resources |
| 7 | **Contact** — WhatsApp community link, reply-to email, PHP form endpoint path. The Footer deliberately ships **without** a contact column rather than with `#` placeholders; it is added the moment these exist. | Contact, Footer |
| 8 | **Instructor copy for DSA.** The DE site's bio (M.Tech NIT Calicut, GATE AIR 440, 110,000+ students mentored) is on record for Atchyut but should be confirmed before reuse here. | Instructor |
| 9 | **Icons** — `app/icon.png` (512×512), `app/apple-icon.png` (180×180), `app/opengraph-image.png` (1200×630, PNG/JPEG — not WebP). | Metadata |
| 10 | **Prerequisites / target audience wording** and any certificate claim. Do not assert a certificate unless the client confirms one exists. | Hero, Program |

Gap numbers are stable; closed ones are not reused.

### Closed

| # | Was | Closed |
| --- | --- | --- |
| 1 | Section titles 11–21 unknown, then sections 4 and 10 not provably verbatim | 2026-08-20 — screenshots of all 21 sections |
| 2b | 223 rows vs Udemy's 222; runtime 10m54s over | 2026-08-20 — one article row, plus a corrected AVL duration |
| 2c | "Column Major Order" and "Multistage Graph" had no duration | 2026-08-20 — Multistage Graph is 32:54; Column Major Order is an article and has none |

## Build order

One section per pass.

- [x] **Nav** — sticky, scroll-spy, hamburger below `lg`
- [x] **Hero** — copy, CTAs, count-up stats, linked-list visual
- [x] **Marquee** — infinite keyword band
- [x] **Curriculum** — six stages, alternating rows, scrubbed spine *(grouping derived — gap 2)*
- [x] ~~**Phases**~~ — **dropped 2026-08-20** at the client's call: Curriculum already exposes all 21 sections, so a phase grid would repeat the same data under invented headings. Removed from `NAV_ITEMS`.
- [x] **Resources** — featured playlist + 8 cards, drawn cover art *(gaps 6a, 6b)*
- [x] **LiveClass** — both states built; ships the empty state *(gap 5 supplies a class)*
- [ ] **Program** — *blocked on gaps 3 and 4*
- [ ] **Instructor** — *blocked on gap 8*
- [ ] **Contact** — *blocked on gap 7*
- [x] **Footer** — brand, link columns from `NAV_ITEMS`, build-time year *(no contact column — gap 7)*
- [x] **ThemeToggle** — fixed bottom-right (landed with the scaffold)

## Local development

The dev server serves the site at **http://localhost:3000/dsa/**, not at `/`.
A `GET /` returning 404 is `basePath` working correctly, not a fault. Newly
added component files sometimes need a dev-server restart before Fast Refresh
picks them up.
