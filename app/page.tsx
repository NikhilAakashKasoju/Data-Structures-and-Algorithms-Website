import { COURSE } from "@/lib/course";
import { CURRICULUM, transcribedLectureCount } from "@/lib/curriculum";
import { NAV_ITEMS } from "@/lib/nav";

/**
 * Scaffold page.
 *
 * Everything below is placeholder scaffolding, not content: it exists so the
 * Nav has real anchor targets to spy on and so the design system can be
 * checked in both themes. Each stub is replaced by its real section, one at
 * a time, in the order listed in NAV_ITEMS.
 *
 * Server component — nothing here needs a hook.
 */
export default function Page() {
  return (
    <>
      <section
        id="top"
        className="relative z-10 mx-auto max-w-[1300px] px-5 py-20 sm:px-8 sm:py-28 lg:px-12"
      >
        <p className="eyebrow">/ Design system check</p>

        <h1 className="mt-4 font-display text-[clamp(40px,5vw,72px)] font-bold leading-[1.04] tracking-tight">
          {COURSE.title}
        </h1>

        <p className="mt-5 max-w-[62ch] text-[16.5px] leading-relaxed text-muted">
          Scaffold and Nav only. Tokens, fonts, background layers and the
          reduced-motion stack are wired; the sections below are empty anchor
          targets so the scroll-spy has something to observe.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            className="btn-primary"
            href={COURSE.udemyUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Udemy
          </a>
          <a className="btn-secondary" href="#curriculum">
            Jump to curriculum
          </a>
        </div>

        {/* A <dl>, not divs: a screen reader would otherwise read
            "21 Sections 222 Lectures" as one undifferentiated run. */}
        <dl className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Stat label="Sections" value={String(COURSE.sections)} />
          <Stat label="Lectures" value={String(COURSE.lectures)} />
          <Stat
            label="Runtime"
            value={`${COURSE.runtimeHours}h ${COURSE.runtimeMinutes}m`}
          />
        </dl>

        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.09em] text-muted">
          Transcribed curriculum holds {transcribedLectureCount} rows across{" "}
          {CURRICULUM.length} sections — see lib/curriculum.ts for the
          one-row discrepancy against Udemy&apos;s stated {COURSE.lectures}.
        </p>
      </section>

      {NAV_ITEMS.map((item) => (
        <Stub key={item.id} id={item.id} label={item.label} />
      ))}

      {/* Not in the nav list, but the nav's secondary CTA points at it. */}
      <Stub id="live" label="Live class" />
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <dt className="label">{label}</dt>
      <dd className="mt-1 font-display text-[34px] font-bold leading-none tabular">
        {value}
      </dd>
    </div>
  );
}

/** Empty anchor target. Tall enough that the scroll-spy band can resolve it. */
function Stub({ id, label }: { id: string; label: string }) {
  return (
    <section
      id={id}
      className="relative z-10 mx-auto max-w-[1300px] px-5 py-20 sm:px-8 sm:py-28 lg:px-12"
    >
      <p className="eyebrow">/ {label}</p>
      <h2 className="mt-4 font-display text-[clamp(30px,3.8vw,46px)] font-bold leading-[1.12] tracking-tight">
        {label}
      </h2>
      <p className="mt-4 max-w-[62ch] text-[16.5px] leading-relaxed text-muted">
        Placeholder. This section has not been built yet.
      </p>
      <div className="mt-6 h-[40vh] rounded-3xl border border-dashed border-line" />
    </section>
  );
}
