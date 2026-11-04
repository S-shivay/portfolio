"use client";

import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/cn";

/**
 * Dark ↔ light switch.
 *
 * Both glyphs are always in the DOM, cross-fading between states, so the
 * button never changes size and nothing around it shifts. The accessible name
 * describes the *action*, and `aria-pressed` communicates current state, so a
 * screen-reader user knows both what will happen and where they are.
 */
export function ThemeToggle({ className, size = 40 }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      style={{ width: size, height: size }}
      className={cn(
        "relative grid shrink-0 cursor-pointer place-items-center rounded-full",
        "border border-line bg-surface-1 text-muted",
        "transition-colors duration-200 hover:border-line-strong hover:text-text",
        className,
      )}
    >
      <span className="relative block size-[18px]">
        {/* Sun */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className={cn(
            "absolute inset-0 size-[18px] transition-[opacity,transform] duration-200 ease-[var(--ease-out)]",
            isDark ? "scale-75 opacity-0" : "scale-100 opacity-100",
          )}
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>

        {/* Moon */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            "absolute inset-0 size-[18px] transition-[opacity,transform] duration-200 ease-[var(--ease-out)]",
            isDark ? "scale-100 opacity-100" : "scale-75 opacity-0",
          )}
          aria-hidden="true"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </span>
    </button>
  );
}
