"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Count-up driven by requestAnimationFrame against a real timestamp.
 *
 * Why a timestamp and not a per-frame increment: a fixed step per frame ties
 * the animation's duration to the display's refresh rate, so the same count
 * finishes in half the time on a 120Hz phone. Measuring elapsed milliseconds
 * against performance.now() makes the duration honest on any device, and it
 * self-corrects after a dropped frame or a backgrounded tab.
 *
 * easeOutExpo because a linear count reads like a loading spinner — the value
 * needs to arrive early and settle, not crawl at a constant rate.
 *
 * Reduced motion: returns the final value immediately. A number ticking up is
 * exactly the kind of motion that triggers vestibular discomfort, and unlike a
 * decorative transform there is no degraded version worth keeping.
 */
const DURATION_MS = 1400;

// 1 - 2^(-10t): ~99.9% of the distance covered by t = 1.
const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

export function useCountUp<T extends HTMLElement = HTMLElement>(target: number) {
  const ref = useRef<T>(null);
  // once: true — the stat must not re-count every time it scrolls back in.
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    if (reduced) {
      setValue(target);
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION_MS, 1);
      setValue(Math.round(easeOutExpo(t) * target));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    // Cancelling matters: without it a fast unmount leaves a callback that
    // calls setState on a dead component.
    return () => cancelAnimationFrame(frame);
  }, [inView, reduced, target]);

  return { ref, value };
}
