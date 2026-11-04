import { IssuerMark } from "@/components/certificates/IssuerMark";

/**
 * Credentials with no document attached: listed, not staged.
 *
 * These are real (each is on the CV) but there is no file to show, so they get
 * the weight of a line of text rather than a card with a preview area. A
 * card-sized empty frame among the real documents reads as a broken image, and
 * it pushed the last of them onto a row of its own.
 *
 * Not interactive: there is nothing to open. Adding `certificatePdf` or
 * `certificateImage` to an entry moves it up into the grid automatically.
 */
export function CertificateRecords({ items, className }) {
  return (
    <section aria-labelledby="certificate-records-heading" className={className}>
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h3
          id="certificate-records-heading"
          className="text-[1.0625rem] font-medium tracking-tight text-text"
        >
          Also completed
        </h3>
        <p className="text-[0.8125rem] text-faint">
          Listed on the CV, without a digital copy attached here.
        </p>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex h-full items-start gap-3.5 rounded-md border border-line bg-surface-1 p-4 sm:p-5"
          >
            <IssuerMark issuer={item.issuer} logo={item.issuerLogo} />
            <div className="min-w-0 flex-1">
              <p className="text-[0.9375rem] font-medium leading-snug tracking-tight text-text">
                {item.title}
              </p>
              <p className="label-mono mt-1.5 text-faint">
                {item.issuer}
                {item.issued && ` · ${item.issued.label}`}
              </p>
              {item.description && (
                <p className="mt-2.5 line-clamp-2 text-[0.8125rem] leading-relaxed text-muted">
                  {item.description}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
