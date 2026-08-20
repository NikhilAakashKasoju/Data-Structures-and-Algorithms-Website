"use client";

import { motion } from "framer-motion";

import { COURSE } from "@/lib/course";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import {
  DIRECT_ENROLMENT,
  PROGRAM_INCLUDES,
  PROGRAM_OUTCOMES,
} from "@/lib/program";

/**
 * PROGRAM.
 *
 * ONE FILLED CTA. The whole section builds to a single gradient button. If
 * direct enrolment is ever configured it becomes the primary and Udemy drops
 * to secondary — two gradient buttons side by side would mean neither reads
 * as primary.
 *
 * NO PRICE, DELIBERATELY. See the reasoning in lib/program.ts: Udemy's price
 * moves with their promotions, and a stale price on a checkout panel is the
 * one number a buyer will hold you to. The panel links to the live price.
 */
export function Program() {
  return (
    <section
      id="program"
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
          / The programme
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="mt-4 font-display text-[clamp(30px,3.8vw,46px)] font-bold leading-[1.12] tracking-tight"
        >
          What you get
        </motion.h2>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={fadeUp}
        className="relative mt-12"
      >
        {/* Halo as a blurred sibling, not a box-shadow. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-4 -z-10 rounded-[44px] bg-purple/15 blur-3xl"
        />

        <div className="panel grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)] lg:gap-16">
          {/* ── What's in it ── */}
          <div>
            <h3 className="label">In the course</h3>
            <ul className="mt-4 grid gap-2.5">
              {PROGRAM_INCLUDES.map((line) => (
                <Tick key={line}>{line}</Tick>
              ))}
            </ul>

            <h3 className="label mt-9">What you&apos;ll learn</h3>
            <ul className="mt-4 grid gap-2.5">
              {PROGRAM_OUTCOMES.map((line) => (
                <Tick key={line}>{line}</Tick>
              ))}
            </ul>
          </div>

          {/* ── Buy ── */}
          <div className="lg:border-l lg:border-line lg:pl-12">
            {DIRECT_ENROLMENT ? (
              <>
                <p className="label">Enrol directly</p>
                <p className="mt-2 font-display text-[clamp(34px,4vw,44px)] font-bold leading-none tabular">
                  {DIRECT_ENROLMENT.price}
                </p>
                <p className="mt-3 text-[15.5px] leading-relaxed text-muted">
                  {DIRECT_ENROLMENT.batches}
                </p>
                <a
                  href={DIRECT_ENROLMENT.checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary mt-6 w-full min-h-[44px]"
                >
                  Enrol now
                </a>
                <a
                  href={COURSE.udemyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary mt-3 w-full min-h-[44px]"
                >
                  Or buy on Udemy
                </a>
              </>
            ) : (
              <>
                <p className="label">Where to buy</p>
                <p className="mt-3 text-[16.5px] leading-relaxed text-muted">
                  The course is sold on Udemy, where the price moves with
                  Udemy&apos;s own promotions. Rather than print a figure here
                  that goes stale, the button takes you to the live price.
                </p>
                <a
                  href={COURSE.udemyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary mt-6 w-full min-h-[44px]"
                >
                  See the price on Udemy
                  <ArrowGlyph />
                </a>
                <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.09em] text-muted">
                  Free lessons first?{" "}
                  <a
                    href="#resources"
                    className="text-purple-2 underline-offset-4 hover:underline"
                  >
                    Start here
                  </a>
                </p>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function Tick({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-[15.5px] leading-relaxed">
      {/* Lime is the tick colour in this palette. aria-hidden because the list
          semantics already convey "these are the items" — a screen reader
          reading "tick" before every line is noise. */}
      <svg
        viewBox="0 0 16 16"
        aria-hidden="true"
        className="mt-[5px] h-[13px] w-[13px] shrink-0 text-lime"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m3 8.5 3.5 3.5L13 5" />
      </svg>
      <span>{children}</span>
    </li>
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
      <path d="M6 3h7v7M13 3 4 12" />
    </svg>
  );
}
