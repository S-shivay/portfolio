"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";

/**
 * Floating section index for a case study, in the right-hand margin.
 *
 * A column of ticks, one per section; the one being read stretches and takes
 * the project's hue. Hovering the column reveals every section's name, so it
 * doubles as a jump menu for a long read. Wide screens only (xl), where the
 * margin has room for it, and it stays out of sight until the first section
 * reaches the reading line — the header does not need an index.
 *
 * "Being read" means crossing a thin band just above the middle of the
 * viewport, tracked with one IntersectionObserver rather than a scroll
 * listener. Jumps go through the anchor links, which Lenis already offsets
 * for the fixed nav.
 */
export function CaseStudyToc({ items }) {
  const [active, setActive] = useState(null);

  useEffect(() => {
    const visible = new Set();
    const order = items.map((item) => item.id);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const current = order.findLast((id) => visible.has(id)) ?? null;
        setActive(current);
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 },
    );

    for (const id of order) {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    }
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label="Case study sections"
      className={cn(
        "group/toc fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 transition-opacity duration-500 xl:block 2xl:right-8",
        active ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <ol className="flex flex-col items-end">
        {items.map((item) => {
          const current = item.id === active;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={current ? "location" : undefined}
                className="group/item flex items-center justify-end gap-3 py-[0.3rem] outline-none"
              >
                <span
                  className={cn(
                    "label-mono whitespace-nowrap rounded-sm bg-bg/85 px-1.5 py-0.5 backdrop-blur-sm transition-[opacity,transform,color] duration-300 ease-[var(--ease-out)]",
                    current ? "text-accent-ink" : "text-faint group-hover/item:text-text",
                    "translate-x-2 opacity-0 group-hover/toc:translate-x-0 group-hover/toc:opacity-100 group-focus-within/toc:translate-x-0 group-focus-within/toc:opacity-100",
                  )}
                >
                  <span className="tabular-nums">{item.num}</span>
                  <span className="ml-2">{item.label}</span>
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "block h-0.5 rounded-full transition-[width,background-color] duration-500 ease-[var(--ease-out)]",
                    current
                      ? "w-8 bg-accent"
                      : "w-3.5 bg-line-strong group-hover/item:w-5 group-hover/item:bg-text",
                  )}
                />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
