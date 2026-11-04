import { cn } from "@/lib/cn";
import { Reveal } from "@/components/motion/Reveal";
import { RunningHead, SplitHeading } from "@/components/layout/SectionHead";

/**
 * Section shell — the editorial frame every block on the page shares.
 *
 * A running head (italic number, name, a rule that draws across), then the
 * heading set large with its last word in the house italic, and the intro
 * standing in the right-hand column beside it like a standfirst.
 *
 * It also carries the section's colour. `data-tone` redefines the accent
 * variables for everything inside, and since the Tailwind theme is mapped with
 * `@theme inline`, every accent utility in every descendant resolves to those
 * variables at use time. One attribute here re-hues an entire section's cards,
 * chips, icons, borders and buttons without touching a single child component.
 *
 * `surface="ink"` goes further and swaps the paper: the section becomes a
 * full-bleed sheet of deep emerald with ivory type — every token inside flips
 * to its dark value — and on wider screens it unrolls from a rounded, inset
 * card to the full width as it scrolls in. The page alternates paper and ink
 * so its length reads as chapters.
 *
 * `tone` defaults to `id` because the section ids and the tone names are the
 * same set by design. Passing `null` opts out and inherits the root accent.
 */
export function Section({
  id,
  tone,
  surface,
  eyebrow,
  heading,
  intro,
  headingLevel: HeadingTag = "h2",
  /* For sections that render their own heading instead of `heading`. */
  labelledBy,
  align = "start",
  wide = false,
  bordered = true,
  wash = true,
  extraWash = false,
  /* The intro inks in line by line as it is read (scroll-driven). */
  fillIntro = false,
  className,
  headerClassName,
  headingClassName,
  children,
}) {
  const resolvedTone = tone === undefined ? id : tone;
  const isInk = surface === "ink";
  const centred = align === "center";

  return (
    <section
      id={id}
      data-tone={resolvedTone || undefined}
      data-surface={surface || undefined}
      data-sheet={isInk ? "" : undefined}
      /* Lets RevealRuntime pause this section's drifting washes while it is off
         screen. */
      data-ambient=""
      aria-labelledby={heading ? `${id}-heading` : labelledBy}
      className={cn(
        /* `isolate` keeps the wash's stacking contained. */
        "relative isolate",
        /* `clip` rather than `hidden`: `overflow-x: hidden` would force the
           block axis to `auto`, turn the section into a scroll container and
           break `position: sticky` (and scroll timelines) inside it. */
        "overflow-x-clip",
        bordered && !isInk && "border-t border-line",
        className,
      )}
      style={{ paddingBlock: "var(--section-y)" }}
    >
      {wash && <div aria-hidden="true" className="section-wash" />}
      {extraWash && <div aria-hidden="true" className="wash-extra" />}
      {isInk && <div aria-hidden="true" className="ink-mark" />}

      {/* `relative` is load-bearing: the wash is absolutely positioned, so
          without a stacking position here it would paint over the content. */}
      <div
        className={cn(
          "relative z-10",
          wide ? "container-wide" : "container-content",
        )}
      >
        {(eyebrow || heading) && (
          <header className={cn("mb-14 md:mb-20", headerClassName)}>
            <RunningHead id={id} eyebrow={eyebrow} />

            <div
              className={cn(
                "mt-10 md:mt-14",
                centred
                  ? "flex flex-col items-center text-center"
                  : intro && "grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-10",
              )}
            >
              {heading && (
                <SplitHeading
                  as={HeadingTag}
                  id={`${id}-heading`}
                  text={heading}
                  className={cn(
                    "text-h2 text-text text-balance",
                    centred ? "max-w-[18ch]" : "max-w-[15ch] lg:col-span-8",
                    headingClassName,
                  )}
                />
              )}

              {intro && (
                <Reveal
                  delay={0.15}
                  className={cn(
                    centred ? "mt-6" : "lg:col-span-4 lg:pt-3",
                  )}
                >
                  <p
                    className={cn(
                      "text-lead text-muted measure",
                      centred && "mx-auto",
                      fillIntro && "ink-fill",
                    )}
                  >
                    {fillIntro ? <span>{intro}</span> : intro}
                  </p>
                </Reveal>
              )}
            </div>
          </header>
        )}

        {children}
      </div>
    </section>
  );
}

/** Standalone container for content that does not need the section header. */
export function Container({ wide = false, className, children }) {
  return (
    <div className={cn(wide ? "container-wide" : "container-content", className)}>
      {children}
    </div>
  );
}
