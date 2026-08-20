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

/**
 * TWO URLs, AND THE DIFFERENCE MATTERS.
 *
 * SITE_ORIGIN is what `metadataBase` must be — the bare origin, NOT the
 * subfolder. Next already prefixes `basePath` onto the paths it generates for
 * the file-convention images (app/opengraph-image.png and friends). Give
 * metadataBase the subfolder as well and the two prefixes compound:
 *
 *   metadataBase "https://edufulness.com/dsa/" + "/dsa/opengraph-image.png"
 *     → https://edufulness.com/dsa/dsa/opengraph-image.png   ← 404
 *
 * That was live in the build until it was caught; it is invisible in the UI
 * and only shows up when someone shares the link.
 *
 * SITE_URL is the canonical address of the page itself, used for og:url.
 *
 * The caveat: with metadataBase set to the origin, any HAND-WRITTEN relative
 * metadata URL would resolve against the domain root rather than /dsa/. There
 * are none today. If one is ever added, write it absolute with SITE_URL.
 */
export const SITE_ORIGIN = "https://edufulness.com/";
export const SITE_URL = "https://edufulness.com/dsa/";

export const SITE = {
  name: "EduFulness",
  tagline: "Think. Learn. Evolve.",
  url: SITE_URL,
} as const;
