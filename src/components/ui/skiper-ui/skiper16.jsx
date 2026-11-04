"use client";

import { createContext, useContext, useRef } from "react";
import {
  m,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

import { cn } from "@/lib/cn";

/**
 * StickyStack — Skiper UI 16 (StickyCard_001), generalised.
 *
 * Cards pin to the top of the viewport one after another. Each new card slides
 * up over the last, and every card already pinned shrinks back a step and
 * dims, so the pile reads as depth: the one you are reading is in front, the
 * ones you have read are behind it.
 *
 * The scroll math is Skiper's: one `useScroll` over the whole container, and
 * each card maps its slice of that progress — `[index / count, 1]` — onto a
 * scale from 1 down to `1 - (count - index - 1) * step`. The registry version
 * hard-coded five images in a 500×300 box inside its own Lenis root; this one
 * stacks any children, takes its smooth scrolling from the site, and:
 *
 *  - pins from `lg` only. Below that a card is taller than a phone screen, and
 *    a sticky element taller than the viewport hides its own bottom half — so
 *    small screens get the cards as a plain sequence;
 *  - adds the dimming layer, driven from the same scale value;
 *  - under reduced motion keeps the pinning (that is layout, not animation)
 *    but drops the scaling and dimming.
 *
 * Motion values write straight to `transform` and `opacity`, so scrolling the
 * stack causes no React renders.
 *
 * Attribution: Skiper UI (free tier requires credit; see the site footer).
 */

const StackContext = createContext(null);

export function StickyStack({ count, step = 0.05, className, children }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <StackContext.Provider value={{ progress: scrollYProgress, count, step }}>
      <div ref={ref} className={cn("relative", className)}>
        {children}
      </div>
    </StackContext.Provider>
  );
}

/**
 * One card in the stack. `offset` is how far below the previous card's top
 * edge this one pins, so a sliver of every card behind stays visible.
 */
export function StickyStackItem({
  index,
  top = "6.5rem",
  offset = "1.75rem",
  className,
  children,
}) {
  const { progress, count, step } = useContext(StackContext);
  const reduceMotion = useReducedMotion();
  const isLast = index === count - 1;

  const targetScale = Math.max(0.5, 1 - (count - index - 1) * step);
  const scale = useTransform(progress, [index / count, 1], [1, targetScale]);
  /* Mapped from progress, not from `scale`: for the last card the scale range
     is 1 → 1, and a degenerate input range left it stuck at full dim — the
     front card of the stack sat permanently washed out. */
  const dim = useTransform(progress, [index / count, 1], [0, isLast ? 0 : 0.42]);

  return (
    <div
      /* Every wrapper is one screen tall, except the last, which grows to fit
         its card. On a short laptop window (~650px) the last card's pinned
         offset plus its height is more than a screen; in a fixed-height
         wrapper it spilled past the end of the stack and — being positioned —
         painted over the "Also built" archive that follows. */
      className={cn(
        "lg:sticky lg:top-0 lg:flex lg:items-start",
        isLast ? "lg:min-h-svh lg:pb-10" : "lg:h-svh",
      )}
    >
      <m.div
        className={cn("relative w-full origin-top", className)}
        style={{
          scale: reduceMotion ? 1 : scale,
          "--stack-top": `calc(${top} + ${index} * ${offset})`,
        }}
      >
        <div className="lg:mt-[var(--stack-top)]">{children}</div>

        {/* The dimming: a sheet of the page colour, so it reads as the card
            receding into the background in either theme. */}
        {!reduceMotion && (
          <m.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden rounded-[inherit] bg-bg lg:mt-[var(--stack-top)] lg:block"
            style={{ opacity: dim }}
          />
        )}
      </m.div>
    </div>
  );
}
