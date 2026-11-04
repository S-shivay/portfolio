"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";

/**
 * Testimonial carousel.
 *
 * Built on native scroll-snap rather than a JavaScript transform track: it
 * works without JS, supports touch-drag and trackpad flicks for free, and the
 * arrow buttons are a progressive enhancement on top of a list that is already
 * scrollable and keyboard-reachable.
 *
 * The scroll container gets `tabindex="0"` and a group role so keyboard users
 * can scroll it directly with arrow keys, which is a browser requirement for
 * any scrollable region that is not otherwise focusable.
 */
export function Testimonials({ items }) {
  const trackRef = useRef(null);
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(false);

  const sync = useCallback(() => {
    const node = trackRef.current;
    if (!node) return;

    const maxScroll = node.scrollWidth - node.clientWidth;
    setCanScrollBack(node.scrollLeft > 8);
    setCanScrollForward(node.scrollLeft < maxScroll - 8);
  }, []);

  useEffect(() => {
    sync();
    const node = trackRef.current;
    if (!node) return;

    node.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      node.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  const scrollBy = (direction) => {
    const node = trackRef.current;
    if (!node) return;
    node.scrollBy({
      left: direction * node.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="label-mono text-faint">What people say</p>

        <div className="flex gap-2">
          <ArrowButton
            direction="back"
            disabled={!canScrollBack}
            onClick={() => scrollBy(-1)}
          />
          <ArrowButton
            direction="forward"
            disabled={!canScrollForward}
            onClick={() => scrollBy(1)}
          />
        </div>
      </div>

      <ul
        ref={trackRef}
        tabIndex={0}
        role="group"
        aria-label="Testimonials, scrollable"
        className="-mx-[var(--gutter)] flex snap-x snap-mandatory gap-3 overflow-x-auto px-[var(--gutter)] pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0"
      >
        {items.map((item) => (
          <li
            key={item.id}
            className="w-[min(24rem,85vw)] shrink-0 snap-start"
          >
            <figure className="flex h-full flex-col rounded-md card-accent border bg-surface-1 p-6 shadow-e1">
              <Icon
                name="Quote"
                size={20}
                className="shrink-0 text-accent-ink"
              />

              <blockquote className="mt-4 flex-1 text-[0.9375rem] leading-relaxed text-muted">
                {item.quote}
              </blockquote>

              <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                <Avatar name={item.name} src={item.avatar} />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-text">
                    {item.name}
                  </span>
                  <span className="block truncate text-[0.8125rem] text-faint">
                    {item.role}
                    {item.company ? ` · ${item.company}` : ""}
                  </span>
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ArrowButton({ direction, disabled, onClick }) {
  const isBack = direction === "back";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isBack ? "Previous testimonials" : "Next testimonials"}
      className={cn(
        "grid size-10 cursor-pointer place-items-center rounded-full card-accent border bg-surface-1 text-muted",
        "transition-colors duration-200 hover:border-line-strong hover:text-text",
        "disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-line disabled:hover:text-muted",
      )}
    >
      <Icon name="ArrowRight" size={16} className={cn(isBack && "rotate-180")} />
    </button>
  );
}

/** Initials monogram instead of a stock avatar when no photo is provided. */
function Avatar({ name, src }) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- small, fixed-size, already-optimised author photo
      <img
        src={src}
        alt=""
        width={40}
        height={40}
        loading="lazy"
        className="size-10 shrink-0 rounded-full border border-line object-cover"
      />
    );
  }

  const initials = name
    .replace(/[[\]]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <span
      aria-hidden="true"
      className="grid size-10 shrink-0 place-items-center rounded-full border border-line-accent bg-accent-soft"
    >
      <span className="label-mono text-accent-ink">{initials}</span>
    </span>
  );
}
