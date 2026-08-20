/**
 * CONTACT.
 *
 * Layout follows the Data Engineering site: copy and a WhatsApp hand-off on
 * the left, the form panel on the right.
 *
 * COPY DISCIPLINE. The DE version promises "the full 33-module syllabus and
 * the next batch dates". Neither exists for DSA — there is no syllabus PDF and
 * no batch schedule on record — so this copy promises only what can actually
 * be delivered: a reply. Promising a document that does not exist is the
 * fastest way to lose the first email.
 */

export const CONTACT = {
  /* ── Endpoint ──
     The client has a backend; the URL is not wired yet. Until it is, the form
     renders in its real layout but the submit button is disabled and says so,
     rather than posting into nothing and reporting success. */
  formEndpoint: null as string | null,

  /** WhatsApp channel for DSA announcements. Null = the button is not
   *  rendered at all. The DE site has a channel; whether the same one covers
   *  DSA has not been confirmed, and a WhatsApp link that lands people in the
   *  wrong community is worse than no link. README gap 7b. */
  whatsappUrl: null as string | null,

  /** Shown under the submit button. Says exactly what happens to the data —
   *  no more, so it stays true. */
  privacyNote: "We store your name and email only to reply about this course.",
} as const;

/** Field placeholders. Illustrative examples, never instructions — the real
 *  labels sit above each field and do not disappear when someone types. */
export const CONTACT_PLACEHOLDERS = {
  name: "Ada Lovelace",
  email: "you@example.com",
  message: "I'd like to know more about the course…",
} as const;
