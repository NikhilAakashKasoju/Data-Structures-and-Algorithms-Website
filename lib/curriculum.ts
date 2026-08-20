/**
 * COURSE CURRICULUM — transcribed from the client's Udemy curriculum and
 * fully reconciled against curriculum screenshots of all 21 sections
 * (supplied 2026-08-20).
 *
 * ── EVERYTHING RECONCILES ────────────────────────────────────────────────
 * Each screenshot's section header prints a lecture count and a runtime.
 * All 21 sections match this file on BOTH figures. The totals line up too:
 *
 *   items in this file      223   =  222 video lectures + 1 article
 *   Udemy's stated count    222   →  counts videos only
 *   runtime in this file    43h 57m 54s
 *   Udemy's stated runtime  43h 57m   → the same figure, truncated
 *
 * The article is "Column Major Order" in section 2 — a document, not a video,
 * shown with a page icon rather than a play icon in the source. It carries
 * `kind: "article"` and `duration: null`. That single row is the entire
 * explanation of the 223-vs-222 discrepancy; nothing was guessed to close it.
 *
 * ── WHAT THE AUDIT CAUGHT ────────────────────────────────────────────────
 * The client's paste ran each duration onto the end of its title with no
 * separator, so rows whose title ends in an index digit are ambiguous:
 * "AVL Tree - Deletion : L-14:09" is either "L-" + 14:09 or "L-1" + 4:09.
 * Thirteen such rows were resolved by an explicit override table. Twelve were
 * right first time; the audit found ONE that was not — that AVL row, read as
 * 14:09 instead of 4:09, put section 10 exactly ten minutes over. Fixing it
 * brought the whole course total to Udemy's figure to the minute.
 *
 * ── VERBATIM DATA, CORRECTED DISPLAY ─────────────────────────────────────
 * `title` is exactly what the source says, typos and all ("Implementaiton",
 * "Cricular", "Inroduction", "Krushkal", and section 14's header "Aymptotic"),
 * so this file stays diffable against Udemy. `displayTitle` holds the form to
 * render, and is set only where the source title fights the page:
 *   - Udemy's own enumeration ("1. Arrays", "2.1 Recursion : Exclusive") is
 *     inconsistent and would collide with our 01–21 numbering, so it is
 *     stripped for display and kept in `title`.
 *   - Section 10's "BONUS LECTURE - ADVANCED DATA STRUCTURE :" prefix is a
 *     badge, not a title; it moves to `badge`.
 *   - "Aymptotic" is corrected to "Asymptotic".
 *
 * Headline figures on the site come from COURSE (Udemy's own), never from
 * this file's length.
 */

export type Lecture = {
  title: string;
  /** null only for articles, which have no runtime. Never a guess. */
  duration: string | null;
  /** "article" = a document in the source, shown with a page icon. */
  kind: "video" | "article";
};

export type CourseSection = {
  /** 1-based, matching Udemy's own ordering. */
  n: number;
  /** Verbatim from the source, typos and enumeration included. */
  title: string;
  /** Set only where `title` should not be rendered as-is. Render this. */
  displayTitle?: string;
  /** Short qualifier lifted out of the source title, e.g. "Bonus · Advanced". */
  badge?: string;
  /** false = not provably verbatim. Rendered with a dagger and a footnote. */
  titleVerified: boolean;
  /** true = matched against a screenshot's lecture count AND runtime. */
  audited: boolean;
  lectures: Lecture[];
};

/** Learning objective Udemy displays at the head of the Arrays section. It is
 *  not a lecture and is not counted as one. */
export const ARRAYS_OBJECTIVE =
  "Demonstrating Problem-Solving Skills for Array-Based Challenges";

export const CURRICULUM: CourseSection[] = [
  {
    n: 1,
    title: "Basic Stuff",
    titleVerified: true,
    audited: true,
    // 1 lectures · 0h 08m — matches the source header
    lectures: [
      { title: "Memory Structure", duration: "8:58", kind: "video" },
    ],
  },
  {
    n: 2,
    title: "1. Arrays",
    displayTitle: "Arrays",
    titleVerified: true,
    audited: true,
    // 16 lectures · 3h 06m — matches the source header
    lectures: [
      { title: "Why arrays are required?", duration: "6:50", kind: "video" },
      { title: "Arrays Introduction and One Dimensional Arrays.", duration: "20:15", kind: "video" },
      { title: "C Code : One Dimensional Arrays Implementation", duration: "11:42", kind: "video" },
      { title: "C++ Code : One Dimensional Arrays Implementaiton.", duration: "7:06", kind: "video" },
      { title: "Python Code : One Dimensional Arrays Implementation", duration: "18:09", kind: "video" },
      { title: "Two Dimensional Arrays Introduction", duration: "5:40", kind: "video" },
      { title: "Row Major Order - 1", duration: "11:58", kind: "video" },
      { title: "Row Major Order - 2", duration: "11:43", kind: "video" },
      { title: "Column Major Order", duration: null, kind: "article" },
      { title: "C Code : Two Dimentional Array - Row Major Order", duration: "9:34", kind: "video" },
      { title: "Python Code : Two Dimentional Array - Row Major Order", duration: "9:50", kind: "video" },
      { title: "Column Major Order - 1", duration: "11:07", kind: "video" },
      { title: "Column Major Order - 2", duration: "8:20", kind: "video" },
      { title: "Extra Stuff on Arrays : Lower Triangular Matrix", duration: "18:52", kind: "video" },
      { title: "Extra Stuff on Arrays : Tridiagonal Matrix", duration: "18:55", kind: "video" },
      { title: "Extra Stuff on Arrays : Toeplitz Matrix", duration: "16:33", kind: "video" },
    ],
  },
  {
    n: 3,
    title: "2. Stacks",
    displayTitle: "Stacks",
    titleVerified: true,
    audited: true,
    // 9 lectures · 2h 01m — matches the source header
    lectures: [
      { title: "Stack Introduction", duration: "4:26", kind: "video" },
      { title: "Stack Implementaion by using Arrays : Push() Operation.", duration: "10:17", kind: "video" },
      { title: "Stack Implementation by using Arrays : Pop() operation.", duration: "7:56", kind: "video" },
      { title: "C Code : Stacks Implementation using Arrays : Push(), Pop(), TopOfStack().", duration: "26:41", kind: "video" },
      { title: "C++ Code : Stacks Implementation using Arrays : Push(), Pop(), Display().", duration: "19:09", kind: "video" },
      { title: "Python Code : Stacks Implementation using Arrays : Push(), Pop(), Display", duration: "20:12", kind: "video" },
      { title: "Python Code : Stacks Implementation using Arrays : Push(), Pop(), Display().", duration: "1:30", kind: "video" },
      { title: "Associativity and Precedence", duration: "11:14", kind: "video" },
      { title: "Converting to Prefix and Postfix notation from Infix", duration: "20:12", kind: "video" },
    ],
  },
  {
    n: 4,
    title: "2.1 Recursion : Exclusive",
    displayTitle: "Recursion : Exclusive",
    titleVerified: true,
    audited: true,
    // 11 lectures · 1h 50m — matches the source header
    lectures: [
      { title: "Writing Recursive Code", duration: "7:24", kind: "video" },
      { title: "Evaluation of Recursive code by using Recursive Tree", duration: "8:38", kind: "video" },
      { title: "Example 1 : Recursive code Evaluation by using Recursive Tree", duration: "14:07", kind: "video" },
      { title: "Constructing Recursive Tree", duration: "10:34", kind: "video" },
      { title: "Example 2 : Recursive code Evaluation by using Recursive Tree", duration: "12:04", kind: "video" },
      { title: "Printing Array Elements using Recursion", duration: "6:56", kind: "video" },
      { title: "Finding Time Complexity from Recursive Equation by using Substitution Method", duration: "7:48", kind: "video" },
      { title: "Recursive code for Multiplication and Division", duration: "11:41", kind: "video" },
      { title: "Time Complexity for Fibonacci Series using Recursive Tree", duration: "11:28", kind: "video" },
      { title: "Finding Time Complexity from Recursive Equation by using Substitution Method", duration: "13:39", kind: "video" },
      { title: "Finding Time Complexity from Recursive Equation by using Substitution Method", duration: "6:29", kind: "video" },
    ],
  },
  {
    n: 5,
    title: "3. Queues",
    displayTitle: "Queues",
    titleVerified: true,
    audited: true,
    // 11 lectures · 2h 06m — matches the source header
    lectures: [
      { title: "Queue Inroduction.", duration: "7:07", kind: "video" },
      { title: "Enqueue Operation", duration: "10:20", kind: "video" },
      { title: "Dequeue Operation", duration: "10:19", kind: "video" },
      { title: "C Code : Queue Implementation - Enqueue and Dequeue.", duration: "24:06", kind: "video" },
      { title: "C++ Code : Queue Implementation - Enqueue and Dequeue.", duration: "16:39", kind: "video" },
      { title: "Python Code : Queue Implementation - Enqueue and Dequeue.", duration: "16:04", kind: "video" },
      { title: "Drawbacks in Normal Queues.", duration: "6:11", kind: "video" },
      { title: "Circular Enqueue Operation", duration: "11:19", kind: "video" },
      { title: "Circular Dequeue Operation", duration: "6:37", kind: "video" },
      { title: "C Code : Circular Queue - Enqueue and Dequeue.", duration: "8:45", kind: "video" },
      { title: "C++ Code : Circular Queue - Enqueue and Dequeue.", duration: "8:55", kind: "video" },
    ],
  },
  {
    n: 6,
    title: "4. Linked Lists",
    displayTitle: "Linked Lists",
    titleVerified: true,
    audited: true,
    // 43 lectures · 8h 58m — matches the source header
    lectures: [
      { title: "Single Linked List Introduction and Structure Creation", duration: "10:29", kind: "video" },
      { title: "Single Linked List : Node Creation Physically in Memory", duration: "9:14", kind: "video" },
      { title: "Single Linked List : Insertion - Beginning", duration: "6:36", kind: "video" },
      { title: "Single Linked List : Insertion - Ending", duration: "7:19", kind: "video" },
      { title: "Single Linked List : Insertion - Middle", duration: "11:06", kind: "video" },
      { title: "C Code : Insertion - Beginning, Middle and Ending.", duration: "38:28", kind: "video" },
      { title: "C++ Code : Insertion - Beginning, Middle and Ending.", duration: "28:09", kind: "video" },
      { title: "Python Code : Insertion - Beginning, Middle and Ending.", duration: "36:54", kind: "video" },
      { title: "Single Linked List : Deletion - Beginning and Ending", duration: "15:17", kind: "video" },
      { title: "Single Linked List : Deletion - Middle", duration: "6:23", kind: "video" },
      { title: "C Code : Deletion - Beginning, Middle and Ending.", duration: "25:11", kind: "video" },
      { title: "C++ Code : Deletion - Beginning , Middle and Ending.", duration: "22:42", kind: "video" },
      { title: "Python Code : Deletion - Beginning, Middle and Ending.", duration: "26:36", kind: "video" },
      { title: "Single Linked List : Traversing", duration: "7:52", kind: "video" },
      { title: "Single Linked List : Reversing", duration: "15:29", kind: "video" },
      { title: "Question 1 : Single Linked List", duration: "7:36", kind: "video" },
      { title: "Circular Single Linked Lists : Introduction", duration: "6:40", kind: "video" },
      { title: "Circular Single Linked Lists : Insertion - Beginning", duration: "11:15", kind: "video" },
      { title: "Circular Single Linked Lists : Insertion - Ending", duration: "5:38", kind: "video" },
      { title: "Circular Single Linked Lists : Deletion - Beginning", duration: "8:02", kind: "video" },
      { title: "Circular Single Linked Lists : Deletion - Ending", duration: "7:55", kind: "video" },
      { title: "C Code : Circular Single Linked Lists : Insertion - Beginning, Middle, Ending.", duration: "14:18", kind: "video" },
      { title: "C Code : Circular Single Linked Lists : Deletion - Beginning, Middle, Ending", duration: "14:36", kind: "video" },
      { title: "Python Code : Cricular Single Linked Lists -Insertion - Beginning, Middle,Ending", duration: "11:27", kind: "video" },
      { title: "Python Code :Circular Single Linked Lists - Deletion Beginning, Middle, Ending", duration: "9:57", kind: "video" },
      { title: "Double Linked List : Introduction and Node Definition.", duration: "9:34", kind: "video" },
      { title: "Double Linked List : Node Creation", duration: "9:14", kind: "video" },
      { title: "Double Linked List : Insertion - Beginning", duration: "5:12", kind: "video" },
      { title: "Double Linked List : Insertion - Middle", duration: "12:04", kind: "video" },
      { title: "Double Linked List : Insertion - Ending", duration: "8:23", kind: "video" },
      { title: "C Code : Double Linked List : Insertion - Beginning, Middle, Ending", duration: "13:03", kind: "video" },
      { title: "C++ Code : Double Linked List : Insertion - Beginning, Middle, Ending", duration: "14:49", kind: "video" },
      { title: "Python Code : Double Linked Lists : Insertion - Beginning, Middle, Ending.", duration: "11:11", kind: "video" },
      { title: "Double Linked List : Deletion - Beginning", duration: "3:48", kind: "video" },
      { title: "Double Linked List : Deletion - Ending", duration: "6:19", kind: "video" },
      { title: "Double Linked List : Deletion - Middle", duration: "8:13", kind: "video" },
      { title: "C Code : Double Linked List : Deletion - Beginning, Ending and Middle", duration: "9:42", kind: "video" },
      { title: "C++ Code : Double Linked Lists : Deletion - Beginning, Middle, Ending.", duration: "13:08", kind: "video" },
      { title: "Python Code : Double Linked List : Deletion - Beginning, Ending and Middle", duration: "11:32", kind: "video" },
      { title: "Stack Implementation using Linked List", duration: "8:24", kind: "video" },
      { title: "Queue Implementation using Linked List", duration: "6:22", kind: "video" },
      { title: "Extra Stuff : Linked Lists nodes count - with loops", duration: "6:48", kind: "video" },
      { title: "Extra Stuff : Linked Lists nodes count - with Recursion", duration: "16:01", kind: "video" },
    ],
  },
  {
    n: 7,
    title: "5. Binary Trees",
    displayTitle: "Binary Trees",
    titleVerified: true,
    audited: true,
    // 9 lectures · 1h 41m — matches the source header
    lectures: [
      { title: "Binary Trees : Introduction", duration: "11:26", kind: "video" },
      { title: "Binary Trees : Traversing Basic", duration: "10:46", kind: "video" },
      { title: "Binary Trees : Traversing Technique - PREorder, INorder, POSTorder.", duration: "16:28", kind: "video" },
      { title: "Binary Trees : Traversing Techniques - PREorder Recursive Code", duration: "13:58", kind: "video" },
      { title: "Binary Trees : Traversing Techniques - INorder and POSTorder Recursive Codes", duration: "6:08", kind: "video" },
      { title: "Binary Trees : Creating Binary Trees from PREorder and INorder.", duration: "12:36", kind: "video" },
      { title: "Binary Trees : Creating Binary Trees from POSTorder and INorder.", duration: "8:31", kind: "video" },
      { title: "Binary Trees : Arithmetic Expression Trees", duration: "14:47", kind: "video" },
      { title: "Binary Trees : Arithmetic Expression Trees - Example", duration: "7:08", kind: "video" },
    ],
  },
  {
    n: 8,
    title: "Binary Search Trees",
    titleVerified: true,
    audited: true,
    // 11 lectures · 2h 04m — matches the source header
    lectures: [
      { title: "Binary Trees : Drawbacks", duration: "7:20", kind: "video" },
      { title: "Binary Search Trees : Introduction", duration: "8:22", kind: "video" },
      { title: "Insertion on Binary Search Trees", duration: "4:01", kind: "video" },
      { title: "C Code : Insertion on BST.", duration: "28:50", kind: "video" },
      { title: "Deletion on Binary Search Trees", duration: "18:08", kind: "video" },
      { title: "C Code : Deletion on BST.", duration: "18:22", kind: "video" },
      { title: "C Code : Search a node and Modify a node.", duration: "9:20", kind: "video" },
      { title: "C Code : Number of nodes in BST.", duration: "8:21", kind: "video" },
      { title: "C Code : Number of leaf nodes in BST.", duration: "7:18", kind: "video" },
      { title: "C Code : Number of Internal nodes in BST.", duration: "5:52", kind: "video" },
      { title: "C Code : Finding Minimum and Maximum element in BST.", duration: "8:47", kind: "video" },
    ],
  },
  {
    n: 9,
    title: "Heaps",
    titleVerified: true,
    audited: true,
    // 4 lectures · 0h 50m — matches the source header
    lectures: [
      { title: "Introduction and Definition of Heaps (Max Heap and Min Heap).", duration: "11:33", kind: "video" },
      { title: "Max Heap Creation (Insertion Operation).", duration: "15:03", kind: "video" },
      { title: "Heap Tree Creation Time Complexity.", duration: "12:08", kind: "video" },
      { title: "Heap Tree representation by using Arrays", duration: "11:58", kind: "video" },
    ],
  },
  {
    n: 10,
    title: "BONUS LECTURE - ADVANCED DATA STRUCTURE : 6. AVL Trees - Exclusive",
    displayTitle: "AVL Trees - Exclusive",
    badge: "Bonus \u00b7 Advanced",
    titleVerified: true,
    audited: true,
    // 16 lectures · 3h 25m — matches the source header
    lectures: [
      { title: "6.1 Why AVL Trees are required?", duration: "13:57", kind: "video" },
      { title: "What is AVL Trees & Introduction.", duration: "12:17", kind: "video" },
      { title: "Insertion : Imbalance", duration: "4:44", kind: "video" },
      { title: "Insertion : LL Imbalance", duration: "22:57", kind: "video" },
      { title: "Insertion : RR Imbalance", duration: "16:34", kind: "video" },
      { title: "Insertion : LR Imbalance", duration: "19:10", kind: "video" },
      { title: "Insertion : RL Imbalance", duration: "20:20", kind: "video" },
      { title: "AVL Tree Creation (Insertion) - 1", duration: "15:04", kind: "video" },
      { title: "AVL Tree Creation (Insertion) - 2", duration: "16:54", kind: "video" },
      { title: "AVL Tree - Deletion : Introduction", duration: "5:21", kind: "video" },
      { title: "AVL Tree - Deletion : R0", duration: "16:35", kind: "video" },
      { title: "AVL Tree - Deletion : R1", duration: "7:36", kind: "video" },
      { title: "AVL Tree - Deletion : R-1", duration: "13:51", kind: "video" },
      { title: "AVL Tree - Deletion : L0", duration: "5:52", kind: "video" },
      { title: "AVL Tree - Deletion : L-1", duration: "4:09", kind: "video" },
      { title: "AVL Tree - Deletion : L1", duration: "10:06", kind: "video" },
    ],
  },
  {
    n: 11,
    title: "2ary Tree, Full Binary Tree, Complete Binary Tree - Properties.",
    titleVerified: true,
    audited: true,
    // 1 lectures · 0h 19m — matches the source header
    lectures: [
      { title: "2ary Tree, Full Binary Tree, Complete Binary Tree - Properties : More Insights", duration: "19:28", kind: "video" },
    ],
  },
  {
    n: 12,
    title: "Graphs",
    titleVerified: true,
    audited: true,
    // 5 lectures · 1h 13m — matches the source header
    lectures: [
      { title: "Graphs : Introduction", duration: "13:49", kind: "video" },
      { title: "Graph Representation : Adjacency Lists and Adjacency Matrix for Undirected Graph", duration: "10:50", kind: "video" },
      { title: "Graph Representation : Adjacency Lists and Adjacency Matrix for directed Graph,", duration: "14:00", kind: "video" },
      { title: "Graph Traversing Techniques : Depth First Search", duration: "18:22", kind: "video" },
      { title: "Graph Traversing Techniques : Breadth First Search", duration: "16:45", kind: "video" },
    ],
  },
  {
    n: 13,
    title: "Hashing",
    titleVerified: true,
    audited: true,
    // 14 lectures · 1h 48m — matches the source header
    lectures: [
      { title: "Hashing Introduction.", duration: "11:01", kind: "video" },
      { title: "Types of Hash Functions", duration: "5:01", kind: "video" },
      { title: "Question 1", duration: "9:05", kind: "video" },
      { title: "Question 2 : Collision", duration: "8:24", kind: "video" },
      { title: "Question 3 : Collision", duration: "5:57", kind: "video" },
      { title: "Collision Resolution Techniques (CRT).", duration: "2:30", kind: "video" },
      { title: "CRT : Open Addressing - Linear Probing.", duration: "12:15", kind: "video" },
      { title: "CRT : Open Addressing - Linear Probing Drawback", duration: "4:57", kind: "video" },
      { title: "CRT : Open Addressing - Quadratic Probing", duration: "7:41", kind: "video" },
      { title: "CRT : Open Addressing - Quadratic Probing : Drawbacks", duration: "6:54", kind: "video" },
      { title: "CRT : Open Addressing - Random Probing.", duration: "9:19", kind: "video" },
      { title: "CRT : Open Addressing - Double Hashing / Rehashing.", duration: "10:26", kind: "video" },
      { title: "CRT : Open Addressing - Drawbacks.", duration: "6:41", kind: "video" },
      { title: "CRT : Chaining.", duration: "7:56", kind: "video" },
    ],
  },
  {
    n: 14,
    title: "Aymptotic Notations",
    displayTitle: "Asymptotic Notations",
    titleVerified: true,
    audited: true,
    // 10 lectures · 1h 06m — matches the source header
    lectures: [
      { title: "Asymptotic Notations : Introduction.", duration: "6:14", kind: "video" },
      { title: "Big Oh (O) : Example - 1", duration: "5:54", kind: "video" },
      { title: "Big Oh (O) : Example : 2", duration: "4:26", kind: "video" },
      { title: "Big Oh (O) : Example : 3", duration: "4:40", kind: "video" },
      { title: "Big Oh (O) : Multiplication and Addition", duration: "4:08", kind: "video" },
      { title: "Big Omega (\u03a9)", duration: "6:48", kind: "video" },
      { title: "Theta (\u0398)", duration: "4:09", kind: "video" },
      { title: "Properties", duration: "9:49", kind: "video" },
      { title: "Example : 4", duration: "4:55", kind: "video" },
      { title: "Examples", duration: "15:42", kind: "video" },
    ],
  },
  {
    n: 15,
    title: "Time Complexity : Exclusive",
    titleVerified: true,
    audited: true,
    // 5 lectures · 0h 55m — matches the source header
    lectures: [
      { title: "Introduction", duration: "6:55", kind: "video" },
      { title: "Time Complexity Calculation for Simple Loops - 1", duration: "9:45", kind: "video" },
      { title: "Time Complexity Calculation for Simple Loops - 2", duration: "14:13", kind: "video" },
      { title: "Time Complexity Calculation for Nested Loops - 1", duration: "13:09", kind: "video" },
      { title: "Time Complexity Calculation for Nested Loops - 2", duration: "11:45", kind: "video" },
    ],
  },
  {
    n: 16,
    title: "Master Theorem",
    titleVerified: true,
    audited: true,
    // 4 lectures · 0h 43m — matches the source header
    lectures: [
      { title: "Master Theorem Introduction.", duration: "16:24", kind: "video" },
      { title: "Master Theorem Formula discussion.", duration: "9:59", kind: "video" },
      { title: "Master Theorem Examples - 1", duration: "12:09", kind: "video" },
      { title: "Master Theorem Examples - 2", duration: "5:26", kind: "video" },
    ],
  },
  {
    n: 17,
    title: "Spanning Trees",
    titleVerified: true,
    audited: true,
    // 7 lectures · 1h 14m — matches the source header
    lectures: [
      { title: "Spanning Trees Introduction.", duration: "14:17", kind: "video" },
      { title: "Spanning Trees Properties Continuation.", duration: "13:04", kind: "video" },
      { title: "Minimum Spanning Trees Definition and Algorithms Introduction", duration: "2:12", kind: "video" },
      { title: "Krushkal's Algorithm for finding Minimum Spanning Trees.", duration: "11:22", kind: "video" },
      { title: "Krushkal's Algorithm for finding Minimum Spanning Trees Continuation", duration: "14:14", kind: "video" },
      { title: "Krushkal's Algorithm for finding Minimum Spanning Trees - Time Complexity.", duration: "4:12", kind: "video" },
      { title: "Prim's Algorithm for finding Minimum Spanning Tree and Time Complexity.", duration: "14:56", kind: "video" },
    ],
  },
  {
    n: 18,
    title: "Sorting Algorithms",
    titleVerified: true,
    audited: true,
    // 26 lectures · 5h 20m — matches the source header
    lectures: [
      { title: "1. Bubble Sort : Understanding Example", duration: "13:46", kind: "video" },
      { title: "1. Bubble Sort : Time Complexity", duration: "14:51", kind: "video" },
      { title: "1. Bubble Sort : Algorithm", duration: "12:24", kind: "video" },
      { title: "1. Bubble Sort : Reducing Time Complexity", duration: "11:35", kind: "video" },
      { title: "C Code : Bubble Sort", duration: "8:42", kind: "video" },
      { title: "Python Code : Bubble Sort", duration: "6:46", kind: "video" },
      { title: "2. Insertion Sort : Understanding Example", duration: "18:43", kind: "video" },
      { title: "2. Insertion Sort : Algorithm", duration: "9:16", kind: "video" },
      { title: "2. Insertion Sort : Time Complexity", duration: "7:46", kind: "video" },
      { title: "C Code : Insertion Sort", duration: "6:19", kind: "video" },
      { title: "Python Code : Insertion Sort", duration: "5:45", kind: "video" },
      { title: "3. Selection Sort : Understanding Example", duration: "13:41", kind: "video" },
      { title: "3. Selection Sort : Algorithm", duration: "9:13", kind: "video" },
      { title: "3. Selection Sort : Time Complexity", duration: "10:29", kind: "video" },
      { title: "C Code : Selection Sort", duration: "6:55", kind: "video" },
      { title: "Python Code : Selection Sort", duration: "6:07", kind: "video" },
      { title: "Merge Sort : Theory", duration: "21:04", kind: "video" },
      { title: "Merge Sort : Algorithm", duration: "25:35", kind: "video" },
      { title: "C Code : Merge Sort", duration: "14:50", kind: "video" },
      { title: "Quick Sort : Example", duration: "15:51", kind: "video" },
      { title: "Quick Sort : Algorithm", duration: "20:32", kind: "video" },
      { title: "Quick Sort : Time Complexity Analysis - Placing Pivot Element", duration: "8:19", kind: "video" },
      { title: "Quick Sort : Time Complexity Analysis - Best Case", duration: "8:06", kind: "video" },
      { title: "Quick Sort : Time Complexity Analysis - Worst Case", duration: "8:13", kind: "video" },
      { title: "Heap Sort : Understanding with Example", duration: "19:19", kind: "video" },
      { title: "Heap Sort : Time Complexity", duration: "16:11", kind: "video" },
    ],
  },
  {
    n: 19,
    title: "Searching Algorithms",
    titleVerified: true,
    audited: true,
    // 9 lectures · 1h 36m — matches the source header
    lectures: [
      { title: "Linear Search", duration: "9:20", kind: "video" },
      { title: "C Code : Linear Search", duration: "9:20", kind: "video" },
      { title: "Python Code : Linear Search", duration: "9:52", kind: "video" },
      { title: "Binary Search : Understanding with Example", duration: "15:26", kind: "video" },
      { title: "Binary Search : Iterative and Recursive Algorithms", duration: "12:13", kind: "video" },
      { title: "C Code : Binary Search - Iterative", duration: "13:20", kind: "video" },
      { title: "C Code : Binary Search - Recursive", duration: "6:50", kind: "video" },
      { title: "Python Code : Binary Search - Iterative", duration: "12:12", kind: "video" },
      { title: "Python Code : Binary Search - Recursive", duration: "7:34", kind: "video" },
    ],
  },
  {
    n: 20,
    title: "Greedy Method",
    titleVerified: true,
    audited: true,
    // 7 lectures · 1h 18m — matches the source header
    lectures: [
      { title: "Job Sequencing Problem : Theory", duration: "11:31", kind: "video" },
      { title: "Job Sequencing Problem : Example 1", duration: "6:36", kind: "video" },
      { title: "Job Sequencing Problem : Example 2", duration: "8:25", kind: "video" },
      { title: "Knapsack Problem : Theory", duration: "5:45", kind: "video" },
      { title: "Knapsack Problem : Example - Greedy about Weight, Profit and Unit Cost.", duration: "17:53", kind: "video" },
      { title: "Optimal Merge Pattern : Theory", duration: "8:57", kind: "video" },
      { title: "Optimal Merge Pattern : Example", duration: "19:04", kind: "video" },
    ],
  },
  {
    n: 21,
    title: "Dynamic Programming",
    titleVerified: true,
    audited: true,
    // 4 lectures · 2h 05m — matches the source header
    lectures: [
      { title: "Travelling Salesperson Problem", duration: "46:40", kind: "video" },
      { title: "Longest Common Subsequence - Intro & Difference between Substring & Subsequence", duration: "8:27", kind: "video" },
      { title: "Longest Common Subsequence - Problem and Solution", duration: "37:16", kind: "video" },
      { title: "Multistage Graph", duration: "32:54", kind: "video" },
    ],
  },
];

/** What to render: the corrected form where the source title needs one. */
export const sectionLabel = (s: CourseSection): string =>
  s.displayTitle ?? s.title;

/** Every row in this file, articles included. Currently 223. */
export const transcribedItemCount = CURRICULUM.reduce(
  (a, s) => a + s.lectures.length,
  0,
);

/** Video lectures only — the basis of Udemy's own "222 lectures". */
export const videoLectureCount = CURRICULUM.reduce(
  (a, s) => a + s.lectures.filter((l) => l.kind === "video").length,
  0,
);

/** Total runtime of the rows in this file, in seconds. Derived, not asserted:
 *  the site's headline figure is COURSE.runtimeHours/Minutes from Udemy. */
export const transcribedRuntimeSeconds = CURRICULUM.reduce(
  (a, s) =>
    a +
    s.lectures.reduce((b, l) => {
      if (!l.duration) return b;
      const [m, sec] = l.duration.split(":").map(Number);
      return b + m * 60 + sec;
    }, 0),
  0,
);

