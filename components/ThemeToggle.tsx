"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

/**
 * Fixed bottom-right theme switch.
 *
 * Notes on the decisions here:
 * - It is a <button>, not an <a>: it performs an action, it does not navigate.
 * - 44×44px minimum hit area (h-11 w-11) to meet the touch-target rule.
 * - aria-pressed communicates state; the icon alone says nothing to a
 *   screen reader, and aria-label carries the *action*, not the state.
 * - The initial value is read from the DOM, not from localStorage, because
 *   ThemeScript has already resolved the correct value before hydration —
 *   re-deriving it here risks the two disagreeing.
 * - `mounted` guards the first render so the server HTML (which has no
 *   window) and the client HTML agree; without it React logs a hydration
 *   mismatch on the icon.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "light" ? "light" : "dark");
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("efn-theme", next);
    } catch {
      /* Safari private mode — the theme still applies for this page view. */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch colour theme"
      aria-pressed={theme === "light"}
      className="fixed bottom-5 right-5 z-50 inline-flex h-11 w-11 items-center
                 justify-center rounded-full border border-line bg-surface
                 backdrop-blur-sm transition-colors hover:border-line-strong
                 hover:bg-surface-2"
    >
      {/* Decorative: the accessible name comes from aria-label above. */}
      <span aria-hidden="true" className="block h-[18px] w-[18px]">
        {mounted && theme === "light" ? <MoonIcon /> : <SunIcon />}
      </span>
      <span className="sr-only">
        {mounted && theme === "light" ? "Light theme active" : "Dark theme active"}
      </span>
    </button>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         strokeLinecap="round" className="h-full w-full text-lime">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round" className="h-full w-full text-purple-2">
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
    </svg>
  );
}
