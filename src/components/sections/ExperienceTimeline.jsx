"use client";

import { useId, useRef, useState } from "react";
import { m, useScroll, useTransform, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/cn";
import { useRouteState } from "@/hooks/useRouteState";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";

const EASE = [0.16, 1, 0.3, 1];

/**
 * Vertical experience timeline.
 *
 * The rail fills as the section scrolls through the viewport — driven by a
 * motion value from `useScroll`, so the fill is a compositor-only transform
 * with no React renders per scroll frame.
 *
 * Each role is a proper disclosure: a real <button aria-expanded> controlling
 * a region. Screen readers announce the state, Enter and Space both work, and
 * the collapsed card still carries the company, title, dates and headline
 * result — so nothing essential is hidden behind the interaction.
 */
export function ExperienceTimeline({ roles }) {
  const containerRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "end 60%"],
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={containerRef} className="relative">
      {/* Rail track */}
      <div
        aria-hidden="true"
        className="absolute left-[0.9375rem] top-2 hidden h-[calc(100%-1rem)] w-px bg-line sm:block"
      >
        <m.div
          className="h-full w-full origin-top bg-accent"
          style={reduceMotion ? { scaleY: 1 } : { scaleY }}
        />
      </div>

      <ol className="flex flex-col gap-4">
        {roles.map((role, index) => (
          <li key={role.id}>
            <Reveal delay={index * 0.04}>
              <RoleCard role={role} defaultOpen={index === 0} />
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---- The opening choreography ----------------------------------------------
 *
 * The panel's height springs open; inside it, once there is room, everything
 * arrives in order: the "Key outcomes" label, then each outcome rising out of
 * a blur with its number, a rule drawing beneath it, then the stack chips
 * popping in one by one. Closing plays the same thing backwards and faster, so
 * the content leaves before the panel folds.
 *
 * Under reduced motion every variant collapses to a plain opacity change. */

const panelList = {
  open: { transition: { staggerChildren: 0.075, delayChildren: 0.16 } },
  closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

const outcome = {
  open: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: EASE } },
  closed: { opacity: 0, y: 18, filter: "blur(8px)", transition: { duration: 0.25 } },
};

const rule = {
  open: { scaleX: 1, transition: { duration: 0.9, ease: EASE, delay: 0.15 } },
  closed: { scaleX: 0, transition: { duration: 0.2 } },
};

const chipList = {
  open: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
  closed: { transition: { staggerChildren: 0.015, staggerDirection: -1 } },
};

const chip = {
  open: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 420, damping: 22 } },
  closed: { opacity: 0, scale: 0.6, y: 8, transition: { duration: 0.15 } },
};

const plain = {
  open: { opacity: 1, transition: { duration: 0.2 } },
  closed: { opacity: 0, transition: { duration: 0.15 } },
};

function RoleCard({ role, defaultOpen = false }) {
  /* Remembered across route changes: Back returns to the page as it was left. */
  const [open, setOpen] = useRouteState(`role-${role.id}`, defaultOpen);
  /* The panel stays out of the accessibility tree and tab order when shut,
     but only once its closing animation has finished — `hidden` applied at
     the moment of the click would cut the animation off. */
  const [mounted, setMounted] = useState(open);
  /* Bumped on every open, to replay the light sweep and the node ripple. */
  const [opens, setOpens] = useState(0);
  const panelId = useId();
  const buttonId = useId();
  const reduceMotion = useReducedMotion();

  const isCurrent = role.end === null;
  const period = `${role.start} — ${role.end ?? "Present"}`;

  const toggle = () => {
    if (!open) {
      setMounted(true);
      setOpens((n) => n + 1);
    }
    setOpen(!open);
  };

  const v = (variants) => (reduceMotion ? plain : variants);

  return (
    <div className="relative sm:pl-12">
      {/* Node on the rail. Ripples outward each time the role opens. */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-[0.5rem] top-7 hidden size-4 place-items-center rounded-full border-2 transition-[border-color,background-color,transform] duration-500 sm:grid",
          open ? "scale-125 border-accent bg-accent" : isCurrent ? "border-accent bg-bg" : "border-line-strong bg-bg",
        )}
      >
        {isCurrent && !open && <span className="size-1.5 rounded-full bg-accent" />}
        {opens > 0 && !reduceMotion && (
          <span key={opens} className="xp-ripple absolute inset-[-2px] rounded-full border-2 border-accent" />
        )}
      </span>

      <div
        className={cn(
          /* Not `card-accent`: this is an accordion with an open state, and
             card-accent's hover border would override the open border. */
          "xp-card relative isolate overflow-hidden rounded-lg border bg-surface-1 transition-[border-color,box-shadow,transform] duration-500 ease-[var(--ease-out)]",
          "bg-gradient-to-br from-accent-soft to-transparent",
          open
            ? "border-accent shadow-[0_30px_60px_-34px_var(--accent-glow)]"
            : "border-line-accent shadow-e1 hover:-translate-y-0.5 hover:border-accent",
        )}
      >
        {/* A band of light that sweeps down the card as it opens. */}
        {opens > 0 && open && !reduceMotion && (
          <span key={opens} aria-hidden="true" className="xp-sweep pointer-events-none absolute inset-x-0 top-0 -z-10 h-40" />
        )}

        {/* The heading wraps the whole disclosure button, so it is reset to
            the body face; only the title inside takes the display serif. */}
        <h3 className="font-sans">
          <button
            id={buttonId}
            type="button"
            onClick={toggle}
            aria-expanded={open}
            aria-controls={panelId}
            data-cursor="view"
            data-cursor-label={open ? "Close" : "Read the role"}
            className="group/xp flex w-full cursor-pointer items-start gap-4 p-5 text-left sm:p-7"
          >
            <span className="min-w-0 flex-1">
              {/* Meta row. The start year is the largest thing in the card —
                  a timeline read at a glance is read by its years. `period`
                  remains the accessible reading of both halves. */}
              <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
                <span className="sr-only">{period}</span>
                <span
                  aria-hidden="true"
                  className="font-display text-[clamp(2rem,5vw,3.25rem)] font-normal leading-none tracking-[-0.045em] text-accent-ink"
                >
                  {role.start}
                </span>
                <span aria-hidden="true" className="label-mono text-faint">
                  → {role.end ?? "Present"}
                </span>
                {isCurrent && (
                  <span className="label-mono inline-flex items-center gap-1.5 rounded-full bg-accent px-2 py-1 text-accent-fg">
                    <span className="size-1.5 animate-pulse rounded-full bg-current" />
                    Current
                  </span>
                )}
              </span>

              {/* Title + company */}
              <span className="mt-4 block font-display text-[1.375rem] font-normal tracking-[-0.02em] text-text">
                {role.title}
              </span>
              <span className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-muted">
                <span>{role.company}</span>
                <span aria-hidden="true" className="text-faint">·</span>
                <span className="text-faint">{role.location}</span>
                <span aria-hidden="true" className="text-faint">·</span>
                <span className="text-faint">{role.type}</span>
              </span>

              {/* Summary + headline impact stay visible while collapsed. */}
              <span className="mt-3 block text-sm leading-relaxed text-muted measure">
                {role.summary}
              </span>

              {role.impact && (
                <span className="mt-4 inline-flex flex-wrap items-baseline gap-2 rounded-md border border-line bg-surface-2 px-3 py-2">
                  {role.impact.value && (
                    <span className="font-display text-xl tracking-tight text-accent-ink">
                      {role.impact.value}
                    </span>
                  )}
                  <span className="text-sm text-muted">{role.impact.label}</span>
                </span>
              )}
            </span>

            {/* The toggle: a ring that fills into a seal when open, its plus
                turning into a cross. */}
            <span
              aria-hidden="true"
              className={cn(
                "relative mt-1 grid size-11 shrink-0 place-items-center overflow-hidden rounded-full border transition-[background-color,border-color,color,transform] duration-500 ease-[var(--ease-out)]",
                open
                  ? "border-accent bg-accent text-accent-fg"
                  : "border-line-strong text-text group-hover/xp:scale-110 group-hover/xp:border-accent",
              )}
            >
              <span
                className={cn(
                  "grid place-items-center transition-transform duration-500 ease-[var(--ease-spring)]",
                  open && "rotate-[135deg]",
                )}
              >
                <Icon name="Plus" size={18} />
              </span>
            </span>
          </button>
        </h3>

        {/* Panel */}
        <m.div
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          hidden={!mounted}
          initial={false}
          animate={open ? "open" : "closed"}
          variants={{
            open: {
              height: "auto",
              transition: reduceMotion
                ? { duration: 0 }
                : { height: { type: "spring", stiffness: 170, damping: 26, mass: 0.9 } },
            },
            closed: {
              height: 0,
              transition: reduceMotion
                ? { duration: 0 }
                : { height: { duration: 0.45, ease: [0.65, 0, 0.35, 1], delay: 0.12 } },
            },
          }}
          onAnimationComplete={(state) => {
            if (state === "closed") setMounted(false);
          }}
          className="overflow-hidden"
        >
          <div className="relative border-t border-line px-5 pb-7 pt-6 sm:px-7">
            {/* An accent bar drawing down the panel's left edge. */}
            <m.span
              aria-hidden="true"
              variants={{
                open: { scaleY: 1, transition: { duration: 1.1, ease: EASE, delay: 0.1 } },
                closed: { scaleY: 0, transition: { duration: 0.2 } },
              }}
              className="absolute bottom-6 left-0 top-6 w-[3px] origin-top rounded-r-full bg-accent"
            />

            <m.ul variants={panelList} className="flex flex-col gap-4">
              <m.li variants={v(outcome)} className="label-mono text-faint">
                Key outcomes
              </m.li>
              {role.highlights.map((highlight, index) => (
                <m.li key={index} variants={v(outcome)} className="relative pb-4">
                  <div className="flex items-start gap-4">
                    <span className="w-7 shrink-0 font-display text-[1.375rem] italic leading-none text-accent-ink">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[0.9375rem] leading-relaxed text-text/85">
                      {highlight}
                    </span>
                  </div>
                  <m.span
                    aria-hidden="true"
                    variants={v(rule)}
                    className="absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-accent/60 via-line to-transparent"
                  />
                </m.li>
              ))}
            </m.ul>

            <m.p
              variants={v(outcome)}
              className="label-mono mb-3 mt-8 text-faint"
            >
              Stack
            </m.p>
            <m.ul variants={chipList} className="flex flex-wrap gap-2">
              {role.stack.map((tech) => (
                <m.li
                  key={tech}
                  variants={v(chip)}
                  className="label-mono rounded-full border border-line-accent bg-accent-soft px-3 py-1.5 text-accent-ink transition-colors duration-300 hover:bg-accent hover:text-accent-fg"
                >
                  {tech}
                </m.li>
              ))}
            </m.ul>
          </div>
        </m.div>
      </div>
    </div>
  );
}
