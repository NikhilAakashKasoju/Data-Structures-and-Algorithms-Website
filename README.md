# EduFulness — Data Structures & Algorithms

Marketing site for the DSA course, modelled on `edufulness.com/data-engineering`.

Next.js 14 (App Router) · TypeScript · Tailwind · Framer Motion · static export.

---

## Run

```bash
npm install
npm run dev        # http://localhost:3000/dsa
npm run build      # emits ./out
npm start          # serves ./out — NOT `next start`, which cannot run an export
npm run typecheck
```

`npm run build` needs network access on first run: `next/font/google` downloads
the three font families and self-hosts them into the export. After that the
files are cached in `.next/cache`.

## Deploy — two targets, one repo

The same source builds for both hosts. The difference is `basePath`, and it is
baked in at build time, so it cannot be one constant:

| Host | Served from | `basePath` |
| --- | --- | --- |
| Hostinger | `https://edufulness.com/dsa/` — a **subfolder** | `/dsa` |
| Render | the **root** of its own host | `""` |

A `/dsa` build uploaded to Render 404s every asset and shows a blank page at
`/`. A `""` build uploaded to Hostinger's subfolder does the same. Render
exports `RENDER="true"` into every build, so `next.config.mjs` derives the
right value instead of relying on anyone remembering:

```js
const basePath =
  process.env.RENDER === "true" ? "" : process.env.SITE_BASE_PATH ?? "/dsa";
```

Both were built and inspected:

```
default          href="/dsa/_next/…"   og:image https://edufulness.com/dsa/opengraph-image.png
RENDER=true      href="/_next/…"       og:image https://dsa.edufulness.com/opengraph-image.png
```

### Render

**Render cannot serve `edufulness.com/dsa`.** That path belongs to whichever
host answers for `edufulness.com` — today, Hostinger. On Render the site lives
at `edufulness-dsa.onrender.com`, or at a subdomain such as
`dsa.edufulness.com` pointed at Render with a CNAME. Decide which before
setting `NEXT_PUBLIC_SITE_ORIGIN`, because it is what every share card and
canonical URL resolves against.

1. Push the repo to GitHub.
2. Render dashboard → **New → Static Site** → connect the repo.
3. Settings:
   - **Build command**: `npm ci && npm run build`
   - **Publish directory**: `out`
4. Environment variables:
   - `NODE_VERSION` = `20.18.0` — Next 14.2 needs ≥ 18.17; pinning stops a
     Render default bump changing the build under you.
   - `NEXT_PUBLIC_SITE_ORIGIN` = the real origin, no trailing slash. Leave it
     unset and OG tags will point at edufulness.com, which is the wrong site.
   - Do **not** set `SITE_BASE_PATH`. `RENDER=true` already handles it.
5. **Headers** (dashboard → Headers, or the included `render.yaml`). Render
   ignores `.htaccess` entirely, so the caching policy has to be restated:

   | Path | Header | Value |
   | --- | --- | --- |
   | `/_next/static/*` | `Cache-Control` | `public, max-age=31536000, immutable` |
   | `/_next/static/**/*` | `Cache-Control` | `public, max-age=31536000, immutable` |
   | `/*` | `Cache-Control` | `public, max-age=0, must-revalidate` |
   | `/*` | `X-Content-Type-Options` | `nosniff` |
   | `/*` | `Referrer-Policy` | `strict-origin-when-cross-origin` |

   The HTML rule is the one that matters. Without it a returning visitor gets
   yesterday's HTML pointing at chunk filenames this deploy replaced, and the
   page renders unstyled.

6. **Do not add a catch-all rewrite to `/index.html`.** That is SPA advice and
   is wrong here — it would swallow `404.html`, which the export already emits.

#### Picking the wrong service type

Creating a **Web Service** instead of a Static Site builds fine and then dies
on boot:

```
Error: "next start" does not work with "output: export" configuration.
```

A Web Service runs a start command; a static export has nothing to start.
Render cannot convert one service type into the other, so the fix is to create
a **Static Site** against the same repo and delete the Web Service.

`npm start` is now `npx --yes serve@latest out`, so a Web Service would at
least boot — verified locally that `serve` reads `PORT` from the environment
and binds `0.0.0.0`. **Stopgap only.** A Web Service handing out static files
costs an instance, spins down when idle on the free tier, and puts a cold start
in front of files a CDN should serve.

`render.yaml` in the repo does steps 3–5 as a Blueprint. Its field names follow
Render's Blueprint spec but were not verified against the live docs in the
session that wrote it — if Render rejects it, delete it and use the dashboard.
Nothing else depends on that file.

#### Two things that stop working on Render

- **`public/.htaccess` is inert.** It is still emitted into `out/` and is
  harmless, but it configures nothing. Delete it if the site ever leaves
  Hostinger for good.
- **PHP does not run.** Render static sites serve files only, so
  `php/dsa-api/submit.php` cannot be hosted there. The contact form must point
  at a backend elsewhere — which it already does, via
  `CONTACT.formEndpoint`. If that backend is on a different origin from the
  site, it needs CORS headers allowing the Render origin.

## Deploy — Hostinger

1. `npm run build`
2. **Delete everything inside** `public_html/dsa/` first — `_next/` filenames are
   content-hashed, so stale chunks accumulate forever otherwise.
3. Upload the contents of `out/` into `public_html/dsa/` — **including the
   dotfile `.htaccess`**, which many FTP clients hide by default.

`public/.htaccess` is copied into the export and is scoped to that folder only;
it does not affect the rest of edufulness.com. It sets `immutable` year-long
caching on the content-hashed `js`/`css`/`woff2`, and `max-age=0,
must-revalidate` on the HTML. That second rule is the one that matters: without
it a returning visitor can be served last week's HTML pointing at chunk
filenames you deleted on this upload, and the page renders unstyled.

No rewrite rules are needed. `trailingSlash: true` makes every route a
directory with an `index.html`, which Apache's `DirectoryIndex` already
resolves. Do not add an SPA catch-all — this is a static export.

The host is Hostinger shared hosting: PHP only, no Node runtime. Anything
server-side (contact form) will be a small PHP endpoint in its own folder, not
an `app/api/**` route handler — route handlers do not exist under
`output: "export"`.

## Architecture notes

| File | Why it exists |
| --- | --- |
| `next.config.mjs` | `output: "export"`, target-aware `basePath`, `trailingSlash`, unoptimized images |
| `render.yaml` | Optional Render Blueprint — build, publish path, env vars, cache headers |
| `lib/site.ts` | `asset()`, plus `SITE_ORIGIN` vs `SITE_URL` — see "The basePath trap, twice" |
| `lib/motion.ts` | Shared entrance variants so the whole page animates as one document |
| `lib/course.ts` | Single source of truth for course facts; unverified values are `null` |
| `lib/curriculum.ts` | All 21 sections and 223 rows, verbatim and audited against screenshots. `displayTitle`/`badge`/`sectionLabel()` carry the rendered form; `kind` separates the one article from the 222 videos |
| `lib/nav.ts` | Nav model — one array drives both the rendered list and the scroll-spy observer |
| `components/Nav.tsx` | Sticky nav, IntersectionObserver scroll-spy, hamburger below `lg` |
| `components/Hero.tsx` | Hero copy, CTAs, count-up stats |
| `components/HeroVisual.tsx` | Linked-list SVG; holds the `svgRef` for reduced-motion layer 3 |
| `lib/useCountUp.ts` | rAF count-up against a real timestamp, easeOutExpo, skipped under reduced motion |
| `components/Marquee.tsx` | Keyword band in display type. Server component — pure CSS animation, ships zero JS |
| `lib/stages.ts` | Six-stage grouping over the 21 sections; counts/durations computed, never typed |
| `components/Curriculum.tsx` | Alternating rows, scroll-scrubbed spine, `<details>` per stage |
| `components/CurriculumArt.tsx` | Six illustrations on one shared viewBox, accent passed as a prop |
| `components/Wordmark.tsx` | Shared brand glyph + name, so Nav and Footer cannot drift apart |
| `components/Footer.tsx` | Link columns driven by `NAV_ITEMS`, build-time copyright year. Server component |
| `lib/resources.ts` | Free-video list. Titles verbatim from YouTube oEmbed; one off-topic entry kept but `excluded` |
| `lib/liveClass.ts` | The one time-sensitive value on the site. `null` = nothing scheduled, which is a real state |
| `components/LiveClass.tsx` | Scheduled / nothing-scheduled panel with **client-side expiry** |
| `lib/instructor.ts` | Bio and figures, each sourced in a comment; `portrait: null` until a photo exists |
| `components/Instructor.tsx` | Portrait with scrim caption, count-up stats, drawn fallback tile |
| `lib/program.ts` | What's in the course, computed from the curriculum. `DIRECT_ENROLMENT` null by default |
| `components/Program.tsx` | Raised pricing panel, one filled CTA |
| `lib/contact.ts` | `formEndpoint`, `whatsappUrl`, placeholders. Null endpoint = submit disabled |
| `components/Contact.tsx` | Two-column: copy + WhatsApp hand-off left, form panel right |
| `php/dsa-api/submit.php` | Reference mail endpoint, **not part of the build**. The client has their own backend; keep this only if it is the one being used — see `php/README-deploy.md` |
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

### What was left out of the instructor bio

The Data Engineering page also claims *"9+ years of hands-on data integration,
transformation and schema design"*. True of the instructor, irrelevant on a DSA
page — quoting it would pad the bio with credentials that do not support the
thing being sold. Everything else on that page transferred.

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

Four places break a house rule on purpose. All are commented in the source.

- **`Marquee` is full-bleed**, not inside the `max-w-[1300px]` section shell. A
  band that stops short of the viewport edge reads as a widget; one that runs
  off both edges reads as a conveyor.
- **The marquee's reduced-motion form is not "frozen"**. The blanket
  `prefers-reduced-motion` rule would leave the track at `translateX(0)` with
  most terms unreachable, so a scoped rule turns it into a horizontally
  scrollable strip instead.
- **The marquee uses `font-display` at 26–32px, not the mono `label` style.**
  Everywhere else, small uppercase text is JetBrains Mono with `0.12em`
  tracking. The band is not a row of labels — it is a statement of scope
  scrolling past, so it takes Space Grotesk Bold and `tracking-tight`.
  Letter-spacing that rescues 11px mono actively hurts a 32px bold face.
  Separator dots moved from `lime` at 3px to `purple-2` at 6px: a 3px dot
  beside 32px type reads as dirt on the screen rather than as punctuation.

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

### The basePath trap, twice

`basePath: "/dsa"` bites in two different places, in opposite directions.

**1. It is NOT applied to `public/` paths.** A raw `"/logo.png"` works in dev
and 404s in production. Everything under `public/` goes through `asset()`.

**2. It IS applied to file-convention metadata images — twice, if you let it.**
Next already prefixes `basePath` onto the path it generates for
`app/opengraph-image.png`. Setting `metadataBase` to the subfolder as well
compounds them:

```
metadataBase "https://edufulness.com/dsa/"  +  "/dsa/opengraph-image.png"
  → https://edufulness.com/dsa/dsa/opengraph-image.png     404
```

That was in the build until the icons were added and the output inspected. It
is invisible in the UI — it only shows up when somebody shares the link and
gets a blank card. `metadataBase` is now `SITE_ORIGIN`
(`https://edufulness.com/`); `SITE_URL` (with `/dsa/`) is used for `og:url`.

Caveat, written down so it is not rediscovered: with `metadataBase` at the
origin, a **hand-written relative** metadata URL would resolve against the
domain root. There are none. If one is added, write it absolute with
`SITE_URL`.

Verified in the built HTML:

```
og:url    https://edufulness.com/dsa/
og:image  https://edufulness.com/dsa/opengraph-image.png
icon      /dsa/icon.png
apple     /dsa/apple-icon.png
```

### Two colours that are not safe as text

The palette has two contrast traps, and both are now enforced rather than
remembered:

| Token | Theme | Ratio on the page | Safe for |
| --- | --- | --- | --- |
| `purple` `#0b4fdb` | dark | **2.98:1** | nothing — never use as text on dark |
| `teal` `#0d9488` | light | **3.53:1** | graphics only (3:1), **not** text (4.5:1) |

The teal one bit: every `/ eyebrow` on the page is 11.5px teal, so on the light
theme every one of them failed AA. The fix is a separate `--c-teal-text`
(`#0f766e`, **5.16:1**) used by `.eyebrow`, rather than darkening `--c-teal`
and dulling every illustration stroke with it. `teal` is for graphics;
`teal-text` is for text. Verified: dark 13.42:1, light 5.16:1.

Measured contrast of every token against its page background:

| Token | Dark | Light |
| --- | --- | --- |
| `text` | 18.08 | 17.26 |
| `muted` | 5.82 | 5.81 |
| `purple-2` | 5.77 | 6.31 |
| `magenta` | 8.77 | 4.18 ▲ |
| `lime` | 17.26 | 4.03 ▲ |
| `teal` | 13.42 | 3.53 ▲ |
| `teal-text` | 13.42 | 5.16 |

▲ = graphics only on that theme. `lime` and `magenta` are currently used only
as strokes and fills in illustrations, where the 3:1 graphics threshold
applies and both pass. **Do not promote either to body text on the light
theme without re-checking.**

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
| 3 | **Direct-enrolment price, checkout URL and batch structure — only if EduFulness sells this programme itself.** If it is Udemy-only, this gap closes as "not applicable" and the panel is already correct. Set `DIRECT_ENROLMENT` in `lib/program.ts` and the panel grows a price, a batch line and an "Enrol now" primary, with Udemy demoted to secondary. | Program |
| 5 | **Next live class** — `startsAt` (ISO **with** offset), `topic`, `durationMinutes`, `joinUrl`. Until then `LIVE_CLASS` is `null` and the panel honestly says nothing is scheduled. Set the object in `lib/liveClass.ts` and rebuild; it expires itself afterwards. | LiveClass |
| 6a | **Playlist video count.** The Resources section claims no count for the playlist, because YouTube rate-limited the playlist page and a count is exactly the kind of number not to guess. Supply it and it goes in. | Resources |
| 6b | **One supplied link is off-topic.** `Qnvl2EHRK30` is *"Day 5: GROUP BY & HAVING Clause \| Primary Key \| MS SQL and Azure Data Factory \| Interview Questions"* — SQL/ADF, not DSA. It is in `lib/resources.ts` with `excluded: true` and is **not rendered**. Remove `excluded` if it was intended. | Resources |
| 7a | **The backend URL and what it expects.** The client has an existing backend. `CONTACT.formEndpoint` is null until it is wired, so the form renders in its real layout with submit disabled and a visible "not connected yet" line — it does not post into nothing and report success. Needed: the URL, the field names it expects, and whether it answers JSON. | Contact |
| 7b | **WhatsApp channel link for DSA.** `CONTACT.whatsappUrl` is null, so the button is not rendered at all — the DE site has a channel but whether the same one covers DSA is unconfirmed, and a link that drops people in the wrong community is worse than no link. The Footer also still ships without a contact column. | Contact, Footer |
| 8a | **Confirm the instructor figures are current.** The bio, the 110,000+ student count, the 99.97 percentile / AIR 440 and the 15+ years are all published by the client on edufulness.com/data-engineering and are reproduced here unchanged. "Published on your other site" is not "confirmed current for this one" — a student count in particular ages. | Instructor |
| 8b | **No instructor portrait.** `INSTRUCTOR.portrait` is `null` and the component draws a fallback tile. Drop a photo in `public/` and set `portrait: "/instructor.jpg"` — it must go through `asset()`, which `portraitSrc()` already does. Stock photography was never an option: a stranger's face beside a real name is a lie in the one place the reader most needs to trust the page. | Instructor |

| 10 | **Prerequisites / target audience wording** and any certificate claim. Do not assert a certificate unless the client confirms one exists. | Hero, Program |

Gap numbers are stable; closed ones are not reused.

### Closed

| # | Was | Closed |
| --- | --- | --- |
| 9 | No `icon.png` / `apple-icon.png` / `opengraph-image.png` | 2026-08-20 — drawn from the site's own node glyph and palette, set in real Space Grotesk / JetBrains Mono |
| 1 | Section titles 11–21 unknown, then sections 4 and 10 not provably verbatim | 2026-08-20 — screenshots of all 21 sections |
| 2b | 223 rows vs Udemy's 222; runtime 10m54s over | 2026-08-20 — one article row, plus a corrected AVL duration |
| 2c | "Column Major Order" and "Multistage Graph" had no duration | 2026-08-20 — Multistage Graph is 32:54; Column Major Order is an article and has none |

### Why there is no price on the page

The course sells through Udemy, and Udemy's price is not something the seller
controls day to day — it moves with their promotions and coupon campaigns,
often several times a month. A price baked into a **statically exported** page
would be wrong within days, and a wrong price on a checkout panel is the one
number a buyer will hold you to.

So the panel links to the live price instead. **This is not a placeholder
standing in for a missing fact.** It is the correct design for a
marketplace-sold course, and it would still be correct after the number was
supplied.

Direct enrolment is a different question: if EduFulness sells this programme
itself, that price *is* fixed and controlled, and it belongs on the page. Set
`DIRECT_ENROLMENT` in `lib/program.ts` and the panel gains a price, a batch
line and an "Enrol now" primary, with Udemy dropping to secondary — one filled
CTA either way.

### The contact form

Layout follows the Data Engineering site: copy and the WhatsApp hand-off on the
left, the form panel on the right.

**Copy discipline.** The DE version promises *"the full 33-module syllabus and
the next batch dates"*. Neither exists for DSA — there is no syllabus PDF and
no batch schedule on record — so this copy promises only what can be delivered:
a reply.

**Progressively enhanced.** The form carries a real `action` and
`method="post"`, so with JavaScript disabled it submits normally and the
browser navigates to whatever the backend returns. With JavaScript it is
intercepted and posted with `fetch` so the reader stays on the page. Both hit
the same endpoint; the fetch path sends `Accept: application/json`.

**While `formEndpoint` is null** the form renders in its real layout but submit
is disabled and a line under it says so. It does not pretend to send. A form
that reports success into nothing is the worst outcome available here — the
sender believes they are in touch and never hears back.

Real `<label for>` above every field. The greyed text inside each box is an
example, not a label: a placeholder vanishes the moment someone types, which
strands anyone interrupted mid-form with an unlabelled box.

### The server-side piece, and where it must not live

`output: "export"` has no route handlers, so the contact form must post to
something outside the export. **The client has their own backend**, so the PHP
file in `php/` is now a reference implementation — keep it only if it is the
one being used, and delete it otherwise rather than leaving two answers to the
same question in the repo.

Whatever backend is used, one rule carries over: **it must not live in
`public_html/dsa/`** — the
deploy step wipes that folder, so a PHP file there would be destroyed on every
single deploy. It goes in a sibling:

```
public_html/
  dsa/            ← wiped and replaced each deploy
  dsa-api/
    submit.php    ← uploaded once, by hand
```

`php/` is not part of the Next build; verified that `out/` contains no `.php`.

The endpoint answers two callers with one code path: `fetch` sending
`Accept: application/json` gets JSON, a plain form post with JS disabled gets a
small HTML page. That is what lets the form be progressively enhanced — it has
a real `action` and `method="post"` and works without JavaScript.

Every branch was exercised against `php -S`:

| Case | Result |
| --- | --- |
| `MAIL_TO` unset | **500** — refuses to run rather than silently dropping mail |
| `GET` | **405** |
| Foreign `Origin` | **403** |
| Honeypot filled | **200 `{"ok":true}`** — sends nothing; a 403 would teach a bot what to avoid |
| Missing email | **422** |
| Malformed email | **422** |
| `email=a@b.com\r\nBcc: victim@…` | **422** — rejected before it reaches a header |
| No-JS post | HTML confirmation page, not JSON |
| Valid post, MTA unavailable | **502** — the failure path reports failure |

`From:` is a mailbox on edufulness.com, never the sender's address: the domain
does not authorise Gmail to send on its behalf, so SPF/DKIM would fail and the
mail would be binned. The sender goes in `Reply-To:`.

### Fonts, and a build that needs the network

`next/font/google` downloads the three families at build time and self-hosts
them into the export, so **the first `npm run build` on a clean checkout needs
network access to fonts.googleapis.com**. After that they are cached in
`.next/cache`.

That is a real fragility for a site rebuilt occasionally (the copyright year is
baked in at build). The alternative is `next/font/local` with the woff2 files
committed — `npm i @fontsource/space-grotesk @fontsource/inter
@fontsource/jetbrains-mono`, copy the seven `latin-*-normal.woff2` files into
`app/fonts/`, and swap the three `next/font/google` calls for `localFont({src:
[...]})`. About fifteen lines, ~200KB in the repo, and builds stop depending on
Google. **Not done** — §4 of the brief specifies `next/font/google`, so it is a
call for the owner, not a silent change.

## Status

**All eleven sections are built.** Every nav target resolves to real content;
there are no placeholder stubs left in `app/page.tsx`.

Three sections ship a deliberate "not yet" state rather than invented content,
each behind a single config value:

| Section | Today | Becomes |
| --- | --- | --- |
| LiveClass | "No live class scheduled" | a dated session — set `LIVE_CLASS` |
| Contact | form, submit disabled | a working form — set `CONTACT.formEndpoint` |
| Program | "See the price on Udemy" | direct enrolment — set `DIRECT_ENROLMENT` |

## Verification pass — 2026-08-20

Run against the production build served statically, in headless Chromium.

| Check | Result |
| --- | --- |
| Horizontal overflow @375 / 768 / 1440, both themes | **none** — `scrollWidth === innerWidth` in all six |
| Console errors, full-page scroll, both themes | **clean** (only the expected 404 for the not-yet-added `icon.png`) |
| `<h1>` count | **1** |
| Heading level jumps | **none** — h1 → h2 → h3 throughout |
| Landmarks | header, nav, main#main, 7 × section[id], footer |
| Links | 40 total, 13 unique external — **no dead `#`, no broken anchors, every `target="_blank"` carries `rel="noopener noreferrer"`, no empty accessible names** |
| Images without `alt` | 0 (there are no `<img>` yet) |
| SVG | 57 total — 55 `aria-hidden`, 1 `role="img"` + label, 1 inside an `aria-hidden` wrapper |
| Touch targets @375 | all ≥ 44px except one inline link inside a sentence, which WCAG 2.5.8 exempts |
| Reduced motion | **0 running animations**; count-ups jump straight to their final values; 1 SVG reports SMIL paused |
| Tab order | skip link → wordmark → 5 nav links → 2 nav CTAs → hero CTAs → content, in visual order |

Two issues were found and fixed in this pass:

1. **Light-theme eyebrow failed AA** at 3.53:1 — see "Two colours that are not
   safe as text" above. Now 5.16:1.
2. **Skip link was 39px tall** when focused. Now 44px.

Reproduce with a static server over `out/` and a headless browser; the checks
are ordinary DOM queries plus a WCAG relative-luminance calculation.

## Build order

One section per pass.

- [x] **Nav** — sticky, scroll-spy, hamburger below `lg`
- [x] **Hero** — copy, CTAs, count-up stats, linked-list visual
- [x] **Marquee** — infinite keyword band
- [x] **Curriculum** — six stages, alternating rows, scrubbed spine *(grouping derived — gap 2)*
- [x] ~~**Phases**~~ — **dropped 2026-08-20** at the client's call: Curriculum already exposes all 21 sections, so a phase grid would repeat the same data under invented headings. Removed from `NAV_ITEMS`.
- [x] **Resources** — featured playlist + 8 cards, drawn cover art *(gaps 6a, 6b)*
- [x] **LiveClass** — both states built; ships the empty state *(gap 5 supplies a class)*
- [x] **Program** — panel with computed inclusions and one filled CTA *(direct enrolment optional — gap 3)*
- [x] **Instructor** — bio, count-up stats, portrait slot with drawn fallback *(gaps 8a, 8b)*
- [x] **Contact** — channel hand-off now, form ready behind one config value *(gaps 7a, 7b)*
- [x] **Footer** — brand, link columns from `NAV_ITEMS`, build-time year *(no contact column — gap 7)*
- [x] **ThemeToggle** — fixed bottom-right (landed with the scaffold)

## Local development

The dev server serves the site at **http://localhost:3000/dsa/**, not at `/`.
A `GET /` returning 404 is `basePath` working correctly, not a fault. Newly
added component files sometimes need a dev-server restart before Fast Refresh
picks them up.
