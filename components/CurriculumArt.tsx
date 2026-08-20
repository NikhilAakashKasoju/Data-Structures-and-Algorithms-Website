/**
 * CURRICULUM ILLUSTRATIONS — one per stage.
 *
 * SHARED VIEWBOX. All six use 0 0 220 170 so they crop identically down the
 * page. Without that, one drawing sits optically higher than its neighbours
 * and the alternating rows look misaligned even though the boxes are the
 * same size.
 *
 * ACCENT AS A PROP. Each drawing takes `accent` (a `--hex-*` variable) rather
 * than hardcoding a colour, so one drawing can serve several tints and the
 * whole set re-themes with the page.
 *
 * VAR() IN SVG. `var()` is invalid in a presentation attribute — `fill="var(…)"`
 * silently does nothing. Every themed colour therefore goes through
 * `style={{ fill: … }}` / `style={{ stroke: … }}`, which is a CSS property
 * and resolves normally.
 *
 * ARIA. These are `aria-hidden`. Each sits beside a heading, a blurb and the
 * real section list that say the same thing in words — a `role="img"` with a
 * label here would make a screen reader announce the same content twice.
 *
 * DRAW ONLY WHAT MEANS SOMETHING. No decorative particles anywhere in this
 * file; every shape is part of the structure being explained.
 */

export type ArtProps = { accent: string };

const RING = "var(--hex-ring)";
const LIME = "var(--hex-lime)";

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 220 170" aria-hidden="true" className="h-auto w-full">
      {children}
    </svg>
  );
}

/* ── 1. Linear structures ─────────────────────────────────────────────────
   Contiguous cells with an index cursor. The point of the drawing is that
   the cells touch: an array is one block of memory and the index is an
   offset into it, which is exactly why random access is O(1) and why the
   row-/column-major lectures exist at all. */
export function ArrayArt({ accent }: ArtProps) {
  const cells = [0, 1, 2, 3, 4, 5];
  const CURSOR = 2;
  const w = 32;
  const x0 = 14;
  return (
    <Frame>
      {cells.map((i) => {
        const x = x0 + i * w;
        const active = i === CURSOR;
        return (
          <g key={i}>
            <rect
              x={x}
              y={62}
              width={w}
              height={40}
              /* No gap and no rx: the cells are one allocation, not six
                 separate boxes. */
              style={{
                fill: active ? "var(--surface-2)" : "var(--surface)",
                stroke: active ? accent : RING,
              }}
              strokeWidth="1.4"
            />
            <text
              x={x + w / 2}
              y={120}
              textAnchor="middle"
              className="font-mono text-[10px]"
              style={{ fill: "currentColor", opacity: active ? 0.9 : 0.45 }}
            >
              {i}
            </text>
          </g>
        );
      })}

      {/* Index cursor. Floats, so the eye reads it as the thing that moves
          while the cells stay put. */}
      <g className="animate-floaty">
        <path
          d={`M${x0 + CURSOR * w + w / 2 - 6} 44 L${x0 + CURSOR * w + w / 2} 56 L${x0 + CURSOR * w + w / 2 + 6} 44 Z`}
          style={{ fill: LIME }}
        />
        <text
          x={x0 + CURSOR * w + w / 2}
          y={36}
          textAnchor="middle"
          className="font-mono text-[11px]"
          style={{ fill: LIME }}
        >
          i
        </text>
      </g>

      <text
        x="110"
        y="146"
        textAnchor="middle"
        className="font-mono text-[10px] uppercase tracking-[0.09em]"
        style={{ fill: "currentColor", opacity: 0.45 }}
      >
        contiguous memory
      </text>
    </Frame>
  );
}

/* ── 2. Recursion ─────────────────────────────────────────────────────────
   A recursion tree, drawn the way the course draws it: one call fanning into
   two smaller calls until the base case. Labelled f(n) rather than with
   values, because the lecture's whole method is reading the SHAPE to get a
   running time, not evaluating the numbers. */
export function RecursionArt({ accent }: ArtProps) {
  const nodes: Array<[number, number, string, number]> = [
    [110, 26, "f(n)", 0],
    [66, 76, "f(n-1)", 1],
    [154, 76, "f(n-2)", 1],
    [40, 126, "…", 2],
    [92, 126, "…", 2],
    [128, 126, "…", 2],
    [180, 126, "1", 2],
  ];
  const edges = [
    "M110 38 L66 64",
    "M110 38 L154 64",
    "M66 88 L40 114",
    "M66 88 L92 114",
    "M154 88 L128 114",
    "M154 88 L180 114",
  ];
  return (
    <Frame>
      {edges.map((d) => (
        <g key={d}>
          <path d={d} fill="none" strokeWidth="1.3" style={{ stroke: RING }} />
          {/* Dash-flow: the call travelling down into the sub-problem. */}
          <path
            d={d}
            fill="none"
            strokeWidth="1.3"
            strokeDasharray="4 10"
            className="animate-field"
            style={{ stroke: LIME, opacity: 0.65 }}
          />
        </g>
      ))}
      {nodes.map(([x, y, label, depth]) => (
        <g key={`${x}-${y}`}>
          <circle
            cx={x}
            cy={y}
            r="12"
            strokeWidth="1.4"
            style={{
              fill: "var(--surface-2)",
              stroke: depth === 0 ? accent : RING,
            }}
          />
          <text
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            className="font-mono text-[8.5px]"
            style={{ fill: "currentColor", opacity: depth === 0 ? 0.95 : 0.6 }}
          >
            {label}
          </text>
        </g>
      ))}
      <text
        x="110"
        y="158"
        textAnchor="middle"
        className="font-mono text-[10px] uppercase tracking-[0.09em]"
        style={{ fill: "currentColor", opacity: 0.45 }}
      >
        recursion tree
      </text>
    </Frame>
  );
}

/* ── 3. Trees & heaps ─────────────────────────────────────────────────────
   A binary search tree with the search path for 6 highlighted. Values are
   chosen so the ordering invariant is visible at a glance — left subtree
   below the node, right subtree above it — because that invariant is the
   entire reason a BST beats a sorted array on insert. */
export function TreeArt({ accent }: ArtProps) {
  const nodes: Array<[number, number, string, boolean]> = [
    [110, 26, "8", true],
    [62, 82, "3", true],
    [158, 82, "10", false],
    [34, 134, "1", false],
    [90, 134, "6", true],
    [186, 134, "14", false],
  ];
  const edges: Array<[string, boolean]> = [
    ["M110 39 L64 69", true],
    ["M110 39 L156 69", false],
    ["M60 95 L36 121", false],
    ["M64 95 L88 121", true],
    ["M160 95 L184 121", false],
  ];
  return (
    <Frame>
      {edges.map(([d, onPath]) => (
        <path
          key={d}
          d={d}
          fill="none"
          strokeWidth={onPath ? "2" : "1.3"}
          style={{ stroke: onPath ? accent : RING }}
        />
      ))}
      {nodes.map(([x, y, label, onPath]) => (
        <g key={label}>
          <circle
            cx={x}
            cy={y}
            r="13"
            strokeWidth={onPath ? "1.8" : "1.3"}
            style={{
              fill: "var(--surface-2)",
              stroke: onPath ? accent : RING,
            }}
          />
          <text
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            className="font-display text-[12px] font-bold"
            style={{ fill: onPath ? accent : "currentColor", opacity: onPath ? 1 : 0.55 }}
          >
            {label}
          </text>
        </g>
      ))}
      <text
        x="110"
        y="162"
        textAnchor="middle"
        className="font-mono text-[10px] uppercase tracking-[0.09em]"
        style={{ fill: "currentColor", opacity: 0.45 }}
      >
        search path for 6
      </text>
    </Frame>
  );
}

/* ── 4. Graphs & hashing ──────────────────────────────────────────────────
   Breadth-first search as an expanding ripple from the source. The ping ring
   is the literal shape of BFS — everything one hop away, then everything two
   hops away — which is what separates it from DFS and why it finds shortest
   paths on an unweighted graph. */
export function GraphArt({ accent }: ArtProps) {
  const nodes: Array<[number, number, number]> = [
    [58, 84, 0], // source
    [110, 42, 1],
    [110, 126, 1],
    [162, 70, 2],
    [168, 122, 2],
  ];
  const edges = [
    "M58 84 L110 42",
    "M58 84 L110 126",
    "M110 42 L162 70",
    "M110 126 L168 122",
    "M110 42 L110 126",
  ];
  return (
    <Frame>
      {edges.map((d) => (
        <g key={d}>
          <path d={d} fill="none" strokeWidth="1.3" style={{ stroke: RING }} />
          <path
            d={d}
            fill="none"
            strokeWidth="1.3"
            strokeDasharray="4 10"
            className="animate-field"
            style={{ stroke: LIME, opacity: 0.55 }}
          />
        </g>
      ))}

      {/* The ripple. animate-ping on a ring behind a static core: the core
          stays readable while the wave expands, which a pulsing node itself
          would not. */}
      <circle
        cx="58"
        cy="84"
        r="13"
        className="animate-ping"
        style={{ fill: "none", stroke: accent, strokeWidth: 1.4, opacity: 0.5 }}
      />

      {nodes.map(([x, y, hop]) => (
        <g key={`${x}-${y}`}>
          <circle
            cx={x}
            cy={y}
            r="11"
            strokeWidth="1.5"
            style={{
              fill: "var(--surface-2)",
              stroke: hop === 0 ? accent : RING,
            }}
          />
          <text
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            className="font-mono text-[9px]"
            style={{ fill: "currentColor", opacity: 0.65 }}
          >
            {hop}
          </text>
        </g>
      ))}

      <text
        x="110"
        y="158"
        textAnchor="middle"
        className="font-mono text-[10px] uppercase tracking-[0.09em]"
        style={{ fill: "currentColor", opacity: 0.45 }}
      >
        bfs — by distance from source
      </text>
    </Frame>
  );
}

/* ── 5. Complexity analysis ───────────────────────────────────────────────
   Three growth curves on one pair of axes. Drawn together on purpose: the
   whole content of asymptotic analysis is that these three diverge, and a
   single curve alone communicates nothing. */
export function ComplexityArt({ accent }: ArtProps) {
  return (
    <Frame>
      {/* axes */}
      <path
        d="M28 20 V126 H198"
        fill="none"
        strokeWidth="1.4"
        strokeLinecap="round"
        style={{ stroke: RING }}
      />

      {/* O(1) */}
      <path d="M30 114 H196" fill="none" strokeWidth="1.6" style={{ stroke: RING }} />
      <text x="200" y="117" className="font-mono text-[9px]" style={{ fill: "currentColor", opacity: 0.5 }}>
        1
      </text>

      {/* O(n) */}
      <path
        d="M30 124 L196 52"
        fill="none"
        strokeWidth="1.6"
        style={{ stroke: RING, opacity: 0.9 }}
      />
      <text x="200" y="52" className="font-mono text-[9px]" style={{ fill: "currentColor", opacity: 0.6 }}>
        n
      </text>

      {/* O(n²) — the accented one, because it is the curve the loop-counting
          lectures are trying to teach you to recognise. */}
      <path
        d="M30 124 C 96 122 140 100 168 24"
        fill="none"
        strokeWidth="2.2"
        strokeLinecap="round"
        style={{ stroke: accent }}
      />
      <text x="172" y="24" className="font-mono text-[9px]" style={{ fill: accent }}>
        n²
      </text>

      <text
        x="113"
        y="150"
        textAnchor="middle"
        className="font-mono text-[10px] uppercase tracking-[0.09em]"
        style={{ fill: "currentColor", opacity: 0.45 }}
      >
        input size → cost
      </text>
    </Frame>
  );
}

/* ── 6. Sorting, searching & algorithm design ─────────────────────────────
   Bars caught mid-swap. A sorted set of bars would be a picture of the
   result; the swap is a picture of the mechanism, and the mechanism is what
   separates bubble from insertion from quick sort. */
export function SortArt({ accent }: ArtProps) {
  const bars = [46, 88, 30, 104, 62, 120, 74];
  const SWAP_A = 1;
  const SWAP_B = 3;
  const w = 20;
  const x0 = 22;
  const base = 130;
  return (
    <Frame>
      {bars.map((h, i) => {
        const active = i === SWAP_A || i === SWAP_B;
        return (
          <rect
            key={i}
            x={x0 + i * (w + 6)}
            y={base - h}
            width={w}
            height={h}
            rx="3"
            strokeWidth="1.4"
            style={{
              fill: active ? "var(--surface-2)" : "var(--surface)",
              stroke: active ? accent : RING,
            }}
          />
        );
      })}

      {/* The swap arc. Two heads, because a swap is symmetric — a single
          arrow would read as a move. */}
      <path
        d={`M${x0 + SWAP_A * (w + 6) + w / 2} 144 C ${x0 + SWAP_A * (w + 6) + w / 2} 162, ${x0 + SWAP_B * (w + 6) + w / 2} 162, ${x0 + SWAP_B * (w + 6) + w / 2} 144`}
        fill="none"
        strokeWidth="1.6"
        style={{ stroke: LIME }}
      />
      <path
        d={`M${x0 + SWAP_A * (w + 6) + w / 2 - 4} 149 L${x0 + SWAP_A * (w + 6) + w / 2} 141 L${x0 + SWAP_A * (w + 6) + w / 2 + 4} 149`}
        fill="none"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ stroke: LIME }}
      />
      <path
        d={`M${x0 + SWAP_B * (w + 6) + w / 2 - 4} 149 L${x0 + SWAP_B * (w + 6) + w / 2} 141 L${x0 + SWAP_B * (w + 6) + w / 2 + 4} 149`}
        fill="none"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ stroke: LIME }}
      />
    </Frame>
  );
}

/** Stage key → drawing. Keeps the mapping in one place instead of a switch
 *  inside the section component. */
export const STAGE_ART: Record<string, (p: ArtProps) => JSX.Element> = {
  linear: ArrayArt,
  recursion: RecursionArt,
  trees: TreeArt,
  graphs: GraphArt,
  complexity: ComplexityArt,
  algorithms: SortArt,
};
