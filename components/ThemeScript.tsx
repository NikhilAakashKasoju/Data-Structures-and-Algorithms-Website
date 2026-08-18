/**
 * Blocking inline script, injected into <head> ahead of any painted markup.
 *
 * Why inline and why blocking: the theme lives on <html data-theme>. If we
 * set it from a useEffect, the browser paints one frame of the default dark
 * palette before React hydrates — a white-page user gets a black flash on
 * every navigation. A synchronous script in <head> runs before first paint,
 * so there is nothing to flash.
 *
 * It is deliberately tiny and wrapped in try/catch: localStorage throws in
 * Safari private mode, and a throw here would abort the whole <head>.
 */
const script = `
(function () {
  try {
    var stored = localStorage.getItem("efn-theme");
    var theme = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
