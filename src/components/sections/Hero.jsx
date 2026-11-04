import { site } from "@/data/site";
import { primarySkills } from "@/data/skills";
import { projects } from "@/data/projects";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { HeroBackdrop } from "@/components/sections/HeroBackdrop";
import { UILayers } from "@/components/sections/UILayers";
import { HeroObjects } from "@/components/sections/HeroObjects";
import { KineticHeadline } from "@/components/motion/KineticHeadline";
import { FadeIn } from "@/components/motion/TextReveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { SpinBadge } from "@/components/ui/SpinBadge";
import { LocalTime } from "@/components/ui/LocalTime";

const isPlaceholder = (value) =>
  !value || typeof value !== "string" || value.startsWith("[");

/* Real coordinates for the location in site.js. Kanpur, Uttar Pradesh. */
const COORDINATES = "26.4499°N / 80.3319°E";

/**
 * Hero.
 *
 * A poster. The statement runs at `--text-mega` in Fraunces across the full
 * width, its three lines staggered like set type, with the two words the
 * sentence turns on — "feel" and "perform." — in vermilion italic. Behind it
 * a vermilion sun rises inside emerald orbit lines, the photograph pinned to
 * it; as the page scrolls the lines slide apart and the sun sets.
 *
 * Below the statement: the argument and the asks on the left, the
 * interactive piece (one screen drawn as five exploded layers) on the right,
 * framed as a numbered figure.
 *
 * A server component: every word is in the server-rendered HTML and readable
 * before a byte of JavaScript executes. Only the pointer-reactive headline,
 * the sun's drift, the clock and the magnetic CTA are client islands, and
 * each degrades to static markup when its capability check fails.
 */
export function Hero() {
  const socials = [
    { key: "linkedin", href: site.links.linkedin, label: "LinkedIn" },
    { key: "github", href: site.links.github, label: "GitHub" },
    { key: "twitter", href: site.links.twitter, label: "X" },
  ].filter((s) => !isPlaceholder(s.href));

  return (
    <section
      id="home"
      data-tone="home"
      /* Pauses the sun's orbits once the hero has been scrolled past. */
      data-ambient=""
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden pt-24 md:pt-32"
    >
      <HeroBackdrop />
      <HeroObjects coordinates={COORDINATES} />

      <div className="container-wide relative z-10">
        {/* Status rail — the masthead line above the statement. */}
        <FadeIn delay={0.05}>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            {site.available && (
              <span className="inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-surface-1/70 py-1.5 pl-2.5 pr-3.5 backdrop-blur-sm">
                <span className="relative grid size-2 place-items-center">
                  <span className="absolute size-2 animate-ping rounded-full bg-vermilion opacity-60" />
                  <span className="relative size-2 rounded-full bg-vermilion" />
                </span>
                <span className="label-mono text-text">{site.availabilityLabel}</span>
              </span>
            )}

            <span className="label-mono text-muted">{site.role}</span>

            <span aria-hidden="true" className="hidden h-px flex-1 bg-line-strong lg:block" />

            <span className="label-mono hidden text-muted lg:block">{COORDINATES}</span>
            <LocalTime
              fallback={site.timezone}
              className="label-mono hidden tabular-nums text-muted sm:block"
            />
          </div>
        </FadeIn>

        {/* The name, set small and wide above the statement — a byline. */}
        <FadeIn delay={0.12}>
          <p className="mt-10 font-display text-[clamp(1.125rem,1rem+0.6vw,1.5rem)] italic text-muted md:mt-14">
            {site.name}{" "}
            <span className="whitespace-nowrap">
              <span className="not-italic text-vermilion">— </span>
              <span className="not-italic font-sans text-[0.8em] text-faint">
                {site.yearsExperience} years in frontend
              </span>
            </span>
          </p>
        </FadeIn>

        {/* The statement. Lines are authored in site.js so the ragged edge is
            deliberate at every width. */}
        <div className="relative mt-4">
          <KineticHeadline
            id="hero-heading"
            lines={site.headlineLines}
            emphasis={["feel", "perform."]}
            lineClassNames={["", "md:pl-[0.9em]", "md:pl-[0.35em]"]}
            enterDelay={200}
            scrollExit
            className="text-mega relative z-10 text-text"
          />
        </div>

        {/* Below the statement: the argument on the left, the figure right. */}
        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col lg:col-span-6">
            <FadeIn delay={0.55}>
              <p className="text-lead text-muted measure">
                <span className="float-left mr-3 mt-1 font-display text-[3.6em] leading-[0.8] text-accent-ink">
                  {site.intro.charAt(0)}
                </span>
                {site.intro.slice(1)}
              </p>
            </FadeIn>

            <FadeIn delay={0.65}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Magnetic>
                  <Button href="#contact" variant="primary" size="lg" icon="ArrowUpRight">
                    Start a project
                  </Button>
                </Magnetic>

                <Button href="#work" variant="secondary" size="lg">
                  See the work
                </Button>

                {socials.map((s) => (
                  <a
                    key={s.key}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    data-cursor="link"
                    className="link-draw label-mono inline-flex h-11 cursor-pointer items-center gap-1.5 px-2 text-muted transition-colors duration-200 hover:text-text"
                  >
                    {s.label}
                    <Icon name="ArrowUpRight" size={12} />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                ))}
              </div>
            </FadeIn>

            {/* Stack chips. Real entries from skills.js, capped at nine. */}
            <FadeIn delay={0.75}>
              <ul className="mt-10 flex flex-wrap items-center gap-2">
                {primarySkills.slice(0, 9).map((skill, i) => (
                  <li
                    key={skill.name}
                    className="chip-hover label-mono rounded-full border border-line-strong px-3 py-2 text-text"
                    style={{ "--chip-i": i }}
                  >
                    {skill.name}
                  </li>
                ))}
              </ul>
            </FadeIn>

            {/* Everything a recruiter scans for. */}
            <FadeIn delay={0.85} className="mt-auto">
              <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line-strong pt-7 sm:grid-cols-4">
                <Fact label="Experience" value={`${site.yearsExperience} years`} />
                <Fact label="Focus" value="Angular · TypeScript" />
                <Fact label="Shipped" value={`${projects.length} projects`} />
                <Fact label="Based in" value={site.location.split(",")[0]} />
              </dl>
            </FadeIn>
          </div>

          {/* The interactive piece, framed as a figure. */}
          <div
            data-hero-lift=""
            className="relative mx-auto w-full max-w-[26rem] lg:col-span-6 lg:col-start-7 lg:max-w-none xl:col-span-5 xl:col-start-8"
          >
            <FadeIn delay={0.45}>
              <figure>
                <figcaption className="mb-3 flex items-baseline justify-between gap-4">
                  <span className="font-display text-[1.0625rem] italic text-text">
                    Fig. 01 — <span className="not-italic">one screen, five layers</span>
                  </span>
                  <span className="label-mono text-faint">Interactive</span>
                </figcaption>
                <div className="neon-edge relative overflow-hidden rounded-[1.25rem] border bg-surface-1">
                  <UILayers />
                </div>
              </figure>
            </FadeIn>

            {/* The seal, stamped over the figure's corner. */}
            <FadeIn delay={1} className="absolute -bottom-14 -left-16 z-20 hidden xl:block">
              <SpinBadge
                href="#contact"
                label="Start a project — go to contact"
                text={`${site.availabilityLabel} ✺ ${site.role} ✺ `}
                className="size-36"
              />
            </FadeIn>
          </div>
        </div>

        {/* Scroll cue. */}
        <div aria-hidden="true" className="mt-16 flex items-center justify-center gap-3 pb-14 md:pb-20">
          <span className="label-mono text-faint">Scroll</span>
          <span className="scroll-cue relative h-10 w-px overflow-hidden bg-line-strong" />
        </div>
      </div>
    </section>
  );
}

function Fact({ label, value }) {
  return (
    <div>
      <dt className="label-mono text-faint">{label}</dt>
      <dd className="mt-2.5 font-display text-[1.375rem] leading-tight tracking-tight text-text">
        {value}
      </dd>
    </div>
  );
}
