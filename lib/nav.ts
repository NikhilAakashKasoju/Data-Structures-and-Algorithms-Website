/**
 * Nav model, kept out of the component so the scroll-spy observer and the
 * rendered list can never drift apart — one array drives both, and the
 * order here is also the tie-break order when two sections are on screen
 * at once.
 *
 * `href` is a bare hash, not `${basePath}#id`: an in-page anchor is resolved
 * against the current URL, so basePath is already applied. Prefixing it
 * would produce /dsa/dsa#curriculum.
 */
export type NavItem = { id: string; label: string };

export const NAV_ITEMS: NavItem[] = [
  { id: "curriculum", label: "Curriculum" },
  { id: "phases", label: "Phases" },
  { id: "resources", label: "Resources" },
  { id: "program", label: "Program" },
  { id: "instructor", label: "Instructor" },
  { id: "contact", label: "Contact" },
];
