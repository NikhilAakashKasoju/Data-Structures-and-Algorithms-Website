"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import {
  LIVE_CLASS,
  endsAt,
  formatClassDate,
  formatClassTime,
  type LiveClass as LiveClassData,
} from "@/lib/liveClass";
import { CHANNEL_URL } from "@/lib/resources";

/**
 * LIVE CLASS PANEL.
 *
 * THE HARD PART IS TIME, NOT LAYOUT. Under `output: "export"` the page is
 * rendered once, at build. There is no server to re-render it the morning
 * after a class, so a scheduled date left alone would sit there advertising
 * a session that finished last week — the single most damaging kind of stale
 * content on a course page.
 *
 * So expiry is handled on the client:
 *
 *   - The static HTML contains the scheduled state. That is what a crawler
 *     and a no-JS reader get, and at build time it is correct.
 *   - On mount, the component compares the session's END time to the clock
 *     and switches to the empty state if it has passed.
 *   - The first client render deliberately matches the server render
 *     (`expired` starts false and is only set in an effect), so there is no
 *     hydration mismatch — the swap happens a frame later.
 *
 * End time rather than start time, so someone arriving ten minutes into a
 * ninety-minute class still gets the join link.
 *
 * THE EMPTY STATE IS NOT A FALLBACK. `LIVE_CLASS` is currently null and the
 * page ships the "nothing scheduled" panel. That is an honest answer; an
 * invented date is not. Both states are built and both are exercised.
 */
export function LiveClass() {
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    /* Copied into a local const so TypeScript's narrowing survives into the
       closure below — an imported binding could in principle be reassigned
       by its module, so the null check alone does not narrow inside `check`. */
    const cls = LIVE_CLASS;
    if (!cls) return;

    const check = () => setExpired(Date.now() > endsAt(cls));
    check();

    /* Re-check every minute rather than only on mount: someone can leave the
       page open across the end of a session, and a 60s tick is cheap enough
       that a more precise timeout is not worth the extra code. */
    const id = window.setInterval(check, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const upcoming = LIVE_CLASS && !expired ? LIVE_CLASS : null;

  return (
    <section
      id="live"
      className="relative z-10 mx-auto max-w-[1300px] px-5 py-20 sm:px-8 sm:py-28 lg:px-12"
    >
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={stagger}
        className="relative"
      >
        {/* Halo as a blurred sibling, not a box-shadow — a shadow this large
            and diffuse bands visibly on #0d0714. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-4 -z-10 rounded-[44px] bg-purple/15 blur-3xl"
        />

        <motion.div variants={fadeUp} className="panel">
          {upcoming ? <Scheduled cls={upcoming} /> : <NothingScheduled />}
        </motion.div>
      </motion.div>
    </section>
  );
}

function Scheduled({ cls }: { cls: LiveClassData }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-12">
      <div>
        <p className="flex items-center gap-2.5">
          <LivePulse />
          <span className="eyebrow">/ Next live class</span>
        </p>

        <h2 className="mt-4 font-display text-[clamp(26px,3.2vw,40px)] font-bold leading-[1.12] tracking-tight">
          {cls.topic}
        </h2>

        {/* <dl> again: "Date 5 September 2026 Time 10:00 am Duration 90
            minutes" needs the pairing to survive a screen reader. */}
        <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-5">
          <Fact label="Date" value={formatClassDate(cls.startsAt)} />
          <Fact label="Time (IST)" value={formatClassTime(cls.startsAt)} />
          <Fact label="Duration" value={`${cls.durationMinutes} min`} />
        </dl>
      </div>

      <div className="flex flex-col items-start gap-3 lg:items-end">
        <a
          href={cls.joinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary min-h-[44px]"
        >
          Join this class
        </a>
        <p className="font-mono text-[11px] uppercase tracking-[0.09em] text-muted">
          Free to attend
        </p>
      </div>
    </div>
  );
}

/**
 * The "nothing scheduled" state.
 *
 * It sends the reader somewhere real rather than apologising: the free
 * lessons that already exist, and the channel where a class would be
 * announced. There is deliberately no "notify me" form — the WhatsApp
 * community link and reply-to address are still unsupplied (README gap 7),
 * and a subscribe box that goes nowhere is worse than no box.
 */
function NothingScheduled() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-12">
      <div>
        <p className="eyebrow">/ Live classes</p>

        <h2 className="mt-4 font-display text-[clamp(26px,3.2vw,40px)] font-bold leading-[1.12] tracking-tight">
          No live class scheduled right now
        </h2>

        <p className="mt-4 max-w-[58ch] text-[16.5px] leading-relaxed text-muted">
          Sessions are announced on the EduFulness channel. In the meantime the
          recorded lessons below cover the same ground, and the full course is
          on Udemy.
        </p>
      </div>

      <div className="flex flex-col items-start gap-3 sm:flex-row lg:flex-col lg:items-end">
        <a
          href={CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary min-h-[44px]"
        >
          EduFulness channel
        </a>
        <a href="#resources" className="btn-secondary min-h-[44px]">
          Free lessons
        </a>
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  /* flex-col-reverse so the value reads above its label while the DOM keeps
     the dt-then-dd order a <dl> requires. */
  return (
    <div className="flex flex-col-reverse">
      <dt className="label mt-1.5">{label}</dt>
      <dd className="font-display text-[18px] font-bold leading-none">
        {value}
      </dd>
    </div>
  );
}

/**
 * Live indicator: an expanding ring BEHIND a static core.
 * Pulsing the dot itself makes it hard to read; pulsing a ring behind it
 * keeps the core crisp while the motion still says "happening soon".
 * animate-ping is a CSS animation, so the reduced-motion block in
 * globals.css stops it without any JS involvement.
 */
function LivePulse() {
  return (
    <span aria-hidden="true" className="relative flex h-2.5 w-2.5">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-70" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-lime" />
    </span>
  );
}
