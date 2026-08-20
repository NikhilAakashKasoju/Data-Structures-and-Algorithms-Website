"use client";

import { motion } from "framer-motion";

import { RESOURCE_ART } from "@/components/ResourceArt";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import {
  CHANNEL_URL,
  KIND_LABEL,
  RESOURCE_PLAYLIST,
  visibleResources,
  type Resource,
} from "@/lib/resources";

/**
 * RESOURCES.
 *
 * Client component only for the staggered entrance — one parent observer
 * driving every card, rather than one observer per card.
 *
 * CONTENT INTEGRITY. Card titles are the YouTube titles, verbatim and
 * unedited, including their inconsistent spacing and numbering ("1.Towers of
 * Hanoi", "-2018 |Algorithms|"). Tidying them would make the page prettier
 * and make it stop matching the channel, which is the wrong trade for a list
 * whose whole job is to send someone to those videos. No video count is
 * claimed anywhere — see lib/resources.ts.
 */

/* Accents cycle through three hues, matching the Curriculum. */
const ACCENTS = [
  "var(--hex-primary-2)",
  "var(--hex-teal)",
  "var(--hex-accent)",
] as const;

export function Resources() {
  const Playlist = RESOURCE_ART.playlist;

  return (
    <section
      id="resources"
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
          / Free to watch
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="mt-4 font-display text-[clamp(30px,3.8vw,46px)] font-bold leading-[1.12] tracking-tight"
        >
          Watch before you decide
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="mt-4 text-[16.5px] leading-relaxed text-muted"
        >
          Full lessons and worked GATE questions from the same instructor, on
          the EduFulness channel. No sign-up, no email.
        </motion.p>
      </motion.div>

      {/* ── Featured: the playlist ──
          Promoted out of the grid because it is the entry point rather than
          one item among eight. */}
      <motion.a
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={fadeUp}
        href={RESOURCE_PLAYLIST.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-12 flex flex-col items-start gap-6 rounded-3xl border border-line bg-surface p-6 transition-colors hover:border-purple/35 hover:bg-surface-2 sm:flex-row sm:items-center sm:gap-10 sm:p-8"
      >
        <div className="w-full max-w-[180px] shrink-0 sm:max-w-[200px]">
          <Playlist accent="var(--hex-primary-2)" />
        </div>
        <div className="min-w-0">
          <span className="label">Playlist</span>
          <h3 className="mt-2 font-display text-[clamp(22px,2.4vw,30px)] font-bold leading-snug tracking-tight">
            {RESOURCE_PLAYLIST.title}
          </h3>
          <p className="mt-3 max-w-[52ch] text-[15.5px] leading-relaxed text-muted">
            The full data structures and algorithms series on YouTube, in order.
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-[14px] font-semibold text-purple-2">
            Open the playlist
            <ExternalGlyph />
          </span>
        </div>
      </motion.a>

      {/* ── Grid ── */}
      <motion.ul
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={stagger}
        className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {visibleResources.map((r, i) => (
          <ResourceCard
            key={r.id}
            resource={r}
            accent={ACCENTS[i % ACCENTS.length]}
          />
        ))}
      </motion.ul>

      <motion.p
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={fadeUp}
        className="mt-8 text-[15.5px] text-muted"
      >
        More on the{" "}
        <a
          href={CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-purple-2 underline-offset-4 hover:underline"
        >
          EduFulness channel
        </a>
        .
      </motion.p>
    </section>
  );
}

function ResourceCard({
  resource,
  accent,
}: {
  resource: Resource;
  accent: string;
}) {
  const Art = RESOURCE_ART[resource.art];

  return (
    <motion.li variants={fadeUp} className="min-w-0">
      {/* The whole card is the link, so the hit area is the card rather than
          the few words of the title — which matters most on touch, where a
          three-line title is the only alternative target. */}
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-purple/35 hover:bg-surface-2"
      >
        <div className="rounded-xl border border-line bg-chip/40 px-4 py-3">
          <Art accent={accent} />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.09em] text-muted">
            {KIND_LABEL[resource.kind]}
          </span>
          <span
            className="font-mono text-[10px] uppercase tracking-[0.09em]"
            style={{ color: accent }}
          >
            {resource.topic}
          </span>
        </div>

        {/* line-clamp-3, not a truncated string in the data: the full title
            stays in the DOM for search and for screen readers, and only the
            rendering is capped. */}
        <h3 className="mt-2 line-clamp-3 font-display text-[16px] font-semibold leading-snug">
          {resource.title}
        </h3>

        <span className="mt-auto flex items-center gap-1.5 pt-4 font-mono text-[11px] uppercase tracking-[0.09em] text-muted">
          YouTube
          <ExternalGlyph />
        </span>
      </a>
    </motion.li>
  );
}

function ExternalGlyph() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="h-[11px] w-[11px] shrink-0"
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
