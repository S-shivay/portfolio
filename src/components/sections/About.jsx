import { aboutHeading, aboutIntro, capabilities } from "@/data/about";
import { cn } from "@/lib/cn";
import { Section } from "@/components/layout/Section";
import { Icon } from "@/components/ui/Icon";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";

/**
 * About — a bento grid of capabilities rather than a wall of prose.
 *
 * Cards are non-interactive by design: they carry information, not actions.
 * They therefore get no cursor-pointer and no focus ring, which keeps the
 * keyboard tab order limited to things that actually do something.
 */
export function About() {
  return (
    <Section
      id="about"
      eyebrow="About"
      heading={aboutHeading}
      intro={aboutIntro}
      fillIntro
    >
      <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((item) => (
          <StaggerItem
            key={item.id}
            className={cn(item.span === "wide" && "lg:col-span-2")}
          >
            <CapabilityCard item={item} />
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}

function CapabilityCard({ item }) {
  return (
    <div
      data-spotlight=""
      className={cn(
        "group/card relative flex h-full flex-col overflow-hidden rounded-md border bg-surface-1 p-6",
        "card-accent shadow-e1",
      )}
    >
      {/* Subtle grid wash that strengthens on hover — no transform, so nothing
          around the card shifts. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 blueprint-grid opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
        style={{ "--grid-size": "28px" }}
      />

      <div className="relative flex items-start justify-between gap-4">
        {/* Solid accent fill rather than a tinted outline. --accent-fg is
            near-black in both themes and every section hue was checked against
            it: the worst case is 6.12:1, so the glyph clears AA on all nine. */}
        <span className="grid size-10 shrink-0 place-items-center rounded-md bg-accent text-accent-fg shadow-e1">
          <Icon name={item.icon} size={18} />
        </span>
        <span className="label-mono pt-1 text-right text-faint">
          {item.detail}
        </span>
      </div>

      <h3 className="relative mt-5 text-[1.0625rem] font-medium tracking-tight text-text">
        {item.title}
      </h3>

      <p className="relative mt-2.5 text-sm leading-relaxed text-muted">
        {item.body}
      </p>
    </div>
  );
}
