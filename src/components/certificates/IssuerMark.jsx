import Image from "next/image";

import { cn } from "@/lib/cn";

const SIZES = {
  sm: { box: "size-7 rounded-[7px] text-[0.625rem]", px: 28 },
  md: { box: "size-9 rounded-sm text-[0.6875rem]", px: 36 },
  lg: { box: "size-14 rounded-md text-base", px: 56 },
};

const MINOR_WORDS = new Set(["by", "of", "the", "and", "for", "in", "at", "on"]);

/**
 * The issuer's logo, or its initials when there is no logo.
 *
 * Initials are the honest fallback. A guessed or hand-drawn version of an
 * organisation's mark would look like the real thing and not be it, so the
 * mark stays typographic until an official logo file is added to the data.
 */
export function IssuerMark({ issuer, logo, size = "md", className }) {
  const spec = SIZES[size] ?? SIZES.md;

  if (logo) {
    return (
      <span
        className={cn(
          "relative grid shrink-0 place-items-center overflow-hidden border border-line bg-white p-1",
          spec.box,
          className,
        )}
      >
        <Image
          src={logo}
          alt=""
          width={spec.px * 2}
          height={spec.px * 2}
          className="h-full w-full object-contain"
        />
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center border border-line bg-surface-2 font-display font-semibold tracking-tight text-accent-ink",
        spec.box,
        className,
      )}
    >
      {initialsOf(issuer)}
    </span>
  );
}

/** "SkillUp by Simplilearn" → "SS", "Dainik Jagran" → "DJ", "Pro5" → "PR". */
export function initialsOf(name) {
  const words = name
    .replace(/\.(com|org|net|io|in|dev)\b/gi, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((word) => word && !MINOR_WORDS.has(word.toLowerCase()));

  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return (words[0] ?? name).slice(0, 2).toUpperCase();
}
