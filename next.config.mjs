/**
 * Static export for Hostinger shared hosting (PHP only, no Node runtime).
 *
 * basePath is "/dsa" because the site is served from
 * https://edufulness.com/dsa/ — a subfolder, not a subdomain.
 * Set it to "" if this ever moves to a domain root.
 *
 * Next applies basePath to its own bundles and to <Link>, but NOT to raw
 * strings pointing at public/ assets. Those must go through asset() in
 * lib/site.ts or they 404 in production while working fine in dev.
 */
const basePath = "/dsa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // No Node runtime on the host, so the Image Optimization API cannot run.
  images: { unoptimized: true },
  // Emits /about/index.html rather than /about.html — Apache serves the
  // former from a directory URL without any rewrite rules.
  trailingSlash: true,
  basePath,
  // Exposed to the client so asset() can read it at runtime.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
