"use client";

import { Fragment, useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { usePointerFine } from "@/hooks/useActiveSection";

/**
 * Display headline whose words lean toward the pointer.
 *
 * Each word is a real word in a span — the text is never split into
 * per-character nodes. Splitting to characters is the usual way to build this
 * effect and it quietly destroys the content: screen readers announce
 * "I. b. u. i. l. d.", in-page find stops matching, and selecting the text
 * copies the letters with separators between them. Word granularity gives
 * almost the same visual result and keeps the heading a heading.
 *
 * Movement is written directly to each span's transform inside a single rAF
 * loop. No React state changes while the pointer moves, so a headline of twenty
 * words costs zero renders and one style write per word per frame.
 *
 * The effect is opt-in by capability: fine pointers only, and never under
 * `prefers-reduced-motion`. When it is off the words simply sit still — the
 * markup and layout are identical, so nothing is lost.
 *
 * Each line also arrives on mount — out of focus, rising and straightening —
 * on a plain CSS keyframe (`data-enter="blur"`), staggered per line. That sits
 * on a wrapper between the line and its words, so the entrance, the scroll
 * exit and the pointer lean each own a different element's transform.
 *
 * @param lines          array of strings; each becomes one display line
 * @param emphasis       words (as written, punctuation included) to set as
 *                       the house emphasis — `<em>`, italic in vermilion
 * @param lineClassNames per-line classes (indents, alignment)
 * @param enterDelay     ms before the first line starts its entrance
 */
export function KineticHeadline({
  lines,
  emphasis = [],
  lineClassNames = [],
  enterDelay = 120,
  /* Lines slide apart as the page scrolls away (CSS, see "HERO SCROLL EXIT"
     in globals.css). On the line wrappers, not the words, so it composes
     with the pointer lean below instead of fighting it for `transform`. */
  scrollExit = false,
  className,
  as: Tag = "h1",
  ...props
}) {
  const rootRef = useRef(null);
  const pointerFine = usePointerFine();

  useEffect(() => {
    if (!pointerFine) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const root = rootRef.current;
    if (!root) return;

    const words = Array.from(root.querySelectorAll("[data-word]"));
    if (!words.length) return;

    /* Word geometry is measured on layout changes, not per frame.
       getBoundingClientRect inside the rAF loop would force a synchronous
       layout for every word on every frame — exactly the thrash this component
       exists to avoid. A ResizeObserver re-measures when the text reflows, and
       scrolling re-measures because the rects are viewport-relative. */
    let boxes = [];

    const measure = () => {
      boxes = words.map((node) => {
        // Read the untransformed box, or the measurement drifts as it moves.
        const previous = node.style.transform;
        node.style.transform = "";
        const rect = node.getBoundingClientRect();
        node.style.transform = previous;

        return {
          node,
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          current: { x: 0, y: 0, r: 0 },
          target: { x: 0, y: 0, r: 0 },
        };
      });
    };

    measure();
    /* Measured once more after the entrance (and an intro curtain, if one is
       playing) has settled: rects read mid-entrance include the wrapper's
       in-flight transform. */
    const settle = setTimeout(measure, 3600);

    const observer = new ResizeObserver(measure);
    observer.observe(root);
    window.addEventListener("scroll", measure, { passive: true });

    /* Words within this radius react; beyond it they are untouched. Roughly one
       display line's height, so the effect stays local to the cursor rather
       than the whole block swimming at once. */
    const RADIUS = 260;
    const PULL = 26;

    let pointerX = -9999;
    let pointerY = -9999;
    let frame = 0;

    const onMove = (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
    };

    const tick = () => {
      for (const box of boxes) {
        const dx = pointerX - box.x;
        const dy = pointerY - box.y;
        const distance = Math.hypot(dx, dy);

        if (distance < RADIUS) {
          // 1 at the cursor, 0 at the edge of the radius.
          const strength = 1 - distance / RADIUS;
          box.target.x = (dx / RADIUS) * PULL * strength;
          box.target.y = (dy / RADIUS) * PULL * strength;
          box.target.r = (dx / RADIUS) * 3 * strength;
        } else {
          box.target.x = 0;
          box.target.y = 0;
          box.target.r = 0;
        }

        // Lerp toward the target so words drift rather than snap.
        box.current.x += (box.target.x - box.current.x) * 0.12;
        box.current.y += (box.target.y - box.current.y) * 0.12;
        box.current.r += (box.target.r - box.current.r) * 0.12;

        box.node.style.transform =
          `translate3d(${box.current.x.toFixed(2)}px, ${box.current.y.toFixed(2)}px, 0) ` +
          `rotate(${box.current.r.toFixed(2)}deg)`;
      }

      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", measure);
      observer.disconnect();
      clearTimeout(settle);
      cancelAnimationFrame(frame);
      for (const word of words) word.style.transform = "";
    };
  }, [pointerFine]);

  return (
    <Tag ref={rootRef} className={cn("font-display text-mega", className)} {...props}>
      {lines.map((line, lineIndex) => {
        const words = line.split(" ");

        return (
          <span
            key={lineIndex}
            data-hero-line={scrollExit ? lineIndex : undefined}
            className={cn("block", lineClassNames[lineIndex])}
          >
            <span
              data-enter="blur"
              className="block"
              style={{
                "--enter-delay": `${enterDelay + lineIndex * 130}ms`,
                "--enter-dur": "1200ms",
              }}
            >
              {words.map((word, wordIndex) => (
                <Fragment key={wordIndex}>
                  <span data-word className="inline-block will-change-transform">
                    {emphasis.includes(word) ? <em>{word}</em> : word}
                  </span>
                  {/* The space is a sibling of the span, not a child. Inside
                      an inline-block a trailing space collapses and the words
                      would run together; as a sibling they keep their natural
                      spacing and the sentence still copies with spaces in it. */}
                  {wordIndex < words.length - 1 ? " " : null}
                </Fragment>
              ))}
            </span>
          </span>
        );
      })}
    </Tag>
  );
}
