import { certificates as authored } from "@/data/certificates";
import { getCertificates, summarize } from "@/lib/certificates";

import { Section } from "@/components/layout/Section";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { CertificateExplorer } from "@/components/certificates/CertificateExplorer";

/**
 * Certifications.
 *
 * A server component. It reads the data file, measures every certificate file
 * on disk, and hands the client a finished, serialisable list, so the grid is
 * complete in the HTML before any JavaScript arrives.
 *
 * `items` exists so the section can be rendered against another list, which is
 * how it was tested against portrait, landscape, PDF and incomplete entries.
 * The page passes nothing and gets the real data.
 */
export async function CertificatesSection({ items = authored, id = "certifications" }) {
  const certificates = await getCertificates(items);
  if (certificates.length === 0) return null;

  const stats = summarize(certificates);

  return (
    <Section
      id={id}
      tone="certifications"
      eyebrow="Certifications"
      heading="Proof of continuous learning."
      intro="The courses and credentials behind the work: what each one covered, who issued it, and when."
    >
      <CertificateStats stats={stats} />

      <Reveal delay={0.05} className="mt-12 sm:mt-14">
        <CertificateExplorer certificates={certificates} />
      </Reveal>
    </Section>
  );
}

/**
 * The header figures. Counted from the data, so they are always exactly what
 * the grid below contains.
 */
function CertificateStats({ stats }) {
  return (
    /* One row at every width. Three short figures do not need a second line on
       a phone, and stacking them cost a full screen of scrolling before the
       first certificate. */
    <Stagger
      as="dl"
      step={0.05}
      className="grid grid-cols-3 border-y border-line"
    >
      {stats.map((stat, index) => (
        <StaggerItem
          key={stat.label}
          className={
            index === 0
              ? "py-5 pr-3 sm:py-8 sm:pr-6"
              : "border-l border-line py-5 pl-4 sm:py-8 sm:pl-8"
          }
        >
          <dt className="label-mono text-faint">{stat.label}</dt>
          <dd className="mt-3 font-display text-[clamp(1.75rem,1.1rem+2.6vw,3.5rem)] leading-none font-normal tracking-tight text-text tabular-nums">
            {stat.value}
          </dd>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
