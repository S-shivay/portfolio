"use client";

import { useLayoutEffect, useRef } from "react";

import { cn } from "@/lib/cn";
import { CertificateCard } from "@/components/certificates/CertificateCard";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

/**
 * The certificate grid.
 *
 * Four columns from `xl`, two from `sm`. Featured certificates span two
 * columns — and two rows at `xl` — and sit first, so with two of them the wide
 * layout is a pair of large documents side by side over a row of four, with no
 * gaps. That is the composition the data is built for, but nothing here
 * depends on the count: the row span means a filter that leaves one featured
 * card beside two small ones lets the small ones keep their natural height
 * instead of stretching to the large card's.
 *
 * Featured cards are not a separate block that filtering would have to
 * special-case; they are the same cards, placed larger.
 *
 * When a filter or search changes the set, cards that stay glide to their new
 * position and cards that arrive fade up. That is a FLIP done by hand: measure
 * every card before the update, measure again after, and play the difference
 * back with the Web Animations API. It costs no library. framer-motion's
 * layout animations need its full feature bundle, which this site
 * deliberately does not load. It also runs on the compositor, since only
 * transform and opacity animate.
 */
export function CertificateGrid({ items, onOpen }) {
  const listRef = useRef(null);
  const positions = useRef(new Map());
  const signature = items.map((item) => item.id).join("|");

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const origin = list.getBoundingClientRect();
    const nodes = [...list.children];
    const next = new Map();
    for (const node of nodes) {
      const rect = node.getBoundingClientRect();
      // Relative to the list, so a scroll between two filters is not
      // mistaken for every card having moved.
      next.set(node.dataset.id, { x: rect.left - origin.left, y: rect.top - origin.top });
    }

    const previous = positions.current;
    positions.current = next;

    // First render: nothing to animate from.
    if (previous.size === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let arrivals = 0;
    for (const node of nodes) {
      const before = previous.get(node.dataset.id);
      const after = next.get(node.dataset.id);

      if (before) {
        const dx = before.x - after.x;
        const dy = before.y - after.y;
        if (dx || dy) {
          node.animate(
            [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }],
            { duration: 460, easing: EASE },
          );
        }
      } else {
        node.animate(
          [
            { opacity: 0, transform: "translateY(10px) scale(0.985)" },
            { opacity: 1, transform: "none" },
          ],
          { duration: 360, delay: 60 + Math.min(arrivals, 6) * 40, easing: EASE, fill: "backwards" },
        );
        arrivals += 1;
      }
    }
  }, [signature]);

  return (
    <ul ref={listRef} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((certificate) => (
        <li
          key={certificate.id}
          data-id={certificate.id}
          className={cn(
            "min-w-0",
            certificate.featured && "sm:col-span-2 xl:row-span-2",
          )}
        >
          <CertificateCard
            certificate={certificate}
            featured={certificate.featured}
            onOpen={onOpen}
          />
        </li>
      ))}
    </ul>
  );
}
