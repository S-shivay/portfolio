import { featuredProjects, archiveProjects } from "@/data/projects";
import { Section } from "@/components/layout/Section";
import { RunningHead } from "@/components/layout/SectionHead";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectArchive } from "@/components/projects/ProjectArchive";
import { ProjectStackCard } from "@/components/projects/ProjectStackCard";
import { WorkTrail } from "@/components/projects/WorkTrail";
import { StickyStack, StickyStackItem } from "@/components/ui/skiper-ui/skiper16";
import { AssembleText } from "@/components/ui/skiper-ui/skiper31";

const HEADING = "Products, not just pages.";

/**
 * Featured work — the visual centre of the page.
 *
 * Three pieces of motion, each doing one job:
 *
 *  1. The header. The heading assembles letter by letter as it scrolls in
 *     (Skiper 31), and moving the pointer across it trails real screenshots
 *     from the case studies (Vengeance UI image-trail).
 *  2. The stack. Each project is a full card that pins and stacks over the
 *     last (Skiper 16): the one being read sits in front, the ones already
 *     read recede behind it. Below `lg` they are a plain sequence.
 *  3. The cards. Hovering one sweeps a second screenshot in with a WebGL
 *     displacement, and clicking it morphs the cover into the case study.
 *
 * Still server-rendered: every name, tagline, feature and technology is in
 * the initial HTML. The client pieces only move what is already there.
 */
export function Projects() {
  if (featuredProjects.length === 0) return null;

  /* The trail draws from every real screenshot in the case studies. */
  const trailImages = featuredProjects.flatMap(
    (project) => project.caseStudy?.gallery ?? [],
  );

  return (
    <Section id="work" labelledBy="work-heading" className="pb-0" extraWash>
      <WorkTrail images={trailImages} className="-mx-[var(--gutter)] px-[var(--gutter)] pb-16 pt-2 md:pb-20">
        <header>
          <RunningHead id="work" eyebrow="Selected work" className="mb-10 md:mb-14" />

          <AssembleText
            id="work-heading"
            text={HEADING}
            className="font-display text-[clamp(2.9rem,8.4vw,8.25rem)] font-normal leading-[0.95] tracking-[-0.035em] text-text"
          />

          <Reveal delay={0.1}>
            <p className="mt-7 text-lead text-muted measure">
              Recruitment platforms, HR systems and payment portals — mostly
              Angular, one full-stack React build. Each opens into a case study
              covering the architecture, the tradeoffs and the result.
            </p>
          </Reveal>
        </header>
      </WorkTrail>

      <StickyStack count={featuredProjects.length}>
        {featuredProjects.map((project, index) => (
          <StickyStackItem
            key={project.slug}
            index={index}
            /* Centred in the viewport (a card is ~34rem tall), but never
               higher than just under the nav on a short laptop screen. */
            top="max(6.5rem, calc(50svh - 18rem))"
            offset="1.5rem"
            className="mb-6 rounded-xl lg:mb-0"
          >
            <ProjectStackCard project={project} index={index} />
          </StickyStackItem>
        ))}
      </StickyStack>

      {/* Clear space after the stack releases, and above it in paint order
          (the pinned cards are positioned). */}
      <div className="relative z-10 pt-20 md:pt-32">
        <ProjectArchive projects={archiveProjects} />
      </div>
    </Section>
  );
}
