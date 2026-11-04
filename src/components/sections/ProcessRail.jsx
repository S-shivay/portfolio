"use client";

import { useRef } from "react";
import { m, useScroll, useTransform, useReducedMotion } from "framer-motion";

import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

/**
 * Scroll-driven process rail.
 *
 * The connecting line fills as the list passes through the viewport. Each step
 * reveals on entry with a small stagger. All of it is transform and opacity
 * only, so the effect never triggers layout.
 *
 * Under reduced motion the rail renders fully drawn and the steps render
 * static — the information is identical, only the choreography is removed.
 */
export function ProcessRail({ steps }) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 65%"],
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <ol ref={ref} className="relative">
      {/* Rail */}
      <div
        aria-hidden="true"
        className="absolute left-6 top-4 hidden h-[calc(100%-2rem)] w-px bg-line md:block"
      >
        <m.div
          className="h-full w-full origin-top bg-accent"
          style={reduceMotion ? { scaleY: 1 } : { scaleY }}
        />
      </div>

      {steps.map((step, index) => (
        <li key={step.step} className="relative md:pl-20">
          {/* The site's CSS reveal (RevealRuntime) rather than Framer's
              `initial`: that renders `opacity: 0` into the server HTML, so
              every step was invisible until the bundle hydrated — and this
              rail is now what every phone shows. */}
          <div
            data-reveal=""
            style={{ "--reveal-y": "14px", "--reveal-dur": "360ms" }}
            className={cn(
              "grid gap-x-6 gap-y-3 border-t border-line py-8 md:grid-cols-12 md:py-10",
              index === 0 && "border-t-0 pt-0 md:pt-0",
            )}
          >
            {/* Node */}
            <span
              aria-hidden="true"
              className={cn(
                "absolute left-0 hidden size-12 place-items-center rounded-full border border-line bg-bg text-accent-ink md:grid",
                index === 0 ? "top-0" : "top-8",
              )}
            >
              <Icon name={step.icon} size={18} />
            </span>

            <div className="md:col-span-4">
              <p className="label-mono text-accent-ink">{step.step}</p>
              <h3 className="mt-3 text-h3 font-normal tracking-tight text-text">
                {step.title}
              </h3>
            </div>

            <div className="md:col-span-8">
              <p className="text-[0.9375rem] leading-relaxed text-text">
                {step.summary}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted measure">
                {step.detail}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
