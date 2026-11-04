"use client";

import { useRef } from "react";

import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";

/**
 * Category chips, built from whatever categories the data actually uses.
 *
 * Nothing here is a fixed list. A chip exists because at least one certificate
 * carries that category, and the whole row disappears when there are fewer than
 * two: a filter with one option filters nothing.
 */
export function CertificateFilters({ categories, active, total, onChange }) {
  if (categories.length < 2) return null;

  const options = [{ name: "all", label: "All", count: total }, ...categories];

  return (
    /* One swipeable row below `lg` rather than a wrapped block: seven chips
       wrapped to three lines on a phone and pushed the grid a screen down.
       The row bleeds to the screen edges so a cut-off chip reads as "more this
       way" instead of as a layout error. */
    <div
      role="group"
      aria-label="Filter by category"
      className="flex min-w-0 gap-2 max-lg:-mx-[var(--gutter)] max-lg:overflow-x-auto max-lg:px-[var(--gutter)] max-lg:py-1 max-lg:[scrollbar-width:none] lg:flex-wrap"
    >
      {options.map((option) => {
        const selected = option.name === active;
        return (
          <button
            key={option.name}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.name)}
            className={cn(
              "inline-flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-full border px-3.5 text-[0.8125rem] transition-[background-color,border-color,color] duration-200 pointer-coarse:h-11",
              selected
                ? "border-line-accent bg-accent-soft text-accent-ink"
                : "border-line bg-surface-1 text-muted hover:border-line-strong hover:text-text",
            )}
          >
            {option.label ?? option.name}
            <span
              className={cn(
                "label-mono tabular-nums",
                selected ? "text-accent-ink" : "text-faint",
              )}
            >
              {option.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Search. Matches title, issuer, skills, category and credential ID, every word
 * of the query in any of them, so "angular pro5" narrows rather than widens.
 */
export function CertificateSearch({ value, onChange }) {
  const inputRef = useRef(null);

  return (
    <div role="search" className="relative w-full lg:w-[25.5rem] lg:shrink-0">
      <label htmlFor="certificate-search" className="sr-only">
        Search certificates
      </label>
      <Icon
        name="Search"
        size={16}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint"
      />
      <input
        ref={inputRef}
        id="certificate-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape" && value) {
            event.preventDefault();
            onChange("");
          }
        }}
        placeholder="Search certificates, skills or organizations…"
        autoComplete="off"
        spellCheck={false}
        className="h-11 w-full text-ellipsis rounded-full border border-line bg-surface-1 pl-11 pr-11 text-[0.9375rem] text-text shadow-e1 transition-[border-color,box-shadow] duration-200 placeholder:text-faint hover:border-line-strong focus:border-line-accent focus:outline-none focus-visible:shadow-[0_0_0_3px_var(--accent-soft)] [&::-webkit-search-cancel-button]:appearance-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange("");
            inputRef.current?.focus();
          }}
          className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-faint transition-colors duration-200 hover:bg-surface-2 hover:text-text pointer-coarse:right-0 pointer-coarse:size-11"
        >
          <Icon name="X" size={15} label="Clear search" />
        </button>
      )}
    </div>
  );
}
