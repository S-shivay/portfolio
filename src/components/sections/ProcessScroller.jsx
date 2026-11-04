"use client";

import { useEffect, useRef } from "react";
import { m, useMotionValue, useScroll, useTransform } from "framer-motion";

import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";

/**
 * The six process steps as a horizontal track that scrolls sideways while the
 * section is pinned.
 *
 * The section is given height in proportion to the number of steps; inside
 * it a full-viewport panel sticks, and the track's `x` is the section's
 * scroll progress times how far the track overflows the screen. Scrolling
 * down walks the reader through Understand → Ship in order, one card filling
 * the eye at a time, and the progress rule at the bottom shows where they are.
 *
 * Desktop only, and not under reduced motion — Engineering.jsx shows the
 * vertical rail instead in both cases, chosen by CSS so the server HTML is the
 * same for everyone.
 *
 * The overflow distance is measured (ResizeObserver) rather than assumed, so
 * any number of steps at any card width lands exactly on the last card.
 */
export function ProcessScroller({ steps, className }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const distance = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(() => -scrollYProgress.get() * distance.get());

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () =>
      distance.set(Math.max(0, track.scrollWidth - window.innerWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [distance]);

  return (
    <div
      ref={sectionRef}
      className={cn("relative ml-[calc(50%-50vw)] w-screen", className)}
      style={{ height: `${steps.length * 55 + 45}vh` }}
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <m.ol
          ref={trackRef}
          style={{ x }}
          className="flex w-max gap-5 pl-[max(var(--gutter),calc((100vw-var(--container))/2+var(--gutter)))] pr-[20vw] will-change-transform"
        >
          {steps.map((step) => (
            <li
              key={step.step}
              data-spotlight=""
              className="relative flex h-[min(58vh,28rem)] w-[min(32rem,36vw)] shrink-0 flex-col overflow-hidden rounded-xl card-accent border bg-surface-1 p-9 shadow-e2"
            >
              <span
                aria-hidden="true"
                className="text-outline pointer-events-none absolute -right-3 -top-6 select-none font-display text-[11rem] font-normal leading-none opacity-30"
              >
                {step.step}
              </span>

              <span className="grid size-12 place-items-center rounded-lg bg-accent text-accent-fg shadow-e1">
                <Icon name={step.icon} size={22} />
              </span>

              <p className="label-mono mt-auto text-accent-ink">Step {step.step}</p>
              <h3 className="mt-3 font-display text-[clamp(2rem,3vw,2.75rem)] font-normal leading-none tracking-[-0.035em] text-text">
                {step.title}
              </h3>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-text">
                {step.summary}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {step.detail}
              </p>
            </li>
          ))}
        </m.ol>

        {/* Where the reader is in the sequence. */}
        <div className="container-content mt-10 w-full">
          <div aria-hidden="true" className="h-px w-full bg-line">
            <m.div
              className="h-full origin-left bg-accent"
              style={{ scaleX: scrollYProgress }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
