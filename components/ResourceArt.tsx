/**
 * RESOURCE COVER ART — one compact drawing per topic.
 *
 * Drawn rather than hotlinked. YouTube thumbnails were the obvious
 * alternative and were rejected for three reasons: they are external requests
 * on a page that otherwise makes none, they arrive in whatever styling each
 * video happened to be given so eight of them together look like a jumble
 * rather than a set, and a thumbnail cannot re-theme when the page does.
 *
 * SHARED VIEWBOX. All of these use 0 0 120 72, so every card crops to the
 * same box and a row of them lines up regardless of which topic each shows.
 *
 * SMALLER VOCABULARY THAN CurriculumArt. These render at roughly a third the
 * size, so they carry no labels and no more than about eight shapes each —
 * detail that reads fine at 380px turns to mud at 120px.
 *
 * `accent` is a prop for the same reason as elsewhere: one drawing, many
 * tints. All are aria-hidden; the card's own title is the accessible name.
 */

export type ResourceArtProps = { accent: string };

const RING = "var(--hex-ring)";

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 120 72" aria-hidden="true" className="h-auto w-full">
      {children}
    </svg>
  );
}

/** A screen with a play triangle — for the demo and any general overview. */
function Overview({ accent }: ResourceArtProps) {
  return (
    <Frame>
      <rect
        x="16"
        y="12"
        width="88"
        height="48"
        rx="6"
        fill="none"
        strokeWidth="1.6"
        style={{ stroke: RING }}
      />
      <path d="M16 24h88" strokeWidth="1.4" style={{ stroke: RING }} />
      <circle cx="23" cy="18" r="1.8" style={{ fill: accent }} />
      <path d="M54 33 L70 42 L54 51 Z" style={{ fill: accent }} />
    </Frame>
  );
}

/** Stacked sheets — a playlist is a sequence, not one thing. */
function Playlist({ accent }: ResourceArtProps) {
  return (
    <Frame>
      <rect x="24" y="8" width="72" height="14" rx="4" fill="none" strokeWidth="1.5" style={{ stroke: RING, opacity: 0.5 }} />
      <rect x="20" y="24" width="80" height="14" rx="4" fill="none" strokeWidth="1.5" style={{ stroke: RING, opacity: 0.75 }} />
      <rect x="16" y="40" width="88" height="22" rx="5" fill="none" strokeWidth="1.7" style={{ stroke: accent }} />
      <path d="M28 46 L38 51 L28 56 Z" style={{ fill: accent }} />
      <path d="M46 51h44" strokeWidth="1.5" strokeLinecap="round" style={{ stroke: RING }} />
    </Frame>
  );
}

/** Bars mid-swap — the mechanism, not the sorted result. */
function Sorting({ accent }: ResourceArtProps) {
  const bars = [22, 42, 14, 52, 30, 46];
  return (
    <Frame>
      {bars.map((h, i) => {
        const active = i === 1 || i === 3;
        return (
          <rect
            key={i}
            x={14 + i * 16}
            y={60 - h}
            width={11}
            height={h}
            rx="2"
            strokeWidth="1.4"
            style={{ fill: "none", stroke: active ? accent : RING }}
          />
        );
      })}
      <path
        d="M31 66 C 31 71, 63 71, 63 66"
        fill="none"
        strokeWidth="1.4"
        style={{ stroke: "var(--hex-lime)" }}
      />
    </Frame>
  );
}

/** A call fanning into two smaller calls. */
function Recursion({ accent }: ResourceArtProps) {
  return (
    <Frame>
      <path d="M60 22 L40 42 M60 22 L80 42 M40 52 L30 62 M40 52 L50 62 M80 52 L70 62 M80 52 L90 62"
        fill="none" strokeWidth="1.3" style={{ stroke: RING }} />
      <circle cx="60" cy="16" r="7" strokeWidth="1.6" style={{ fill: "var(--surface-2)", stroke: accent }} />
      <circle cx="40" cy="47" r="6" strokeWidth="1.4" style={{ fill: "var(--surface-2)", stroke: RING }} />
      <circle cx="80" cy="47" r="6" strokeWidth="1.4" style={{ fill: "var(--surface-2)", stroke: RING }} />
      {[30, 50, 70, 90].map((x) => (
        <circle key={x} cx={x} cy="66" r="4" strokeWidth="1.3" style={{ fill: "var(--surface-2)", stroke: RING }} />
      ))}
    </Frame>
  );
}

/** A binary tree with one traversal edge picked out. */
function Trees({ accent }: ResourceArtProps) {
  return (
    <Frame>
      <path d="M60 22 L38 42" fill="none" strokeWidth="2" style={{ stroke: accent }} />
      <path d="M60 22 L82 42 M38 52 L26 62 M38 52 L50 62" fill="none" strokeWidth="1.3" style={{ stroke: RING }} />
      <circle cx="60" cy="16" r="8" strokeWidth="1.7" style={{ fill: "var(--surface-2)", stroke: accent }} />
      <circle cx="38" cy="47" r="7" strokeWidth="1.7" style={{ fill: "var(--surface-2)", stroke: accent }} />
      <circle cx="82" cy="47" r="7" strokeWidth="1.4" style={{ fill: "var(--surface-2)", stroke: RING }} />
      <circle cx="26" cy="66" r="5" strokeWidth="1.3" style={{ fill: "var(--surface-2)", stroke: RING }} />
      <circle cx="50" cy="66" r="5" strokeWidth="1.3" style={{ fill: "var(--surface-2)", stroke: RING }} />
    </Frame>
  );
}

/** A heap: the root is the extreme value, so it is the one accented. */
function Heaps({ accent }: ResourceArtProps) {
  return (
    <Frame>
      <path d="M60 22 L40 42 M60 22 L80 42 M40 52 L28 64 M40 52 L52 64 M80 52 L68 64"
        fill="none" strokeWidth="1.3" style={{ stroke: RING }} />
      <circle cx="60" cy="16" r="8" strokeWidth="1.7" style={{ fill: "var(--surface-2)", stroke: accent }} />
      {[[40, 47], [80, 47]].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="6.5" strokeWidth="1.4" style={{ fill: "var(--surface-2)", stroke: RING }} />
      ))}
      {[[28, 68], [52, 68], [68, 68]].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="4.5" strokeWidth="1.3" style={{ fill: "var(--surface-2)", stroke: RING }} />
      ))}
      {/* The ordering arrow: smallest at the root, growing downward. */}
      <path d="M100 20 V60 M96 56 l4 5 4-5" fill="none" strokeWidth="1.4"
        strokeLinecap="round" strokeLinejoin="round" style={{ stroke: "var(--hex-lime)" }} />
    </Frame>
  );
}

/** Buckets with a chain hanging off one — collision resolution, drawn. */
function Hashing({ accent }: ResourceArtProps) {
  return (
    <Frame>
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x="12"
          y={8 + i * 15}
          width="26"
          height="13"
          rx="3"
          strokeWidth="1.4"
          style={{ fill: "none", stroke: i === 2 ? accent : RING }}
        />
      ))}
      {/* The chain on the colliding bucket. */}
      <path d="M40 45h10M60 45h10M80 45h8" strokeWidth="1.3" strokeLinecap="round" style={{ stroke: "var(--hex-lime)" }} />
      {[55, 75].map((x) => (
        <rect key={x} x={x - 5} y="39" width="12" height="12" rx="3" strokeWidth="1.4"
          style={{ fill: "var(--surface-2)", stroke: accent }} />
      ))}
      <rect x="88" y="39" width="12" height="12" rx="3" strokeWidth="1.4"
        style={{ fill: "var(--surface-2)", stroke: RING }} />
    </Frame>
  );
}

/** Nodes and edges with the source picked out — traversal starts somewhere. */
function Graphs({ accent }: ResourceArtProps) {
  const edges = "M28 40 L58 20 M28 40 L58 58 M58 20 L88 32 M58 58 L92 56 M58 20 L58 58";
  return (
    <Frame>
      <path d={edges} fill="none" strokeWidth="1.3" style={{ stroke: RING }} />
      <circle cx="28" cy="40" r="8" strokeWidth="1.7" style={{ fill: "var(--surface-2)", stroke: accent }} />
      {[[58, 20], [58, 58], [88, 32], [92, 56]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="6" strokeWidth="1.4"
          style={{ fill: "var(--surface-2)", stroke: RING }} />
      ))}
      {/* One ripple ring: BFS expands by distance from the source. */}
      <circle cx="28" cy="40" r="14" fill="none" strokeWidth="1.2"
        style={{ stroke: accent, opacity: 0.4 }} />
    </Frame>
  );
}

export const RESOURCE_ART: Record<string, (p: ResourceArtProps) => JSX.Element> = {
  overview: Overview,
  playlist: Playlist,
  sorting: Sorting,
  recursion: Recursion,
  trees: Trees,
  heaps: Heaps,
  hashing: Hashing,
  graphs: Graphs,
};
