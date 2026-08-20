"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";

import { STAGE_ART } from "@/components/CurriculumArt";
import { COURSE } from "@/lib/course";
import { CURRICULUM, sectionLabel } from "@/lib/curriculum";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import {
  STAGES,
  formatMinutes,
  sectionsFor,
  stageLectureCount,
  stageMinutes,
  type Stage,
} from "@/lib/stages";

/**
 * CURRICULUM.
 *
 * Client component: Framer variants for the entrance and a scroll-linked
 * MotionValue for the spine.
 *
 * HONESTY OF THE GROUPING. The six stages are our labels; the 21 sections
 * under them are the syllabus. Every row therefore exposes its real section
 * titles in a <details>, so the grouping is a way of reading the syllabus
 * rather than a replacement for it. Any title that is not provably verbatim
 * carries a dagger and a footnote — see `titleVerified` in lib/curriculum.ts.
 *
 * PROGRESSIVE DISCLOSURE VIA <details>. Native, keyboard-operable, findable
 * by the browser's in-page search in modern engines, and it needs no state,
 * no JS and no ARIA of its own. A hand-rolled accordion here would be more
 * code and less accessible.
 */

/* Accent per stage. Cycles through three hues rather than six so the page
   reads as one palette; using every token available would make the section
   look like a colour test. */
const ACCENTS = [
  "var(--hex-primary-2)",
  "var(--hex-teal)",
  "var(--hex-accent)",
] as const;

export function Curriculum() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  /* Scroll-scrubbed spine.
     offset ["start 0.75", "end 0.4"] means the line starts drawing when the
     top of the track reaches three-quarters down the viewport and finishes
     when its bottom passes 40% — so it completes as you read the last row,
     not after you have already scrolled past it.
     The spring removes the jitter of a raw scroll value on a trackpad. */
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 0.75", "end 0.4"],
  });
  const drawn = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section
      id="curriculum"
      className="relative z-10 mx-auto max-w-[1300px] px-5 py-20 sm:px-8 sm:py-28 lg:px-12"
    >
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={stagger}
        className="max-w-[62ch]"
      >
        <motion.p variants={fadeUp} className="eyebrow">
          / The path
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="mt-4 font-display text-[clamp(30px,3.8vw,46px)] font-bold leading-[1.12] tracking-tight"
        >
          From memory layout to dynamic programming
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="mt-4 text-[16.5px] leading-relaxed text-muted"
        >
          {COURSE.sections} sections, grouped into six stages. Open any stage
          to see the sections it contains, exactly as they appear in the
          course.
        </motion.p>
      </motion.div>

      <div ref={trackRef} className="relative mt-16 sm:mt-20">
        {/* ── Scrubbed spine ──
            lg only. Below that the rows stack into a single column and a
            centre line would run straight through the content instead of
            between two columns. aria-hidden: it is a progress ornament, not
            information. */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-[2px] -translate-x-1/2 lg:block"
          viewBox="0 0 2 100"
          preserveAspectRatio="none"
        >
          <line x1="1" y1="0" x2="1" y2="100" strokeWidth="2" style={{ stroke: "var(--line)" }} />
          <motion.line
            x1="1"
            y1="0"
            x2="1"
            y2="100"
            strokeWidth="2"
            style={{
              stroke: "var(--hex-primary-2)",
              /* Under reduced motion the line is simply present rather than
                 drawing — scroll-linked or not, an animating stroke is
                 motion the user asked not to see. */
              pathLength: reduced ? 1 : drawn,
            }}
          />
        </svg>

        <ol className="space-y-16 sm:space-y-24">
          {STAGES.map((stage, i) => (
            <StageRow
              key={stage.key}
              stage={stage}
              index={i}
              accent={ACCENTS[i % ACCENTS.length]}
            />
          ))}
        </ol>
      </div>

      {/* Rendered only while something is actually unverified. Every title
          is currently confirmed against a curriculum screenshot, so this is
          dormant — but it stays wired so a future edit that introduces an
          unverified title surfaces the dagger AND its explanation together,
          rather than leaving an unexplained mark on the page. */}
      {CURRICULUM.some((s) => !s.titleVerified) && (
        <p className="mt-14 max-w-[62ch] font-mono text-[11px] leading-relaxed text-muted">
          † Not provably verbatim from the published curriculum.
        </p>
      )}
    </section>
  );
}

function StageRow({
  stage,
  index,
  accent,
}: {
  stage: Stage;
  index: number;
  accent: string;
}) {
  const Art = STAGE_ART[stage.key];
  const sections = sectionsFor(stage);
  const flipped = index % 2 === 1;

  return (
    <motion.li
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={stagger}
      className="grid items-center gap-8 lg:grid-cols-2 lg:gap-20"
    >
      {/* Copy is ALWAYS first in the DOM. The visual swap on alternating rows
          is done with `order` at lg only, so a screen reader and a keyboard
          user get a consistent heading-then-detail sequence all the way down
          rather than an order that flips every row. */}
      <motion.div variants={fadeUp} className={flipped ? "lg:order-2" : undefined}>
        <div className="flex items-center gap-3">
          <span
            className="font-mono text-[11px] tabular"
            style={{ color: accent }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="h-px w-8" style={{ background: accent, opacity: 0.5 }} />
        </div>

        <h3 className="mt-3 font-display text-[clamp(22px,2.4vw,30px)] font-bold leading-snug tracking-tight">
          {stage.title}
        </h3>

        <p className="mt-3 text-[15.5px] leading-relaxed text-muted">
          {stage.blurb}
        </p>

        {/* Counts are computed from the curriculum data, never typed in, so
            they cannot drift from the source. */}
        <dl className="mt-5 flex flex-wrap gap-x-7 gap-y-2">
          <StageStat label="Sections" value={String(sections.length)} />
          <StageStat label="Lectures" value={String(stageLectureCount(stage))} />
          <StageStat label="Runtime" value={formatMinutes(stageMinutes(stage))} />
        </dl>

        <details className="group mt-5 rounded-2xl border border-line bg-surface transition-colors open:bg-surface-2 hover:border-line-strong">
          <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.09em] text-muted">
            <span>Sections in this stage</span>
            <ChevronGlyph />
          </summary>
          <ul className="border-t border-line px-4 py-3">
            {sections.map((s) => (
              <li
                key={s.n}
                className="flex items-baseline justify-between gap-4 py-1.5 text-[14px]"
              >
                <span>
                  <span className="mr-2 font-mono text-[11px] tabular text-muted">
                    {String(s.n).padStart(2, "0")}
                  </span>
                  {/* sectionLabel(), not s.title: section 14's header
                      carries a typo in the source ("Aymptotic"). The typo is
                      preserved in the data so this file stays diffable
                      against Udemy, and corrected only for display. */}
                  {sectionLabel(s)}
                  {s.badge && (
                    <span className="ml-2 rounded-full border border-line px-1.5 py-0.5 align-middle font-mono text-[9px] uppercase tracking-[0.09em] text-muted">
                      {s.badge}
                    </span>
                  )}
                  {!s.titleVerified && (
                    <span
                      className="text-muted"
                      title="Not provably verbatim — see footnote"
                    >
                      {" "}
                      †
                    </span>
                  )}
                </span>
                {/* Item count, matching what Udemy prints in its own section
                    header. Where one of those items is an article rather than
                    a video it is called out, because that single row is the
                    whole reason 223 items are advertised as 222 lectures. */}
                <span className="shrink-0 font-mono text-[11px] tabular text-muted">
                  {s.lectures.length}
                  {s.lectures.filter((l) => l.kind === "article").length > 0 && (
                    <span className="ml-1.5 normal-case">
                      · {s.lectures.filter((l) => l.kind === "article").length}{" "}
                      article
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </details>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className={`min-w-0 ${flipped ? "lg:order-1" : ""}`}
      >
        {/* max-w on the drawing, not on the card. The card should fill its
            grid column, but the SVG scales its stroke widths with its box —
            let it run to 780px and every 1.4px line renders hairline-thin
            while the labels balloon. Capping it at 380px keeps the drawing at
            roughly the weight it was designed for at every breakpoint. */}
        <div className="flex items-center justify-center rounded-3xl border border-line bg-surface px-6 py-8 sm:px-8 sm:py-10">
          <div className="w-full max-w-[380px]">
            <Art accent={accent} />
          </div>
        </div>
      </motion.div>
    </motion.li>
  );
}

function StageStat({ label, value }: { label: string; value: string }) {
  /* flex-col-reverse: a <dl> group must be dt-then-dd to be valid, but the
     number reads better above its label. */
  return (
    <div className="flex flex-col-reverse">
      <dt className="label mt-1">{label}</dt>
      <dd className="tabular font-display text-[19px] font-bold leading-none">
        {value}
      </dd>
    </div>
  );
}

function ChevronGlyph() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="h-[14px] w-[14px] shrink-0 transition-transform group-open:rotate-180"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m4 6 4 4 4-4" />
    </svg>
  );
}
