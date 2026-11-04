import Link from "next/link";

import { cn } from "@/lib/cn";
import { projectTone } from "@/lib/tones";
import { Icon } from "@/components/ui/Icon";
import { ProjectMedia } from "@/components/projects/ProjectMedia";
import { ProjectCover } from "@/components/projects/ProjectCover";
import { DisplacementCover } from "@/components/projects/DisplacementCover";

const isPlaceholder = (value) =>
  !value || typeof value !== "string" || value.startsWith("[");

/* Three features keep the card short enough to pin on a 720px-tall laptop
   screen; the case study carries the full list. */
const MAX_FEATURES = 3;

/**
 * A featured project, as one sheet in the scroll-driven stack.
 *
 * Details on the left, the product on the right. The cover has two jobs:
 *
 *  - It is the shared element for the page transition (`ProjectCover`):
 *    clicking the card grows this exact image into the case study's header.
 *  - Where the project has a second real screenshot, hovering the card
 *    sweeps it in with the displacement effect — the cover is the front door,
 *    the hover is a look inside.
 *
 * The whole card is one link (the stretched-link pattern from the old rows),
 * with the live-site link lifted above it as a separate target.
 */
export function ProjectStackCard({ project, index }) {
  const number = String(index + 1).padStart(2, "0");
  /* Each card takes the next hue in the palette; its case study wears the
     same one. */
  const tone = projectTone(index);
  const hasLive = !isPlaceholder(project.links?.live);
  const peek = project.caseStudy?.gallery?.[0];
  const features = project.features?.slice(0, MAX_FEATURES) ?? [];

  return (
    <article
      data-tone={tone}
      data-displace-host=""
      aria-labelledby={`project-${project.slug}-title`}
      className="group relative isolate overflow-hidden rounded-xl border border-line-accent bg-surface-1 shadow-e2"
    >
      {/* The card's colour: a wash of its hue from the top-left corner, so a
          stack of four reads as four different objects. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 90% at 0% 0%, var(--accent-soft), transparent 55%)",
        }}
      />

      <div className="grid lg:grid-cols-12">
        {/* ---- Details ----------------------------------------------- */}
        <div className="relative order-2 flex flex-col p-6 sm:p-8 lg:order-1 lg:col-span-5 lg:p-10">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="label-mono rounded-sm bg-accent px-2 py-1 text-accent-fg">
              PROJECT {number}
            </span>
            {!isPlaceholder(project.year) && (
              <span className="label-mono text-faint">{project.year}</span>
            )}
            {!isPlaceholder(project.kind) && (
              <>
                <span aria-hidden="true" className="size-1 rounded-full bg-line-strong" />
                <span className="label-mono text-faint">{project.kind}</span>
              </>
            )}
          </div>

          <h3
            id={`project-${project.slug}-title`}
            className="mt-6 font-display text-[clamp(2rem,3.6vw,3.25rem)] font-normal leading-[0.98] tracking-[-0.04em] text-text"
          >
            <Link
              href={`/work/${project.slug}`}
              transitionTypes={["nav-forward"]}
              className="after:absolute after:inset-0 after:z-[2] after:content-[''] focus-visible:outline-none"
            >
              <span className="bg-[linear-gradient(var(--accent),var(--accent))] bg-[length:0%_3px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 ease-[var(--ease-out)] group-hover:bg-[length:100%_3px]">
                {project.name}
              </span>
            </Link>
          </h3>

          <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted measure-tight">
            {project.tagline}
          </p>

          {features.length > 0 && (
            /* Dropped on short desktop windows, where the pinned card would
               otherwise run off the bottom of the screen; the case study
               carries the full list. */
            <ul className="mt-6 flex flex-col gap-2 [@media(min-width:1024px)_and_(max-height:760px)]:hidden">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-muted">
                  <Icon name="Check" size={14} className="mt-1 shrink-0 text-accent-ink" />
                  {feature}
                </li>
              ))}
            </ul>
          )}

          <ul className="mt-6 flex flex-wrap gap-1.5">
            {project.stack.slice(0, 6).map((tech) => (
              <li
                key={tech}
                className="label-mono rounded-full border border-line bg-surface-2 px-2.5 py-1.5 text-faint transition-colors duration-300 group-hover:border-line-accent group-hover:text-accent-ink"
              >
                {tech}
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-8">
            <span className="inline-flex items-center gap-2 font-display text-[0.9375rem] font-medium text-text">
              View case study
              <span className="grid size-8 place-items-center rounded-full bg-accent text-accent-fg transition-transform duration-300 ease-[var(--ease-spring)] group-hover:translate-x-1.5">
                <Icon name="ArrowRight" size={15} />
              </span>
            </span>

            {hasLive && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="link"
                className="tap-target relative z-[3] inline-flex items-center gap-1.5 text-sm text-muted transition-colors duration-200 hover:text-accent-ink"
              >
                Live site
                <Icon name="ArrowUpRight" size={14} />
                <span className="sr-only">for {project.name} (opens in a new tab)</span>
              </a>
            )}
          </div>
        </div>

        {/* ---- Product ----------------------------------------------- */}
        <div
          data-cursor="view"
          data-cursor-label="View case study"
          className="relative order-1 p-3 sm:p-4 lg:order-2 lg:col-span-7"
        >
          {/* The ghost numeral, in the space the details column leaves under
              the cover — where it used to sit it ran over the stack chips. */}
          <span
            aria-hidden="true"
            className="text-outline pointer-events-none absolute -bottom-5 right-6 hidden select-none font-display text-[clamp(6rem,10vw,9rem)] font-normal leading-none opacity-25 transition-opacity duration-500 group-hover:opacity-50 lg:block"
          >
            {number}
          </span>

          <ProjectCover slug={project.slug}>
            <DisplacementCover src={project.cover?.src} hoverSrc={peek?.src}>
              <ProjectMedia
                cover={project.cover}
                index={index}
                priority={index === 0}
                sizes="(max-width: 1023px) 141vw, 960px"
              />
            </DisplacementCover>
          </ProjectCover>

          {/* Tells a mouse user there is something under the cover. Hidden on
              touch, where there is no hover to reveal it. */}
          {project.cover?.src && peek?.label && (
            <span
              aria-hidden="true"
              className={cn(
                "label-mono pointer-events-none absolute right-7 top-7 z-[2] hidden items-center gap-2 rounded-full border border-white/20 bg-black/55 px-3 py-1.5 text-white backdrop-blur-md transition-opacity duration-300 sm:right-8 sm:top-8 pointer-fine:inline-flex",
                "group-hover:opacity-0",
              )}
            >
              <Icon name="MousePointerClick" size={12} />
              Hover · {peek.label}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
