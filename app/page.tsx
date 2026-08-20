import { Hero } from "@/components/Hero";
import { NAV_ITEMS } from "@/lib/nav";

/**
 * Home page.
 *
 * Built so far: Hero. Everything after it is an empty anchor target so the
 * Nav's scroll-spy has real sections to observe; each stub is replaced by
 * its real section one at a time, in NAV_ITEMS order.
 *
 * Server component — the interactive parts (Nav, Hero) own their own client
 * boundaries, so the page shell itself never ships to the browser.
 */
export default function Page() {
  return (
    <>
      <Hero />

      {NAV_ITEMS.map((item) => (
        <Stub key={item.id} id={item.id} label={item.label} />
      ))}

      {/* Not in the nav list, but the nav's secondary CTA points at it. */}
      <Stub id="live" label="Live class" />
    </>
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
