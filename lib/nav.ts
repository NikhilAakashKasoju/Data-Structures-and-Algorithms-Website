/**
 * Nav model, kept out of the component so the scroll-spy observer and the
 * rendered list can never drift apart — one array drives both, and the
 * order here is also the tie-break order when two sections are on screen
 * at once. The Footer's "On this page" column reads it too.
 *
 * "Phases" was dropped on 2026-08-20: the Curriculum section already exposes
 * all 21 syllabus sections inside its six stages, so a separate phase grid
 * would have been the same data a second time under invented headings.
 *
 * `href` is a bare hash, not `${basePath}#id`: an in-page anchor is resolved
 * against the current URL, so basePath is already applied. Prefixing it
 * would produce /dsa/dsa#curriculum.
 */
export type NavItem = { id: string; label: string };

export const NAV_ITEMS: NavItem[] = [
  { id: "curriculum", label: "Curriculum" },
  { id: "resources", label: "Resources" },
  { id: "program", label: "Program" },
  { id: "instructor", label: "Instructor" },
  { id: "reviews", label: "Reviews" },
  { id: "contact", label: "Contact" },
];
