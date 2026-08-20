import { CURRICULUM, type CourseSection } from "@/lib/curriculum";

/**
 * CURRICULUM STAGES.
 *
 * WHAT THIS IS AND IS NOT. The Udemy syllabus has 21 sections and no grouping
 * above them — no "phases", no "modules", no stages. Six rows of syllabus is
 * unreadable, so the sections are grouped here for presentation.
 *
 * The grouping is DERIVED, not sourced. Its one guarantee is that it is
 * mechanical and lossless: every section number 1–21 appears exactly once
 * across the six stages, and each stage renders the real section titles
 * beneath it so a reader always sees the underlying syllabus rather than only
 * my label for it. Counts and durations are computed from CURRICULUM at
 * render time so they cannot drift from the source data.
 *
 * The stage NAMES and the blurbs are editorial. Every claim in a blurb names
 * something that appears in a lecture title — no technique is mentioned that
 * the course does not cover. Listed in README under Known Gaps until
 * confirmed.
 */
export type Stage = {
  key: string;
  /** Editorial label for the group — not a Udemy section title. */
  title: string;
  /** Every claim here maps to a lecture title in the listed sections. */
  blurb: string;
  /** Section numbers from CURRICULUM, in syllabus order. */
  sections: number[];
};

export const STAGES: Stage[] = [
  {
    key: "linear",
    title: "Linear structures",
    blurb:
      "How memory is laid out, then the four structures built directly on top of it. Row- and column-major order, push and pop, the circular queue that fixes the ordinary one, and singly, circular and doubly linked lists — each written out in C, C++ and Python.",
    sections: [1, 2, 3, 5, 6],
  },
  {
    key: "recursion",
    title: "Recursion",
    blurb:
      "Reading recursive code by drawing its recursion tree, then turning that tree into a running time with the substitution method. Given its own stage because it is the section the course itself flags as the hard one.",
    sections: [4],
  },
  {
    key: "trees",
    title: "Trees & heaps",
    blurb:
      "Pre-, in- and post-order traversal, and rebuilding a tree from two of them. Insertion and deletion on binary search trees, max-heap construction and its array representation, and every AVL rotation case — LL, RR, LR, RL on insert, R0 through L1 on delete.",
    sections: [7, 8, 9, 10, 11],
  },
  {
    key: "graphs",
    title: "Graphs & hashing",
    blurb:
      "Adjacency lists against adjacency matrices for directed and undirected graphs, depth-first and breadth-first traversal, and Kruskal's and Prim's algorithms for minimum spanning trees. Then hash functions and every collision resolution technique from linear probing to chaining.",
    sections: [12, 13, 17],
  },
  {
    key: "complexity",
    title: "Complexity analysis",
    blurb:
      "Big-O, Big-Omega and Theta with worked examples and their algebra. Counting the cost of simple and nested loops, and the Master Theorem for divide-and-conquer recurrences.",
    sections: [14, 15, 16],
  },
  {
    key: "algorithms",
    title: "Sorting, searching & algorithm design",
    blurb:
      "Bubble, insertion, selection, merge, quick and heap sort, each with its best and worst case. Linear and binary search, iterative and recursive. Then greedy methods — job sequencing, knapsack, optimal merge patterns — and dynamic programming.",
    sections: [18, 19, 20, 21],
  },
];

/* ── Integrity check ──
   Runs at module load in dev. A section silently dropped from or duplicated
   across STAGES would be invisible in the UI — the page would just quietly
   stop showing part of the syllabus. Better to fail loudly at build time. */
if (process.env.NODE_ENV !== "production") {
  const listed = STAGES.flatMap((s) => s.sections);
  const unique = new Set(listed);
  if (listed.length !== unique.size || unique.size !== CURRICULUM.length) {
    throw new Error(
      `STAGES must cover each of the ${CURRICULUM.length} curriculum sections exactly once; got ${listed.length} entries covering ${unique.size} sections.`,
    );
  }
}

const byNumber = new Map(CURRICULUM.map((s) => [s.n, s]));

export function sectionsFor(stage: Stage): CourseSection[] {
  return stage.sections
    .map((n) => byNumber.get(n))
    .filter((s): s is CourseSection => Boolean(s));
}

/** Total runtime of a stage, in whole minutes. Computed, never hardcoded. */
export function stageMinutes(stage: Stage): number {
  const seconds = sectionsFor(stage).reduce(
    (acc, section) =>
      acc +
      section.lectures.reduce((a, l) => {
        if (!l.duration) return a; // absent from the source; never guessed
        const [m, s] = l.duration.split(":").map(Number);
        return a + m * 60 + s;
      }, 0),
    0,
  );
  return Math.round(seconds / 60);
}

/**
 * Video lectures only.
 *
 * Udemy is inconsistent with itself here: its per-SECTION headers count every
 * item (section 2 says "16 lectures", one of which is an article), while its
 * COURSE header says 222, which is the video count. We follow the course
 * header, so the six stage totals sum to the 222 shown in the hero. The
 * per-section rows in the UI still show the item count, matching what a
 * reader sees on Udemy, and the single article is labelled there.
 */
export function stageLectureCount(stage: Stage): number {
  return sectionsFor(stage).reduce(
    (a, s) => a + s.lectures.filter((l) => l.kind === "video").length,
    0,
  );
}

/** "3h 06m" / "51m" */
export function formatMinutes(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return h ? `${h}h ${String(m).padStart(2, "0")}m` : `${m}m`;
}
