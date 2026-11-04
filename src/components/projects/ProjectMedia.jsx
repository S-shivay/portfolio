import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * Project cover.
 *
 * Renders a real screenshot through next/image when one is configured, and a
 * generated blueprint wireframe when it is not. The fallback is deliberate:
 * an obviously-schematic placeholder reads as "not filled in yet", whereas a
 * stock photo or a broken image reads as carelessness.
 *
 * `priority` is passed only for the first project, which is the LCP candidate
 * on most viewports once real images are in place.
 */
export function ProjectMedia({
  cover,
  index = 0,
  priority = false,
  className,
  /* Defaults to the projects-list layout, where the cover occupies 7 of 12
     columns. The case-study header renders it at full container width and must
     say so — an understated `sizes` makes the browser choose a source narrower
     than the slot, which it then upscales into a soft image.

     The values run wider than the slot on purpose. This frame is 16:10 but the
     screenshots behind it are roughly 2.25:1, so `object-cover` matches their
     height to the frame and lets the width overflow — about 1.4× the slot.
     `sizes` describes the width the image is *drawn* at, not the width of the
     box it is drawn into. */
  sizes = "(max-width: 1023px) 141vw, 88vw",
}) {
  const hasImage = Boolean(cover?.src);

  return (
    <div
      className={cn(
        "relative aspect-[16/10] w-full overflow-hidden rounded-md border border-line bg-surface-1",
        className,
      )}
    >
      {hasImage ? (
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          priority={priority}
          quality={92}
          sizes={sizes}
          className="object-cover object-top transition-transform duration-[600ms] ease-[var(--ease-out)] group-hover:scale-[1.04]"
        />
      ) : (
        <WireframePlaceholder index={index} alt={cover?.alt} />
      )}

      {/* Hairline inner edge, so the image sits *in* the frame rather than on it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-inset ring-line"
      />
    </div>
  );
}

/**
 * Schematic UI wireframe. Built from divs and design tokens rather than an
 * image file, so it costs no network request, adapts to the theme, and never
 * needs to be regenerated when the palette changes.
 */
function WireframePlaceholder({ index = 0, alt }) {
  // Three variants so consecutive projects do not look identical.
  const variant = index % 3;

  return (
    <div
      role="img"
      aria-label={
        alt && !alt.startsWith("[")
          ? alt
          : "Placeholder wireframe: project screenshot not added yet"
      }
      className="absolute inset-0 blueprint-grid"
    >
      <div className="absolute inset-0 flex flex-col p-[4%] transition-transform duration-[600ms] ease-[var(--ease-out)] group-hover:scale-[1.03]">
        {/* Window chrome */}
        <div className="mb-[3%] flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-line-strong" />
          <span className="size-2 rounded-full bg-line-strong" />
          <span className="size-2 rounded-full bg-line-strong" />
          <span className="ml-3 h-2 w-1/4 rounded-full bg-line" />
        </div>

        <div className="flex min-h-0 flex-1 gap-[3%]">
          {/* Sidebar */}
          {variant !== 1 && (
            <div className="hidden w-[18%] shrink-0 flex-col gap-[6%] rounded-sm border border-line bg-surface-2/60 p-[6%] sm:flex">
              <span className="h-2 w-3/4 rounded-full bg-accent/50" />
              <span className="h-2 w-full rounded-full bg-line-strong" />
              <span className="h-2 w-2/3 rounded-full bg-line-strong" />
              <span className="h-2 w-5/6 rounded-full bg-line" />
              <span className="h-2 w-1/2 rounded-full bg-line" />
            </div>
          )}

          {/* Main canvas */}
          <div className="flex min-w-0 flex-1 flex-col gap-[3%]">
            <div className="flex flex-col gap-[2.5%] rounded-sm border border-line bg-surface-2/40 p-[4%]">
              <span className="h-3 w-2/5 rounded-full bg-line-strong" />
              <span className="h-2 w-3/5 rounded-full bg-line" />
            </div>

            {variant === 2 ? (
              <div className="grid min-h-0 flex-1 grid-cols-3 gap-[3%]">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "rounded-sm border border-line",
                      i === 0 ? "bg-accent-soft" : "bg-surface-2/40",
                    )}
                  />
                ))}
              </div>
            ) : (
              <div className="flex min-h-0 flex-1 gap-[3%]">
                <div className="flex-[2] rounded-sm border border-line bg-surface-2/40" />
                <div className="flex flex-1 flex-col gap-[6%]">
                  <div className="flex-1 rounded-sm border border-line bg-accent-soft" />
                  <div className="flex-1 rounded-sm border border-line bg-surface-2/40" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Honest label — nobody should mistake this for a real screenshot. */}
      <span className="label-mono absolute bottom-3 right-3 rounded border border-line bg-bg/80 px-2 py-1 text-faint backdrop-blur-sm">
        Screenshot pending
      </span>
    </div>
  );
}
