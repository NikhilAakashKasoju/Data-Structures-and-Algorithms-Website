"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Reduced-motion layer 2 of 3.
 *
 * The CSS block in globals.css kills CSS animations and transitions, but it
 * cannot touch Framer's transforms — those are written as inline styles by
 * JS every frame, so a `transition-duration: 0.001ms` rule has nothing to
 * act on. reducedMotion="user" makes Framer drop transform/layout animation
 * and keep only opacity, which is the accessible-but-not-dead compromise.
 *
 * (Layer 3, SVG SMIL, is handled per-illustration with pauseAnimations().)
 *
 * This is the only reason layout.tsx needs a client boundary at all, and it
 * wraps children rather than replacing them, so every section below stays a
 * server component unless it needs its own hooks.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
