import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/layout/SectionHead";

const isPlaceholder = (value) =>
  !value || typeof value !== "string" || value.startsWith("[");

/**
 * Archive of smaller builds.
 *
 * A compact table rather than more large cards: these are real, shippable work
 * worth listing, but giving each one a full editorial row would dilute the
 * featured projects the showcase is actually built around.
 *
 * Uses a semantic table so the row structure is announced properly, with the
 * project name as the row header. Rows rise in one after another; hovering a
 * row sweeps the section's colour across it, slides the name forward and
 * turns the arrow (`archive-row` in globals.css).
 *
 * `relative z-10` keeps it above the pinned project stack that ends just
 * before it — positioned (sticky) cards otherwise paint over in-flow content.
 */
export function ProjectArchive({ projects }) {
  if (!projects || projects.length === 0) return null;

  return (
    <div className="relative z-10 border-t border-line pt-16 md:pt-24">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <SplitHeading
          as="h3"
          text="Also built."
          className="text-[clamp(2.25rem,1.4rem+3vw,3.75rem)] leading-none tracking-[-0.03em] text-text"
        />
        <Reveal delay={0.1}>
          <p className="max-w-[34ch] text-[0.9375rem] text-muted">
            Smaller client projects and sites still in production.
          </p>
        </Reveal>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-left">
          <caption className="sr-only">
            Archive of additional projects, with technologies and links
          </caption>
          <thead>
            <tr className="border-b border-line-strong">
              <th scope="col" className="label-mono py-3 pl-3 pr-4 text-faint">
                Project
              </th>
              <th scope="col" className="label-mono py-3 pr-4 text-faint">
                Stack
              </th>
              <th scope="col" className="label-mono py-3 pr-4 text-faint">
                Year
              </th>
              <th scope="col" className="label-mono py-3 pr-3 text-right text-faint">
                Links
              </th>
            </tr>
          </thead>
          <Stagger as="tbody" step={0.08}>
            {projects.map((project, index) => {
              const hasLive = !isPlaceholder(project.links?.live);

              return (
                <StaggerItem
                  as="tr"
                  key={project.slug}
                  y={18}
                  className="archive-row group border-b border-line last:border-b-0"
                >
                  <th scope="row" className="py-5 pl-3 pr-4 font-normal align-top">
                    <span className="flex items-baseline gap-3">
                      <span aria-hidden="true" className="font-display text-[0.9375rem] italic text-accent-ink">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>
                        <Link
                          href={`/work/${project.slug}`}
                          transitionTypes={["nav-forward"]}
                          data-cursor="link"
                          className="tap-target inline-block font-display text-[1.25rem] leading-tight text-text transition-[transform,color] duration-500 ease-[var(--ease-out)] group-hover:translate-x-1.5 group-hover:text-accent-ink"
                        >
                          {project.name}
                        </Link>
                        <span className="mt-1.5 block max-w-[40ch] text-[0.8125rem] leading-relaxed text-faint">
                          {project.tagline}
                        </span>
                      </span>
                    </span>
                  </th>

                  <td className="py-5 pr-4 align-top">
                    <ul className="flex flex-wrap gap-1.5">
                      {project.stack.slice(0, 4).map((tech) => (
                        <li
                          key={tech}
                          className="label-mono rounded-full border border-line bg-surface-1 px-2.5 py-1 text-faint transition-colors duration-300 group-hover:border-line-accent group-hover:text-accent-ink"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </td>

                  <td className="label-mono py-5 pr-4 align-top text-faint">
                    {project.year}
                  </td>

                  <td className="py-5 pr-3 align-top">
                    <div className="flex items-center justify-end gap-4">
                      {hasLive && (
                        <a
                          href={project.links.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-cursor="link"
                          className="link-draw tap-target inline-flex items-center gap-1 text-sm text-muted hover:text-text"
                        >
                          Live
                          <Icon name="ArrowUpRight" size={13} />
                          <span className="sr-only">
                            site for {project.name} (opens in a new tab)
                          </span>
                        </a>
                      )}
                      <Link
                        href={`/work/${project.slug}`}
                        transitionTypes={["nav-forward"]}
                        className="tap-target inline-flex items-center gap-2 text-sm text-muted transition-colors duration-200 hover:text-text"
                      >
                        Details
                        <span className="grid size-8 place-items-center rounded-full border border-line-strong transition-[background-color,border-color,color,transform] duration-500 ease-[var(--ease-out)] group-hover:-rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-fg">
                          <Icon name="ArrowRight" size={13} />
                        </span>
                        <span className="sr-only">about {project.name}</span>
                      </Link>
                    </div>
                  </td>
                </StaggerItem>
              );
            })}
          </Stagger>
        </table>
      </div>
    </div>
  );
}
