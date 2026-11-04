"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";
import { languageColor } from "@/data/github.mjs";

const percent = (share) => `${Math.round(share * 100)}%`;

/**
 * Language breakdown.
 *
 * The bar is the whole public profile in one line: every segment is a real
 * count of repositories, fetched rather than authored, and the widths are the
 * shares those counts produce.
 *
 * Interaction is deliberately two-surfaced. The bar itself is decorative and
 * pointer-only — it reacts to hover because that is where the eye already is —
 * while the legend beneath it is the real control: a list of buttons that are
 * tabbable, announce their pressed state, and drive exactly the same highlight.
 * Nobody has to hit a 4%-wide target to read the number it stands for.
 */
export function GithubLanguages({ languages, repoCount, title, note }) {
  const [active, setActive] = useState(null);
  const current = active === null ? null : languages[active];

  return (
    <div className="flex h-full flex-col">
      <h3 className="text-[1.0625rem] font-medium tracking-tight text-text">
        {title}
      </h3>

      {/* Readout. Fixed height so swapping between the summary and a selected
          language cannot shift the bar underneath it. */}
      <p className="mt-5 flex h-7 items-baseline gap-2">
        {current ? (
          <>
            <span
              aria-hidden="true"
              className="size-2.5 self-center rounded-full"
              style={{ background: languageColor(current.name) }}
            />
            <span className="font-display text-[1.375rem] font-medium leading-none tracking-tight text-text">
              {current.name}
            </span>
            <span className="label-mono text-faint tabular-nums">
              {current.count} {current.count === 1 ? "repo" : "repos"} ·{" "}
              {percent(current.share)}
            </span>
          </>
        ) : (
          <>
            <span className="font-display text-[1.375rem] font-medium leading-none tracking-tight text-text tabular-nums">
              {repoCount}
            </span>
            <span className="label-mono text-faint">
              repositories · {languages.length} languages
            </span>
          </>
        )}
      </p>

      {/* The bar. `aria-hidden` because the legend below states the same data
          in a form a screen reader can actually read out. */}
      <div
        aria-hidden="true"
        onPointerLeave={() => setActive(null)}
        className="mt-3 flex h-5 w-full gap-1"
      >
        {languages.map((language, index) => (
          <span
            key={language.name}
            onPointerEnter={() => setActive(index)}
            style={{
              width: `${language.share * 100}%`,
              background: languageColor(language.name),
            }}
            className={cn(
              "min-w-1.5 rounded-[3px] transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
              active !== null && active !== index
                ? "opacity-25"
                : "opacity-100",
              active === index && "scale-y-125",
            )}
          />
        ))}
      </div>

      {/* The legend, and the accessible version of the bar. One row per
          language rather than two columns: five rows is exactly the height
          this card needs to sit level with the profile beside it, and a row
          you can sweep down is easier to compare than a 2×3 block. */}
      <ul className="mt-5">
        {languages.map((language, index) => (
          <li key={language.name}>
            <button
              type="button"
              onPointerEnter={() => setActive(index)}
              onPointerLeave={() => setActive(null)}
              onFocus={() => setActive(index)}
              onBlur={() => setActive(null)}
              onClick={() => setActive(active === index ? null : index)}
              aria-pressed={active === index}
              data-cursor="link"
              className={cn(
                "flex w-full cursor-pointer items-center gap-3 rounded-sm px-2.5 py-2.5 text-left transition-colors duration-200",
                active === index ? "bg-accent-soft" : "hover:bg-surface-2",
              )}
            >
              <span
                aria-hidden="true"
                className="size-2.5 shrink-0 rounded-full"
                style={{ background: languageColor(language.name) }}
              />
              <span className="min-w-0 flex-1 truncate text-[0.9375rem] text-text">
                {language.name}
              </span>

              {/* A second, row-level reading of the same share. Tiny, but it
                  turns the list into a chart you can compare down a column
                  instead of five numbers you have to hold in your head. */}
              <span
                aria-hidden="true"
                className="hidden h-1 w-24 overflow-hidden rounded-full bg-surface-3 sm:block"
              >
                <span
                  className="block h-full rounded-full transition-[width] duration-300 ease-out motion-reduce:transition-none"
                  style={{
                    width: `${language.share * 100}%`,
                    background: languageColor(language.name),
                  }}
                />
              </span>

              <span className="label-mono w-10 shrink-0 text-right text-faint tabular-nums">
                {language.count}
              </span>
              <span className="label-mono w-9 shrink-0 text-right text-faint tabular-nums">
                {percent(language.share)}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <p className="mt-auto pt-6 text-[0.8125rem] leading-relaxed text-faint">
        {note}
      </p>
    </div>
  );
}
