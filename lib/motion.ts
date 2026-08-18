import type { Variants } from "framer-motion";

/**
 * Shared entrance timing.
 *
 * Defining it once is what makes the page feel like one document rather
 * than N separately-animated pages. Every section imports these instead
 * of hand-rolling its own durations.
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

/**
 * Applied to the PARENT of a grid or list. One observer drives every child.
 * Putting whileInView on each card instead makes the grid pop in raggedly
 * and costs N IntersectionObservers.
 */
export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14 } },
};

/**
 * once: true — otherwise every section replays its entrance each time it
 * scrolls back into view, which reads as a bug rather than a flourish.
 * amount: 0.3 — fire when 30% is visible, so tall sections don't wait until
 * they are almost scrolled past.
 */
export const viewportOnce = { once: true, amount: 0.3 } as const;

/**
 * Pointer-following motion uses a spring, never a direct binding: a direct
 * binding feels twitchy and stops dead the instant the cursor does.
 * Tilt is clamped to ±7° — past that the parallax reads as a broken layout.
 */
export const pointerSpring = { stiffness: 140, damping: 18, mass: 0.6 } as const;
export const TILT_MAX_DEG = 7;
