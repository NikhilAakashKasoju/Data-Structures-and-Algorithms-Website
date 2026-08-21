/**
 * TESTIMONIALS.
 *
 * QUOTED VERBATIM. Every review below is reproduced exactly as the client
 * supplied it, including its grammar and typos — "Why this instructor didn't
 * became famous", "What a effort", "Most likely part for me is". Tidying a
 * testimonial is not copy-editing, it is putting words in a real person's
 * mouth, and the unevenness is itself evidence that these are real people
 * rather than marketing copy.
 *
 * PROVENANCE. One review (Ramana) was supplied as a screenshot of the Udemy
 * review card, showing five stars and "1 year ago". The other twelve were
 * supplied as text with a stated star rating. All are attributed to Udemy
 * because they quote the Udemy course listing by name — see README gap 11.
 *
 * DATES. Only Ramana's is known ("1 year ago", itself relative and already
 * stale). No date is rendered for anyone rather than invent twelve of them.
 *
 * NO AGGREGATE CLAIM. The section deliberately never says "13 reviews" or
 * "5.0 average". These are thirteen reviews the client chose to show, not the
 * course's rating — presenting a hand-picked set as a statistic would be
 * exactly the kind of invented figure §9 exists to prevent.
 *
 * NOTE ON THE COURSE TITLE. Several reviewers name the course
 * "Data Structures & Algorithms using C++, C and Python – 2025", while the
 * current listing reads "- 2026". The course appears to have been renamed for
 * the year. The quotes keep whatever each reviewer wrote.
 */

export type Testimonial = {
  /** Reviewer name, exactly as supplied. */
  name: string;
  /** Verbatim. Never edited for grammar, spelling or length. */
  quote: string;
  /** Out of 5. Every supplied review is a 5. */
  rating: 5;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Ramana",
    rating: 5,
    quote:
      "The Data Structures & Algorithms using C++, C, and Python – 2025 course by Atchyut found it very useful. The explanations were clear, made the concepts easy to understand with examples. Great course for building strong DSA foundations. Thank you!",
  },
  {
    name: "ChandraMurthy",
    rating: 5,
    quote:
      'The course "Data Structures & Algorithms using C++, C and Python - 2025" by Atchyut Sir is excellent! The explanations are very clear, well-structured, and easy to follow. I really liked how he covered each topic with practical examples. It helped me understand the core concepts deeply. Thank you Sir.',
  },
  {
    name: "Techie",
    rating: 5,
    quote:
      "Great course. What a effort with simple explanation with deep knowledge. The best teacher naturally in my life. Concepts implemented in three languages is great thing. Thanks a lot dear Sir.",
  },
  {
    name: "Karim",
    rating: 5,
    quote:
      "Why this instructor didn't became famous in this computer science field. His knowledge and teaching skill is awesome. He know very well how to start a topic and how to engage the students. This is my personal view after 70% of course completed. The best faculty. I wish you will became very famous very soon sir.",
  },
  {
    name: "Krithika",
    rating: 5,
    quote:
      "Good course with deep knowledge from instructor. Most likely part for me is , he always teaching from scratch and providing lots insights giving and making so much confident in subject. Linked lists and trees are such difficult topics for me, but now I am absolutely playing with them. Thank you sir.",
  },
  {
    name: "Victoria",
    rating: 5,
    quote:
      "This course is quite comprehensive when compared with other courses available on this platform which is why I bought it. It is packed full of amazing content and like the description, it did make me a full data structures master. The instructor is a very good teacher using visual aids (not just talking) and simple illustrations to drive home a point. I enjoyed the course, well recommended for all levels.",
  },
  {
    name: "Jibin",
    rating: 5,
    quote:
      "Very smooth teaching and deep discussion on every topic. Teaching from always basics and taking very deep. I did 60% of course. Simply superb. My basics are very poor. But made me like pro. Thank you sir.",
  },
  {
    name: "Xin",
    rating: 5,
    quote:
      "This is a really amazing course. Seems like a lot of effort was given to creating this course. It helped me a lot with my academics as well as placement preparation. Tons of thanks to you Atchyut Sir.",
  },
  {
    name: "Muhammad Ali Imran",
    rating: 5,
    quote: "Great way to explain complicated data structures.",
  },
  {
    name: "Ravi",
    rating: 5,
    quote:
      "The course was great. Great part of his course is every concept explaining in all possible directions. Always starting from very basic and going very deep as much as possible. Most part of the material was complex and instructor found a way to explain it clearly. A lot of examples were provided were discussed for every concept.",
  },
  {
    name: "Joseph",
    rating: 5,
    quote:
      "Mr. Atchyut Kumar does an excellent job of thoroughly explaining each method data structure. He shows with plenty of detailed examples, making it very easy to understand. He doesn't go straight to the solution, he explains things in a way that make it easy to understand with charts and very descriptive diagrams. It makes for very easy learning. You won't be disappointed.",
  },
  {
    name: "Michael",
    rating: 5,
    quote:
      "One of the best courses I've enrolled here in Udemy, he is a good teacher, he gives challenges, examples and tips too.",
  },
  {
    name: "Ramachandran",
    rating: 5,
    quote:
      "This is Course is the FIRST Udemy course which I felt PERFECT! There was enough guidance AND enough opportunity to explore and rock yourself. I really enjoyed the course. It covered lot of things which are missed in college and hopefully will help me with my upcoming interview.",
  },
];
