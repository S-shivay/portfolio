import { Fragment } from "react";
import { cn } from "@/lib/cn";
import { sectionNumber, sectionRegister } from "@/data/site";

const TOTAL = String(sectionRegister.length - 1).padStart(2, "0");

/**
 * The running head over every section, the way a printed page carries one:
 * the section's number in italic, its name, and a rule that draws itself
 * across the measure as the section arrives (scroll-driven, see
 * "SECTION HEADS" in globals.css), ending on the index position.
 */
export function RunningHead({ id, eyebrow, className }) {
  const number = sectionNumber(id);

  return (
    <div className={cn("flex items-center gap-4", className)}>
      {number && (
        <span className="font-display text-[1.625rem] italic leading-none text-accent-ink">
          ({number})
        </span>
      )}
      {eyebrow && <span className="label-mono text-text">{eyebrow}</span>}
      <span aria-hidden="true" className="section-rule h-px flex-1 bg-line-strong" />
      {number && (
        <span aria-hidden="true" className="label-mono hidden text-faint sm:block">
          {number} / {TOTAL}
        </span>
      )}
    </div>
  );
}

/**
 * A display heading whose words rise one after another out of their own
 * masks as it scrolls into view.
 *
 * Split by word, never by letter: each word stays whole, the spaces are real
 * text between them, so the heading reads, copies and finds exactly as typed.
 * The reveal is the same `data-reveal` system as everything else, so anything
 * already on screen at load is simply shown and nothing waits on JavaScript.
 *
 * By default the last word is set as the house emphasis — italic, vermilion —
 * which is how every section heading on the page ends. Pass `emphasis={false}`
 * to opt out, or a number to emphasise the last N words.
 */
export function SplitHeading({
  as: Tag = "h2",
  text,
  emphasis = 1,
  className,
  ...props
}) {
  if (typeof text !== "string") {
    return (
      <Tag className={className} {...props}>
        {text}
      </Tag>
    );
  }

  const words = text.split(" ");
  const emphasised = words.length > 1 && emphasis ? Math.min(emphasis, words.length - 1) : 0;
  const firstEm = words.length - emphasised;

  return (
    <Tag data-reveal="split" className={className} {...props}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="sw">
            <span className="sw-i" style={{ "--i": i }}>
              {i >= firstEm ? <em>{word}</em> : word}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
