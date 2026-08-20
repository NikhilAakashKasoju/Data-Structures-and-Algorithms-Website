"use client";

import { motion } from "framer-motion";

import { HeroVisual } from "@/components/HeroVisual";
import { COURSE } from "@/lib/course";
import { fadeUp, stagger } from "@/lib/motion";
import { useCountUp } from "@/lib/useCountUp";

/**
 * HERO.
 *
 * Client component because the entrance uses Framer variants and the stats
 * count up — both browser-only. Nothing downstream inherits the boundary.
 *
 * CONTENT INTEGRITY: every figure and claim below traces to the Udemy
 * listing. The eyebrow's three languages, the 21/222/43h57m stats and the
 * structures named in the sub-copy are all in the syllabus. There is
 * deliberately NO price, no batch dates, no student count, no certificate
 * claim and no "enrol" CTA — none of that has been supplied, so the primary
 * CTA points at the one checkout that exists. See README Known Gaps.
 */
export function Hero() {
  return (
    <section
      id="top"
      className="relative z-10 mx-auto max-w-[1300px] px-5 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-16 lg:px-12"
    >
      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        /* items-center, not items-start: at lg the visual is roughly as tall
           as the copy block, and top-aligning leaves the artwork stranded
           against the fold. */
        className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10"
      >
        {/* ── Copy ──
            First in source order, and first visually at every breakpoint.
            The visual is decoration for the proposition, not the other way
            round, so it never gets `order` treatment. */}
        <div>
          <motion.p variants={fadeUp} className="eyebrow">
            / {COURSE.languages.join(" · ")} · Beginner to advanced
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="mt-4 font-display text-[clamp(40px,5vw,72px)] font-bold leading-[1.04] tracking-tight"
          >
            Master Data Structures{" "}
            {/* The break is forced only from sm up. On a 375px screen the
                line wraps naturally and a hard break would leave a short
                orphan line. */}
            <span className="hidden sm:inline">
              <br />
            </span>
            &amp; Algorithms
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-[58ch] text-[16.5px] leading-relaxed text-muted"
          >
            Physical structures like arrays and linked lists. Logical
            structures like stacks, queues, trees and graphs. Searching,
            sorting, recursion, greedy methods and dynamic programming —
            each one worked through by hand, then implemented in C, C++ and
            Python.
          </motion.p>

          {/* One filled CTA. The secondary is an in-page jump, so the two
              never compete for the same click. */}
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
            <a
              className="btn-primary"
              href={COURSE.udemyUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get the course on Udemy
              <ArrowGlyph />
            </a>
            <a className="btn-secondary" href="#curriculum">
              See the curriculum
            </a>
          </motion.div>

          {/* A <dl>, not three divs. Without dt/dd a screen reader reads
              "21 Sections 222 Lectures 43 h 57m" as one undifferentiated
              run with no idea which number belongs to which label. */}
          <motion.dl
            variants={fadeUp}
            className="mt-12 grid max-w-[560px] grid-cols-3 gap-3 sm:gap-5"
          >
            <Stat label="Sections" value={COURSE.sections} />
            <Stat label="Lectures" value={COURSE.lectures} />
            <Stat
              label="Of video"
              value={COURSE.runtimeHours}
              suffix={`h ${COURSE.runtimeMinutes}m`}
            />
          </motion.dl>
        </div>

        {/* ── Visual ── */}
        <motion.div variants={fadeUp} className="min-w-0">
          <HeroVisual />
        </motion.div>
      </motion.div>
    </section>
  );
}

/**
 * One stat. `tabular` (font-variant-numeric: tabular-nums) is not cosmetic
 * here: while the number counts up, proportional digits change width every
 * frame and the label underneath visibly jitters.
 */
function Stat({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number;
  suffix?: string;
}) {
  const { ref, value: shown } = useCountUp<HTMLElement>(value);

  return (
    /* flex-col-reverse, not dd-then-dt in the markup: a <dl> group must be
       dt followed by dd to be valid, but the design wants the number on top.
       Reversing visually keeps the DOM order the spec (and every screen
       reader) expects. */
    <div className="flex flex-col-reverse">
      <dt className="label mt-2">{label}</dt>
      <dd
        ref={ref}
        className="tabular font-display text-[clamp(30px,4vw,42px)] font-bold leading-none"
      >
        {shown}
        {suffix && (
          <span className="text-[0.55em] font-semibold text-muted">{suffix}</span>
        )}
      </dd>
    </div>
  );
}

function ArrowGlyph() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="h-[14px] w-[14px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" />
    </svg>
  );
}
