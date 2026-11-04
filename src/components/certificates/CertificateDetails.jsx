"use client";

import { useState } from "react";

import { Icon } from "@/components/ui/Icon";
import { IssuerMark } from "@/components/certificates/IssuerMark";
import { CredentialLink } from "@/components/certificates/CertificateCard";

/**
 * The certificate's metadata, beside it in the viewer.
 *
 * Every row is conditional. A certificate with only a title and an issuer
 * shows exactly that, with no "N/A" rows standing in for what is not known.
 */
export function CertificateDetails({ certificate: c, onHide }) {
  const facts = [
    c.issued && ["Issued", c.issued.label],
    c.expires && [c.expires.past ? "Expired" : "Valid through", c.expires.label],
    c.level && ["Level", c.level],
    c.duration && ["Duration", c.duration],
  ].filter(Boolean);

  return (
    <div className="flex flex-col gap-6 p-5 sm:p-6">
      {/* Sheet header, on screens where the details slide over the stage. */}
      <div className="-mb-2 flex items-center justify-between lg:hidden">
        <span className="label-mono text-faint">Details</span>
        <button
          type="button"
          onClick={onHide}
          className="inline-flex h-11 cursor-pointer items-center gap-1.5 rounded-full px-3 text-sm text-muted transition-colors duration-200 hover:bg-surface-2 hover:text-text"
        >
          Hide
          <Icon name="ChevronDown" size={15} />
        </button>
      </div>

      <div>
        {c.category && (
          <p className="label-mono mb-3 text-accent-ink">{c.category}</p>
        )}
        {/* The dialog's accessible name is the header's h2, which carries the
            full title even where it is visually truncated. Repeating it here
            for assistive tech would read it twice. */}
        <p
          aria-hidden="true"
          className="text-[1.375rem] font-medium leading-tight tracking-tight text-pretty text-text"
        >
          {c.title}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <IssuerMark issuer={c.issuer} logo={c.issuerLogo} />
        <div className="min-w-0">
          <p className="label-mono text-faint">Issued by</p>
          <p className="mt-1.5 text-[0.9375rem] font-medium text-text">{c.issuer}</p>
        </div>
      </div>

      {c.distinction && (
        <p className="w-fit rounded-md border border-line-accent bg-accent-soft px-4 py-3 font-display text-2xl leading-none font-normal tracking-tight text-accent-ink">
          {c.distinction}
        </p>
      )}

      {c.description && (
        <p className="text-sm leading-relaxed text-muted">{c.description}</p>
      )}

      {(facts.length > 0 || c.credentialId) && (
        <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-3 border-y border-line py-5 text-sm">
          {facts.map(([term, value]) => (
            <Fact key={term} term={term}>
              {value}
            </Fact>
          ))}
          {c.credentialId && (
            <Fact term="Credential ID">
              <CredentialId value={c.credentialId} />
            </Fact>
          )}
        </dl>
      )}

      {c.skills.length > 0 && (
        <div>
          <p className="label-mono mb-3 text-faint">Skills</p>
          <ul className="flex flex-wrap gap-1.5">
            {c.skills.map((skill) => (
              <li
                key={skill}
                className="rounded-full border border-line bg-surface-2 px-2.5 py-1.5 text-[0.8125rem] leading-none text-muted"
              >
                {skill}
              </li>
            ))}
          </ul>
        </div>
      )}

      {c.link && (
        <div className="rounded-md border border-line bg-surface-2 p-4">
          {c.link.verified ? (
            <p className="flex items-center gap-2 text-sm font-medium text-positive">
              <Icon name="BadgeCheck" size={16} />
              Verified credential
            </p>
          ) : (
            <p className="text-sm text-muted">
              The issuer publishes a page for this credential.
            </p>
          )}
          <CredentialLink link={c.link} title={c.title} className="mt-1" />
        </div>
      )}

      <a
        href={c.document.src}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-11 w-fit items-center gap-2 rounded-full border border-line bg-surface-1 px-4 text-sm text-text transition-colors duration-200 hover:border-line-strong hover:bg-surface-2"
      >
        <Icon name={c.document.kind === "pdf" ? "FileText" : "ExternalLink"} size={15} />
        {c.document.kind === "pdf" ? "Open PDF" : "Open original"}
        <span className="sr-only">(opens in a new tab)</span>
      </a>

      <KeyboardLegend />
    </div>
  );
}

function Fact({ term, children }) {
  return (
    <>
      <dt className="text-faint">{term}</dt>
      <dd className="min-w-0 text-text">{children}</dd>
    </>
  );
}

function CredentialId({ value }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard blocked (an insecure context, a denied permission). The ID
      // is plain selectable text right beside the button, so nothing is lost.
    }
  };

  return (
    <span className="flex items-center gap-2">
      <span className="min-w-0 font-mono text-[0.8125rem] break-all">{value}</span>
      <button
        type="button"
        onClick={copy}
        className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-sm text-faint transition-colors duration-200 hover:bg-surface-2 hover:text-text pointer-coarse:size-11"
      >
        <Icon
          name={copied ? "Check" : "Copy"}
          size={14}
          label={copied ? "Copied" : "Copy credential ID"}
        />
      </button>
    </span>
  );
}

/* Hidden on touch screens, which have no keyboard to use it with. */
function KeyboardLegend() {
  const keys = [
    [["←", "→"], "Browse"],
    [["+", "−"], "Zoom"],
    [["0"], "Fit"],
    [["F"], "Fullscreen"],
    [["Esc"], "Close"],
  ];

  return (
    <dl className="hidden flex-wrap gap-x-4 gap-y-2 border-t border-line pt-5 lg:flex pointer-coarse:hidden">
      {keys.map(([combo, label]) => (
        <div key={label} className="flex items-center gap-1.5">
          <dt className="flex gap-1">
            {combo.map((key) => (
              <kbd
                key={key}
                className="label-mono grid h-5 min-w-5 place-items-center rounded-xs border border-line bg-surface-2 px-1 text-faint"
              >
                {key}
              </kbd>
            ))}
          </dt>
          <dd className="label-mono text-faint">{label}</dd>
        </div>
      ))}
    </dl>
  );
}
