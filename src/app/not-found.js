import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export const metadata = {
  title: "Page not found",
};

/**
 * 404.
 *
 * Kept in the same visual language as the rest of the site — a wrong URL is
 * still a first impression. Offers the two routes a lost visitor actually
 * wants: home, and the work.
 */
export default function NotFound() {
  return (
    <section className="relative flex min-h-[70svh] items-center overflow-hidden py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 blueprint-grid mask-fade-edges"
      />

      <div className="container-content relative">
        <p className="label-mono text-accent-ink">ERROR 404</p>

        <h1 className="mt-6 text-h1 font-semibold tracking-tight text-text max-w-[14ch]">
          This page doesn&apos;t exist.
        </h1>

        <p className="mt-6 text-lead text-muted measure-tight">
          The link may be out of date, or the URL might have a typo in it.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 text-[0.9375rem] font-medium text-accent-fg transition-colors duration-200 hover:bg-[color-mix(in_oklab,var(--accent)_88%,white)]"
          >
            <Icon name="ArrowRight" size={16} className="rotate-180" />
            Back home
          </Link>

          <Link
            href="/#work"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-line bg-surface-1 px-6 text-[0.9375rem] text-text transition-colors duration-200 hover:border-line-strong"
          >
            View the work
          </Link>
        </div>
      </div>
    </section>
  );
}
