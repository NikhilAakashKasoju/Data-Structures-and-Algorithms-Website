/**
 * FREE RESOURCES.
 *
 * Titles are VERBATIM, fetched from YouTube's oEmbed endpoint on 2026-08-20
 * for each URL the client supplied — not typed from memory and not inferred
 * from the URL. Every one returned `author_name: "EduFulness EFN"`, so all of
 * these are the client's own channel.
 *
 * URLs are canonicalised: tracking and timestamp parameters (`t=2s`,
 * `pp=0gcJ…`) are stripped, and the playlist is linked as a playlist rather
 * than as "a video that happens to sit inside one".
 *
 * TWO NOTES ON THE SUPPLIED LIST — both flagged rather than silently resolved:
 *
 *  1. DUPLICATE. Links 1 and 3 are the same video, `WHG_qHCt0Qo`. Link 1
 *     carried a `list=` parameter, so it is treated as the playlist entry and
 *     link 3 as the standalone video. The video appears once in the grid.
 *
 *  2. OFF-TOPIC. Link 8, `Qnvl2EHRK30`, is titled "Day 5: GROUP BY & HAVING
 *     Clause | Primary Key | MS SQL and Azure Data Factory | Interview
 *     Questions". That is SQL and Azure Data Factory — it belongs on the Data
 *     Engineering site, not on a DSA page. It is recorded below as
 *     `excluded: true` and NOT rendered. Flip the flag if it was intended.
 *
 * `topic` and `kind` are editorial labels, but each is derived from words in
 * the video's own title ("Bubble Sort" → Sorting; "GATE" → GATE PYQ), never
 * from watching or guessing at content.
 */

export type ResourceKind = "playlist" | "lesson" | "gate";

export type Resource = {
  /** oEmbed video id, and the React key. */
  id: string;
  /** Verbatim from YouTube oEmbed. Never edited. */
  title: string;
  /** Canonical URL — no tracking or timestamp parameters. */
  url: string;
  kind: ResourceKind;
  /** Which drawing to use; keys into ART in components/ResourceArt.tsx. */
  art: string;
  /** Short chip. Derived from the title's own wording. */
  topic: string;
  /** Off-topic for this site; kept for the record, not rendered. */
  excluded?: true;
};

/** The playlist, promoted out of the grid — it is the entry point, not one
 *  item among nine. Video count deliberately absent: the playlist page could
 *  not be read, and a count is exactly the kind of number not to guess. */
export const RESOURCE_PLAYLIST = {
  title: "Data Structures and Algorithms",
  url: "https://www.youtube.com/playlist?list=PL6Gbi3RNCXcGknIUS1NSBq-qPw7qA1Xbq",
} as const;

export const CHANNEL_URL = "https://www.youtube.com/@EduFulnessEFN";

export const RESOURCES: Resource[] = [
  {
    id: "FTG1Ltr0r24",
    title: "Data Structures and Algorithms Demo",
    url: "https://www.youtube.com/watch?v=FTG1Ltr0r24",
    kind: "lesson",
    art: "overview",
    topic: "Course demo",
  },
  {
    id: "WHG_qHCt0Qo",
    title:
      "Bubble Sort : Example, Algorithm, Time Complexity | Data Structures and Algorithms.",
    url: "https://www.youtube.com/watch?v=WHG_qHCt0Qo",
    kind: "lesson",
    art: "sorting",
    topic: "Sorting",
  },
  {
    id: "_7NQk2XOlSk",
    title:
      "1.Towers of Hanoi | Introduction to Towers of Hanoi | Towers of Hanoi part one, Towers of Hanoi game",
    url: "https://www.youtube.com/watch?v=_7NQk2XOlSk",
    kind: "lesson",
    art: "recursion",
    topic: "Recursion",
  },
  {
    id: "3QNuSVuB084",
    title:
      "Evaluating Recursive Code - Constructing Recursive Tree | Data Structures | GATE 2023",
    url: "https://www.youtube.com/watch?v=3QNuSVuB084",
    kind: "gate",
    art: "recursion",
    topic: "Recursion",
  },
  {
    id: "zGCo4LHwL-0",
    title:
      "1. Data Structures - Binary Trees - Postorder and Inorder -2018 | Previous Year GATE CS/IT Questions",
    url: "https://www.youtube.com/watch?v=zGCo4LHwL-0",
    kind: "gate",
    art: "trees",
    topic: "Binary trees",
  },
  {
    id: "2MG70JmIs-Y",
    title:
      "2. Data Structures - Min Heaps - 2018 | Algorithms | GATE CS/IT Previous Year Question Solutions",
    url: "https://www.youtube.com/watch?v=2MG70JmIs-Y",
    kind: "gate",
    art: "heaps",
    topic: "Heaps",
  },
  {
    id: "N73X_GC33YM",
    title:
      "3. Data Structures - Graph Traversals - 2017 |Algorithms|GATE CS/IT Previous Year Question Solutions",
    url: "https://www.youtube.com/watch?v=N73X_GC33YM",
    kind: "gate",
    art: "graphs",
    topic: "Graphs",
  },
  {
    id: "vGnhotw4HUE",
    title:
      "Data Structures & Algorithms - Chaining - Hashing -2014 |GATE CS/IT Previous Year Question Solutions",
    url: "https://www.youtube.com/watch?v=vGnhotw4HUE",
    kind: "gate",
    art: "hashing",
    topic: "Hashing",
  },
  {
    /* SQL / Azure Data Factory — not DSA. See note 2 in the file header. */
    id: "Qnvl2EHRK30",
    title:
      "Day 5: GROUP BY & HAVING Clause| Primary Key | MS SQL and Azure Data Factory | Interview Questions",
    url: "https://www.youtube.com/watch?v=Qnvl2EHRK30",
    kind: "lesson",
    art: "overview",
    topic: "SQL",
    excluded: true,
  },
];

/** What the page actually renders. */
export const visibleResources = RESOURCES.filter((r) => !r.excluded);

export const KIND_LABEL: Record<ResourceKind, string> = {
  playlist: "Playlist",
  lesson: "Lesson",
  gate: "GATE PYQ",
};
