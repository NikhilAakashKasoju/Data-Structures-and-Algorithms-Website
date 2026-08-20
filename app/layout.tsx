import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";

import { Footer } from "@/components/Footer";
import { MotionProvider } from "@/components/MotionProvider";
import { Nav } from "@/components/Nav";
import { ThemeScript } from "@/components/ThemeScript";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SITE_ORIGIN, SITE_URL } from "@/lib/site";

import "./globals.css";

/* Fonts are self-hosted by next/font at build time — no runtime request to
   Google, no layout shift, and it works on a host with no Node runtime
   because the woff2 files are emitted into the static export. */
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  /* The ORIGIN, not the subfolder — Next already adds basePath to the
     file-convention image paths, and giving metadataBase the subfolder too
     produces /dsa/dsa/opengraph-image.png. See lib/site.ts. */
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: "Data Structures & Algorithms — EduFulness",
    template: "%s — EduFulness",
  },
  description:
    "Data Structures & Algorithms in C, C++ and Python — 21 sections, 222 lectures, taught by Atchyut Kumar.",
  openGraph: {
    type: "website",
    siteName: "EduFulness",
    url: SITE_URL,
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /* suppressHydrationWarning: ThemeScript mutates data-theme before React
       hydrates, so the server HTML and the live DOM legitimately differ on
       exactly this attribute. */
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="relative min-h-screen">
        {/* Background is mounted once, here, as three fixed layers. Sections
            stay transparent so this reads through the entire page. */}
        <div className="bg-glow" aria-hidden="true" />
        <div className="bg-grid" aria-hidden="true" />
        <div className="bg-fade" aria-hidden="true" />

        {/* Keyboard users land here first; the target is the <main> below. */}
        <a
          href="#main"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:inline-flex
                     focus-visible:left-4 focus-visible:top-4 focus-visible:z-[60]
                     focus-visible:rounded-full focus-visible:border
                     focus-visible:border-line focus-visible:bg-surface-2
                     focus-visible:min-h-[44px] focus-visible:items-center focus-visible:px-4
                     focus-visible:py-2 focus-visible:text-[14px]
                     focus-visible:font-semibold"
        >
          Skip to content
        </a>

        <MotionProvider>
          {/* Nav is a sibling of <main>, not a wrapper: its client boundary
              must not swallow the page's server components. */}
          <Nav />
          <main id="main">{children}</main>
        </MotionProvider>

        {/* Outside <main> — a footer is a landmark of the page, not part of
            its main content. Also outside MotionProvider: it animates
            nothing, so it needs no context. */}
        <Footer />

        <ThemeToggle />
      </body>
    </html>
  );
}
