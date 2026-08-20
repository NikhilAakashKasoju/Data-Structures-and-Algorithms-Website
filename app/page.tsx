import { Curriculum } from "@/components/Curriculum";
import { Hero } from "@/components/Hero";
import { LiveClass } from "@/components/LiveClass";
import { Marquee } from "@/components/Marquee";
import { Resources } from "@/components/Resources";
import { NAV_ITEMS } from "@/lib/nav";

/**
 * Home page.
 *
 * Built so far: Hero, Marquee, Curriculum, Resources, LiveClass. The remaining
 * nav targets are still empty stubs so the Nav's scroll-spy has real sections
 * to observe; each is replaced by its real section one at a time.
 *
 * Server component — the interactive parts (Nav, Hero) own their own client
 * boundaries, so the page shell itself never ships to the browser.
 */
export default function Page() {
  return (
    <>
      <Hero />
      <Marquee />
      <Curriculum />
      <Resources />
      <LiveClass />

      {NAV_ITEMS.filter(
        (item) => !["curriculum", "resources"].includes(item.id),
      ).map((item) => (
        <Stub key={item.id} id={item.id} label={item.label} />
      ))}
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
