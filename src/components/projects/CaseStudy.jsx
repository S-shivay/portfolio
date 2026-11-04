import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/cn";
import { projectTone } from "@/lib/tones";
import { Icon } from "@/components/ui/Icon";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { CountUp } from "@/components/motion/CountUp";
import { ProjectMedia } from "@/components/projects/ProjectMedia";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { ProjectCover } from "@/components/projects/ProjectCover";
import { CaseStudyToc } from "@/components/projects/CaseStudyToc";
import { CaseStudyCommandDemo } from "@/components/projects/CaseStudyCommandDemo";
import { CaseStudyPortalExplorer } from "@/components/projects/CaseStudyPortalExplorer";
import {
  AccessMap,
  ArchitectureMap,
  ByTheNumbers,
  EventJourney,
  FeatureAtlas,
  LifecycleTimeline,
  ProjectRecord,
  StackLedger,
  StatusPipeline,
  TaxYearFlow,
} from "@/components/projects/CaseStudyDetail";
import { hrmsDetail } from "@/data/hrms-detail";
import { job24Detail } from "@/data/job24-detail";

/* The longer sections some case studies carry, beyond the shared fields. */
const DETAILS = { job24: job24Detail, hrms: hrmsDetail };

const isPlaceholder = (value) =>
  !value || typeof value !== "string" || value.startsWith("[");

const TITLES = {
  overview: "Overview",
  record: "Project record",
  problem: "The problem",
  role: "My role",
  portals: "Portals",
  features: "What it does",
  palette: "Command palette",
  lifecycle: "Lifecycle timeline",
  tax: "Tax year",
  approach: "Approach",
  architecture: "Architecture",
  decisions: "Technical decisions",
  challenges: "Challenges",
  performance: "Performance",
  access: "Routes and permissions",
  numbers: "By the numbers",
  result: "Result",
  stack: "Tech stack",
};

/* Header entrance: each piece rises in after the one above it. A plain
   keyframe gated on `data-motion` (see globals.css), so it needs no observer
   and the header is fully visible before any JavaScript runs. */
const enter = (ms) => ({ "--enter-delay": `${ms}ms` });

/**
 * Case study page body.
 *
 * Laid out as an editorial two-column read: a sticky mono label in the left
 * margin, the prose in a measured column on the right. Long-form content stays
 * within ~68 characters per line at every width.
 *
 * Motion, almost all of it CSS scroll-driven animation (the CASE STUDY MOTION
 * block in globals.css) — compositor-run, no scroll listeners, absent where
 * unsupported and under reduced motion, never hiding server-rendered content:
 *
 *  - the page wears its project's hue, the same one as its card on the home page
 *  - a reading-progress bar; the header drifts up and fades as you leave it
 *  - the cover scales up into place as it arrives
 *  - each section's sticky label carries a rail that fills as it is read
 *  - the overview's lead paragraph inks in, line by line, with scroll
 *  - challenges hang off a timeline that draws itself down the page
 *  - the gallery's title slides past, and its tiles wipe open
 *  - cards lean toward the pointer; the next-project band floods with the next
 *    project's colour from wherever the pointer enters it
 */
export function CaseStudy({ project, index, next, nextIndex }) {
  const study = project.caseStudy;
  const detail = DETAILS[project.slug];
  const number = String(index + 1).padStart(2, "0");

  const hasLive = !isPlaceholder(project.links?.live);
  const hasRepo = !isPlaceholder(project.links?.github);
  const metrics = study.performance?.metrics ?? [];
  const techniques = study.performance?.techniques ?? [];
  const budgets = study.performance?.budgets ?? [];
  const gallery = study.gallery ?? [];
  const stats = study.stats ?? [];
  const featureGroups = study.featureGroups ?? [];
  const stackGroups = study.stackGroups ?? [];

  /* Block numbers follow the blocks that actually render, so a study without
     decisions or a feature breakdown still counts 01, 02, 03 with no gaps. */
  const blocks = [
    "overview",
    detail?.record && "record",
    "problem",
    "role",
    detail?.portals && "portals",
    (detail?.features || featureGroups.length > 0) && "features",
    detail?.palette && "palette",
    detail?.lifecycle && "lifecycle",
    detail?.taxYear && "tax",
    study.approach && "approach",
    detail?.architecture && "architecture",
    study.decisions?.length > 0 && "decisions",
    study.challenges?.length > 0 && "challenges",
    "performance",
    detail?.access && "access",
    detail?.numbers && "numbers",
    "result",
    "stack",
  ].filter(Boolean);
  const num = (key) => String(blocks.indexOf(key) + 1).padStart(2, "0");

  const tocItems = [
    ...blocks.map((key) => ({ id: key, num: num(key), label: TITLES[key] })),
    ...(gallery.length > 0 ? [{ id: "interface", num: "UI", label: "Interface" }] : []),
  ];

  /* The overview's first paragraph is the lead, set larger and inked in on
     scroll; the rest of it reads as ordinary prose. */
  const [lead, ...overviewRest] = study.overview.split(/\n{2,}/).filter(Boolean);
  const nameWords = project.name.split(" ");

  return (
    <article data-tone={projectTone(index)}>
      <CaseStudyToc items={tocItems} />

      {/* ---- Header ------------------------------------------------------ */}
      <header className="relative isolate overflow-hidden border-b border-line pb-14 pt-32 md:pt-40">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 blueprint-grid mask-fade-edges"
        />
        {/* Two slow glows in the project's hue, behind the grid. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="cs-aurora cs-aurora-a" />
          <div className="cs-aurora cs-aurora-b" />
        </div>

        <div className="cs-header-inner container-content relative">
          <div data-enter="" style={enter(0)}>
            <Link
              href="/#work"
              transitionTypes={["nav-back"]}
              /* If the home page is behind us in this tab, go back to it, to
                 the card that was clicked; see lib/route-history. */
              data-return-to="/"
              data-cursor="link"
              className="group/back inline-flex items-center gap-2 text-sm text-muted transition-colors duration-200 hover:text-text"
            >
              <Icon
                name="ArrowRight"
                size={14}
                className="rotate-180 transition-transform duration-300 ease-[var(--ease-out)] group-hover/back:-translate-x-1"
              />
              All projects
            </Link>
          </div>

          <div
            data-enter=""
            style={enter(60)}
            className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2"
          >
            <span className="label-mono rounded-sm bg-accent px-2 py-1 text-accent-fg">
              PROJECT {number}
            </span>
            <span aria-hidden="true" className="h-px w-5 bg-line-strong" />
            {!isPlaceholder(project.year) && (
              <span className="label-mono text-faint">{project.year}</span>
            )}
            {!isPlaceholder(project.kind) && (
              <span className="label-mono text-faint">{project.kind}</span>
            )}
          </div>

          {/* Each word rises from under its own mask, one after another. The
              words stay plain text in one heading, so the accessible name is
              unchanged. */}
          <h1 className="mt-5 max-w-[16ch] text-h1 font-normal tracking-tight text-text">
            {nameWords.map((word, i) => (
              <span key={i}>
                <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
                  <span
                    data-enter="line"
                    className="inline-block"
                    style={{ ...enter(140 + i * 80), "--enter-dur": "900ms" }}
                  >
                    {word}
                  </span>
                </span>
                {i < nameWords.length - 1 && " "}
              </span>
            ))}
          </h1>

          <p
            data-enter=""
            style={enter(380)}
            className="mt-6 text-lead text-muted measure"
          >
            {project.tagline}
          </p>

          {(hasLive || hasRepo) && (
            <div data-enter="" style={enter(480)}>
              <div className="mt-8 flex flex-wrap gap-3">
                {hasLive && (
                  <Magnetic>
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="link"
                      className="group/live relative inline-flex h-11 items-center gap-2 overflow-hidden rounded-full bg-accent px-5 text-[0.9375rem] font-medium text-accent-fg shadow-[0_10px_30px_-12px_var(--accent-glow)] transition-[box-shadow] duration-300 hover:shadow-[0_14px_40px_-10px_var(--accent-glow)]"
                    >
                      {/* A sheen that crosses the button on hover. */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/45 to-transparent opacity-0 transition-[transform,opacity] duration-700 ease-[var(--ease-out)] group-hover/live:translate-x-[300%] group-hover/live:opacity-100"
                      />
                      <span aria-hidden="true" className="relative flex size-2">
                        <span className="absolute inset-0 animate-ping rounded-full bg-accent-fg/40 motion-reduce:animate-none" />
                        <span className="relative size-2 rounded-full bg-accent-fg" />
                      </span>
                      Live demo
                      <Icon
                        name="ArrowUpRight"
                        size={16}
                        className="transition-transform duration-300 ease-[var(--ease-out)] group-hover/live:-translate-y-0.5 group-hover/live:translate-x-0.5"
                      />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </Magnetic>
                )}
                {hasRepo && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="link"
                    className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-surface-1 px-5 text-[0.9375rem] text-text transition-colors duration-200 hover:border-line-strong"
                  >
                    Source code
                    <Icon name="ArrowUpRight" size={16} />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                )}
              </div>
              {project.links?.liveNote && (
                <p className="mt-4 flex items-start gap-2 text-sm text-faint measure">
                  <Icon name="Info" size={14} className="mt-1 shrink-0" />
                  {project.links.liveNote}
                </p>
              )}
            </div>
          )}

          {/* Fast facts */}
          <dl
            data-enter=""
            style={enter(580)}
            className="mt-14 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-line pt-8 sm:grid-cols-4"
          >
            <Fact label="Role" value={project.role} />
            <Fact label="Type" value={project.kind} />
            <Fact label="Year" value={project.year} />
            <Fact label="Stack" value={`${project.stack.length} technologies`} />
          </dl>
        </div>
      </header>

      {/* ---- Cover ------------------------------------------------------- */}
      <div className="container-content -mt-2 pt-14">
        {/* Not inside a Reveal: the cover arrives by morphing out of the
            project list, and a fade-in on top of that would play the
            entrance twice. The scroll scale is on a wrapper, so the morph
            target is still the cover itself. */}
        <div className="cs-cover">
          <ProjectCover slug={project.slug}>
            <ProjectMedia
              cover={project.cover}
              index={index}
              priority
              /* Full container width here, not the 7-of-12 columns the list
                 uses. Scaled by ~1.4 for the same `object-cover` overflow the
                 default accounts for — see ProjectMedia. */
              sizes="(max-width: 1239px) 134vw, 1632px"
            />
          </ProjectCover>
        </div>

        {/* ---- At a glance ----------------------------------------------- */}
        {/* Counts, not claims: every figure here is read off the repository,
            which is why it sits under the cover as fact rather than in the
            prose as persuasion. */}
        {detail?.pipeline && <StatusPipeline {...detail.pipeline} />}
        {detail?.journey && <EventJourney {...detail.journey} />}

        {stats.length > 0 && (
          <>
            <Stagger
              as="dl"
              step={0.06}
              className={cn(
                "mt-4 grid grid-cols-2 gap-3",
                stats.length === 5 ? "sm:grid-cols-3 lg:grid-cols-5" : "sm:grid-cols-4",
              )}
            >
              {stats.map((stat) => (
                <StaggerItem
                  key={stat.label}
                  data-spotlight=""
                  className={cn(
                    "group/stat relative overflow-hidden rounded-md border border-line bg-surface-1 px-5 py-4",
                    stats.length === 5 && "last:col-span-2 lg:last:col-span-1",
                  )}
                >
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <CountUp
                      value={stat.value}
                      className="block font-display text-[clamp(1.5rem,2.6vw,2rem)] font-normal leading-none tracking-[-0.03em] text-text tabular-nums"
                    />
                    <span aria-hidden="true" className="mt-2 block text-sm text-muted">
                      {stat.label}
                    </span>
                  </dd>
                  {/* An accent underline that draws across on hover. */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[var(--ease-out)] group-hover/stat:scale-x-100"
                  />
                </StaggerItem>
              ))}
            </Stagger>
            {study.statsNote && (
              <p className="label-mono mt-3 text-faint">{study.statsNote}</p>
            )}
          </>
        )}
      </div>

      {/* ---- Body -------------------------------------------------------- */}
      <div className="container-content pb-8 pt-20 md:pt-28">
        <Block id="overview" label={num("overview")}>
          <p className="cs-fill text-[1.25rem] leading-[1.6] text-text measure md:text-[1.4375rem]">
            <span>{lead}</span>
          </p>
          {overviewRest.length > 0 && (
            <div className="mt-6">
              <Prose>{overviewRest.join("\n\n")}</Prose>
            </div>
          )}
        </Block>

        {detail?.record && (
          <Block id="record" label={num("record")}>
            <ProjectRecord items={detail.record} />
          </Block>
        )}

        <Block id="problem" label={num("problem")}>
          <Prose>{study.problem}</Prose>
        </Block>

        <Block id="role" label={num("role")}>
          <Prose>{study.myRole.summary}</Prose>
          {study.myRole.responsibilities?.length > 0 && (
            <Stagger as="ul" step={0.04} className="mt-6 flex flex-col gap-3">
              {study.myRole.responsibilities.map((item, i) => (
                <StaggerItem as="li" key={i} className="group/resp flex items-start gap-3">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent-soft text-accent-ink transition-transform duration-300 ease-[var(--ease-spring)] group-hover/resp:scale-125">
                    <Icon name="Check" size={12} />
                  </span>
                  <span className="text-[0.9375rem] leading-relaxed text-muted transition-colors duration-200 group-hover/resp:text-text">
                    {item}
                  </span>
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </Block>

        {detail?.portals && (
          <Block id="portals" label={num("portals")}>
            <p className="mb-8 text-[1.0625rem] leading-[1.7] text-muted measure">
              {detail.portals.intro}
            </p>
            <Reveal>
              <CaseStudyPortalExplorer roles={detail.portals.roles} flags={detail.portals.flags} />
            </Reveal>
          </Block>
        )}

        {detail?.features && (
          <Block id="features" label={num("features")}>
            <FeatureAtlas intro={detail.featuresIntro} features={detail.features} />
          </Block>
        )}

        {detail?.palette && (
          <Block id="palette" label={num("palette")}>
            <p className="mb-8 text-[1.0625rem] leading-[1.7] text-muted measure">
              {detail.palette.intro}
            </p>
            <Reveal>
              <CaseStudyCommandDemo
                keys={detail.palette.keys}
                presets={detail.palette.presets}
                commands={detail.palette.commands}
              />
            </Reveal>
          </Block>
        )}

        {detail?.lifecycle && (
          <Block id="lifecycle" label={num("lifecycle")}>
            <LifecycleTimeline {...detail.lifecycle} />
          </Block>
        )}

        {detail?.taxYear && (
          <Block id="tax" label={num("tax")}>
            <TaxYearFlow {...detail.taxYear} />
          </Block>
        )}

        {!detail?.features && featureGroups.length > 0 && (
          <Block id="features" label={num("features")}>
            <Stagger step={0.05} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {featureGroups.map((group) => (
                <StaggerItem key={group.title}>
                  <div
                    data-spotlight=""
                    className="group/card relative flex h-full flex-col rounded-md border border-line bg-surface-1 p-5 shadow-e1 transition-[transform,box-shadow] duration-500 ease-[var(--ease-out)] hover:-translate-y-1 hover:shadow-e2"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="grid size-8 place-items-center rounded-md border border-line bg-surface-2 text-accent-ink transition-colors duration-300 group-hover/card:border-transparent group-hover/card:bg-accent group-hover/card:text-accent-fg">
                        <Icon name={group.icon ?? "Layers"} size={15} />
                      </span>
                      <h3 className="text-[0.9375rem] font-medium tracking-tight text-text">
                        {group.title}
                      </h3>
                      <span className="label-mono ml-auto text-faint tabular-nums">
                        {String(group.items.length).padStart(2, "0")}
                      </span>
                    </span>
                    <ul className="mt-4 flex flex-col gap-2.5 border-t border-line pt-4">
                      {group.items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted">
                          <Icon name="Check" size={14} className="mt-1 shrink-0 text-accent-ink" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </Block>
        )}

        {study.approach && (
          <Block id="approach" label={num("approach")}>
            <Prose>{study.approach}</Prose>
          </Block>
        )}

        {detail?.architecture && (
          <Block id="architecture" label={num("architecture")}>
            <ArchitectureMap {...detail.architecture} />
          </Block>
        )}

        {study.decisions?.length > 0 && (
          <Block id="decisions" label={num("decisions")}>
            <Stagger step={0.05} className="grid gap-3 sm:grid-cols-2">
              {study.decisions.map((decision, i) => {
                const n = String(i + 1).padStart(2, "0");
                return (
                  <StaggerItem key={i}>
                    <div
                      data-spotlight=""
                      data-tilt=""
                      className="group/card relative flex h-full flex-col overflow-hidden rounded-md border border-line bg-surface-1 p-5 pb-16 shadow-e1 hover:shadow-e2"
                    >
                      {/* Ghost numeral, in the strip the bottom padding keeps
                          clear for it, rising a little on hover. */}
                      <span
                        aria-hidden="true"
                        className="text-outline pointer-events-none absolute -bottom-5 right-3 select-none font-display text-[4.5rem] font-normal leading-none opacity-15 transition-[opacity,transform] duration-500 ease-[var(--ease-out)] group-hover/card:-translate-y-1.5 group-hover/card:opacity-45"
                      >
                        {n}
                      </span>
                      <div className="relative">
                        <span className="label-mono text-faint transition-colors duration-300 group-hover/card:text-accent-ink">
                          DECISION {n}
                        </span>
                        <h3 className="mt-3 text-[0.9375rem] font-medium tracking-tight text-text">
                          {decision.title}
                        </h3>
                        <p className="mt-2.5 text-sm leading-relaxed text-muted">
                          {decision.reasoning}
                        </p>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </Block>
        )}

        {study.challenges?.length > 0 && (
          <Block id="challenges" label={num("challenges")}>
            {/* A timeline: the rail draws itself as the list scrolls past,
                and each node lights up as its challenge arrives. */}
            <ol className="cs-timeline relative flex flex-col gap-4 pl-9">
              <span
                aria-hidden="true"
                className="absolute bottom-6 left-[0.6875rem] top-6 w-px overflow-hidden bg-line"
              >
                <span className="cs-timeline-fill block h-full w-full bg-accent" />
              </span>
              {study.challenges.map((challenge, i) => (
                <li key={i} className="relative">
                  <span
                    aria-hidden="true"
                    className="cs-node absolute -left-9 top-5 grid size-[1.375rem] place-items-center rounded-full border border-line bg-bg"
                  >
                    <span className="size-1.5 rounded-full bg-accent" />
                  </span>
                  <Reveal delay={i * 0.05}>
                    <div
                      data-spotlight=""
                      className="group/card relative rounded-md border border-line bg-surface-1 p-5 shadow-e1 transition-[transform,box-shadow] duration-500 ease-[var(--ease-out)] hover:translate-x-1 hover:shadow-e2"
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-md border border-line bg-surface-2 text-accent-ink transition-colors duration-300 group-hover/card:border-transparent group-hover/card:bg-accent group-hover/card:text-accent-fg">
                          <Icon name="TriangleAlert" size={14} />
                        </span>
                        <h3 className="text-[0.9375rem] font-medium tracking-tight text-text">
                          {challenge.title}
                        </h3>
                      </div>
                      <p className="mt-4 border-t border-line pt-4 text-sm leading-relaxed text-muted">
                        <span className="label-mono mr-2 rounded-sm bg-accent-soft px-1.5 py-0.5 text-accent-ink">
                          SOLVED
                        </span>
                        {challenge.solution}
                      </p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </Block>
        )}

        <Block id="performance" label={num("performance")}>
          <Prose>{study.performance.summary}</Prose>

          {/* Techniques describe engineering that was done. Metrics are claims
              about measured outcomes, so they render only when real numbers
              exist — an empty table says nothing and an estimated one is worse
              than nothing. */}
          {techniques.length > 0 && (
            <Stagger step={0.05} className="mt-8 grid gap-3 sm:grid-cols-2">
              {techniques.map((technique, i) => (
                <StaggerItem key={i}>
                  <div
                    data-spotlight=""
                    data-tilt=""
                    className="group/card relative flex h-full flex-col rounded-md border border-line bg-surface-1 p-5 shadow-e1 hover:shadow-e2"
                  >
                    <span className="grid size-8 place-items-center rounded-md border border-line bg-surface-2 text-accent-ink transition-[transform,background-color,color,border-color] duration-500 ease-[var(--ease-spring)] group-hover/card:rotate-[-8deg] group-hover/card:scale-110 group-hover/card:border-transparent group-hover/card:bg-accent group-hover/card:text-accent-fg">
                      <Icon name={technique.icon ?? "Zap"} size={15} />
                    </span>
                    <h3 className="mt-4 text-[0.9375rem] font-medium tracking-tight text-text">
                      {technique.label}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {technique.detail}
                    </p>
                    {technique.effect && (
                      <div className="mt-auto pt-3.5">
                        <p className="flex items-start gap-2 border-t border-line pt-3.5 text-sm text-text">
                          <Icon
                            name="ArrowRight"
                            size={14}
                            className="mt-1 shrink-0 text-accent-ink transition-transform duration-300 ease-[var(--ease-out)] group-hover/card:translate-x-1"
                          />
                          {technique.effect}
                        </p>
                      </div>
                    )}
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          )}

          {metrics.length > 0 && (
            <div className="mt-8 overflow-x-auto rounded-md border border-line">
              <table className="w-full min-w-[28rem] border-collapse text-left">
                <caption className="sr-only">
                  Measured performance improvements for {project.name}
                </caption>
                <thead>
                  <tr className="border-b border-line bg-surface-2">
                    <th scope="col" className="label-mono px-4 py-3 text-faint">
                      Metric
                    </th>
                    <th scope="col" className="label-mono px-4 py-3 text-faint">
                      Before
                    </th>
                    <th scope="col" className="label-mono px-4 py-3 text-faint">
                      After
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((metric, i) => (
                    <tr
                      key={i}
                      className="border-b border-line last:border-b-0"
                    >
                      <th
                        scope="row"
                        className="px-4 py-3.5 text-sm font-normal text-text"
                      >
                        {metric.label}
                      </th>
                      <td className="px-4 py-3.5 font-mono text-sm text-faint line-through decoration-line-strong">
                        {metric.before}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-sm text-accent-ink">
                        {metric.after}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Budgets are what the endpoints are held to, not what was
              measured — so they get their own table, labelled as targets,
              rather than borrowing the before/after one above. */}
          {budgets.length > 0 && (
            <Reveal>
              <div className="mt-8 overflow-x-auto rounded-md border border-line">
                <table className="w-full min-w-[24rem] border-collapse text-left">
                  <caption className="border-b border-line bg-surface-2 px-4 py-3 text-left text-sm text-muted">
                    {study.performance.budgetsNote ?? "Performance targets"}
                  </caption>
                  <thead>
                    <tr className="border-b border-line">
                      <th scope="col" className="label-mono px-4 py-3 text-faint">
                        Endpoint
                      </th>
                      <th scope="col" className="label-mono px-4 py-3 text-right text-faint">
                        p95 target
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {budgets.map((budget) => (
                      <tr
                        key={budget.label}
                        className="border-b border-line transition-colors duration-200 last:border-b-0 hover:bg-accent-soft"
                      >
                        <th scope="row" className="px-4 py-3.5 font-mono text-sm font-normal text-text">
                          {budget.label}
                        </th>
                        <td className="px-4 py-3.5 text-right font-mono text-sm text-accent-ink tabular-nums">
                          {budget.target}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          )}
        </Block>

        {detail?.access && (
          <Block id="access" label={num("access")}>
            <AccessMap {...detail.access} />
          </Block>
        )}

        {detail?.numbers && (
          <Block id="numbers" label={num("numbers")}>
            <ByTheNumbers {...detail.numbers} />
          </Block>
        )}

        <Block id="result" label={num("result")}>
          <Prose>{study.result}</Prose>
        </Block>

        <Block id="stack" label={num("stack")} last>
          {detail?.stack ? (
            <StackLedger
              intro={detail.stackIntro}
              groups={detail.stack}
              designSystem={detail.designSystem}
            />
          ) : stackGroups.length > 0 ? (
            <dl className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {stackGroups.map((group) => (
                <Reveal key={group.label}>
                  <dt className="label-mono flex items-center gap-2 text-faint">
                    {group.label}
                    <span aria-hidden="true" className="h-px flex-1 bg-line" />
                    <span className="tabular-nums">{String(group.items.length).padStart(2, "0")}</span>
                  </dt>
                  <dd className="mt-3 flex flex-wrap gap-2">
                    {group.items.map((tech) => (
                      <StackChip key={tech}>{tech}</StackChip>
                    ))}
                  </dd>
                </Reveal>
              ))}
            </dl>
          ) : (
            <Stagger step={0.03} className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <StaggerItem key={tech} as="span">
                  <StackChip>{tech}</StackChip>
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </Block>
      </div>

      {/* ---- Interface mosaic -------------------------------------------- */}
      {/* Deliberately outside the numbered blocks and outside the 9-column
          prose gutter: the screenshots are the one part of the page that wants
          the full container, and breaking the rhythm is what makes them land
          as a visual break in a long read. */}
      {gallery.length > 0 && (
        <section
          id="interface"
          aria-labelledby="interface-heading"
          /* `overflow-x-clip`, not `overflow-hidden`: hidden makes this a
             scroll container, and the tiles' and marquee's view() timelines
             would then track it instead of the page — and never move. */
          className="scroll-mt-24 overflow-x-clip border-t border-line bg-surface-1/40"
        >
          {/* The project's name sliding past in outline, tied to scroll. */}
          <div aria-hidden="true" className="cs-marquee pt-14 md:pt-20">
            <p className="cs-marquee-track text-outline select-none whitespace-nowrap font-display text-[clamp(3.5rem,11vw,10rem)] font-normal leading-[0.9] tracking-[-0.05em]">
              {`Interface — ${project.name} — Interface — ${project.name}`}
            </p>
          </div>

          <div className="container-content pb-14 pt-8 md:pb-20 md:pt-10">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="label-mono text-accent-ink">
                  Interface · {gallery.length} screens
                </p>
                <h2
                  id="interface-heading"
                  className="mt-3 text-h3 font-semibold tracking-tight text-text"
                >
                  The product, as shipped
                </h2>
              </div>
              <p className="flex items-center gap-2 text-sm text-faint">
                <Icon name="Maximize2" size={14} />
                Select any screen to see it full size
              </p>
            </div>
            <ProjectGallery items={gallery} projectName={project.name} />
          </div>
        </section>
      )}

      {/* ---- Next project ------------------------------------------------ */}
      {/* The band floods with the next project's colour — or its cover, where
          it has one — in a circle that grows from wherever the pointer came
          in. SpotlightRuntime supplies the coordinates via `data-pointer`;
          the whole band is the link. */}
      {next && (
        <nav
          aria-label="Next project"
          data-tone={projectTone(nextIndex)}
          data-pointer=""
          className="cs-next group/next relative isolate overflow-hidden border-t border-line bg-surface-1"
        >
          <span aria-hidden="true" className="cs-next-reveal pointer-events-none absolute inset-0 -z-10 bg-accent">
            {next.cover?.src && (
              <>
                <Image
                  src={next.cover.src}
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-cover object-top"
                />
                <span className="absolute inset-0 bg-[linear-gradient(90deg,rgb(0_0_0/0.86)_0%,rgb(0_0_0/0.6)_55%,rgb(0_0_0/0.35)_100%)]" />
              </>
            )}
          </span>

          <Link
            href={`/work/${next.slug}`}
            transitionTypes={["nav-forward"]}
            data-cursor="view"
            data-cursor-label="Next case study"
            className="container-content flex flex-col gap-6 py-16 outline-none after:absolute after:inset-0 after:content-[''] sm:flex-row sm:items-center sm:justify-between md:py-24"
          >
            <span>
              <span
                className={cn(
                  "label-mono transition-colors duration-500",
                  next.cover?.src
                    ? "text-faint group-hover/next:text-white/70 group-focus-within/next:text-white/70"
                    : "text-faint group-hover/next:text-accent-fg/70 group-focus-within/next:text-accent-fg/70",
                )}
              >
                Next project
              </span>
              <span
                className={cn(
                  "mt-3 block font-display text-[clamp(2.25rem,5.5vw,4.5rem)] font-normal leading-[0.95] tracking-[-0.04em] transition-colors duration-500",
                  next.cover?.src
                    ? "text-text group-hover/next:text-white group-focus-within/next:text-white"
                    : "text-text group-hover/next:text-accent-fg group-focus-within/next:text-accent-fg",
                )}
              >
                {next.name}
              </span>
              <span
                className={cn(
                  "mt-3 block text-sm transition-colors duration-500 measure-tight",
                  next.cover?.src
                    ? "text-muted group-hover/next:text-white/80 group-focus-within/next:text-white/80"
                    : "text-muted group-hover/next:text-accent-fg/80 group-focus-within/next:text-accent-fg/80",
                )}
              >
                {next.tagline}
              </span>
            </span>
            <span
              aria-hidden="true"
              className="grid size-16 shrink-0 place-items-center rounded-full border border-line bg-surface-2 text-accent-ink transition-[transform,background-color,color,border-color] duration-500 ease-[var(--ease-spring)] group-hover/next:-rotate-45 group-hover/next:scale-110 group-hover/next:border-transparent group-hover/next:bg-bg group-hover/next:text-text"
            >
              <Icon name="ArrowRight" size={22} />
            </span>
          </Link>
        </nav>
      )}
    </article>
  );
}

/* -------------------------------------------------------------------------- */

function Block({ id, label, children, last = false }) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cn(
        /* `grid-cols-1` (minmax(0, 1fr)), not the implicit auto column: an auto
           track grows to its content's minimum, so the budgets table's 24rem
           widened this page past a phone screen and the browser zoomed out. */
        "cs-block grid grid-cols-1 scroll-mt-24 gap-6 border-b border-line py-12 md:grid-cols-12 md:gap-10 md:py-16",
        last && "border-b-0",
      )}
    >
      <div className="md:col-span-3">
        {/* Sticky in the margin on wide screens, inline on narrow ones. The
            rail under the title fills as this section is read. */}
        <div className="md:sticky md:top-28">
          <p className="label-mono text-accent-ink">{label}</p>
          <h2
            id={`${id}-heading`}
            className="mt-3 text-h3 font-semibold tracking-tight text-text"
          >
            {TITLES[id]}
          </h2>
          <span
            aria-hidden="true"
            className="mt-5 hidden h-0.5 w-28 overflow-hidden rounded-full bg-line md:block"
          >
            <span className="cs-rail-fill block h-full w-full rounded-full bg-accent" />
          </span>
        </div>
      </div>
      <div className="md:col-span-9">{children}</div>
    </section>
  );
}

/**
 * Case-study body copy.
 *
 * Splits on blank lines so a data file can hold more than one paragraph in a
 * single field. A `\n\n` inside one <p> collapses to a space in HTML, which
 * would silently run two arguments together — this keeps the author's breaks.
 * Each paragraph lifts into place as it enters the viewport (`cs-prose`).
 */
function Prose({ children }) {
  const paragraphs =
    typeof children === "string"
      ? children.split(/\n{2,}/).filter(Boolean)
      : [children];

  return (
    <div className="cs-prose flex flex-col gap-5">
      {paragraphs.map((paragraph, i) => (
        <p
          key={i}
          className="text-[1.0625rem] leading-[1.7] text-muted measure"
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function StackChip({ children }) {
  return (
    <span className="group/chip inline-flex cursor-default items-center gap-2 rounded-full border border-line bg-surface-1 px-4 py-2.5 text-sm text-text transition-[transform,border-color,background-color] duration-300 ease-[var(--ease-out)] hover:-translate-y-0.5 hover:border-line-accent hover:bg-accent-soft">
      <span
        aria-hidden="true"
        className="size-1.5 rounded-full bg-accent transition-[transform,box-shadow] duration-300 ease-[var(--ease-spring)] group-hover/chip:scale-[1.6] group-hover/chip:shadow-[0_0_0_3px_var(--accent-soft)]"
      />
      {children}
    </span>
  );
}

function Fact({ label, value }) {
  return (
    <div>
      <dt className="label-mono text-faint">{label}</dt>
      <dd className="mt-2 text-[0.9375rem] text-text">{value}</dd>
    </div>
  );
}
