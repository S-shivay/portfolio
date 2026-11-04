import { cn } from "@/lib/cn";

/**
 * Line-by-line mask reveal for headlines.
 *
 * Lines are supplied explicitly rather than split from a single string at
 * runtime. Automatic word/character splitting shatters the text node, which
 * makes screen readers announce fragments and breaks text selection — a
 * common and very visible mistake in "animated portfolio" sites.
 *
 * Here each line stays one intact text node inside a clipping wrapper, so the
 * accessible name of the heading is unchanged.
 *
 * The movement is a CSS keyframe rather than an animation library. These fire
 * once on mount and never again, so there was nothing for JavaScript to decide
 * — and as plain CSS this file no longer needs to be a client component at
 * all. The hero's headline and its supporting copy are now server-rendered
 * markup with no JavaScript attached, which matters because the hero is the
 * first thing a phone has to paint. Reduced motion is honoured in the
 * stylesheet alongside every other animation on the site.
 */
export function TextReveal({
  lines,
  as: Tag = "h1",
  className,
  lineClassName,
  delay = 0,
  step = 0.08,
  duration = 0.7,
  ...props
}) {
  return (
    <Tag className={className} {...props}>
      {lines.map((line, i) => (
        // `pb-[0.12em]` keeps descenders (g, y, p) from being clipped by the mask.
        <span key={i} className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
          <span
            data-enter="line"
            className={cn("block", lineClassName)}
            style={{
              "--enter-delay": `${Math.round((delay + i * step) * 1000)}ms`,
              "--enter-dur": `${Math.round(duration * 1000)}ms`,
            }}
          >
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}

/** Simple fade-and-rise for supporting copy beneath a TextReveal heading. */
export function FadeIn({
  children,
  delay = 0,
  y = 10,
  duration = 0.5,
  as: Tag = "div",
  className,
}) {
  return (
    <Tag
      data-enter=""
      className={className}
      style={{
        "--enter-y": `${y}px`,
        "--enter-delay": `${Math.round(delay * 1000)}ms`,
        "--enter-dur": `${Math.round(duration * 1000)}ms`,
      }}
    >
      {children}
    </Tag>
  );
}
