/**
 * CONTACT.
 *
 * Two states, the same pattern as the live-class panel:
 *
 *   formEndpoint === null  → channel hand-off. Real destinations only.
 *   formEndpoint set       → the form renders and posts to that PHP endpoint.
 *
 * Today it is null, so the page hands off to channels that actually exist
 * rather than showing a form that emails nowhere. A form that silently
 * discards a message is worse than no form: the sender believes they have
 * been in touch.
 *
 * WHY THE ENDPOINT IS NOT INSIDE /dsa/. The deploy step for this site is
 * "delete everything inside public_html/dsa/, then upload out/". A PHP file
 * living in that folder would be deleted on every single deploy. It goes in a
 * SIBLING folder — public_html/dsa-api/ — which the deploy never touches.
 * See php/README-deploy.md.
 */

export type ContactChannel = {
  label: string;
  description: string;
  href: string;
  /** Opens off-site. */
  external?: true;
};

/** Every one of these resolves somewhere real. No placeholders. */
export const CONTACT_CHANNELS: ContactChannel[] = [
  {
    label: "Ask on the course",
    description:
      "Udemy's Q&A goes straight to the instructor and the answer stays visible to everyone else on the course.",
    href: "https://www.udemy.com/course/mastering-data-structures-and-algorithms-using-c-programming/",
    external: true,
  },
  {
    label: "EduFulness on YouTube",
    description:
      "Comment on any lesson, or watch for announcements — live sessions are posted here first.",
    href: "https://www.youtube.com/@EduFulnessEFN",
    external: true,
  },
  {
    label: "edufulness.com",
    description:
      "The rest of the EduFulness courses, including Azure Data Engineering.",
    href: "https://edufulness.com/",
    external: true,
  },
];

export const CONTACT = {
  /* ── Not yet supplied — README gap 7 ──
     Set to the deployed endpoint, e.g. "https://edufulness.com/dsa-api/submit.php",
     and the form replaces the channel hand-off automatically. The PHP file is
     already written; it only needs a recipient address configured at the top
     of it. */
  formEndpoint: null as string | null,

  /** Shown under the form so a sender knows what happens to their details.
   *  Only rendered when the form is. */
  privacyNote:
    "We store your name and email only to reply about this course.",

  /** WhatsApp community link, if there is one for DSA. Null = not rendered. */
  whatsappUrl: null as string | null,
} as const;
