import { allSkills } from "@/data/skills";
import { cn } from "@/lib/cn";

/**
 * Two ribbons of the stack, crossed.
 *
 * An emerald band tilted one way runs left; a vermilion band tilted the other
 * runs right, passing behind it. Each is a duplicated track looping on a CSS
 * keyframe (no JavaScript, no measurement), and each also slides a little
 * further with the page's scroll (a scroll-driven offset on the band, see
 * "RIBBONS" in globals.css) so the strip answers the reader's movement rather
 * than just playing in place.
 *
 * The first track of the emerald band is the real list; every other track is
 * `aria-hidden` so a screen reader reads the stack once. Hover or focus pauses
 * both, and reduced motion stops them.
 */
export function TechTicker() {
  const items = allSkills
    .filter((skill) => skill.primary || skill.years)
    .map((skill) => skill.name);

  if (items.length === 0) return null;

  /* The second band runs the list from the middle so the two never show the
     same names stacked over each other. */
  const half = Math.floor(items.length / 2);
  const rotated = [...items.slice(half), ...items.slice(0, half)];

  return (
    <section
      id="stack"
      data-tone="stack"
      data-ambient=""
      aria-label="Technologies I work with"
      className="ribbons group relative isolate overflow-hidden py-14 md:py-20"
    >
      <div className="ribbon ribbon-back">
        <div className="ribbon-band bg-vermilion text-[#170a05]">
          <Track items={rotated} reverse aria-hidden="true" />
          <Track items={rotated} reverse aria-hidden="true" />
        </div>
      </div>

      <div className="ribbon ribbon-front">
        <div className="ribbon-band bg-emerald text-ivory">
          <Track items={items} />
          <Track items={items} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

function Track({ items, reverse = false, ...props }) {
  return (
    <ul
      {...props}
      className={cn(
        "flex shrink-0 items-center gap-7 pr-7",
        reverse
          ? "motion-safe:animate-[ticker-reverse_52s_linear_infinite]"
          : "motion-safe:animate-[ticker_46s_linear_infinite]",
        "group-hover:[animation-play-state:paused]",
        "group-focus-within:[animation-play-state:paused]",
      )}
    >
      {items.map((name, index) => (
        <li key={`${name}-${index}`} className="flex items-center gap-7">
          <span
            className={cn(
              "whitespace-nowrap font-display text-[clamp(1.375rem,2.8vw,2.5rem)] leading-none tracking-[-0.01em]",
              index % 2 === 1 && "italic",
            )}
          >
            {name}
          </span>
          <span aria-hidden="true" className="text-[0.9em] leading-none opacity-80">
            ✺
          </span>
        </li>
      ))}
    </ul>
  );
}
