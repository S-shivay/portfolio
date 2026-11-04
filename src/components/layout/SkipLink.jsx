/**
 * Skip link.
 *
 * Visually hidden until focused, then it becomes a real, high-contrast button
 * at the top of the page. This is the first thing a keyboard user meets, so it
 * is rendered before the nav in the DOM — tab order follows visual order.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:inline-flex focus-visible:h-11 focus-visible:items-center focus-visible:rounded-full focus-visible:bg-accent focus-visible:px-5 focus-visible:text-[0.9375rem] focus-visible:font-medium focus-visible:text-accent-fg"
    >
      Skip to content
    </a>
  );
}
