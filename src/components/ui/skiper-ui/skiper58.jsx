import { cn } from "@/lib/cn";

/**
 * TextRoll — Skiper UI 58 (Navigation text roll), adapted.
 *
 * The label is drawn twice, one copy stacked under the other. On hover each
 * letter of the top copy rolls up out of view while the same letter of the
 * bottom copy rolls into its place, staggered outward from the centre.
 *
 * What changed from the registry version:
 *
 *  - CSS instead of Framer Motion. The original gave every letter its own
 *    motion component with hover variants: a twelve-letter label became
 *    twenty-four animated nodes listening for hover. Here the delays are
 *    computed once at render and the stylesheet does the rest, so a nav full
 *    of these costs nothing at runtime and works before hydration.
 *  - Triggered by the surrounding link, not the text. The roll plays when the
 *    pointer is anywhere on the `group` — and on keyboard focus, which the
 *    original never responded to.
 *  - Readable. Both copies are `aria-hidden` and the real label is a single
 *    visually-hidden text node, so a screen reader says "Projects" once
 *    instead of spelling it twice.
 *  - Reduced motion: the letters stay put (see `.text-roll` in globals.css).
 *
 * Attribution: Skiper UI (free tier requires credit; see the site footer).
 */

const STAGGER_MS = 28;

export function TextRoll({ children, className, center = true }) {
  const letters = [...children];
  const mid = (letters.length - 1) / 2;

  const copy = (position) =>
    letters.map((letter, i) => (
      <span
        key={i}
        className="text-roll-letter"
        data-position={position}
        style={{
          "--roll-delay": `${Math.round(
            (center ? Math.abs(i - mid) : i) * STAGGER_MS,
          )}ms`,
        }}
      >
        {letter === " " ? " " : letter}
      </span>
    ));

  return (
    <span className={cn("text-roll", className)}>
      <span className="sr-only">{children}</span>
      <span aria-hidden="true" className="text-roll-track">
        <span className="block">{copy("top")}</span>
        <span className="absolute inset-0">{copy("bottom")}</span>
      </span>
    </span>
  );
}
