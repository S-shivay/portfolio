"use client";

import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { scrollToTop } from "@/components/ui/smooth-scroll";

/**
 * A round "back to top" control: the arrow leaves through the top of the
 * disc on hover and a twin rises in from below to replace it.
 */
export function BackToTop({ className }) {
  return (
    <button
      type="button"
      onClick={scrollToTop}
      data-cursor="link"
      aria-label="Back to top"
      className={cn(
        "group relative grid size-12 cursor-pointer place-items-center overflow-hidden rounded-full border border-line-strong text-text transition-colors duration-300 hover:bg-text hover:text-bg",
        className,
      )}
    >
      <span className="block transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-y-[180%]">
        <Icon name="ArrowUp" size={18} />
      </span>
      <span
        aria-hidden="true"
        className="absolute translate-y-[180%] transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-y-0"
      >
        <Icon name="ArrowUp" size={18} />
      </span>
    </button>
  );
}
