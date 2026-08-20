"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import { Wordmark } from "@/components/Wordmark";
import { COURSE } from "@/lib/course";
import { NAV_ITEMS } from "@/lib/nav";

/**
 * Sticky nav with scroll-spy and a hamburger below `lg`.
 *
 * Client component, and it has to be: IntersectionObserver, a scrolled-state
 * listener, open/close state and an Escape handler are all browser-only.
 * Nothing else on the page inherits that boundary — it is a sibling of
 * <main>, not a wrapper.
 */
export function Nav() {
  const [active, setActive] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  /* ── Scroll-spy ────────────────────────────────────────────────────────
     One observer for all sections.

     rootMargin "-96px 0px -70% 0px" shrinks the viewport to a band that
     starts just under the sticky bar (96px) and ends 30% down the screen.
     A section counts as "current" only while its top region sits in that
     band, which is what makes the highlight change at the moment the
     heading passes under the nav rather than when a tall section merely
     touches the bottom edge.

     Sections that do not exist yet are simply skipped — the nav is built
     before the sections it points at, and querySelector returning null
     must not throw. */
  useEffect(() => {
    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // Two sections can share the band on a short viewport. Resolve by
        // document order — NAV_ITEMS is already in that order.
        const first = NAV_ITEMS.find((i) => visible.has(i.id));
        setActive(first ? first.id : null);
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    );

    const targets = NAV_ITEMS.map((i) => document.getElementById(i.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  /* ── Scrolled state ────────────────────────────────────────────────────
     The bar is transparent over the hero and gains a border + blur once the
     page moves, so it never draws a hard line across the hero artwork.
     passive: true because the handler never calls preventDefault, and
     without it Chrome logs a scroll-blocking warning. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Mobile panel dismissal ────────────────────────────────────────────
     Escape returns focus to the button that opened the panel, otherwise a
     keyboard user is dumped at the top of the document. */
  const close = useCallback((refocus = false) => {
    setOpen(false);
    if (refocus) burgerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
    };
    const onPointer = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !burgerRef.current?.contains(t)) {
        close();
      }
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open, close]);

  /* Above lg the panel is hidden by CSS, but leaving `open` true means the
     Escape/outside-click listeners stay armed on desktop. Reset on resize. */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-200 ${
        scrolled || open
          ? "border-b border-line bg-bg/70 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-[68px] max-w-[1300px] items-center gap-4 px-5 sm:px-8 lg:h-[76px] lg:px-12"
      >
        {/* Wordmark. An <a> because it navigates. */}
        <a
          href="#main"
          className="group flex min-h-[44px] shrink-0 items-center gap-2.5"
        >
          <Wordmark />
        </a>

        {/* ── Desktop links ── */}
        <ul className="ml-auto hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  // aria-current is the accessible half of the highlight;
                  // the colour change alone communicates nothing.
                  aria-current={isActive ? "true" : undefined}
                  className={`relative inline-flex min-h-[44px] items-center rounded-full px-3.5 text-[14px] font-medium transition-colors ${
                    isActive ? "text-text" : "text-muted hover:text-text"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    // layoutId slides the pill between items instead of
                    // cross-fading two of them. Framer drops the transform
                    // under reducedMotion="user", leaving a plain swap.
                    <motion.span
                      layoutId="nav-active"
                      aria-hidden="true"
                      className="absolute inset-0 -z-10 rounded-full border border-line bg-surface-2"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        {/* ── Desktop actions ──
            One filled CTA only. "Live classes" is the secondary; making both
            gradient buttons would mean neither reads as primary. */}
        <div className="hidden shrink-0 items-center gap-2.5 lg:flex">
          <a href="#live" className="btn-secondary min-h-[44px]">
            Live classes
          </a>
          <a
            href={COURSE.udemyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary min-h-[44px]"
          >
            Get the course
          </a>
        </div>

        {/* ── Hamburger ── */}
        <button
          ref={burgerRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface transition-colors hover:border-line-strong lg:hidden"
        >
          <BurgerGlyph open={open} />
        </button>
      </nav>

      {/* ── Mobile panel ──
          Rendered inside <header> so it inherits the blurred backdrop and
          stays inside the same stacking context as the sticky bar. */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="mobile-nav"
            ref={panelRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="overflow-hidden lg:hidden"
          >
            <div className="border-t border-line px-5 pb-6 pt-3 sm:px-8">
              <ul className="flex flex-col">
                {NAV_ITEMS.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={() => close()}
                      aria-current={active === item.id ? "true" : undefined}
                      className={`flex min-h-[48px] items-center rounded-xl px-3 text-[15.5px] font-medium transition-colors ${
                        active === item.id
                          ? "bg-surface-2 text-text"
                          : "text-muted hover:text-text"
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-col gap-2.5">
                <a href="#live" onClick={() => close()} className="btn-secondary">
                  Live classes
                </a>
                <a
                  href={COURSE.udemyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Get the course
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/**
 * Hamburger → close. The two outer bars fade and the middle pair crosses,
 * so there is no third element popping in and out.
 * Aria state lives on the button; this is purely visual.
 */
function BurgerGlyph({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px]">
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        className="transition-transform duration-200"
      >
        <line
          x1="4"
          y1="7"
          x2="20"
          y2="7"
          className="origin-center transition-transform duration-200"
          style={{ transform: open ? "translateY(5px) rotate(45deg)" : undefined }}
        />
        <line
          x1="4"
          y1="12"
          x2="20"
          y2="12"
          className="origin-center transition-opacity duration-150"
          style={{ opacity: open ? 0 : 1 }}
        />
        <line
          x1="4"
          y1="17"
          x2="20"
          y2="17"
          className="origin-center transition-transform duration-200"
          style={{ transform: open ? "translateY(-5px) rotate(-45deg)" : undefined }}
        />
      </g>
    </svg>
  );
}
