import { Wordmark } from "@/components/Wordmark";
import { COURSE } from "@/lib/course";
import { NAV_ITEMS } from "@/lib/nav";
import { SITE } from "@/lib/site";

/**
 * FOOTER.
 *
 * SERVER COMPONENT — the second on the page that ships no JS at all. There is
 * no entrance animation here on purpose: a footer is what a reader scrolls to
 * deliberately, so fading it in delays the thing they went looking for.
 *
 * CONTENT INTEGRITY. Every link below resolves somewhere real: the in-page
 * anchors come from NAV_ITEMS, and the three external links are the Udemy
 * listing, edufulness.com and the existing Data Engineering course. There is
 * deliberately NO contact column — the WhatsApp community link and reply-to
 * address have not been supplied (README gap 7), and a footer full of `#`
 * placeholders is worse than a footer with one fewer column. It is added the
 * moment those exist.
 */

/** Fixed at build time. Under `output: "export"` there is no server at request
 *  time, so this is the year of the last deploy, not the current year — a
 *  known and accepted constraint, documented in the README. */
const BUILD_YEAR = new Date().getFullYear();

const EXTERNAL = [
  {
    label: "Course on Udemy",
    href: COURSE.udemyUrl,
  },
  {
    label: "edufulness.com",
    href: "https://edufulness.com/",
  },
  {
    label: "Azure Data Engineering",
    href: "https://edufulness.com/data-engineering/",
  },
] as const;

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-line">
      <div className="mx-auto max-w-[1300px] px-5 py-14 sm:px-8 sm:py-16 lg:px-12">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_repeat(2,minmax(0,1fr))] lg:gap-16">
          {/* ── Brand ── */}
          <div>
            <a
              href="#main"
              className="inline-flex min-h-[44px] items-center gap-2.5"
            >
              <Wordmark />
            </a>
            <p className="mt-4 max-w-[38ch] text-[15.5px] leading-relaxed text-muted">
              {SITE.tagline}
            </p>
            <p className="mt-4 max-w-[42ch] text-[14px] leading-relaxed text-muted">
              {COURSE.sections} sections and {COURSE.lectures} lectures on data
              structures and algorithms in {COURSE.languages.join(", ")}, taught
              by {COURSE.instructor}.
            </p>
          </div>

          {/* ── In-page links ──
              Driven by NAV_ITEMS, so the footer can never list a section the
              nav has dropped, or miss one it has gained. */}
          <FooterColumn title="On this page">
            {NAV_ITEMS.map((item) => (
              <FooterLink key={item.id} href={`#${item.id}`}>
                {item.label}
              </FooterLink>
            ))}
          </FooterColumn>

          {/* ── External ── */}
          <FooterColumn title="Elsewhere">
            {EXTERNAL.map((link) => (
              <FooterLink key={link.href} href={link.href} external>
                {link.label}
              </FooterLink>
            ))}
          </FooterColumn>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.09em] text-muted">
            © {BUILD_YEAR} {SITE.name}
          </p>
          <a
            href="#main"
            className="inline-flex min-h-[44px] items-center gap-2 self-start font-mono text-[11px] uppercase tracking-[0.09em] text-muted transition-colors hover:text-text sm:self-auto"
          >
            Back to top
            <svg
              viewBox="0 0 16 16"
              aria-hidden="true"
              className="h-[12px] w-[12px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 13V3M4.5 6.5 8 3l3.5 3.5" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}

/**
 * A labelled group of links.
 *
 * The heading is a real <h2> rather than a styled <p>, and the list is bound
 * to it with aria-labelledby — so a screen reader announces "Elsewhere, list,
 * 3 items" instead of an unattributed run of links at the end of the page.
 */
function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const id = `footer-${title.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div>
      <h2 id={id} className="label">
        {title}
      </h2>
      <ul aria-labelledby={id} className="mt-3 flex flex-col">
        {children}
      </ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <li>
      <a
        href={href}
        /* noreferrer alongside noopener: noopener alone still leaks the
           referring URL, and these go to third-party domains. */
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        className="inline-flex min-h-[44px] items-center gap-1.5 text-[15px] text-muted transition-colors hover:text-text"
      >
        {children}
        {external && (
          /* Decorative — the accessible cue is that the link opens in a new
             tab, which browsers and screen readers surface themselves. */
          <svg
            viewBox="0 0 16 16"
            aria-hidden="true"
            className="h-[11px] w-[11px] shrink-0 opacity-60"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 3h7v7M13 3 4 12" />
          </svg>
        )}
      </a>
    </li>
  );
}
