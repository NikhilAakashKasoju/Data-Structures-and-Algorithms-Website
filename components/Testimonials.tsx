"use client";

import { motion } from "framer-motion";

import { COURSE } from "@/lib/course";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import { TESTIMONIALS, type Testimonial } from "@/lib/testimonials";

/**
 * A faster stagger than the shared one.
 *
 * lib/motion.ts uses 0.14s between children, tuned for the three-to-six item
 * groups everywhere else. Thirteen cards at 0.14s means the last one does not
 * begin until 1.8s after the wall enters view — long enough that a reader
 * scrolling normally watches cards appear beneath their eyes. 0.045s keeps the
 * cascade legible and finishes the whole wall in about half a second.
 */
const wallStagger = { hidden: {}, show: { transition: { staggerChildren: 0.045 } } };

/**
 * TESTIMONIALS.
 *
 * LAYOUT: CSS multi-column, not a grid. The thirteen quotes range from one
 * line to eight, and a grid would either stretch every card in a row to the
 * tallest one — a wall of whitespace under the short quotes — or need JS to
 * measure and distribute them. `columns-*` with `break-inside-avoid` packs
 * them by height, costs no JavaScript, and reading order still follows the
 * DOM: down column one, then column two.
 *
 * NO AGGREGATE FIGURE. The heading never claims a rating or a review count.
 * These are thirteen reviews the client chose to show; presenting a
 * hand-picked set as "5.0 from 13 reviews" would read as the course's overall
 * rating, which it is not. See lib/testimonials.ts.
 *
 * QUOTES ARE VERBATIM, typos included. Read the file header before "fixing"
 * any of the grammar in the data.
 */
export function Testimonials() {
  return (
    <section
      id="reviews"
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
          / In their words
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="mt-4 font-display text-[clamp(30px,3.8vw,46px)] font-bold leading-[1.12] tracking-tight"
        >
          What students say
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="mt-4 text-[16.5px] leading-relaxed text-muted"
        >
          Reviews left on Udemy, quoted in full and unedited.
        </motion.p>
      </motion.div>

      {/* One observer for the whole wall, not thirteen. */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.05 }}
        variants={wallStagger}
        className="mt-12 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5"
      >
        {TESTIMONIALS.map((t) => (
          <Card key={t.name} testimonial={t} />
        ))}
      </motion.div>

      <motion.p
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={fadeUp}
        className="mt-4 text-[15.5px] text-muted"
      >
        More on{" "}
        <a
          href={COURSE.udemyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-purple-2 underline-offset-4 hover:underline"
        >
          the course page
        </a>
        .
      </motion.p>
    </section>
  );
}

function Card({ testimonial }: { testimonial: Testimonial }) {
  const { name, quote, rating } = testimonial;

  return (
    /* break-inside-avoid stops a card being split across two columns.
       <figure>/<blockquote>/<figcaption> rather than divs: the quote and its
       attribution are a single unit, and assistive tech announces it as one. */
    <motion.figure
      variants={fadeUp}
      className="m-0 break-inside-avoid rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-purple/35 hover:bg-surface-2"
    >
      <Stars rating={rating} />

      <blockquote className="mt-4">
        <p className="text-[15.5px] leading-relaxed text-text">{quote}</p>
      </blockquote>

      <figcaption className="mt-5 flex items-center gap-3">
        {/* Initial in a disc. No stock avatars: a made-up face beside a real
            person's review is the same lie as a stock instructor portrait. */}
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-surface-2 font-display text-[14px] font-bold text-muted"
        >
          {name.charAt(0)}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[14px] font-semibold">{name}</span>
          <span className="block font-mono text-[10.5px] uppercase tracking-[0.09em] text-muted">
            Udemy review
          </span>
        </span>
      </figcaption>
    </motion.figure>
  );
}

/**
 * Rating.
 *
 * The stars are `aria-hidden` decoration and the real value is a
 * visually-hidden string, so a screen reader hears "Rated 5 out of 5" once
 * instead of the word "star" five times.
 */
function Stars({ rating }: { rating: number }) {
  return (
    <p className="flex items-center gap-0.5">
      <span className="sr-only">Rated {rating} out of 5</span>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          aria-hidden="true"
          className="h-[15px] w-[15px]"
          style={{ fill: i < rating ? "var(--hex-lime)" : "var(--hex-ring)" }}
        >
          <path d="M10 1.6l2.47 5.5 5.99.62-4.47 4.03 1.25 5.89L10 14.7l-5.24 2.94 1.25-5.89L1.54 7.72l5.99-.62L10 1.6z" />
        </svg>
      ))}
    </p>
  );
}
