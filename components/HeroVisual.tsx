"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

import { TILT_MAX_DEG, pointerSpring } from "@/lib/motion";

/**
 * HERO VISUAL — a singly linked list assembling itself, node by node.
 *
 * One metaphor, committed to: every shape here means something. Each node is
 * drawn the way the structure actually is — a data cell and a *separate*
 * next cell holding an address — because the whole difficulty of a linked
 * list for a beginner is that the pointer is stored data, not a drawing
 * convention. The last node's next cell holds ∅, which is the one thing
 * every "traverse until null" bug comes down to.
 *
 * The cascade is diagonal rather than a flat row for a practical reason: a
 * horizontal chain of three nodes is 3:1 and collapses to unreadable at
 * 375px. A diagonal fills a near-square box at every width.
 *
 * Motion, in the order a viewer perceives it:
 *   1. nodes stagger in            (Framer variants, one parent observer)
 *   2. pointers draw               (motion.path pathLength 0 → 1)
 *   3. energy runs along pointers  (CSS animate-field, dash-flow)
 *   4. a traversal dot walks the chain (SVG SMIL animateMotion)
 *   5. the whole plate tilts to the pointer (spring, clamped ±7°)
 *
 * 4 is the reason this component holds an svgRef: SMIL is reached by neither
 * the CSS reduced-motion block nor MotionConfig. pauseAnimations() is
 * reduced-motion layer 3.
 */

/* Geometry. Kept as constants so the arrows, the SMIL path and the nodes are
   provably derived from the same numbers rather than eyeballed apart. */
const W = 140;
const H = 78;
const DIVIDER = 92; // x-offset of the data | next split
const NODES = [
  { x: 30, y: 48, value: "12", hex: "var(--hex-primary-2)" },
  { x: 175, y: 176, value: "27", hex: "var(--hex-accent)" },
  { x: 320, y: 304, value: "9", hex: "var(--hex-teal)" },
] as const;

/* Pointer A → B and B → C.
   The line leaves the RIGHT edge of the node holding the pointer and enters
   the TOP edge of the node it addresses. Two reasons, in order:
   meaning — a pointer exits the box it is stored in rather than sprouting
   from the middle of it; and layout — leaving from the side keeps the strip
   directly under each node free for the cell labels, which an exit-from-below
   route runs straight through. */
const ARROW_AB = "M170 87 C 205 87 215 120 215 166";
const ARROW_BC = "M315 215 C 350 215 360 250 360 294";

/* One continuous path through data cell → next cell → pointer → next node,
   used only by the traversal dot. Written as a single subpath: a second M
   would make the dot teleport. */
const CHAIN =
  "M76 87 H170 C 205 87 215 120 215 176 V215 H291 C 350 215 360 250 360 304 V343 H436";

export function HeroVisual() {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  /* ── Reduced motion, layer 3 ──
     globals.css handles CSS animation; MotionConfig handles Framer. Neither
     touches SMIL, so it is paused directly on the SVG element. */
  useEffect(() => {
    if (reduced) svgRef.current?.pauseAnimations();
  }, [reduced]);

  /* ── Pointer parallax ──
     Springs, not a direct binding: bound directly, the plate snaps to the
     cursor and stops dead the instant the cursor does, which reads as a bug.
     Clamped to ±7° — past that the perspective distortion is obvious and the
     text beside it looks crooked by comparison. */
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, pointerSpring);
  const sy = useSpring(py, pointerSpring);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-TILT_MAX_DEG, TILT_MAX_DEG]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [TILT_MAX_DEG, -TILT_MAX_DEG]);

  useEffect(() => {
    /* Only on devices with a real pointer. On touch there is no hover state,
       and a pointermove handler would fire during scroll for no benefit. */
    if (reduced || !window.matchMedia("(hover: hover)").matches) return;
    const el = wrapRef.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      px.set((e.clientX - r.left) / r.width - 0.5);
      py.set((e.clientY - r.top) / r.height - 0.5);
    };
    const onLeave = () => {
      px.set(0);
      py.set(0);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [px, py, reduced]);

  return (
    <div ref={wrapRef} className="relative w-full [perspective:1200px]">
      {/* Halo as a blurred sibling, not a box-shadow: a shadow this large and
          diffuse bands visibly on #0d0714. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-8 -z-10 rounded-full bg-purple/25 blur-3xl"
      />

      <motion.svg
        ref={svgRef}
        viewBox="0 0 500 420"
        role="img"
        aria-label="A singly linked list of three nodes. Each node holds a value and a pointer to the next node; the last node's pointer is null."
        className="h-auto w-full"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.16 } } }}
      >
        {/* ── head label ── */}
        <motion.g variants={LABEL_IN}>
          <text
            x="24"
            y="22"
            className="fill-current font-mono text-[13px] uppercase tracking-[0.12em] text-muted"
            style={{ fill: "currentColor" }}
          >
            head
          </text>
          <path
            d="M56 30 C 74 30 80 36 86 44"
            fill="none"
            strokeWidth="1.8"
            strokeLinecap="round"
            style={{ stroke: "var(--hex-lime)" }}
          />
          <circle cx="86" cy="45" r="3" style={{ fill: "var(--hex-lime)" }} />
        </motion.g>

        {/* ── pointers ──
            Drawn before the nodes in source order so the nodes paint over the
            line ends; SVG has no z-index, only document order. */}
        <Pointer d={ARROW_AB} head={[215, 176]} delay={0.34} />
        <Pointer d={ARROW_BC} head={[360, 304]} delay={0.66} />

        {/* ── nodes ── */}
        {NODES.map((n, i) => (
          <Node key={n.x} {...n} isLast={i === NODES.length - 1} />
        ))}

        {/* ── traversal dot ──
            `path` is given inline rather than via <mpath href>: Safari's
            support for href (as opposed to xlink:href) on mpath is patchy,
            and an inline path attribute has been universally supported since
            SVG 1.1. Same drawing, no vendor gamble. */}
        <circle r="5" style={{ fill: "var(--hex-lime)" }} opacity="0.9">
          <animateMotion dur="5.5s" repeatCount="indefinite" path={CHAIN} />
        </circle>
      </motion.svg>
    </div>
  );
}

const LABEL_IN = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

/**
 * A pointer between two nodes.
 * pathLength is normalised to 1 by Framer, so the same variant draws a short
 * and a long path in the same amount of time.
 */
function Pointer({
  d,
  head,
  delay,
}: {
  d: string;
  head: [number, number];
  delay: number;
}) {
  const [hx, hy] = head;
  return (
    <g>
      <motion.path
        d={d}
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        style={{ stroke: "var(--hex-ring)" }}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeInOut", delay }}
      />
      {/* Dash-flow: energy travelling along the pointer. A CSS animation, not
          a Framer one — it runs forever and responds to no state, so it
          belongs on the compositor rather than in a rAF loop for the life of
          the page. */}
      <path
        d={d}
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeDasharray="6 14"
        className="animate-field"
        style={{ stroke: "var(--hex-lime)", opacity: 0.7 }}
      />
      {/* Arrowhead. A pointer without one is just a wire — direction is the
          entire meaning of the shape, so it fades in with the line rather
          than being drawn by pathLength (a 9px triangle drawing itself over
          0.7s reads as a glitch, not an animation). */}
      <motion.path
        d={`M${hx - 5.5} ${hy - 8} L${hx} ${hy + 2} L${hx + 5.5} ${hy - 8}`}
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ stroke: "var(--hex-lime)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: delay + 0.55 }}
      />
    </g>
  );
}

function Node({
  x,
  y,
  value,
  hex,
  isLast,
}: {
  x: number;
  y: number;
  value: string;
  hex: string;
  isLast: boolean;
}) {
  return (
    /* Placement on the outer <g>, animation on the inner one. A CSS or Framer
       transform REPLACES an SVG transform attribute rather than composing
       with it — put both on one element and the node collapses to the
       origin. This is the single most common way an animated SVG breaks. */
    <g transform={`translate(${x} ${y})`}>
      <motion.g
        variants={{
          hidden: { opacity: 0, y: 14, scale: 0.96 },
          show: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.55, ease: "easeOut" },
          },
        }}
      >
        <rect
          width={W}
          height={H}
          rx="14"
          style={{ fill: "var(--surface-2)", stroke: hex }}
          strokeWidth="1.6"
        />
        {/* The split is the point of the drawing: data on the left, the
            address on the right. */}
        <line
          x1={DIVIDER}
          y1="0"
          x2={DIVIDER}
          y2={H}
          strokeWidth="1.6"
          style={{ stroke: hex, opacity: 0.45 }}
        />

        <text
          x={DIVIDER / 2}
          y={H / 2}
          textAnchor="middle"
          dominantBaseline="central"
          className="font-display text-[26px] font-bold"
          style={{ fill: hex }}
        >
          {value}
        </text>

        <text
          x={DIVIDER + (W - DIVIDER) / 2}
          y={H / 2}
          textAnchor="middle"
          dominantBaseline="central"
          className="font-mono text-[18px]"
          style={{ fill: isLast ? "var(--hex-ring)" : "var(--hex-lime)" }}
        >
          {isLast ? "∅" : "•"}
        </text>

        {/* One label per cell, centred under the cell it names. This is the
            whole point of the drawing — "data" and "next" are two separate
            fields, not one box with an arrow glued to it — so both are
            labelled on every node rather than once in a legend. */}
        <text
          x={DIVIDER / 2}
          y={H + 18}
          textAnchor="middle"
          className="font-mono text-[11px] uppercase tracking-[0.09em]"
          style={{ fill: "currentColor", opacity: 0.5 }}
        >
          data
        </text>
        <text
          x={DIVIDER + (W - DIVIDER) / 2}
          y={H + 18}
          textAnchor="middle"
          className="font-mono text-[11px] uppercase tracking-[0.09em]"
          style={{ fill: "currentColor", opacity: 0.5 }}
        >
          {isLast ? "null" : "next"}
        </text>
      </motion.g>
    </g>
  );
}
