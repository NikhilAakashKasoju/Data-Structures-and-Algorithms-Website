import { COURSE } from "@/lib/course";
import { CURRICULUM, videoLectureCount } from "@/lib/curriculum";
import { STAGES } from "@/lib/stages";

/**
 * PROGRAM.
 *
 * WHY THERE IS NO PRICE ON THIS PAGE, AND WHY THAT IS CORRECT.
 *
 * The course sells through Udemy, and Udemy's price is not a number the seller
 * controls day to day — it moves with their own promotions and coupon
 * campaigns, often several times a month. A price baked into a statically
 * exported page would be wrong within days, and a wrong price on a checkout
 * page is worse than no price: it is the one number a buyer will hold you to.
 *
 * So the panel sends people to the live price instead. This is not a
 * placeholder standing in for a missing fact — it is the right design for a
 * marketplace-sold course.
 *
 * DIRECT ENROLMENT is a separate question. If EduFulness sells this programme
 * directly — its own price, its own checkout, weekday/weekend batches — that
 * is a fixed number the seller does control, and it belongs here. It has not
 * been supplied (README gaps 3 and 4), so `directEnrolment` is null and that
 * half of the panel does not render.
 */

export type DirectEnrolment = {
  /** Display string, e.g. "₹4,999". Formatted by whoever knows the currency. */
  price: string;
  /** Real checkout URL. No placeholder links. */
  checkoutUrl: string;
  /** e.g. "Weekday and weekend batches · 3–4 months". */
  batches: string;
};

/* ── Not yet supplied — README gaps 3 and 4 ── */
export const DIRECT_ENROLMENT: DirectEnrolment | null = null;

const articleCount = CURRICULUM.reduce(
  (a, s) => a + s.lectures.filter((l) => l.kind === "article").length,
  0,
);

/**
 * What is in the course. Every line is computed from the curriculum data or
 * quoted from the Udemy listing — nothing here is a marketing claim that
 * cannot be checked against lib/curriculum.ts.
 */
export const PROGRAM_INCLUDES: string[] = [
  `${COURSE.sections} sections, ${videoLectureCount} video lectures`,
  `${COURSE.runtimeHours}h ${COURSE.runtimeMinutes}m of video`,
  `Implementations in ${COURSE.languages.join(", ")}`,
  `${STAGES.length} stages, from memory layout to dynamic programming`,
  ...(articleCount ? [`${articleCount} written article`] : []),
];

/**
 * Quoted verbatim from the Udemy listing's "What you'll learn" block. Left
 * exactly as written, including its capitalisation — this is the seller's own
 * promise, not ours to reword.
 */
export const PROGRAM_OUTCOMES = COURSE.outcomes;
