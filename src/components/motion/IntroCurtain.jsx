import { site } from "@/data/site";

/**
 * The opening curtain: an emerald sheet with the name set large, a counter
 * running to 100, then the sheet lifts away with a vermilion sheet a beat
 * behind it, and the hero rises in underneath.
 *
 * Entirely CSS on a fixed timeline (see "INTRO CURTAIN" in globals.css), and
 * `display: none` unless the head script has set `data-intro` — which it does
 * once per browser session, never under reduced motion, and never without
 * JavaScript. It does not wait on hydration or on any network request: it
 * lifts at 1.9s whether or not the bundle has arrived, so it can delay what a
 * reader sees by that much and no more.
 *
 * `aria-hidden`: it repeats the name that the page itself states, and a
 * screen reader should go straight to the content.
 */
export function IntroCurtain() {
  const [first, ...rest] = site.name.split(" ");

  return (
    <div aria-hidden="true" className="intro-curtain">
      <div className="intro-sheet intro-sheet-v" />
      <div className="intro-sheet intro-sheet-e">
        <div className="container-wide flex h-full flex-col justify-between py-8 md:py-10">
          <div className="flex items-center justify-between">
            <span className="label-mono">{site.role}</span>
            <span className="label-mono">{site.location.split(",")[0]}, IN</span>
          </div>

          <p className="intro-name font-display">
            <span className="intro-line">
              <span>{first}</span>
            </span>
            <span className="intro-line">
              <span>
                <em>{rest.join(" ")}</em>
              </span>
            </span>
          </p>

          <div className="flex items-end justify-between gap-6">
            <span className="intro-bar" />
            <span className="intro-count font-display" />
          </div>
        </div>
      </div>
    </div>
  );
}
