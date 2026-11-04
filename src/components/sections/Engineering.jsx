import {
  processHeading,
  processIntro,
  processSteps,
  architectureHeading,
  architectureIntro,
  architectureTree,
  architecturePrinciples,
} from "@/data/process";

import { cn } from "@/lib/cn";
import { Section } from "@/components/layout/Section";
import { Icon } from "@/components/ui/Icon";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ProcessRail } from "@/components/sections/ProcessRail";
import { ProcessScroller } from "@/components/sections/ProcessScroller";

/**
 * Engineering.
 *
 * Merges "From idea to production" and "I care about what happens behind the
 * UI" into one block. They are the same argument — how the work gets made —
 * and separating them into two full sections with two headers made the page
 * repeat itself without adding information.
 */
export function Engineering() {
  return (
    <Section
      id="engineering"
      eyebrow="How I build"
      heading={processHeading}
      intro={processIntro}
    >
      {/* Desktop: the steps scroll sideways while pinned. Phones and reduced
          motion: the vertical rail. Chosen in CSS, so the server sends the
          same HTML to everyone and only one of the two is ever displayed (and
          therefore read by assistive tech). */}
      <div className="lg:hidden lg:motion-reduce:block">
        <ProcessRail steps={processSteps} />
      </div>
      <ProcessScroller
        steps={processSteps}
        className="hidden lg:block lg:motion-reduce:hidden"
      />

      {/* Architecture */}
      <div className="mt-24 border-t border-line pt-16 md:mt-28 md:pt-20">
        <Reveal>
          <div className="mb-4 flex items-center gap-3">
            <span className="label-mono text-accent-ink">ARCHITECTURE</span>
            <span aria-hidden="true" className="h-px w-6 bg-line-strong" />
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h3 className="text-h2 font-normal tracking-tight text-text max-w-[18ch]">
            {architectureHeading}
          </h3>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-5 text-lead text-muted measure">
            {architectureIntro}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-3 lg:grid-cols-12">
          {/* Tree */}
          <Reveal className="lg:col-span-5">
            <div className="relative h-full overflow-hidden rounded-md card-accent border bg-surface-1 p-6 shadow-e1">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 blueprint-grid opacity-70"
                style={{ "--grid-size": "32px" }}
              />

              <p className="label-mono relative mb-5 text-faint">
                Project structure
              </p>

              {/* A real list, not ASCII art: the connectors are drawn with
                  borders so a screen reader announces a clean hierarchy
                  instead of a stream of pipe characters. */}
              <ul className="relative flex flex-col font-mono text-[0.8125rem]">
                {architectureTree.map((node, index) => (
                  <li
                    key={`${node.label}-${index}`}
                    style={{ paddingLeft: `${node.depth * 1.25}rem` }}
                    className="group/node flex items-center gap-2 py-1.5"
                  >
                    {node.depth > 0 && (
                      <span
                        aria-hidden="true"
                        className="h-px w-3 shrink-0 bg-line-strong"
                      />
                    )}
                    <span
                      className={cn(
                        "shrink-0",
                        node.accent ? "text-accent-ink" : "text-text",
                      )}
                    >
                      {node.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className="hidden h-px min-w-2 flex-1 bg-line sm:block"
                    />
                    <span className="hidden shrink-0 text-[0.6875rem] text-faint sm:block">
                      {node.note}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Principles */}
          <Stagger
            step={0.04}
            className="grid gap-3 sm:grid-cols-2 lg:col-span-7 lg:self-start"
          >
            {architecturePrinciples.map((principle) => (
              <StaggerItem key={principle.id}>
                <div
                  data-spotlight=""
                  className="relative flex h-full flex-col rounded-md card-accent border bg-surface-1 p-5 shadow-e1"
                >
                  <span className="grid size-9 place-items-center rounded-md bg-accent text-accent-fg shadow-e1">
                    <Icon name={principle.icon} size={16} />
                  </span>
                  <h4 className="mt-4 text-[0.9375rem] font-medium tracking-tight text-text">
                    {principle.title}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {principle.body}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </Section>
  );
}
