/**
 * LIVE CLASS.
 *
 * The one piece of genuinely time-sensitive content on a site that has no
 * server. `output: "export"` means this file's value is frozen at
 * `npm run build`, so a scheduled class does not stop being "upcoming" on its
 * own — nothing re-renders after the date passes. The component therefore
 * compares `startsAt` to the clock on the client and falls back to the empty
 * state once it is over. See components/LiveClass.tsx.
 *
 * `LIVE_CLASS` is null until a real class is supplied (README gap 5). Null is
 * a first-class state here, not a placeholder: a course page that says
 * "nothing scheduled right now" is honest, whereas one showing an invented
 * date is the exact failure mode §9 exists to prevent.
 */

export type LiveClass = {
  /** ISO 8601 WITH an explicit offset. A bare "2026-09-05T10:00" would be
   *  parsed as UTC at build time and as local time in the browser, so the
   *  same string would describe two different instants. */
  startsAt: string;
  /** Verbatim session title. */
  topic: string;
  durationMinutes: number;
  /** Real join or registration URL. No placeholder links. */
  joinUrl: string;
};

/* ── Not yet supplied — README gap 5 ──
   To schedule a class, replace null with e.g.

     { startsAt: "2026-09-05T10:00:00+05:30",
       topic: "Solving AVL rotations under exam pressure",
       durationMinutes: 90,
       joinUrl: "https://…" }

   and rebuild. The panel switches to the scheduled state automatically and
   expires itself once the end time passes. */
export const LIVE_CLASS: LiveClass | null = null;

/** Classes run on IST, so both the build (UTC) and the browser (anywhere)
 *  must format against that zone explicitly. Without a fixed `timeZone` the
 *  server and client produce different strings and React logs a hydration
 *  mismatch — on a date, which is the worst thing to get quietly wrong. */
const IST = "Asia/Kolkata";

export function formatClassDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: IST,
  }).format(new Date(iso));
}

export function formatClassTime(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: IST,
  }).format(new Date(iso));
}

/** Milliseconds after `startsAt` at which the panel should stop advertising
 *  the class. Uses the end of the session, not the start, so a viewer who
 *  arrives ten minutes late still sees the join link. */
export function endsAt(cls: LiveClass): number {
  return new Date(cls.startsAt).getTime() + cls.durationMinutes * 60_000;
}
