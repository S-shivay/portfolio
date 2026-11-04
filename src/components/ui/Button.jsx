import Link from "next/link";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";

/**
 * Button / link primitive.
 *
 * Renders as <button>, next/link <Link>, or <a> depending on props — an
 * anchor never pretends to be a button and vice versa, so keyboard semantics
 * stay correct for free.
 *
 * Hover: a flood of colour rises from the bottom edge as a widening curve and
 * settles flat (`btn-flood` in globals.css), the label changes colour over
 * it and any trailing icon nudges forward. It is a transform on a child, so
 * the button never resizes and nothing around it shifts.
 */

const base =
  "btn group/btn relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-medium " +
  "whitespace-nowrap select-none cursor-pointer " +
  "transition-[background-color,border-color,color,box-shadow,opacity] duration-500 ease-[var(--ease-out)] " +
  "disabled:pointer-events-none disabled:opacity-45";

const variants = {
  /* Accent fill; the flood is the deep ink (ivory in dark contexts). */
  primary:
    "bg-accent text-accent-fg border border-transparent " +
    "hover:text-[var(--flood-fg)] " +
    "shadow-[0_14px_30px_-16px_var(--accent-glow)]",

  /* Hairline outline on the page; floods with the section's accent. */
  secondary:
    "btn-flood-accent bg-transparent text-text border border-line-strong " +
    "hover:border-transparent hover:text-accent-fg",

  /* Lowest emphasis — no chrome until hover. */
  ghost:
    "bg-transparent text-muted border border-transparent " +
    "hover:text-text hover:bg-surface-2",

  /* Inline text link with an animated underline. */
  link:
    "bg-transparent text-accent-ink border-0 rounded-xs px-0 gap-1.5 " +
    "underline decoration-1 underline-offset-4 decoration-[color-mix(in_oklab,var(--accent-ink)_40%,transparent)] " +
    "hover:decoration-[var(--accent-ink)]",
};

/* Every tappable size clears the 44px minimum target except `sm`, which is
   reserved for dense desktop-only controls. */
const sizes = {
  sm: "h-9 px-3.5 text-[0.8125rem]",
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-[3.25rem] px-7 text-base",
};

export function Button({
  as,
  href,
  variant = "secondary",
  size = "md",
  icon,
  iconPosition = "end",
  loading = false,
  disabled = false,
  external = false,
  download = false,
  className,
  children,
  ...props
}) {
  const classes = cn(
    base,
    variants[variant] ?? variants.secondary,
    variant === "link" ? "h-auto" : sizes[size] ?? sizes.md,
    className,
  );

  const flooded = variant === "primary" || variant === "secondary";

  const content = (
    <>
      {flooded && <span aria-hidden="true" className="btn-flood" />}

      {/* Reserves the label's space while loading so the button never resizes. */}
      <span
        className={cn(
          "inline-flex items-center gap-2 transition-opacity duration-150",
          loading && "opacity-0",
        )}
      >
        {icon && iconPosition === "start" ? (
          <Icon name={icon} size={size === "lg" ? 18 : 16} />
        ) : null}
        {children}
        {icon && iconPosition === "end" ? (
          <Icon
            name={icon}
            size={size === "lg" ? 18 : 16}
            className="transition-transform duration-500 ease-[var(--ease-out)] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
          />
        ) : null}
      </span>

      {loading ? (
        <span className="absolute inset-0 grid place-items-center">
          <Icon name="LoaderCircle" size={18} className="animate-spin" />
        </span>
      ) : null}
    </>
  );

  /* A download is a plain <a download>, never a <Link>: next/link would try to
     client-navigate to a binary, and `target="_blank"` would show the PDF in a
     tab instead of saving it. This branch comes first for that reason. */
  if (href && download) {
    return (
      <a href={href} download className={classes} {...props}>
        {content}
      </a>
    );
  }

  /* External links get the security attributes and a visually-hidden hint so
     screen-reader users know a new tab is opening. */
  if (href && (external || href.startsWith("http") || href.startsWith("mailto:"))) {
    return (
      <a
        href={href}
        className={classes}
        target={href.startsWith("mailto:") ? undefined : "_blank"}
        rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
        aria-disabled={disabled || undefined}
        {...props}
      >
        {content}
        {!href.startsWith("mailto:") && (
          <span className="sr-only">(opens in a new tab)</span>
        )}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  const Tag = as ?? "button";

  return (
    <Tag
      className={classes}
      disabled={Tag === "button" ? disabled || loading : undefined}
      aria-busy={loading || undefined}
      {...props}
    >
      {content}
    </Tag>
  );
}
