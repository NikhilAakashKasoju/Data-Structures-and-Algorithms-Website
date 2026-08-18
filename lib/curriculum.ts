/**
 * COURSE CURRICULUM — transcribed from the Udemy curriculum listing the
 * client supplied on 2026-08-18. Lecture titles and durations are verbatim,
 * including the source's own typos ("Implementaiton", "Cricular", "Inroduction")
 * — they are corrected only in display copy, never silently here, so this file
 * can be diffed against Udemy later.
 *
 * Two integrity notes, both reproduced in README "Known Gaps":
 *
 * 1. SECTION TITLES 11–21 ARE DERIVED, NOT QUOTED. The paste carried lecture
 *    rows but not the section headers. Titles 1–10 come from the Udemy listing
 *    page itself and are verbatim; 11–21 were inferred from their lecture
 *    contents and are marked `titleVerified: false`. Confirm before shipping.
 *
 * 2. COUNTS DISAGREE BY ONE. Udemy's header says 222 lectures; this list has
 *    223 rows. The likely cause is the duplicated row in Stacks
 *    ("Python Code : ... Push(), Pop(), Display", 20:12 and 1:30). The site
 *    displays Udemy's official 222, not this file's length — see
 *    `COURSE.lectures`.
 *
 * Durations here sum to 43h35m against Udemy's stated 43h57m. The 22-minute
 * gap is exactly the two lectures whose duration was absent from the paste
 * (`duration: null`), which is a good sign the transcription is sound.
 */

export type Lecture = {
  title: string;
  /** null = duration absent from the source listing. Never guessed. */
  duration: string | null;
};

export type CourseSection = {
  /** 1-based, matching Udemy's own numbering. */
  n: number;
  title: string;
  /** false = title inferred from lecture contents; needs client confirmation. */
  titleVerified: boolean;
  lectures: Lecture[];
};

/** Learning objective Udemy displays at the head of the Arrays section. */
export const ARRAYS_OBJECTIVE =
  "Demonstrating Problem-Solving Skills for Array-Based Challenges";

export const CURRICULUM: CourseSection[] = [
  {
    n: 1,
    title: "Basic Stuff",
    titleVerified: true,
    // 1 lectures · 0h 08m
    lectures: [
      { title: "Memory Structure", duration: "8:58" },
    ],
  },
  {
    n: 2,
    title: "Arrays",
    titleVerified: true,
    // 16 lectures · 3h 06m
    lectures: [
      { title: "Why arrays are required?", duration: "6:50" },
      { title: "Arrays Introduction and One Dimensional Arrays.", duration: "20:15" },
      { title: "C Code : One Dimensional Arrays Implementation", duration: "11:42" },
      { title: "C++ Code : One Dimensional Arrays Implementaiton.", duration: "7:06" },
      { title: "Python Code : One Dimensional Arrays Implementation", duration: "18:09" },
      { title: "Two Dimensional Arrays Introduction", duration: "5:40" },
      { title: "Row Major Order - 1", duration: "11:58" },
      { title: "Row Major Order - 2", duration: "11:43" },
      { title: "Column Major Order", duration: null },
      { title: "C Code : Two Dimentional Array - Row Major Order", duration: "9:34" },
      { title: "Python Code : Two Dimentional Array - Row Major Order", duration: "9:50" },
      { title: "Column Major Order - 1", duration: "11:07" },
      { title: "Column Major Order - 2", duration: "8:20" },
      { title: "Extra Stuff on Arrays : Lower Triangular Matrix", duration: "18:52" },
      { title: "Extra Stuff on Arrays : Tridiagonal Matrix", duration: "18:55" },
      { title: "Extra Stuff on Arrays : Toeplitz Matrix", duration: "16:33" },
    ],
  },
  {
    n: 3,
    title: "Stacks",
    titleVerified: true,
    // 9 lectures · 2h 01m
    lectures: [
      { title: "Stack Introduction", duration: "4:26" },
      { title: "Stack Implementaion by using Arrays : Push() Operation.", duration: "10:17" },
      { title: "Stack Implementation by using Arrays : Pop() operation.", duration: "7:56" },
      { title: "C Code : Stacks Implementation using Arrays : Push(), Pop(), TopOfStack().", duration: "26:41" },
      { title: "C++ Code : Stacks Implementation using Arrays : Push(), Pop(), Display().", duration: "19:09" },
      { title: "Python Code : Stacks Implementation using Arrays : Push(), Pop(), Display", duration: "20:12" },
      { title: "Python Code : Stacks Implementation using Arrays : Push(), Pop(), Display().", duration: "1:30" },
      { title: "Associativity and Precedence", duration: "11:14" },
      { title: "Converting to Prefix and Postfix notation from Infix", duration: "20:12" },
    ],
  },
  {
    n: 4,
    title: "Recursion (Exclusive)",
    titleVerified: true,
    // 11 lectures · 1h 50m
    lectures: [
      { title: "Writing Recursive Code", duration: "7:24" },
      { title: "Evaluation of Recursive code by using Recursive Tree", duration: "8:38" },
      { title: "Example 1 : Recursive code Evaluation by using Recursive Tree", duration: "14:07" },
      { title: "Constructing Recursive Tree", duration: "10:34" },
      { title: "Example 2 : Recursive code Evaluation by using Recursive Tree", duration: "12:04" },
      { title: "Printing Array Elements using Recursion", duration: "6:56" },
      { title: "Finding Time Complexity from Recursive Equation by using Substitution Method", duration: "7:48" },
      { title: "Recursive code for Multiplication and Division", duration: "11:41" },
      { title: "Time Complexity for Fibonacci Series using Recursive Tree", duration: "11:28" },
      { title: "Finding Time Complexity from Recursive Equation by using Substitution Method", duration: "13:39" },
      { title: "Finding Time Complexity from Recursive Equation by using Substitution Method", duration: "6:29" },
    ],
  },
  {
    n: 5,
    title: "Queues",
    titleVerified: true,
    // 11 lectures · 2h 06m
    lectures: [
      { title: "Queue Inroduction.", duration: "7:07" },
      { title: "Enqueue Operation", duration: "10:20" },
      { title: "Dequeue Operation", duration: "10:19" },
      { title: "C Code : Queue Implementation - Enqueue and Dequeue.", duration: "24:06" },
      { title: "C++ Code : Queue Implementation - Enqueue and Dequeue.", duration: "16:39" },
      { title: "Python Code : Queue Implementation - Enqueue and Dequeue.", duration: "16:04" },
      { title: "Drawbacks in Normal Queues.", duration: "6:11" },
      { title: "Circular Enqueue Operation", duration: "11:19" },
      { title: "Circular Dequeue Operation", duration: "6:37" },
      { title: "C Code : Circular Queue - Enqueue and Dequeue.", duration: "8:45" },
      { title: "C++ Code : Circular Queue - Enqueue and Dequeue.", duration: "8:55" },
    ],
  },
  {
    n: 6,
    title: "Linked Lists",
    titleVerified: true,
    // 43 lectures · 8h 58m
    lectures: [
      { title: "Single Linked List Introduction and Structure Creation", duration: "10:29" },
      { title: "Single Linked List : Node Creation Physically in Memory", duration: "9:14" },
      { title: "Single Linked List : Insertion - Beginning", duration: "6:36" },
      { title: "Single Linked List : Insertion - Ending", duration: "7:19" },
      { title: "Single Linked List : Insertion - Middle", duration: "11:06" },
      { title: "C Code : Insertion - Beginning, Middle and Ending.", duration: "38:28" },
      { title: "C++ Code : Insertion - Beginning, Middle and Ending.", duration: "28:09" },
      { title: "Python Code : Insertion - Beginning, Middle and Ending.", duration: "36:54" },
      { title: "Single Linked List : Deletion - Beginning and Ending", duration: "15:17" },
      { title: "Single Linked List : Deletion - Middle", duration: "6:23" },
      { title: "C Code : Deletion - Beginning, Middle and Ending.", duration: "25:11" },
      { title: "C++ Code : Deletion - Beginning , Middle and Ending.", duration: "22:42" },
      { title: "Python Code : Deletion - Beginning, Middle and Ending.", duration: "26:36" },
      { title: "Single Linked List : Traversing", duration: "7:52" },
      { title: "Single Linked List : Reversing", duration: "15:29" },
      { title: "Question 1 : Single Linked List", duration: "7:36" },
      { title: "Circular Single Linked Lists : Introduction", duration: "6:40" },
      { title: "Circular Single Linked Lists : Insertion - Beginning", duration: "11:15" },
      { title: "Circular Single Linked Lists : Insertion - Ending", duration: "5:38" },
      { title: "Circular Single Linked Lists : Deletion - Beginning", duration: "8:02" },
      { title: "Circular Single Linked Lists : Deletion - Ending", duration: "7:55" },
      { title: "C Code : Circular Single Linked Lists : Insertion - Beginning, Middle, Ending.", duration: "14:18" },
      { title: "C Code : Circular Single Linked Lists : Deletion - Beginning, Middle, Ending", duration: "14:36" },
      { title: "Python Code : Cricular Single Linked Lists -Insertion - Beginning, Middle,Ending", duration: "11:27" },
      { title: "Python Code :Circular Single Linked Lists - Deletion Beginning, Middle, Ending", duration: "9:57" },
      { title: "Double Linked List : Introduction and Node Definition.", duration: "9:34" },
      { title: "Double Linked List : Node Creation", duration: "9:14" },
      { title: "Double Linked List : Insertion - Beginning", duration: "5:12" },
      { title: "Double Linked List : Insertion - Middle", duration: "12:04" },
      { title: "Double Linked List : Insertion - Ending", duration: "8:23" },
      { title: "C Code : Double Linked List : Insertion - Beginning, Middle, Ending", duration: "13:03" },
      { title: "C++ Code : Double Linked List : Insertion - Beginning, Middle, Ending", duration: "14:49" },
      { title: "Python Code : Double Linked Lists : Insertion - Beginning, Middle, Ending.", duration: "11:11" },
      { title: "Double Linked List : Deletion - Beginning", duration: "3:48" },
      { title: "Double Linked List : Deletion - Ending", duration: "6:19" },
      { title: "Double Linked List : Deletion - Middle", duration: "8:13" },
      { title: "C Code : Double Linked List : Deletion - Beginning, Ending and Middle", duration: "9:42" },
      { title: "C++ Code : Double Linked Lists : Deletion - Beginning, Middle, Ending.", duration: "13:08" },
      { title: "Python Code : Double Linked List : Deletion - Beginning, Ending and Middle", duration: "11:32" },
      { title: "Stack Implementation using Linked List", duration: "8:24" },
      { title: "Queue Implementation using Linked List", duration: "6:22" },
      { title: "Extra Stuff : Linked Lists nodes count - with loops", duration: "6:48" },
      { title: "Extra Stuff : Linked Lists nodes count - with Recursion", duration: "16:01" },
    ],
  },
  {
    n: 7,
    title: "Binary Trees",
    titleVerified: true,
    // 9 lectures · 1h 41m
    lectures: [
      { title: "Binary Trees : Introduction", duration: "11:26" },
      { title: "Binary Trees : Traversing Basic", duration: "10:46" },
      { title: "Binary Trees : Traversing Technique - PREorder, INorder, POSTorder.", duration: "16:28" },
      { title: "Binary Trees : Traversing Techniques - PREorder Recursive Code", duration: "13:58" },
      { title: "Binary Trees : Traversing Techniques - INorder and POSTorder Recursive Codes", duration: "6:08" },
      { title: "Binary Trees : Creating Binary Trees from PREorder and INorder.", duration: "12:36" },
      { title: "Binary Trees : Creating Binary Trees from POSTorder and INorder.", duration: "8:31" },
      { title: "Binary Trees : Arithmetic Expression Trees", duration: "14:47" },
      { title: "Binary Trees : Arithmetic Expression Trees - Example", duration: "7:08" },
    ],
  },
  {
    n: 8,
    title: "Binary Search Trees",
    titleVerified: true,
    // 11 lectures · 2h 04m
    lectures: [
      { title: "Binary Trees : Drawbacks", duration: "7:20" },
      { title: "Binary Search Trees : Introduction", duration: "8:22" },
      { title: "Insertion on Binary Search Trees", duration: "4:01" },
      { title: "C Code : Insertion on BST.", duration: "28:50" },
      { title: "Deletion on Binary Search Trees", duration: "18:08" },
      { title: "C Code : Deletion on BST.", duration: "18:22" },
      { title: "C Code : Search a node and Modify a node.", duration: "9:20" },
      { title: "C Code : Number of nodes in BST.", duration: "8:21" },
      { title: "C Code : Number of leaf nodes in BST.", duration: "7:18" },
      { title: "C Code : Number of Internal nodes in BST.", duration: "5:52" },
      { title: "C Code : Finding Minimum and Maximum element in BST.", duration: "8:47" },
    ],
  },
  {
    n: 9,
    title: "Heaps",
    titleVerified: true,
    // 4 lectures · 0h 50m
    lectures: [
      { title: "Introduction and Definition of Heaps (Max Heap and Min Heap).", duration: "11:33" },
      { title: "Max Heap Creation (Insertion Operation).", duration: "15:03" },
      { title: "Heap Tree Creation Time Complexity.", duration: "12:08" },
      { title: "Heap Tree representation by using Arrays", duration: "11:58" },
    ],
  },
  {
    n: 10,
    title: "AVL Trees (Bonus - Advanced Data Structure)",
    titleVerified: true,
    // 16 lectures · 3h 35m
    lectures: [
      { title: "6.1 Why AVL Trees are required?", duration: "13:57" },
      { title: "What is AVL Trees & Introduction.", duration: "12:17" },
      { title: "Insertion : Imbalance", duration: "4:44" },
      { title: "Insertion : LL Imbalance", duration: "22:57" },
      { title: "Insertion : RR Imbalance", duration: "16:34" },
      { title: "Insertion : LR Imbalance", duration: "19:10" },
      { title: "Insertion : RL Imbalance", duration: "20:20" },
      { title: "AVL Tree Creation (Insertion) - 1", duration: "15:04" },
      { title: "AVL Tree Creation (Insertion) - 2", duration: "16:54" },
      { title: "AVL Tree - Deletion : Introduction", duration: "5:21" },
      { title: "AVL Tree - Deletion : R0", duration: "16:35" },
      { title: "AVL Tree - Deletion : R1", duration: "7:36" },
      { title: "AVL Tree - Deletion : R-1", duration: "13:51" },
      { title: "AVL Tree - Deletion : L", duration: "05:52" },
      { title: "AVL Tree - Deletion : L-", duration: "14:09" },
      { title: "AVL Tree - Deletion : L1", duration: "10:06" },
    ],
  },
  {
    n: 11,
    title: "Binary Tree Properties",
    titleVerified: false,
    // 1 lectures · 0h 19m
    lectures: [
      { title: "2ary Tree, Full Binary Tree, Complete Binary Tree - Properties : More Insights", duration: "19:28" },
    ],
  },
  {
    n: 12,
    title: "Graphs",
    titleVerified: false,
    // 5 lectures · 1h 13m
    lectures: [
      { title: "Graphs : Introduction", duration: "13:49" },
      { title: "Graph Representation : Adjacency Lists and Adjacency Matrix for Undirected Graph", duration: "10:50" },
      { title: "Graph Representation : Adjacency Lists and Adjacency Matrix for directed Graph,", duration: "14:00" },
      { title: "Graph Traversing Techniques : Depth First Search", duration: "18:22" },
      { title: "Graph Traversing Techniques : Breadth First Search", duration: "16:45" },
    ],
  },
  {
    n: 13,
    title: "Hashing",
    titleVerified: false,
    // 14 lectures · 1h 48m
    lectures: [
      { title: "Hashing Introduction.", duration: "11:01" },
      { title: "Types of Hash Functions", duration: "5:01" },
      { title: "Question 1", duration: "9:05" },
      { title: "Question 2 : Collision", duration: "8:24" },
      { title: "Question 3 : Collision", duration: "5:57" },
      { title: "Collision Resolution Techniques (CRT).", duration: "2:30" },
      { title: "CRT : Open Addressing - Linear Probing.", duration: "12:15" },
      { title: "CRT : Open Addressing - Linear Probing Drawback", duration: "4:57" },
      { title: "CRT : Open Addressing - Quadratic Probing", duration: "7:41" },
      { title: "CRT : Open Addressing - Quadratic Probing : Drawbacks", duration: "6:54" },
      { title: "CRT : Open Addressing - Random Probing.", duration: "9:19" },
      { title: "CRT : Open Addressing - Double Hashing / Rehashing.", duration: "10:26" },
      { title: "CRT : Open Addressing - Drawbacks.", duration: "6:41" },
      { title: "CRT : Chaining.", duration: "7:56" },
    ],
  },
  {
    n: 14,
    title: "Asymptotic Notations",
    titleVerified: false,
    // 10 lectures · 1h 06m
    lectures: [
      { title: "Asymptotic Notations : Introduction.", duration: "6:14" },
      { title: "Big Oh (O) : Example - 1", duration: "5:54" },
      { title: "Big Oh (O) : Example : 2", duration: "4:26" },
      { title: "Big Oh (O) : Example : 3", duration: "4:40" },
      { title: "Big Oh (O) : Multiplication and Addition", duration: "4:08" },
      { title: "Big Omega (\u03a9)", duration: "6:48" },
      { title: "Theta (\u0398)", duration: "4:09" },
      { title: "Properties", duration: "9:49" },
      { title: "Example : 4", duration: "4:55" },
      { title: "Examples", duration: "15:42" },
    ],
  },
  {
    n: 15,
    title: "Time Complexity Analysis",
    titleVerified: false,
    // 5 lectures · 0h 55m
    lectures: [
      { title: "Introduction", duration: "6:55" },
      { title: "Time Complexity Calculation for Simple Loops - 1", duration: "9:45" },
      { title: "Time Complexity Calculation for Simple Loops - 2", duration: "14:13" },
      { title: "Time Complexity Calculation for Nested Loops - 1", duration: "13:09" },
      { title: "Time Complexity Calculation for Nested Loops - 2", duration: "11:45" },
    ],
  },
  {
    n: 16,
    title: "Master Theorem",
    titleVerified: false,
    // 4 lectures · 0h 43m
    lectures: [
      { title: "Master Theorem Introduction.", duration: "16:24" },
      { title: "Master Theorem Formula discussion.", duration: "9:59" },
      { title: "Master Theorem Examples - 1", duration: "12:09" },
      { title: "Master Theorem Examples - 2", duration: "5:26" },
    ],
  },
  {
    n: 17,
    title: "Spanning Trees",
    titleVerified: false,
    // 7 lectures · 1h 14m
    lectures: [
      { title: "Spanning Trees Introduction.", duration: "14:17" },
      { title: "Spanning Trees Properties Continuation.", duration: "13:04" },
      { title: "Minimum Spanning Trees Definition and Algorithms Introduction", duration: "2:12" },
      { title: "Krushkal's Algorithm for finding Minimum Spanning Trees.", duration: "11:22" },
      { title: "Krushkal's Algorithm for finding Minimum Spanning Trees Continuation", duration: "14:14" },
      { title: "Krushkal's Algorithm for finding Minimum Spanning Trees - Time Complexity.", duration: "4:12" },
      { title: "Prim's Algorithm for finding Minimum Spanning Tree and Time Complexity.", duration: "14:56" },
    ],
  },
  {
    n: 18,
    title: "Sorting Techniques",
    titleVerified: false,
    // 26 lectures · 5h 20m
    lectures: [
      { title: "1. Bubble Sort : Understanding Example", duration: "13:46" },
      { title: "1. Bubble Sort : Time Complexity", duration: "14:51" },
      { title: "1. Bubble Sort : Algorithm", duration: "12:24" },
      { title: "1. Bubble Sort : Reducing Time Complexity", duration: "11:35" },
      { title: "C Code : Bubble Sort", duration: "8:42" },
      { title: "Python Code : Bubble Sort", duration: "6:46" },
      { title: "2. Insertion Sort : Understanding Example", duration: "18:43" },
      { title: "2. Insertion Sort : Algorithm", duration: "9:16" },
      { title: "2. Insertion Sort : Time Complexity", duration: "7:46" },
      { title: "C Code : Insertion Sort", duration: "6:19" },
      { title: "Python Code : Insertion Sort", duration: "5:45" },
      { title: "3. Selection Sort : Understanding Example", duration: "13:41" },
      { title: "3. Selection Sort : Algorithm", duration: "9:13" },
      { title: "3. Selection Sort : Time Complexity", duration: "10:29" },
      { title: "C Code : Selection Sort", duration: "6:55" },
      { title: "Python Code : Selection Sort", duration: "6:07" },
      { title: "Merge Sort : Theory", duration: "21:04" },
      { title: "Merge Sort : Algorithm", duration: "25:35" },
      { title: "C Code : Merge Sort", duration: "14:50" },
      { title: "Quick Sort : Example", duration: "15:51" },
      { title: "Quick Sort : Algorithm", duration: "20:32" },
      { title: "Quick Sort : Time Complexity Analysis - Placing Pivot Element", duration: "8:19" },
      { title: "Quick Sort : Time Complexity Analysis - Best Case", duration: "8:06" },
      { title: "Quick Sort : Time Complexity Analysis - Worst Case", duration: "8:13" },
      { title: "Heap Sort : Understanding with Example", duration: "19:19" },
      { title: "Heap Sort : Time Complexity", duration: "16:11" },
    ],
  },
  {
    n: 19,
    title: "Searching Techniques",
    titleVerified: false,
    // 9 lectures · 1h 36m
    lectures: [
      { title: "Linear Search", duration: "9:20" },
      { title: "C Code : Linear Search", duration: "9:20" },
      { title: "Python Code : Linear Search", duration: "9:52" },
      { title: "Binary Search : Understanding with Example", duration: "15:26" },
      { title: "Binary Search : Iterative and Recursive Algorithms", duration: "12:13" },
      { title: "C Code : Binary Search - Iterative", duration: "13:20" },
      { title: "C Code : Binary Search - Recursive", duration: "6:50" },
      { title: "Python Code : Binary Search - Iterative", duration: "12:12" },
      { title: "Python Code : Binary Search - Recursive", duration: "7:34" },
    ],
  },
  {
    n: 20,
    title: "Greedy Method",
    titleVerified: false,
    // 7 lectures · 1h 18m
    lectures: [
      { title: "Job Sequencing Problem : Theory", duration: "11:31" },
      { title: "Job Sequencing Problem : Example 1", duration: "6:36" },
      { title: "Job Sequencing Problem : Example 2", duration: "8:25" },
      { title: "Knapsack Problem : Theory", duration: "5:45" },
      { title: "Knapsack Problem : Example - Greedy about Weight, Profit and Unit Cost.", duration: "17:53" },
      { title: "Optimal Merge Pattern : Theory", duration: "8:57" },
      { title: "Optimal Merge Pattern : Example", duration: "19:04" },
    ],
  },
  {
    n: 21,
    title: "Dynamic Programming",
    titleVerified: false,
    // 4 lectures · 1h 32m
    lectures: [
      { title: "Travelling Salesperson Problem", duration: "46:40" },
      { title: "Longest Common Subsequence - Intro & Difference between Substring & Subsequence", duration: "8:27" },
      { title: "Longest Common Subsequence - Problem and Solution", duration: "37:16" },
      { title: "Multistage Graph", duration: null },
    ],
  },
];

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

export const transcribedLectureCount = CURRICULUM.reduce(
  (a, s) => a + s.lectures.length,
  0,
);

