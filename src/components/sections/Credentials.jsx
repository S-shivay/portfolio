import { site } from "@/data/site";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Credentials: education and languages.
 *
 * Certifications and the honour certificate used to live here too. They now
 * have their own section (src/components/certificates), with the documents
 * themselves, filters and a viewer, and their data lives in
 * src/data/certificates.js.
 */
export function Credentials() {
  return (
    <Reveal className="mt-3">
      <div className="grid gap-3 md:grid-cols-12">
        <Panel icon="BookOpen" title="Education" className="md:col-span-7">
          <ul className="flex flex-col gap-4">
            {site.education.map((entry) => (
              <li key={entry.institution}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm text-text">{entry.qualification}</p>
                  <span className="label-mono shrink-0 text-faint">
                    {entry.year}
                  </span>
                </div>
                <p className="mt-1 text-[0.8125rem] leading-relaxed text-faint">
                  {entry.institution}
                </p>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel icon="Globe" title="Languages" className="md:col-span-5">
          <ul className="flex flex-wrap gap-2">
            {site.languages.map((language) => (
              <li
                key={language}
                className="label-mono rounded-full border border-line bg-surface-2 px-3 py-1.5 text-muted"
              >
                {language}
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </Reveal>
  );
}

function Panel({ icon, title, children, className }) {
  return (
    <div
      className={cn(
        "rounded-md card-accent border bg-surface-1 p-6 shadow-e1",
        className,
      )}
    >
      <div className="mb-5 flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-md border border-line bg-surface-2 text-accent-ink">
          <Icon name={icon} size={16} />
        </span>
        <h3 className="text-[1.0625rem] font-medium tracking-tight text-text">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}
