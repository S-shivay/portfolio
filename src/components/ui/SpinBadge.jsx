import { useId } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";

/**
 * A round badge whose text runs around its rim and turns slowly — the
 * rotating seal of a printed poster. The centre is a vermilion disc with an
 * arrow; hovering turns the arrow and swells the disc.
 *
 * The ring of text is decoration (`aria-hidden`); the link's accessible name
 * is `label`. The rotation is a CSS animation, stopped by the reduced-motion
 * floor in globals.css.
 */
export function SpinBadge({ href, label, text, className }) {
  const pathId = useId();

  return (
    <a
      href={href}
      aria-label={label}
      data-cursor="link"
      className={cn(
        "spin-badge group relative grid size-36 shrink-0 place-items-center rounded-full",
        className,
      )}
    >
      <svg viewBox="0 0 160 160" aria-hidden="true" className="spin-badge-ring absolute inset-0 size-full">
        <defs>
          <path id={pathId} d="M80,80 m-63,0 a63,63 0 1,1 126,0 a63,63 0 1,1 -126,0" />
        </defs>
        <text className="fill-text font-mono text-[11px] uppercase tracking-[0.12em]">
          <textPath href={`#${pathId}`} textLength="392" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <span className="relative grid size-[3.75rem] place-items-center rounded-full bg-vermilion text-[#170a05] shadow-[0_14px_30px_-14px_var(--brand-vermilion)] transition-transform duration-500 ease-[var(--ease-spring)] group-hover:scale-110">
        <Icon
          name="ArrowDownRight"
          size={24}
          className="transition-transform duration-500 ease-[var(--ease-out)] group-hover:-rotate-45"
        />
      </span>
    </a>
  );
}
