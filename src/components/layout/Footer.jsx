import { site } from "@/data/site";
import { Icon, GithubIcon, LinkedinIcon } from "@/components/ui/Icon";
import { ViewResumeButton } from "@/components/resume/ViewResumeButton";
import { EmailLink } from "@/components/contact/EmailLink";
import { Link001, Link002 } from "@/components/ui/skiper-ui/skiper40";
import { LocalTime } from "@/components/ui/LocalTime";
import { BackToTop } from "@/components/layout/BackToTop";

const isPlaceholder = (value) =>
  !value || typeof value !== "string" || value.startsWith("[");

/**
 * The footer: a slab of pure emerald under the page.
 *
 * On a tall enough desktop window the page lifts off it — `main` is a raised
 * sheet with rounded bottom corners and the footer is sticky beneath, so the
 * last scroll uncovers it rather than scrolling it up (`footer-reveal` in
 * globals.css). As it arrives the giant name at the bottom rises letter by
 * letter out of the bottom edge (scroll-driven).
 *
 * Emerald and vermilion vibrate against each other at 1.6:1, so nothing on
 * this slab is vermilion: the accents are ivory, and the emphasis italic is a
 * pale coral (5.1:1) instead.
 */
export function Footer() {
  const year = new Date().getFullYear();
  const firstName = site.name.split(" ")[0];

  const social = [
    { key: "github", href: site.links.github, label: "GitHub", Glyph: GithubIcon },
    { key: "linkedin", href: site.links.linkedin, label: "LinkedIn", Glyph: LinkedinIcon },
  ].filter((item) => !isPlaceholder(item.href));

  return (
    <footer data-surface="emerald" className="footer-reveal relative isolate overflow-hidden">
      <div aria-hidden="true" className="footer-glow" />

      <div className="container-wide relative pt-16 md:pt-20">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          {/* The sign-off. */}
          <div className="lg:col-span-7">
            <p className="label-mono flex items-center gap-3 text-muted">
              <span aria-hidden="true">✺</span> {site.availabilityLabel}
            </p>
            <p className="mt-6 font-display text-[clamp(2.5rem,1.4rem+4.6vw,5.25rem)] leading-[0.98] tracking-[-0.03em] text-text">
              Thanks for scrolling <em>this far.</em>
            </p>

            {!isPlaceholder(site.email) && (
              <EmailLink
                data-cursor="link"
                className="link-draw group mt-8 inline-flex cursor-pointer items-center gap-3 font-display text-[clamp(1.25rem,1rem+1.2vw,2rem)] italic text-text"
              >
                {site.email}
                <span className="grid size-10 place-items-center rounded-full bg-ivory text-emerald transition-transform duration-500 ease-[var(--ease-spring)] group-hover:rotate-45">
                  <Icon name="ArrowUpRight" size={18} />
                </span>
              </EmailLink>
            )}
          </div>

          {/* Links and the clock. */}
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
            <FooterColumn title="Explore">
              <FooterLink href="/#work">Projects</FooterLink>
              <FooterLink href="/#experience">Experience</FooterLink>
              <FooterLink href="/#skills">Skills</FooterLink>
              <FooterLink href="/#playground">Playground</FooterLink>
            </FooterColumn>

            <FooterColumn title="Connect">
              {social.map((item) => (
                <FooterLink key={item.key} href={item.href} external>
                  {item.label}
                </FooterLink>
              ))}
              {!isPlaceholder(site.links.resume) && (
                <li>
                  {/* Opens the in-page viewer, so the footer never dumps a
                      reader into the browser's PDF plugin. */}
                  <ViewResumeButton
                    icon={null}
                    className="tap-target inline-flex cursor-pointer items-center gap-1.5 py-0.5 text-[0.9375rem] text-muted transition-colors duration-200 hover:text-text"
                  >
                    Resume
                  </ViewResumeButton>
                </li>
              )}
            </FooterColumn>

            <div className="col-span-2 sm:col-span-1">
              <p className="label-mono mb-4 text-faint">Local time</p>
              <LocalTime
                fallback={site.timezone}
                className="font-display text-[1.75rem] leading-none tabular-nums text-text"
              />
              <p className="mt-2 flex items-center gap-1.5 text-[0.875rem] text-muted">
                <Icon name="MapPin" size={13} />
                {site.location.split(",")[0]}, India
              </p>
            </div>
          </nav>
        </div>

        {/* Baseline */}
        <div className="mt-12 flex flex-col gap-5 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3">
            <p className="label-mono text-faint">
              © {year} {site.name}
            </p>
            {/* Required by the Skiper UI free licence. */}
            <p className="text-[0.8125rem] text-faint">
              Interface components adapted from{" "}
              <a
                href="https://skiper-ui.com"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="link"
                className="tap-target underline decoration-1 underline-offset-4 transition-colors duration-200 hover:text-text"
              >
                Skiper UI
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {social.map(({ key, href, label, Glyph }) => (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label} (opens in a new tab)`}
                className="grid size-12 place-items-center rounded-full border border-line-strong text-muted transition-colors duration-300 hover:bg-text hover:text-bg"
              >
                <Glyph size={16} />
              </a>
            ))}
            <BackToTop />
          </div>
        </div>
      </div>

      {/* The closing wordmark: the first name, as wide as the page, rising out
          of the bottom edge letter by letter. `aria-hidden` because the name is
          already stated above. */}
      <div aria-hidden="true" className="footer-mark relative mt-2 select-none overflow-hidden">
        <p className="flex justify-center whitespace-nowrap pb-[0.2em] font-display text-[clamp(5rem,18vw,17rem)] leading-[0.8] tracking-[-0.045em] text-text">
          {[...firstName].map((char, i) => (
            <span key={i} className="footer-letter inline-block" style={{ "--i": i }}>
              {char}
            </span>
          ))}
          <span className="footer-letter inline-block italic text-[var(--em-color)]" style={{ "--i": firstName.length }}>
            .
          </span>
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }) {
  return (
    <div>
      <p className="label-mono mb-4 text-faint">{title}</p>
      <ul className="flex flex-col gap-3">{children}</ul>
    </div>
  );
}

/* Skiper 40's animated links: an underline that draws in from the left and
   an arrow that rises into place on hover. 001 opens in a new tab, 002 stays
   on the page. */
function FooterLink({ href, children, external = false }) {
  const isExternal = external || href.startsWith("http");
  const SkiperLink = isExternal ? Link001 : Link002;

  return (
    <li>
      <SkiperLink
        href={href}
        className="tap-target w-fit py-0.5 text-[0.9375rem] text-muted transition-colors duration-200 hover:text-text"
      >
        {children}
        {isExternal && <span className="sr-only"> (opens in a new tab)</span>}
      </SkiperLink>
    </li>
  );
}
