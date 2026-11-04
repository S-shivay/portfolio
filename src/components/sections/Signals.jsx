import { beyondTheCode } from "@/data/about";
import { testimonials } from "@/data/signals";

import { Section } from "@/components/layout/Section";
import { Icon } from "@/components/ui/Icon";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Testimonials } from "@/components/sections/Testimonials";
import { Credentials } from "@/components/sections/Credentials";
import { EmailLink } from "@/components/contact/EmailLink";

/**
 * Signals.
 *
 * Merges "Beyond the code", credentials and testimonials into one band. Each
 * is short on its own; as separate full-width sections they added three
 * headers and a lot of scrolling for very little information.
 *
 * GitHub used to sit here as a quarter-width panel. It now has its own section
 * further up the page, reading live from the API, so the panel came out rather
 * than saying the same thing twice.
 *
 * The testimonial block degrades to a clearly-labelled empty state rather than
 * inventing quotes.
 */
export function Signals() {
  return (
    <Section
      id="signals"
      eyebrow="Beyond the code"
      heading="The part that isn't the framework."
      intro="Frameworks change every couple of years. These are the things that carry across all of them."
    >
      {/* Beyond the code */}
      <Stagger
        step={0.04}
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        {beyondTheCode.map((item) => (
          <StaggerItem key={item.id}>
            <div
              data-spotlight=""
              className="relative flex h-full flex-col rounded-md card-accent border bg-surface-1 p-5 shadow-e1"
            >
              <span className="grid size-9 place-items-center rounded-md bg-accent text-accent-fg shadow-e1">
                <Icon name={item.icon} size={16} />
              </span>
              <h3 className="mt-4 text-[0.9375rem] font-medium tracking-tight text-text">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {item.body}
              </p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>

      {/* Education and languages. Certifications have their own section. */}
      <Credentials />

      {/* Testimonials */}
      <Reveal className="mt-3">
        {testimonials.length > 0 ? (
          <div className="rounded-md card-accent border bg-surface-1 p-6 shadow-e1">
            <Testimonials items={testimonials} />
          </div>
        ) : (
          <ReferencesPanel />
        )}
      </Reveal>
    </Section>
  );
}

/**
 * References.
 *
 * What sits in the testimonial slot until real quotes exist.
 *
 * It is not a placeholder waiting to be replaced by invented praise — a
 * fabricated quote is the one item on a portfolio that a single reference call
 * disproves, and it puts every true claim around it in doubt. So this panel
 * does the job a testimonial is actually there to do: it tells a recruiter
 * corroboration is available and gives them a working way to ask for it.
 *
 * Once a real, attributable quote exists, add it to `testimonials` in
 * src/data/signals.js and the carousel replaces this automatically.
 */
function ReferencesPanel() {
  return (
    <div className="rounded-md card-accent border bg-surface-1 p-6 shadow-e1 sm:p-7">
      <span className="grid size-10 place-items-center rounded-md bg-accent text-accent-fg shadow-e1">
        <Icon name="Quote" size={18} />
      </span>

      <h3 className="mt-5 text-[1.0625rem] font-medium tracking-tight text-text">
        References
      </h3>

      <p className="mt-2 max-w-[68ch] text-sm leading-relaxed text-muted">
        There are no quotes here, and none invented to fill the space. The
        people I reported to at Sigma Staffing Solutions and Shokone Enterprises
        can speak to this work first-hand — how Job24 and the HRMS were scoped,
        built and shipped, and what I was like to work alongside while it
        happened.
      </p>

      <p className="mt-3 max-w-[68ch] text-sm leading-relaxed text-muted">
        Contact details available on request, at whatever point in the process
        they are useful to you.
      </p>

      <div className="pt-6">
        <EmailLink
          subject="Reference request"
          data-cursor="link"
          className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-md border border-line bg-surface-2 px-4 py-2.5 text-sm text-text transition-colors duration-200 hover:border-line-strong"
        >
          Request references
          <Icon name="ArrowUpRight" size={14} />
        </EmailLink>
      </div>
    </div>
  );
}
