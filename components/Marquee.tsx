/**
 * KEYWORD MARQUEE.
 *
 * SERVER COMPONENT — deliberately. This is the one piece of motion on the
 * page with no client boundary at all: it runs forever, responds to no
 * state, and never reads the DOM. Driving it in Framer would mean a
 * requestAnimationFrame loop writing inline styles for the life of the page;
 * as a CSS transform it is handed to the compositor once and costs the main
 * thread nothing. Shipping zero JS for it is the point.
 *
 * SEAMLESSNESS. The track is `w-max` and holds exactly TWO identical copies.
 * That is what makes translateX(-50%) equal exactly one copy's width at any
 * viewport size and after the fonts swap in — no measurement, no resize
 * listener, no magic number. Three copies, or a gap on the track, and the
 * loop visibly jumps every cycle.
 *
 * CONTENT INTEGRITY. Every term below is a section title or a lecture topic
 * in the supplied syllabus — the section number is noted against each. No
 * technology is named that the course does not teach, which for a DSA course
 * mostly means: no LeetCode, no "system design", no framework names, and no
 * structure (trie, segment tree, red-black tree, B-tree) that never appears
 * in the curriculum.
 */

/** [term, source section number in lib/curriculum.ts] */
const KEYWORDS: ReadonlyArray<readonly [string, number]> = [
  ["Arrays", 2],
  ["Stacks", 3],
  ["Recursion", 4],
  ["Queues", 5],
  ["Circular Queues", 5],
  ["Linked Lists", 6],
  ["Doubly Linked Lists", 6],
  ["Binary Trees", 7],
  ["Traversals", 7],
  ["Binary Search Trees", 8],
  ["Heaps", 9],
  ["AVL Trees", 10],
  ["Graphs", 12],
  ["BFS & DFS", 12],
  ["Hashing", 13],
  ["Collision Resolution", 13],
  ["Big-O", 14],
  ["Master Theorem", 16],
  ["Spanning Trees", 17],
  ["Quick Sort", 18],
  ["Merge Sort", 18],
  ["Binary Search", 19],
  ["Greedy Method", 20],
  ["Dynamic Programming", 21],
];

export function Marquee() {
  return (
    /* Full-bleed, and the only section on the page that breaks the
       max-w-[1300px] shell. A band that stops short of the viewport edge
       reads as a widget; one that runs off both edges reads as a conveyor,
       which is the whole idea. overflow-hidden is what clips the second
       copy. */
    <section
      aria-label="Topics covered in this course"
      className="relative z-10 overflow-hidden border-y border-line bg-surface/50 py-4 sm:py-5"
    >
      <div className="marquee-mask">
        <div
          className="flex w-max animate-marquee hover:[animation-play-state:paused]"
          /* Pausing on hover is not decoration: at 42s per cycle a reader who
             wants to actually read a term has no other way to stop it. */
        >
          <KeywordRow />
          {/* The duplicate exists only to make the loop seamless. Hiding it
              from the accessibility tree stops a screen reader announcing
              all 24 terms twice in a row. */}
          <KeywordRow aria-hidden />
        </div>
      </div>
    </section>
  );
}

function KeywordRow({ "aria-hidden": ariaHidden }: { "aria-hidden"?: boolean }) {
  return (
    <ul
      aria-hidden={ariaHidden}
      className="flex shrink-0 items-center"
      /* No gap on this list or on its parent: any spacing between the two
         copies would make -50% land mid-gap instead of exactly one copy
         along. All spacing lives inside the <li> padding. */
    >
      {KEYWORDS.map(([term]) => (
        <li key={term} className="flex shrink-0 items-center px-5 sm:px-7">
          <span className="whitespace-nowrap font-mono text-[12px] uppercase tracking-[0.12em] text-muted sm:text-[13px]">
            {term}
          </span>
          {/* Separator dot. Decorative, so it lives outside the text node
              rather than being punctuation a screen reader would read. */}
          <span
            aria-hidden="true"
            className="ml-5 h-[3px] w-[3px] rounded-full bg-lime sm:ml-7"
          />
        </li>
      ))}
    </ul>
  );
}
