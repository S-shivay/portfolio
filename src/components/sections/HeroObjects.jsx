import Image from "next/image";

/**
 * The photograph, pinned to the sun.
 *
 * A small tilted print — ivory border, cast shadow, a strip of tape — resting
 * on the vermilion disc behind the headline, bobbing slowly on a CSS keyframe.
 * It sits on the same anchor as the sun (`--sun-*` in globals.css), so the
 * two stay together at every width.
 *
 * `aria-hidden` and `alt=""`: the name is stated in the page's real content,
 * so this layer is scenery. Hidden below `md`, where the headline needs the
 * width.
 */
export function HeroObjects({ coordinates }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5] hidden md:block">
      <div className="hero-print-wrap">
        <figure className="hero-print">
          <span className="hero-print-tape" />
          <div className="relative aspect-[4/5] overflow-hidden bg-surface-3">
            <Image
              src="/portrait-small-v1.jpg"
              alt=""
              fill
              sizes="200px"
              className="object-cover"
            />
          </div>
          <figcaption className="label-mono mt-2.5 flex justify-between gap-2 text-[0.5625rem] text-muted">
            <span>Kanpur, IN</span>
            <span>{coordinates.split(" / ")[0]}</span>
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
