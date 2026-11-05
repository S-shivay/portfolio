"use client";

import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { IssuerMark } from "@/components/certificates/IssuerMark";
import { CertificatePreview } from "@/components/certificates/CertificatePreview";
import { preloadCertificate } from "@/components/certificates/ViewerStage";

/* The width each preview is drawn at, for next/image's `sizes`. The stage
   insets the sheet by 9% on each side. A regular card is a 7.5rem thumbnail
   below `sm`, half the container to `xl` and a quarter of it from there; a
   featured card is the full container below `xl` (stage ~55% once it goes
   side by side) and half of it from there. */
const SIZES = {
  regular: "(max-width: 639px) 100px, (max-width: 1279px) 42vw, 250px",
  featured: "(max-width: 639px) 84vw, (max-width: 1279px) 52vw, 500px",
};

const MAX_SKILLS = 4;

/**
 * One certificate.
 *
 * Reads in the order the section is built around: achievement, organisation,
 * date, skills, then the evidence and its verification. The document preview
 * leads, because the certificate itself is the proof and everything below it
 * is context.
 *
 * The whole card opens the viewer. That is done with the "View certificate"
 * button stretched over the card, not an onClick on the <article>, so there is
 * exactly one real control with a real label, and the Verify link sits above
 * it as a second, separate target.
 *
 * Two shapes, chosen by space rather than by device:
 *
 *  - Featured cards are a size container. Wide enough (a full row, below
 *    `xl`), the document and its context sit side by side; at half a row they
 *    stack. The card decides from its own width, so it is right in every slot
 *    the grid can put it in.
 *  - Regular cards on a phone become a row: a thumbnail of the document beside
 *    its title, issuer and date. Description and skills drop out — they are
 *    one tap away in the viewer — and the four of them take the height one
 *    full card used to.
 */
export function CertificateCard({ certificate, featured = false, onOpen }) {
  const c = certificate;
  const openable = Boolean(c.document);
  const titleId = `cert-${c.id}-title`;

  const meta = [
    c.issued && `Issued ${c.issued.label}`,
    c.duration,
    c.level,
  ].filter(Boolean);

  const skills = c.skills.slice(0, MAX_SKILLS);
  const hiddenSkills = c.skills.length - skills.length;

  /* Applied only to regular cards: the phone-width row layout. */
  const compact = (classes) => (featured ? false : classes);

  return (
    <article
      aria-labelledby={titleId}
      className={cn(
        "cert-card relative h-full overflow-hidden rounded-md border bg-surface-1 shadow-e1",
        featured
          ? "@container border-line-accent bg-[linear-gradient(155deg,var(--accent-soft),transparent_55%)]"
          : "border-line",
      )}
    >
      {/* A container cannot query itself, so the layout lives one level in. */}
      <div
        className={cn(
          "flex h-full flex-col",
          featured &&
            "@2xl:grid @2xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]",
          compact("max-sm:flex-row"),
        )}
      >
        {/* ---- Evidence ---------------------------------------------------- */}
        <div
          className={cn(
            "relative shrink-0 border-line",
            featured
              ? "aspect-[16/10] border-b @2xl:aspect-auto @2xl:min-h-[22rem] @2xl:border-r @2xl:border-b-0"
              : "aspect-[3/2] border-b max-sm:aspect-auto max-sm:w-[7.5rem] max-sm:border-r max-sm:border-b-0",
          )}
        >
          <CertificatePreview
            certificate={c}
            sizes={featured ? SIZES.featured : SIZES.regular}
            className="absolute inset-0"
          />

          {featured && (
            <span className="label-mono absolute left-3 top-3 inline-flex h-7 items-center gap-1.5 rounded-full bg-accent px-2.5 text-accent-fg shadow-e1">
              <Icon name="Star" size={12} strokeWidth={2} />
              Featured
            </span>
          )}

          {c.document?.kind === "pdf" && (
            <span
              className={cn(
                "label-mono absolute bottom-3 left-3 inline-flex h-6 items-center rounded-sm border border-line bg-surface-1/85 px-2 text-faint backdrop-blur-sm",
                compact("max-sm:hidden"),
              )}
            >
              PDF
            </span>
          )}

          {/* Zoom affordance. Revealed on hover for a mouse; always shown on
              touch, where there is no hover to reveal it — except on a phone
              thumbnail, which it would cover, and where the row itself says
              "View". */}
          {openable && (
            <span
              aria-hidden="true"
              className={cn(
                "label-mono absolute right-3 top-3 inline-flex h-7 items-center gap-1.5 rounded-full border border-line bg-surface-1/85 px-2.5 text-muted opacity-0 backdrop-blur-sm transition-opacity duration-200 pointer-coarse:opacity-100 [.cert-card:hover_&]:opacity-100 [.cert-card:focus-within_&]:opacity-100",
                compact("max-sm:hidden"),
              )}
            >
              <Icon name="Maximize2" size={12} />
              View
            </span>
          )}
        </div>

        {/* ---- Context ----------------------------------------------------- */}
        <div
          className={cn(
            "flex min-w-0 flex-1 flex-col p-5",
            featured ? "sm:p-7" : "sm:p-6",
            compact("max-sm:px-4 max-sm:py-3.5"),
          )}
        >
          <div className="flex items-center gap-3">
            <IssuerMark
              issuer={c.issuer}
              logo={c.issuerLogo}
              className={compact("max-sm:hidden")}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text">{c.issuer}</p>
              {meta.length > 0 && (
                <p className="label-mono mt-1.5 truncate text-faint">
                  {meta.join(" · ")}
                </p>
              )}
            </div>
          </div>

          <h3
            id={titleId}
            className={cn(
              "mt-5 font-medium tracking-tight text-pretty text-text",
              featured
                ? "text-h3"
                : "line-clamp-3 text-[1.0625rem] leading-snug max-sm:mt-2 max-sm:line-clamp-2 max-sm:text-[0.9375rem]",
            )}
          >
            {c.title}
          </h3>

          {c.distinction &&
            (featured ? (
              <p className="mt-4 font-display text-[2.5rem] leading-none font-normal tracking-tight text-accent-ink">
                {c.distinction}
              </p>
            ) : (
              <p className="mt-3">
                <span className="label-mono inline-flex h-6 items-center rounded-full border border-line-accent bg-accent-soft px-2.5 text-accent-ink">
                  {c.distinction}
                </span>
              </p>
            ))}

          {c.description && (
            <p
              className={cn(
                "mt-3 text-sm leading-relaxed text-muted",
                featured ? "line-clamp-4" : "line-clamp-2 max-sm:hidden",
              )}
            >
              {c.description}
            </p>
          )}

          {skills.length > 0 && (
            <ul
              aria-label="Skills"
              className={cn(
                "mt-4 flex flex-wrap gap-1.5",
                compact("max-sm:hidden"),
              )}
            >
              {skills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-full border border-line bg-surface-2 px-2.5 py-1 text-[0.75rem] leading-none text-muted"
                >
                  {skill}
                </li>
              ))}
              {hiddenSkills > 0 && (
                <li className="rounded-full px-1.5 py-1 text-[0.75rem] leading-none text-faint">
                  +{hiddenSkills}
                  <span className="sr-only"> more</span>
                </li>
              )}
            </ul>
          )}

          {c.link?.verified && (
            <p className="mt-4 inline-flex items-center gap-1.5 text-[0.8125rem] text-positive">
              <Icon name="BadgeCheck" size={15} />
              Verified credential
            </p>
          )}

          {(openable || c.link) && (
            <div className={cn("mt-auto pt-5", compact("max-sm:pt-1"))}>
              <div
                className={cn(
                  "flex items-center justify-between gap-3 border-t border-line pt-4",
                  compact("max-sm:border-t-0 max-sm:pt-0"),
                )}
              >
                {openable ? (
                  <button
                    type="button"
                    onClick={() => onOpen(c.id)}
                    onPointerEnter={() => preloadCertificate(c)}
                    onFocus={() => preloadCertificate(c)}
                    data-cursor="view"
                    data-cursor-label="View"
                    className={cn(
                      "cert-open group/open inline-flex h-10 shrink-0 cursor-pointer items-center gap-1.5 text-sm font-medium text-text outline-none after:absolute after:inset-0 after:content-[''] pointer-coarse:h-11",
                      compact("max-sm:h-9 max-sm:text-[0.8125rem] max-sm:text-accent-ink"),
                    )}
                  >
                    View certificate
                    <Icon
                      name="ArrowRight"
                      size={15}
                      className="text-accent-ink transition-transform duration-200 ease-[var(--ease-out)] [.cert-card:hover_&]:translate-x-0.5"
                    />
                    <span className="sr-only">: {c.title}</span>
                  </button>
                ) : (
                  <span />
                )}

                {c.link ? (
                  <CredentialLink link={c.link} title={c.title} />
                ) : (
                  c.credentialId && (
                    /* The printed ID, so a reader can match the card to the
                       document — and quote it to the issuer — without opening
                       anything. Plain mono, not `label-mono`: that utility
                       uppercases, and these IDs are case-sensitive
                       ("gbnWLJB4X1coKp6g" is not "GBNWLJB4X1COKP6G"). */
                    <span
                      title={c.credentialId}
                      className={cn(
                        "min-w-0 truncate font-mono text-[0.75rem] text-faint",
                        compact("max-sm:hidden"),
                      )}
                    >
                      <span aria-hidden="true">ID </span>
                      <span className="sr-only">Credential ID </span>
                      {c.credentialId}
                    </span>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

/**
 * "Verify" only when the author has confirmed the credential verifies. A URL
 * on its own is a link to a page, and the card says exactly that.
 */
export function CredentialLink({ link, title, className }) {
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group/link relative z-10 inline-flex h-10 shrink-0 items-center gap-1 rounded-sm text-[0.8125rem] text-accent-ink underline decoration-1 underline-offset-4 decoration-[color-mix(in_oklab,var(--accent-ink)_35%,transparent)] transition-colors duration-200 hover:decoration-[var(--accent-ink)] pointer-coarse:h-11",
        className,
      )}
    >
      {link.verified ? "Verify" : "View credential"}
      <Icon
        name="ArrowUpRight"
        size={14}
        className="transition-transform duration-200 ease-[var(--ease-out)] group-hover/link:-translate-y-px group-hover/link:translate-x-px"
      />
      <span className="sr-only">
        {` for ${title} (opens in a new tab)`}
      </span>
    </a>
  );
}
