import { cn } from "@/lib/cn";

/**
 * Mono metadata chip — technology names, project types, years.
 * Purely presentational; never interactive.
 */
export function Tag({ children, variant = "default", className }) {
  return (
    <span
      className={cn(
        "label-mono inline-flex items-center rounded-full border px-2.5 py-1.5",
        variant === "default" && "border-line bg-surface-1 text-muted",
        variant === "accent" &&
          "border-line-accent bg-accent-soft text-accent-ink",
        variant === "bare" && "border-transparent bg-transparent text-faint px-0",
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * Availability indicator. The dot's pulse is decorative and is disabled by
 * the reduced-motion rule in globals.css; the text carries the meaning.
 */
export function AvailabilityPill({ label, className, compact = false }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-line bg-surface-1 py-1.5",
        compact ? "px-2.5" : "px-3",
        className,
      )}
    >
      <span className="relative grid size-2 place-items-center">
        <span className="absolute size-2 animate-ping rounded-full bg-positive opacity-60" />
        <span className="relative size-2 rounded-full bg-positive" />
      </span>
      <span className="label-mono text-muted">{label}</span>
    </span>
  );
}
