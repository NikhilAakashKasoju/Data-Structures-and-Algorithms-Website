/**
 * SINGLE SOURCE OF TRUTH FOR COURSE FACTS.
 *
 * Rule: nothing goes in this file that is not verifiable from a source the
 * client supplied. Anything unverified is typed as `null` and listed under
 * "Known Gaps" in the README — never guessed, never rounded up, never
 * back-filled from a similar course.
 *
 * Verified source (fetched 2026-08-18):
 *   https://www.udemy.com/course/mastering-data-structures-and-algorithms-using-c-programming/
 */

export const COURSE = {
  /** Exact Udemy listing title. */
  title: "Data Structures & Algorithms using C++, C and Python - 2026",
  instructor: "Atchyut Kumar",
  publisher: "Edufulness EFN",

  /** VERIFIED from the Udemy listing. */
  sections: 21,
  lectures: 222,
  runtimeHours: 43,
  runtimeMinutes: 57,
  languages: ["C", "C++", "Python"] as const,

  udemyUrl:
    "https://www.udemy.com/course/mastering-data-structures-and-algorithms-using-c-programming/",

  /* Section titles no longer live here. lib/curriculum.ts holds all 21,
     verbatim and audited against curriculum screenshots — one source of
     truth, so the two cannot drift apart. */

  /** Quoted verbatim from the Udemy "What you'll learn" block. */
  outcomes: [
    "Data Structures and Algorithms for Beginners to Advanced",
    "Detailed discussion on Physical Data Structures like Arrays and Linked Lists",
    "Detailed discussion on Logical Data Structures like Stacks, Queues, Trees, Graphs",
    "Play with Searching and Sorting techniques",
    "Master the Most difficult concept 'RECURSION'",
    "Master Dynamic Programming and Graphs",
  ] as const,

  /* ── UNVERIFIED — must be supplied before these ship ──────────────── */
  /** Direct-enrolment price and checkout URL for the EduFulness program. */
  price: null,
  checkoutUrl: null,
  /** Weekday/weekend batch structure and programme duration in months. */
  batches: null,
  /** Next live class date / topic / time. */
  liveClass: null,
  /** WhatsApp community link, contact email, form endpoint. */
  whatsappUrl: null,
  contactEmail: null,
  /** Free YouTube playlists and their video counts. */
  playlists: null,
} as const;
