/**
 * Shared brand mark.
 *
 * Extracted so the Nav and the Footer cannot drift apart — the glyph was
 * previously inlined in Nav, and a second copy in the Footer is exactly how
 * two subtly different logos end up on one page.
 *
 * No client boundary: it is a pure function with no hooks, so it renders on
 * the server in the Footer and simply inlines into Nav's existing bundle.
 */

/**
 * Two nodes and a pointer — the smallest drawing that says "linked
 * structure", and a deliberate echo of the hero visual.
 *
 * Decorative: the wordmark beside it carries the name, so an aria-label here
 * would make a screen reader announce "EduFulness" twice.
 */
export function NodeGlyph({ className = "h-[20px] w-[34px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 34 20" aria-hidden="true" className={`shrink-0 ${className}`}>
      <rect
        x="1"
        y="4"
        width="12"
        height="12"
        rx="3.5"
        fill="none"
        strokeWidth="1.6"
        style={{ stroke: "var(--hex-primary-2)" }}
      />
      <rect
        x="21"
        y="4"
        width="12"
        height="12"
        rx="3.5"
        fill="none"
        strokeWidth="1.6"
        style={{ stroke: "var(--hex-teal)" }}
      />
      {/* Pointer from node one to node two. */}
      <path
        d="M13.8 10h5.4M17.4 7.6 19.9 10l-2.5 2.4"
        fill="none"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ stroke: "var(--hex-lime)" }}
      />
    </svg>
  );
}

/** Glyph + name. `suffix` renders the "/ DSA" qualifier where there is room. */
export function Wordmark({ showSuffix = true }: { showSuffix?: boolean }) {
  return (
    <>
      <NodeGlyph />
      <span className="font-display text-[17px] font-bold tracking-tight">
        EduFulness
      </span>
      {showSuffix && (
        <span className="hidden font-mono text-[11px] uppercase tracking-[0.12em] text-muted sm:inline">
          / Data Structures and Algorithms
        </span>
      )}
    </>
  );
}
