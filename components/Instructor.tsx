"use client";

import { motion } from "framer-motion";

import { INSTRUCTOR, portraitSrc, type InstructorStat } from "@/lib/instructor";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import { useCountUp } from "@/lib/useCountUp";

/**
 * INSTRUCTOR.
 *
 * Client component for the entrance variants and the stat count-ups.
 *
 * CONTENT INTEGRITY. Every figure is the client's own published claim, sourced
 * in lib/instructor.ts. Nothing is rounded up for effect — "99.97 percentile ·
 * AIR 440" is shown at full precision rather than as "top 0.1%", because the
 * exact number is more credible than the paraphrase and it is what the source
 * says.
 *
 * NO PORTRAIT YET. `INSTRUCTOR.portrait` is null, so the component draws a
 * fallback tile. Stock photography was not considered: a stranger's face
 * beside a real person's name is a lie in the one place a reader most needs
 * to trust the page.
 */
export function Instructor() {
  const src = portraitSrc();

  return (
    <section
      id="instructor"
      className="relative z-10 mx-auto max-w-[1300px] px-5 py-20 sm:px-8 sm:py-28 lg:px-12"
    >
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={stagger}
        className="grid gap-10 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-16"
      >
        {/* ── Portrait ──
            First in the DOM and first visually; it is the subject of the
            section, so there is no order swap to reason about here. */}
        <motion.figure variants={fadeUp} className="relative m-0">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-line bg-surface">
            {src ? (
              /* Plain <img>: `images.unoptimized` is set for the static
                 export, so next/image would add a component and a wrapper
                 for no optimization. Dimensions come from the aspect box. */
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={INSTRUCTOR.portraitAlt}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <PortraitFallback />
            )}

            {/* Scrim caption. A gradient rather than a solid bar so the
                portrait is not cropped by its own label, and the text sits on
                enough darkness to hold contrast whatever the photo does. */}
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent p-5 pt-14">
              <p className="font-display text-[19px] font-bold leading-tight text-white">
                {INSTRUCTOR.name}
              </p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.09em] text-white/70">
                {INSTRUCTOR.role}
              </p>
            </figcaption>
          </div>
        </motion.figure>

        {/* ── Copy ── */}
        <div>
          <motion.p variants={fadeUp} className="eyebrow">
            / Your instructor
          </motion.p>

          <motion.h2
            variants={fadeUp}
            className="mt-4 font-display text-[clamp(30px,3.8vw,46px)] font-bold leading-[1.12] tracking-tight"
          >
            Taught by {INSTRUCTOR.name}
          </motion.h2>

          {INSTRUCTOR.bio.map((para) => (
            <motion.p
              key={para.slice(0, 24)}
              variants={fadeUp}
              className="mt-4 max-w-[62ch] text-[16.5px] leading-relaxed text-muted"
            >
              {para}
            </motion.p>
          ))}

          <motion.dl
            variants={fadeUp}
            className="mt-10 grid gap-6 sm:grid-cols-3"
          >
            {INSTRUCTOR.stats.map((stat) => (
              <Stat key={stat.label} stat={stat} />
            ))}
          </motion.dl>

          <motion.ul variants={fadeUp} className="mt-10 flex flex-wrap gap-3">
            {INSTRUCTOR.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary min-h-[44px]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </motion.ul>
        </div>
      </motion.div>
    </section>
  );
}

function Stat({ stat }: { stat: InstructorStat }) {
  /* Count up on the integer part only. 99.97 counts to 99 and then prints its
     exact value — animating two decimal places is a blur of digits, and the
     figure matters more than the flourish. */
  const isDecimal = !Number.isInteger(stat.value);
  const { ref, value } = useCountUp<HTMLElement>(
    isDecimal ? Math.floor(stat.value) : stat.value,
  );

  const done = value >= (isDecimal ? Math.floor(stat.value) : stat.value);
  const shown = isDecimal && done ? stat.value.toFixed(2) : value;

  return (
    <div className="flex flex-col-reverse">
      <dt className="label mt-2">
        {stat.label}
        {stat.note && (
          <span className="mt-0.5 block normal-case tracking-normal">
            {stat.note}
          </span>
        )}
      </dt>
      <dd
        ref={ref}
        className="tabular font-display text-[clamp(26px,3vw,34px)] font-bold leading-none"
      >
        {/* Explicit en-GB grouping, not the visitor's locale: an Indian
            locale renders 110000 as "1,10,000", and the figure should read
            the same to everyone as it does on the source page. */}
        {stat.group && typeof shown === "number"
          ? new Intl.NumberFormat("en-GB").format(shown)
          : shown}
        {stat.suffix}
      </dd>
    </div>
  );
}

/**
 * Portrait fallback.
 *
 * Deliberately a diagram rather than a silhouette or a generic avatar: it
 * reads as "this tile is waiting for a photo" rather than as a person.
 * Stays dark in both themes, which §7.3 allows for media tiles — a drawn
 * dark tile on a light page reads as intentional, whereas a re-tinted one
 * looks like a rendering bug.
 */
function PortraitFallback() {
  const initials = INSTRUCTOR.name
    .split(" ")
    .map((w) => w[0])
    .join("");

  return (
    <div
      className="flex h-full w-full items-center justify-center"
      style={{ background: "#0d0714" }}
    >
      <svg viewBox="0 0 160 200" aria-hidden="true" className="h-full w-full">
        {/* A small tree, echoing the curriculum art, with the root where a
            head would sit. */}
        <path
          d="M80 78 L52 116 M80 78 L108 116 M52 128 L36 158 M52 128 L68 158"
          fill="none"
          strokeWidth="1.4"
          style={{ stroke: "var(--hex-ring)" }}
        />
        <circle
          cx="80"
          cy="66"
          r="26"
          fill="none"
          strokeWidth="1.6"
          style={{ stroke: "var(--hex-primary-2)" }}
        />
        <text
          x="80"
          y="66"
          textAnchor="middle"
          dominantBaseline="central"
          className="font-display text-[22px] font-bold"
          style={{ fill: "var(--hex-primary-2)" }}
        >
          {initials}
        </text>
        {[
          [52, 122],
          [108, 122],
          [36, 164],
          [68, 164],
        ].map(([x, y]) => (
          <circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r="6"
            fill="none"
            strokeWidth="1.4"
            style={{ stroke: "var(--hex-ring)" }}
          />
        ))}
      </svg>
    </div>
  );
}
