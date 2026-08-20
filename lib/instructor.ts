import { asset } from "@/lib/site";

/**
 * INSTRUCTOR.
 *
 * SOURCING. Every claim below is published by the client about themselves, on
 * edufulness.com/data-engineering (fetched 2026-08-18) or on the Udemy
 * listing. Nothing here is inferred, rounded or embellished, and the source is
 * noted against each line. It is still listed under README gap 8, because
 * "published on your other site" is not the same as "confirmed current for
 * this one" — figures like a student count age.
 *
 * DELIBERATELY OMITTED. The DE page also claims "9+ years of hands-on data
 * integration, transformation and schema design". That is true of the
 * instructor and irrelevant on a DSA page — quoting it here would pad the bio
 * with credentials that do not support the thing being sold.
 */

export type InstructorStat = {
  label: string;
  /** Numeric part, for the count-up. */
  value: number;
  /** Rendered after the number, e.g. "+" or "th". */
  suffix?: string;
  /** Rendered under the number when the figure needs context. */
  note?: string;
  /** Thousands separators. Off for figures that are not counts. */
  group?: boolean;
};

export const INSTRUCTOR = {
  name: "Atchyut Kumar",
  /** Udemy publisher name, verbatim. */
  publisher: "Edufulness EFN",
  role: "Founder, EduFulness",

  /**
   * Portrait. null until a photo is supplied (README gap 8); the component
   * draws a fallback tile rather than shipping a broken image or a stock
   * face. When a file lands in public/, set this to asset("/instructor.jpg")
   * — asset() is required or the path 404s in production under basePath.
   */
  portrait: null as string | null,
  portraitAlt: "Atchyut Kumar",

  /**
   * Bio. Sentence 1: M.Tech, GATE rank, GATE faculty years — DE page.
   * Sentence 2: describes the structure visible in the syllabus itself,
   * where every topic has theory lectures followed by "C Code : …",
   * "C++ Code : …" and "Python Code : …" lectures.
   */
  bio: [
    "Atchyut Kumar has taught computer science for more than fifteen years, seven of them as GATE faculty. He holds an M.Tech from NIT Calicut and placed in the 99.97th percentile in GATE CS/IT — All India Rank 440.",
    "That background shows in how this course is built. Every structure is worked through by hand first — drawn, traced, its cost counted — and only then written out in C, C++ and Python. It is the same order an interviewer asks for, and the same order GATE marks.",
  ],

  /** All three from the DE page. */
  stats: [
    { label: "Students mentored", value: 110_000, suffix: "+", group: true },
    { label: "GATE CS/IT", value: 99.97, note: "percentile · AIR 440" },
    { label: "Years teaching", value: 15, suffix: "+", note: "research and industry" },
  ] satisfies InstructorStat[],

  links: [
    { label: "EduFulness channel", href: "https://www.youtube.com/@EduFulnessEFN" },
    { label: "edufulness.com", href: "https://edufulness.com/" },
  ],
} as const;

/** Kept as a function so the portrait path is resolved through asset() at the
 *  point of use, not baked into a module constant at import time. */
export const portraitSrc = (): string | null =>
  INSTRUCTOR.portrait ? asset(INSTRUCTOR.portrait) : null;
