/**
 * basePath helper.
 *
 * Next rewrites its own bundles and <Link> hrefs with basePath, but it does
 * NOT touch raw strings that point at public/. Those work perfectly in dev
 * (where basePath is also "" for the dev server's own root) and 404 in
 * production. Every public/ path must go through asset().
 *
 *   asset("/og/hero.png")  →  "/dsa/og/hero.png"
 */
export const asset = (path: string): string =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;

/** The real origin including the subfolder, trailing slash required, or
 *  relative OG image URLs resolve against the domain root instead. */
export const SITE_URL = "https://edufulness.com/dsa/";

export const SITE = {
  name: "EduFulness",
  tagline: "Think. Learn. Evolve.",
  url: SITE_URL,
} as const;
