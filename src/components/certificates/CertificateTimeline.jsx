"use client";

import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { SplitHeading } from "@/components/layout/SectionHead";

/**
 * The same certificates, read by year: oldest first, so it reads as growth
 * rather than as a list of dates.
 *
 * Only certificates with a date can be placed on it, and it only renders when
 * they span at least two years. One year is a single point, and a timeline of
 * one point is decoration.
 *
 * From `lg` it runs left to right, one column per year along a horizontal
 * rail; below that it stands upright with the rail down the left.
 *
 * It plays as a sequence when it scrolls into view (`learning-timeline` in
 * globals.css): the rail draws across, each year's node pops as the line
 * reaches it — its year rising above — then a stem drops and that year's
 * certificates fall in one after another. The latest year carries a pulsing
 * vermilion "now" beacon. Hovering a certificate lifts it and lights its year.
 *
 * Every delay is derived in CSS from `--f`, the year's fraction along the rail,
 * and `--j`, the entry's place in its year, so the sequence fits however many
 * years there are. It rides the site's `data-reveal` system: anything already
 * on screen at load is simply shown, and nothing waits on JavaScript.
 */
export function CertificateTimeline({ certificates, onOpen }) {
  const years = new Map();
  for (const certificate of certificates) {
    if (!certificate.issued) continue;
    const year = certificate.issued.year;
    if (!years.has(year)) years.set(year, []);
    years.get(year).push(certificate);
  }

  if (years.size < 2) return null;

  const rows = [...years.entries()]
    .sort(([a], [b]) => a - b)
    .map(([year, items]) => [
      year,
      items.sort((a, b) => a.issued.time - b.issued.time),
    ]);

  const dated = rows.reduce((sum, [, items]) => sum + items.length, 0);
  const first = rows[0][0];
  const last = rows[rows.length - 1][0];

  return (
    <section aria-labelledby="certificate-timeline-heading" className="mt-24 sm:mt-32">
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="label-mono mb-4 flex items-center gap-3 text-faint">
            <span aria-hidden="true" className="h-px w-10 bg-accent" />
            {first} — {last}
          </p>
          <SplitHeading
            as="h3"
            id="certificate-timeline-heading"
            text="Learning timeline."
            className="text-[clamp(2.25rem,1.4rem+3vw,3.75rem)] leading-none tracking-[-0.03em] text-text"
          />
        </div>
        <p className="font-display text-[1.125rem] italic text-muted">
          {dated} credentials across {rows.length} years — and counting.
        </p>
      </div>

      <ol
        data-reveal="timeline"
        className="learning-timeline relative lg:grid lg:grid-cols-[repeat(var(--years),minmax(0,1fr))] lg:gap-x-6"
        style={{ "--years": rows.length }}
      >
        {/* The rail: a faint track with the accent drawn along it. Vertical
            below lg, horizontal from lg. */}
        <span aria-hidden="true" className="lt-track">
          <span className="lt-fill" />
        </span>

        {rows.map(([year, items], rowIndex) => {
          const latest = rowIndex === rows.length - 1;
          /* Where this year's column starts along the rail, as a fraction —
             which is also how far through its draw the rail reaches it. */
          const f = rowIndex / rows.length;

          return (
            <li
              key={year}
              className="lt-year relative grid grid-cols-[5.25rem_1fr] pb-12 last:pb-2 sm:grid-cols-[6.5rem_1fr] lg:flex lg:flex-col lg:pb-0"
              style={{ "--f": f }}
            >
              {/* The year, rising into place as the rail reaches it. */}
              <p className="lt-label overflow-hidden pt-0.5 lg:pb-1">
                <span
                  className={cn(
                    "lt-year-num block font-display text-[1.5rem] leading-none tracking-tight tabular-nums sm:text-[2rem] lg:text-[2.75rem]",
                    latest ? "text-accent-ink" : "text-text",
                  )}
                >
                  {year}
                </span>
              </p>

              {/* The node. */}
              <span aria-hidden="true" className={cn("lt-node", latest && "lt-node-now")}>
                {latest && (
                  <>
                    <span className="lt-beacon" />
                    <span className="label-mono lt-now">Now</span>
                  </>
                )}
              </span>

              {/* The stem from the node down to this year's entries. */}
              <span aria-hidden="true" className="lt-stem" />

              <ul className="flex flex-col gap-3 pl-6 sm:pl-8 lg:mt-14 lg:pl-0 lg:pr-2">
                {items.map((certificate, j) => (
                  <li key={certificate.id} className="lt-entry-wrap" style={{ "--j": j }}>
                    <TimelineEntry certificate={certificate} onOpen={onOpen} />
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function TimelineEntry({ certificate, onOpen }) {
  const month =
    certificate.issued.label !== String(certificate.issued.year)
      ? certificate.issued.label
      : null;

  const body = (
    <>
      <span aria-hidden="true" className="lt-entry-bar" />
      <span className="flex items-start justify-between gap-3">
        <span className="block text-[0.9375rem] font-medium leading-snug text-text">
          {certificate.title}
        </span>
        {certificate.document && (
          <span
            aria-hidden="true"
            className="lt-entry-arrow grid size-7 shrink-0 place-items-center rounded-full bg-accent text-accent-fg"
          >
            <Icon name="ArrowUpRight" size={13} />
          </span>
        )}
      </span>
      <span className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8125rem] text-faint">
        <span>{certificate.issuer}</span>
        {month && (
          <>
            <span aria-hidden="true">·</span>
            <span className="label-mono">{month}</span>
          </>
        )}
      </span>
    </>
  );

  if (!certificate.document) {
    return <div className="lt-entry">{body}</div>;
  }

  return (
    <button
      type="button"
      onClick={() => onOpen(certificate.id)}
      data-cursor="view"
      data-cursor-label="Open"
      className="lt-entry w-full cursor-pointer text-left"
    >
      {body}
      <span className="sr-only"> — view certificate</span>
    </button>
  );
}
