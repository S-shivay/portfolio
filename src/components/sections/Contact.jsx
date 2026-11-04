import { site } from "@/data/site";
import { RunningHead, SplitHeading } from "@/components/layout/SectionHead";
import { resume } from "@/data/signals";
import { Icon, GithubIcon, LinkedinIcon } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { ContactForm } from "@/components/sections/ContactForm";
import { ViewResumeButton } from "@/components/resume/ViewResumeButton";
import { EmailLink } from "@/components/contact/EmailLink";
import { AvailabilityPill } from "@/components/ui/Tag";
import { BorderBeam } from "@/components/ui/border-beam";

const isPlaceholder = (value) =>
  !value || typeof value !== "string" || value.startsWith("[");

/**
 * The bare destination of a profile URL — `linkedin.com/in/sarang...` rather
 * than the full href.
 *
 * The email row above shows the address itself; a social row that says only
 * "LinkedIn" is asking the reader to click to find out whose profile it is. On
 * a link that exists to prove an identity, the slug is the proof, and showing
 * it costs one muted line. Dropped below `sm`, where the row has no width for
 * it and the label alone still works.
 */
const destination = (url) =>
  url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

/**
 * Contact — the final CTA, with the resume ask folded in rather than given its
 * own section. A recruiter arriving here has one decision to make, and
 * splitting it across two blocks only adds scrolling between them and the
 * form.
 */
export function Contact() {
  const hasEmail = !isPlaceholder(site.email);
  const hasResume = !isPlaceholder(site.links.resume);

  const social = [
    { key: "github", href: site.links.github, label: "GitHub", Glyph: GithubIcon },
    {
      key: "linkedin",
      href: site.links.linkedin,
      label: "LinkedIn",
      Glyph: LinkedinIcon,
    },
  ].filter((item) => !isPlaceholder(item.href));

  return (
    <section
      id="contact"
      /* Closes the loop on the hero's blue: the page runs through eight hues
         between them, and landing back on the brand colour is what makes that
         read as a journey rather than as randomness. */
      data-tone="contact"
      aria-labelledby="contact-heading"
      className="relative isolate overflow-hidden border-t border-line"
      style={{ paddingBlock: "var(--section-y)" }}
    >
      <div aria-hidden="true" className="section-wash" />

      {/* A second sun, setting into the bottom corner — the page ends where
          the hero began. */}
      <div aria-hidden="true" className="contact-sun" />

      <div className="container-content relative z-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Pitch */}
        <div className="lg:col-span-6">
          <RunningHead id="contact" eyebrow="Contact" className="mb-10 md:mb-14" />

          {/* The closing statement, at the same scale as the hero's; it turns
              italic and vermilion exactly where it turns into the ask. */}
          <SplitHeading
            id="contact-heading"
            text="Got something worth building?"
            className="text-[clamp(2.9rem,1.2rem+5vw,5.75rem)] leading-[0.95] tracking-[-0.03em] text-text"
          />

          <Reveal delay={0.1}>
            <p className="mt-6 text-lead text-muted measure-tight">
              I&apos;m always interested in challenging frontend problems,
              ambitious products and great teams.
            </p>
          </Reveal>

          {site.available && (
            <Reveal delay={0.14}>
              <div className="mt-7">
                <AvailabilityPill label={site.availabilityLabel} />
              </div>
            </Reveal>
          )}

          {/* Direct routes — always available, so the form is never the only
              way to make contact. */}
          <Reveal delay={0.18}>
            <ul className="mt-10 flex flex-col gap-2.5">
              {hasEmail && (
                <li>
                  {/* A real mailto: href that opens the compose chooser when
                      scripting is available — see EmailLink. */}
                  {/* The primary target on the page, sized to say so. The
                      address is set in the display face at up to 1.5rem and
                      the whole bar fills with the section's hue on hover. */}
                  <EmailLink
                    data-cursor="link"
                    /* `isolate` is load-bearing: the fill sits at -z-10 so it
                       paints over the bar's own background but under its
                       content, and without a stacking context here it would
                       escape and hide behind an ancestor instead. */
                    className="group relative isolate flex cursor-pointer items-center gap-4 overflow-hidden rounded-md card-accent border bg-surface-1 px-5 py-5 sm:py-6"
                  >
                    <Icon
                      name="Mail"
                      size={20}
                      className="shrink-0 text-accent-ink transition-colors duration-300 group-hover:text-accent-fg"
                    />

                    <span className="min-w-0 flex-1 truncate font-display text-[clamp(0.9375rem,3.4vw,1.5rem)] font-medium tracking-tight text-text transition-colors duration-300 group-hover:text-accent-fg">
                      {site.email}
                    </span>

                    <span className="relative grid size-10 shrink-0 place-items-center rounded-full bg-accent text-accent-fg transition-transform duration-300 ease-[var(--ease-spring)] group-hover:translate-x-1 group-hover:-translate-y-1">
                      <Icon name="ArrowUpRight" size={18} />
                    </span>

                    {/* The fill. Scales from the left on hover, behind the
                        content — a transform, so it composites rather than
                        repainting the bar's width every frame. */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 -z-10 origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-x-100"
                    />
                  </EmailLink>
                </li>
              )}

              {/* Off by default — see the note on `showPhone` in site.js. */}
              {site.showPhone && !isPlaceholder(site.phone) && (
                <li>
                  <a
                    href={`tel:${site.phone.replace(/\s/g, "")}`}
                    data-cursor="link"
                    className="group flex items-center gap-3 rounded-md card-accent border bg-surface-1 px-4 py-3.5"
                  >
                    <Icon
                      name="Terminal"
                      size={16}
                      className="shrink-0 text-accent-ink"
                    />
                    <span className="min-w-0 flex-1 truncate text-[0.9375rem] text-text">
                      {site.phone}
                    </span>
                    <Icon
                      name="ArrowUpRight"
                      size={15}
                      className="shrink-0 text-faint transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                </li>
              )}

              {social.map(({ key, href, label, Glyph }) => (
                <li key={key}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="link"
                    className="group flex items-center gap-3 rounded-md card-accent border bg-surface-1 px-4 py-3.5"
                  >
                    <Glyph size={16} className="shrink-0 text-accent-ink" />
                    <span className="min-w-0 flex-1 truncate text-[0.9375rem] text-text">
                      {label}
                    </span>
                    <span className="hidden shrink-0 font-mono text-[0.8125rem] text-faint transition-colors duration-200 group-hover:text-muted sm:block">
                      {destination(href)}
                    </span>
                    <Icon
                      name="ArrowUpRight"
                      size={15}
                      className="shrink-0 text-faint transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Resume */}
          {hasResume && (
            <Reveal delay={0.22}>
              <div className="mt-10 rounded-md card-accent border bg-surface-1 p-6 shadow-e1">
                <h3 className="text-[1.0625rem] font-medium tracking-tight text-text">
                  {resume.heading}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {resume.body}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Magnetic>
                    <a
                      href={site.links.resume}
                      download
                      className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-[0.9375rem] font-medium text-accent-fg transition-colors duration-200 hover:bg-[color-mix(in_oklab,var(--accent)_88%,white)]"
                    >
                      <Icon name="Download" size={15} />
                      Download Resume
                    </a>
                  </Magnetic>

                  {/* Opens the in-page viewer rather than handing the reader
                      off to the browser's PDF plugin and losing the site. */}
                  <ViewResumeButton className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-line bg-surface-2 px-5 text-[0.9375rem] text-text" />
                </div>
              </div>
            </Reveal>
          )}
        </div>

        {/* Form */}
        {/* Columns 8–12: start 8 with a span of 6 used to run to a 13th
            column, adding an implicit track wider than the grid. */}
        <div className="lg:col-span-5 lg:col-start-8">
          <Reveal delay={0.1}>
            <div className="relative rounded-lg card-accent border bg-surface-1 p-6 shadow-e2 sm:p-8">
              {/* A light travelling the form's edge — the one place on the
                  page that should draw the eye before the reader leaves. In
                  the section's own hue, then the brand violet. */}
              <BorderBeam
                size={260}
                duration={9}
                borderWidth={1.5}
                colorFrom="var(--brand-vermilion)"
                colorTo="var(--brand-emerald)"
              />
              <p className="label-mono text-faint">Start a conversation</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Tell me a little about the product and the problem. I read
                everything and reply to anything concrete.
              </p>

              <div className="mt-7">
                <ContactForm email={hasEmail ? site.email : null} />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
