/**
 * Static export, deployable to TWO different targets from one repo.
 *
 * ── THE BASEPATH PROBLEM ────────────────────────────────────────────────────
 * Hostinger serves this from a SUBFOLDER: https://edufulness.com/dsa/
 * Render serves a static site from the ROOT of its own host:
 *     https://<name>.onrender.com/   or   https://dsa.edufulness.com/
 *
 * A build with basePath "/dsa" deployed to Render 404s on every asset and
 * shows nothing at "/". A build with basePath "" uploaded to Hostinger's
 * subfolder does the same. The value is baked in at build time, so it cannot
 * be one constant.
 *
 * Render sets RENDER="true" in every build environment (documented), so the
 * correct value is derived rather than remembered. SITE_BASE_PATH overrides
 * both, for any host that is neither.
 */
const basePath =
  process.env.RENDER === "true"
    ? ""
    : process.env.SITE_BASE_PATH ?? "/dsa";

/**
 * Absolute origin, used for metadataBase and og:url. Must match wherever the
 * build is actually served, or every share card points at the wrong site.
 * NOT the same as basePath — see lib/site.ts.
 */
const siteOrigin =
  process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "https://edufulness.com";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // No Node runtime on either target's static tier, so the Image
  // Optimization API cannot run.
  images: { unoptimized: true },
  // Emits /about/index.html rather than /about.html. Apache resolves that
  // from a directory URL with no rewrite rules, and Render serves it too.
  trailingSlash: true,
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_SITE_ORIGIN: siteOrigin,
  },
};

export default nextConfig;
