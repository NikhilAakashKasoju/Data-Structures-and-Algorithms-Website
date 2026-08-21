import { Contact } from "@/components/Contact";
import { Curriculum } from "@/components/Curriculum";
import { Hero } from "@/components/Hero";
import { Instructor } from "@/components/Instructor";
import { LiveClass } from "@/components/LiveClass";
import { Marquee } from "@/components/Marquee";
import { Program } from "@/components/Program";
import { Resources } from "@/components/Resources";
import { Testimonials } from "@/components/Testimonials";

/**
 * Home page.
 *
 * Every nav target now resolves to real content — the placeholder stubs are
 * gone. Section order follows §12 of the brief; LiveClass sits between
 * Resources and Program and is reachable from the nav's secondary CTA rather
 * than from NAV_ITEMS, so it does not take a slot in the nav bar.
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
      <Program />
      <Instructor />
      <Testimonials />
      <Contact />
    </>
  );
}

