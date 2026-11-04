import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";

/**
 * The extra sections a case study can carry when it has more to say than the
 * shared fields hold (see `data/job24-detail.js`). Each one takes plain data and
 * lays it out; the numbered section around it comes from `CaseStudy`.
 *
 * Wide tables scroll inside their own frame rather than widening the page, and
 * that frame is focusable so a keyboard can scroll it too.
 */

function Intro({ children }) {
  if (!children) return null;
  return <p className="mb-8 text-[1.0625rem] leading-[1.7] text-muted measure">{children}</p>;
}

/* A label beside its text; collapses to label over text on narrow screens. */
function Ledger({ items }) {
  return (
    <dl className="border-t border-line">
      {items.map(([term, text]) => (
        <div key={term} className="grid gap-1 border-b border-line py-3.5 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-5">
          <dt className="text-sm font-medium text-text">{term}</dt>
          <dd className="text-sm leading-relaxed text-muted">{text}</dd>
        </div>
      ))}
    </dl>
  );
}

function Subhead({ children, className }) {
  return (
    <h3 className={cn("text-[1.0625rem] font-medium tracking-tight text-text", className)}>
      {children}
    </h3>
  );
}

function TableFrame({ label, children }) {
  return (
    <>
      <div
        role="region"
        aria-label={label}
        tabIndex={0}
        className="overflow-x-auto rounded-md border border-line bg-surface-1"
      >
        {children}
      </div>
      {/* Touch browsers hide the scrollbar, so nothing else says there is more. */}
      <p className="mt-2 flex items-center gap-1.5 text-xs text-faint sm:hidden">
        <Icon name="ArrowRight" size={12} />
        Swipe the table sideways to see every column
      </p>
    </>
  );
}

const headCell = "label-mono whitespace-nowrap px-4 py-3 text-faint";

/* ---- Application pipeline ------------------------------------------------- */

/* Node x positions are the centres of the seven equal columns below, so each
   dot sits over its own label at every width. */
const RIBBON =
  "M0 110 C40 110 40 96 80 96 C160 96 160 58 240 58 C320 58 320 104 400 104 C480 104 480 52 560 52 C640 52 640 100 720 100 C800 100 800 46 880 46";
const NODES = [
  [80, 96],
  [240, 58],
  [400, 104],
  [560, 52],
  [720, 100],
];

export function StatusPipeline({ stages, caption, ribbonNote }) {
  const hired = stages.length - 2;
  const rejected = stages.length - 1;

  return (
    <figure className="cs-ribbon mt-4 rounded-md border border-line bg-surface-1 px-4 pb-5 pt-5 md:px-6">
      <svg
        viewBox="0 0 1120 130"
        aria-hidden="true"
        className="hidden h-auto w-full sm:block"
        fill="none"
      >
        <path d={RIBBON} stroke="var(--accent)" strokeOpacity="0.18" strokeWidth="14" strokeLinecap="round" />
        <path
          d={RIBBON}
          pathLength="1"
          stroke="var(--accent)"
          strokeWidth="4"
          strokeLinecap="round"
          className="cs-ribbon-line"
        />
        {NODES.map(([cx, cy]) => (
          <circle key={cx} cx={cx} cy={cy} r="8" fill="var(--surface-1)" stroke="var(--accent)" strokeWidth="3" />
        ))}
        <circle cx="880" cy="46" r="11" fill="var(--accent)" stroke="var(--surface-1)" strokeWidth="3" />
        <circle
          cx="1040"
          cy="100"
          r="8"
          fill="var(--surface-1)"
          stroke="var(--text-faint)"
          strokeWidth="3"
          strokeDasharray="4 4"
        />
      </svg>

      <ol className="flex flex-wrap gap-2 sm:grid sm:grid-cols-7 sm:gap-0">
        {stages.map((stage, i) => (
          <li
            key={stage}
            className={cn(
              "rounded-full border border-line px-3 py-1 text-center text-sm sm:rounded-none sm:border-0 sm:p-0",
              i === hired ? "font-medium text-accent-ink" : i === rejected ? "text-faint" : "text-text",
            )}
          >
            {stage}
          </li>
        ))}
      </ol>

      <figcaption className="mt-4 border-t border-line pt-3 text-sm text-faint">
        {caption} <span className="hidden sm:inline">{ribbonNote}</span>
      </figcaption>
    </figure>
  );
}

/* ---- Employee journey ------------------------------------------------------ */

export function EventJourney({ title, caption, stages }) {
  const last = stages.length - 1;

  return (
    <figure className="mt-4 rounded-md border border-line bg-surface-1 p-5 md:p-6">
      <p className="font-display text-[clamp(1.25rem,2.4vw,1.75rem)] leading-tight tracking-[-0.02em] text-text [overflow-wrap:anywhere]">
        {title}
      </p>
      <ol className="mt-5 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
        {stages.map(([category, code], i) => (
          <li key={category} className="flex min-w-0 items-start gap-2.5">
            <span
              className={cn(
                "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full font-mono text-[0.625rem]",
                i === last ? "bg-accent text-accent-fg" : "border border-line-accent text-accent-ink",
              )}
            >
              {i + 1}
            </span>
            <span className="min-w-0">
              <span className="block text-sm text-text">{category}</span>
              <span className="mt-0.5 block font-mono text-[0.6875rem] leading-snug text-faint [overflow-wrap:anywhere]">
                {code}
              </span>
            </span>
          </li>
        ))}
      </ol>
      <figcaption className="mt-5 border-t border-line pt-3 text-sm text-faint">{caption}</figcaption>
    </figure>
  );
}

/* ---- Project record -------------------------------------------------------- */

export function ProjectRecord({ items }) {
  return (
    <Reveal>
      <Ledger items={items} />
    </Reveal>
  );
}

/* ---- What it does --------------------------------------------------------- */

export function FeatureAtlas({ intro, features }) {
  return (
    <>
      <Intro>{intro}</Intro>
      <Stagger step={0.04} className="grid gap-3 md:grid-cols-2">
        {features.map((feature) => (
          <StaggerItem key={feature.title} className={cn(feature.wide && "md:col-span-2")}>
            <FeatureCard feature={feature} />
          </StaggerItem>
        ))}
      </Stagger>
    </>
  );
}

function FeatureCard({ feature }) {
  return (
    <article
      data-spotlight=""
      className="group/card relative flex h-full flex-col rounded-md border border-line bg-surface-1 p-5 shadow-e1 transition-[box-shadow] duration-500 ease-[var(--ease-out)] hover:shadow-e2 md:p-6"
    >
      <div className={cn("flex gap-3", feature.route ? "items-start" : "items-center")}>
        <span className="grid size-9 shrink-0 place-items-center rounded-md border border-line bg-surface-2 text-accent-ink transition-colors duration-300 group-hover/card:border-transparent group-hover/card:bg-accent group-hover/card:text-accent-fg">
          <Icon name={feature.icon} size={16} />
        </span>
        <div className="min-w-0">
          <h3 className="text-[1.0625rem] font-medium tracking-tight text-text">{feature.title}</h3>
          {feature.route && (
            <p className="mt-1 font-mono text-xs text-faint [overflow-wrap:anywhere]">{feature.route}</p>
          )}
        </div>
      </div>

      {feature.lead && <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">{feature.lead}</p>}

      {feature.steps && (
        <ol className="mt-4 flex flex-wrap items-center gap-x-1.5 gap-y-2">
          {feature.steps.map((step, i) => (
            <li key={step} className="flex items-center gap-1.5">
              <span className="flex items-center gap-2 rounded-full border border-line bg-surface-2 py-1 pl-1.5 pr-3 text-sm text-text">
                <span className="grid size-5 place-items-center rounded-full bg-accent font-mono text-[0.6875rem] text-accent-fg">
                  {i + 1}
                </span>
                {step}
              </span>
              {i < feature.steps.length - 1 && (
                <Icon name="ArrowRight" size={12} className="text-faint" />
              )}
            </li>
          ))}
        </ol>
      )}

      {feature.tags && (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {feature.tags.map((tag) => (
            <li key={tag} className="rounded-full border border-line bg-surface-2 px-2.5 py-1 text-xs text-text">
              {tag}
            </li>
          ))}
        </ul>
      )}

      {feature.groups && (
        <dl className="mt-4 flex flex-col gap-3 border-t border-line pt-3">
          {feature.groups.map(([label, items]) => (
            <div key={label} className="grid gap-1.5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-4">
              <dt className="text-sm font-medium text-text">{label}</dt>
              <dd className="flex flex-wrap gap-1.5">
                {items.map((item) => (
                  <span key={item} className="rounded-full border border-line bg-surface-2 px-2.5 py-0.5 text-xs text-text">
                    {item}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {feature.points && (
        <ul className={cn("mt-4 flex flex-col gap-2.5", feature.wide && !feature.table && "lg:grid lg:grid-cols-2 lg:gap-x-8")}>
          {feature.points.map((point) => (
            <li key={point} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted">
              <Icon name="Check" size={14} className="mt-1 shrink-0 text-accent-ink" />
              {point}
            </li>
          ))}
        </ul>
      )}

      {feature.note && (
        <p className="mt-4 border-t border-line pt-3 text-sm leading-relaxed text-muted">{feature.note}</p>
      )}

      {feature.table && (
        <div className="mt-5 overflow-hidden rounded-sm border border-line">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">{feature.table.caption}</caption>
            <thead>
              <tr className="border-b border-line bg-surface-2">
                {feature.table.head.map((cell) => (
                  <th key={cell} scope="col" className="label-mono px-4 py-2.5 text-faint">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {feature.table.rows.map(([mode, fields]) => (
                <tr key={mode} className="border-b border-line transition-colors duration-200 last:border-b-0 hover:bg-accent-soft">
                  <th scope="row" className="whitespace-nowrap px-4 py-2.5 text-sm font-normal text-text">
                    {mode}
                  </th>
                  <td className="px-4 py-2.5 text-sm text-muted">{fields}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </article>
  );
}

/* ---- Lifecycle timeline ---------------------------------------------------- */

export function LifecycleTimeline({ intro, categoriesTitle, categories, notes, access }) {
  return (
    <>
      <Intro>{intro}</Intro>

      <Subhead>{categoriesTitle}</Subhead>
      <Reveal>
        <dl className="mt-4 border-t border-line">
          {categories.map(([category, codes, extra]) => (
            <div key={category} className="grid gap-2 border-b border-line py-3 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-4">
              <dt className="text-sm font-medium text-text">{category}</dt>
              <dd className="flex flex-wrap items-center gap-1.5">
                {codes.map((code) => (
                  <code key={code} className="rounded-sm border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[0.6875rem] text-text [overflow-wrap:anywhere]">
                    {code}
                  </code>
                ))}
                {extra && <span className="text-sm text-muted">{extra}</span>}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <Stagger step={0.05} className="mt-10 grid gap-3 md:grid-cols-2">
        {notes.map((note) => (
          <StaggerItem key={note.title}>
            <article
              data-spotlight=""
              className="relative h-full rounded-md border border-line bg-surface-1 p-5 shadow-e1"
            >
              <span className="flex items-center gap-2.5">
                <span className="grid size-8 place-items-center rounded-md border border-line bg-surface-2 text-accent-ink">
                  <Icon name={note.icon} size={15} />
                </span>
                <h3 className="text-[1.0625rem] font-medium tracking-tight text-text">{note.title}</h3>
              </span>
              <p className="mt-3 text-sm leading-relaxed text-muted">{note.body}</p>
            </article>
          </StaggerItem>
        ))}
      </Stagger>

      <Subhead className="mt-12">{access.title}</Subhead>
      <Reveal>
        <div className="mt-4">
          <TableFrame label={access.title}>
            <table className="w-full min-w-[42rem] border-collapse text-left">
              <caption className="sr-only">What each role can see and do on the timeline</caption>
              <thead>
                <tr className="border-b border-line bg-surface-2">
                  {access.head.map((cell) => (
                    <th key={cell} scope="col" className={headCell}>{cell}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {access.rows.map(([rule, ...cells]) => (
                  <tr key={rule} className="border-b border-line align-top transition-colors duration-200 last:border-b-0 hover:bg-accent-soft">
                    <th scope="row" className="px-4 py-3 text-sm font-normal text-text">{rule}</th>
                    {cells.map((cell, i) => (
                      <td key={i} className={cn("px-4 py-3 text-sm", cell === "No" || cell === "Never" ? "text-faint" : "text-muted")}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </TableFrame>
        </div>
      </Reveal>
    </>
  );
}

/* ---- Tax year -------------------------------------------------------------- */

/**
 * A swimlane on wide screens, one column per kind of user, with the steps numbered
 * in the order they happen. Narrower screens have no room for four lanes, so it
 * becomes a numbered list with the lane named on each step.
 */
export function TaxYearFlow({ intro, lanes, steps, caption, ledger }) {
  return (
    <>
      <Intro>{intro}</Intro>

      <Reveal>
        <figure className="rounded-md border border-line bg-surface-1 p-5 md:p-6">
          <div aria-hidden="true" className="mb-3 hidden grid-cols-4 gap-2 xl:grid">
            {lanes.map((lane) => (
              <p key={lane} className="border-b border-line pb-2 text-xs font-medium text-muted">{lane}</p>
            ))}
          </div>
          <ol className="grid grid-cols-1 gap-2 xl:grid-cols-4">
            {steps.map((step, i) => (
              <li
                key={step.title}
                style={{ "--lane": step.lane + 1 }}
                className={cn(
                  "min-w-0 rounded-sm border p-3 xl:[grid-column-start:var(--lane)]",
                  step.key
                    ? "border-line-accent bg-accent-soft"
                    : step.external
                      ? "border-dashed border-line-strong"
                      : "border-line bg-surface-2/60",
                )}
              >
                <span className="flex items-start gap-2">
                  <span className="mt-px font-mono text-xs text-accent-ink tabular-nums">{i + 1}</span>
                  <span className="min-w-0">
                    <span className="block text-sm text-text">{step.title}</span>
                    <span className="mt-0.5 block text-xs leading-snug text-faint">{step.note}</span>
                    <span className="mt-1.5 block font-mono text-[0.6875rem] text-muted xl:hidden">
                      {lanes[step.lane]}
                    </span>
                  </span>
                </span>
              </li>
            ))}
          </ol>
          <figcaption className="mt-5 border-t border-line pt-4 text-sm leading-relaxed text-muted measure">
            {caption}
          </figcaption>
        </figure>
      </Reveal>

      <Reveal>
        <div className="mt-8">
          <Ledger items={ledger} />
        </div>
      </Reveal>
    </>
  );
}

/* ---- Architecture --------------------------------------------------------- */

export function ArchitectureMap({ intro, modules, request, forms, tree, conventions, interceptors }) {
  return (
    <>
      <Intro>{intro}</Intro>

      {modules && (
        <Reveal>
          <TableFrame label="Application modules">
            <table className="w-full min-w-[36rem] border-collapse text-left">
              <caption className="sr-only">Modules, when each is loaded and what it holds</caption>
              <thead>
                <tr className="border-b border-line bg-surface-2">
                  <th scope="col" className={headCell}>Module</th>
                  <th scope="col" className={headCell}>Loaded</th>
                  <th scope="col" className={headCell}>Holds</th>
                </tr>
              </thead>
              <tbody>
                {modules.map((module) => (
                  <tr key={module.name} className="border-b border-line align-top transition-colors duration-200 last:border-b-0 hover:bg-accent-soft">
                    <th scope="row" className="whitespace-nowrap px-4 py-3 font-mono text-xs font-normal text-text">
                      {module.name}
                    </th>
                    <td className="px-4 py-3 text-sm text-muted">{module.loaded}</td>
                    <td className="px-4 py-3 text-sm text-muted">{module.holds}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableFrame>
        </Reveal>
      )}

      <Subhead className={cn(modules && "mt-12")}>{request.title}</Subhead>
      <Reveal>
        <figure className="mt-4 rounded-md border border-line bg-surface-1 p-5 md:p-6">
          <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-3">
            {request.chain.map((step, i) => (
              <li key={step.name} className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "rounded-sm border px-3 py-2 text-sm",
                    step.hot
                      ? "border-line-accent bg-accent-soft text-text"
                      : "border-line bg-surface-2 text-text",
                  )}
                >
                  {step.name}
                  {step.note && (
                    <span className="mt-0.5 block font-mono text-[0.6875rem] text-faint">{step.note}</span>
                  )}
                </span>
                {i < request.chain.length - 1 && (
                  <Icon name="ArrowRight" size={13} className="text-faint" />
                )}
              </li>
            ))}
          </ol>

          <p className="label-mono mt-6 text-faint">
            {request.outcomesLabel ?? "When the auth interceptor sees"}
          </p>
          <ul className="mt-3 grid gap-3 sm:grid-cols-3">
            {request.outcomes.map((outcome) => (
              <li key={outcome.tag} className="rounded-sm border border-line p-4">
                <span className="label-mono rounded-sm bg-accent-soft px-1.5 py-0.5 text-accent-ink">
                  {outcome.tag}
                </span>
                <ol className="mt-3 flex flex-col gap-1.5">
                  {outcome.steps.map((step) => (
                    <li key={step} className="flex items-start gap-2 text-sm text-text">
                      <Icon name="ArrowRight" size={13} className="mt-1 shrink-0 text-accent-ink" />
                      {step}
                    </li>
                  ))}
                </ol>
              </li>
            ))}
          </ul>

          <figcaption className="mt-5 border-t border-line pt-4 text-sm leading-relaxed text-muted measure">
            {request.caption}
          </figcaption>
        </figure>
      </Reveal>

      {forms && (
        <>
          <Subhead className="mt-12">{forms.title}</Subhead>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted measure">{forms.body}</p>
          <Reveal>
            <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
              <pre
                tabIndex={0}
                className="overflow-x-auto rounded-md border border-line bg-surface-2 p-5 font-mono text-[0.8125rem] leading-relaxed text-text"
              >
                <code>{forms.code}</code>
              </pre>

              {/* A static picture of what the config above produces. */}
              <div className="rounded-md border border-line bg-surface-1 p-5">
                <p className="label-mono text-faint">Rendered by the shared layout</p>
                <div className="mt-4 flex flex-col gap-4">
                  <div>
                    <p className="text-xs text-muted">Job Type</p>
                    <p className="mt-1 flex h-10 items-center justify-between rounded-sm border border-accent px-3 text-sm text-faint">
                      Select
                      <Icon name="ChevronDown" size={14} />
                    </p>
                    <p className="mt-1.5 text-xs text-accent-ink">This field is required</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Total Vacancies</p>
                    <p className="mt-1 flex h-10 items-center rounded-sm border border-line px-3 text-sm text-text">
                      12
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </>
      )}

      {tree && conventions && (
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <Reveal>
            <Subhead>{tree.title}</Subhead>
            <pre
              tabIndex={0}
              className="mt-4 overflow-x-auto rounded-md border border-line bg-surface-2 p-5 font-mono text-xs leading-relaxed text-text"
            >
              <code>{tree.code}</code>
            </pre>
          </Reveal>
          <Reveal>
            <Subhead className="mb-4">{conventions.title}</Subhead>
            <Ledger items={conventions.items} />
          </Reveal>
        </div>
      )}

      {interceptors && (
        <>
          <Subhead className="mt-12">{interceptors.title}</Subhead>
          <ol className="mt-4 flex flex-wrap gap-1.5">
            {interceptors.names.map((name, i) => (
              <li key={name} className="flex items-center gap-2 rounded-full border border-line bg-surface-1 py-1 pl-1.5 pr-3 text-sm text-text">
                <span className="grid size-5 place-items-center rounded-full bg-accent-soft font-mono text-[0.625rem] text-accent-ink">
                  {i + 1}
                </span>
                {name}
              </li>
            ))}
          </ol>
          <p className="mt-3 text-sm text-muted">{interceptors.note}</p>
        </>
      )}
    </>
  );
}

/* ---- Routes and permissions ------------------------------------------------ */

export function AccessMap({ intro, actions, resources, extraKeys, extraNote, routes }) {
  return (
    <>
      <Intro>{intro}</Intro>

      <Subhead>Permission keys</Subhead>
      <Reveal>
        {/* Compact enough to fit a phone whole: five short columns have no need
            to scroll, and a hidden "deactivate" would read as not existing. */}
        <div className="mt-4 overflow-hidden rounded-md border border-line bg-surface-1">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Actions available on each resource</caption>
            <thead>
              <tr className="border-b border-line bg-surface-2">
                <th scope="col" className="px-3 py-3 font-mono text-[0.625rem] font-normal text-faint sm:px-4 sm:text-xs sm:uppercase sm:tracking-widest">
                  Resource
                </th>
                {actions.map((action) => (
                  <th key={action} scope="col" className="px-1.5 py-3 text-center font-mono text-[0.625rem] font-normal text-faint sm:px-4 sm:text-xs sm:uppercase sm:tracking-widest">
                    {action}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {resources.map((resource) => (
                <tr key={resource} className="border-b border-line transition-colors duration-200 last:border-b-0 hover:bg-accent-soft">
                  <th scope="row" className="px-3 py-3 font-mono text-xs font-normal text-text sm:px-4 sm:text-sm">
                    {resource}
                  </th>
                  {actions.map((action) => (
                    <td key={action} className="px-1.5 py-3 text-center text-accent-ink sm:px-4">
                      <Icon name="Check" size={15} className="inline-block" label={`${resource}.${action}`} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      <p className="mt-5 text-sm text-muted">Plus four specific keys:</p>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {extraKeys.map((key) => (
          <li key={key} className="rounded-sm border border-line bg-surface-2 px-2 py-1 font-mono text-xs text-text [overflow-wrap:anywhere]">
            {key}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-muted">{extraNote}</p>

      <Subhead className="mt-12">Routes</Subhead>
      <Reveal>
        <div className="mt-4">
          <TableFrame label="Routes">
            <table className="w-full min-w-[40rem] border-collapse text-left">
              <caption className="sr-only">Every route, its screen and what it requires</caption>
              <thead>
                <tr className="border-b border-line bg-surface-2">
                  <th scope="col" className={headCell}>Path</th>
                  <th scope="col" className={headCell}>Screen</th>
                  <th scope="col" className={headCell}>Requires</th>
                </tr>
              </thead>
              {routes.map((section) => (
                <tbody key={section.group}>
                  <tr className="border-b border-line bg-surface-2/50">
                    <th colSpan={3} scope="rowgroup" className="px-4 py-2.5 text-sm font-medium text-text">
                      {section.group}
                    </th>
                  </tr>
                  {section.rows.map(([path, screen, requires]) => (
                    <tr key={path} className="border-b border-line align-top transition-colors duration-200 hover:bg-accent-soft">
                      <th scope="row" className="w-[42%] px-4 py-2.5 font-mono text-xs font-normal leading-relaxed text-text [overflow-wrap:anywhere]">
                        {path}
                      </th>
                      <td className="px-4 py-2.5 text-sm text-muted">{screen}</td>
                      <td className="px-4 py-2.5 font-mono text-xs leading-relaxed text-muted [overflow-wrap:anywhere]">
                        {requires}
                      </td>
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </TableFrame>
        </div>
      </Reveal>
    </>
  );
}

/* ---- By the numbers -------------------------------------------------------- */

const format = (value) => value.toLocaleString("en-US");

/**
 * One series in one hue, so no legend: the title names it. It is a real table
 * with a bar drawn in the value cell, which makes the numbers the table view and
 * keeps them readable without the marks. The bars are not in a scroll frame:
 * `view()` on `.cs-bar` needs the page as its nearest scroller.
 */
function BarTable({ title, unit, rows, total: declaredTotal }) {
  const max = Math.max(...rows.map(([, value]) => value));
  const listed = rows.reduce((sum, [, value]) => sum + value, 0);
  /* The whole can be more than the rows shown, and shares are of the whole. */
  const total = declaredTotal ?? listed;

  return (
    <div>
      <Subhead>{title}</Subhead>
      <table className="mt-4 w-full border-collapse text-left">
        <caption className="sr-only">
          {title}, {format(listed)} of {format(total)} {unit}
        </caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">Name</th>
            <th scope="col">{unit}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, value]) => (
            <tr key={name} className="group/row transition-colors duration-200 hover:bg-accent-soft">
              <th scope="row" className="whitespace-nowrap py-1.5 pl-1 pr-4 text-sm font-normal text-muted group-hover/row:text-text">
                {name}
              </th>
              <td className="w-full py-1.5 pr-1">
                <div className="flex items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className="cs-bar block h-3.5 shrink-0 rounded-r-[4px] bg-accent"
                    /* Scaled against the room left after the labels, and never
                       shrunk, so bar lengths stay in exact proportion. */
                    style={{ width: `calc((100% - 6.5rem) * ${value / max})` }}
                  />
                  <span className="font-mono text-sm tabular-nums text-text">{format(value)}</span>
                  <span
                    aria-hidden="true"
                    className="font-mono text-xs tabular-nums text-faint opacity-0 transition-opacity duration-200 group-hover/row:opacity-100"
                  >
                    {Math.round((value / total) * 100)}%
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {listed !== total && (
        <p className="mt-3 text-sm text-faint">
          These areas hold {format(listed)} of the {format(total)} {unit}.
        </p>
      )}
    </div>
  );
}

export function ByTheNumbers({ intro, charts, blocksTitle = "Building blocks", blocks }) {
  return (
    <>
      <Intro>{intro}</Intro>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {charts.map((chart) => (
          <BarTable key={chart.title} {...chart} />
        ))}
      </div>

      <Subhead className="mt-12">{blocksTitle}</Subhead>
      <Stagger as="dl" step={0.05} className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
        {blocks.map(([label, value]) => (
          <StaggerItem key={label} className="flex flex-col-reverse justify-end gap-2 rounded-md border border-line bg-surface-1 px-5 py-4">
            <dt className="text-sm text-muted">{label}</dt>
            <dd className="font-display text-[clamp(1.5rem,2.6vw,2rem)] leading-none tracking-[-0.03em] text-text tabular-nums">
              {format(value)}
            </dd>
          </StaggerItem>
        ))}
      </Stagger>
    </>
  );
}

/* ---- Tech stack ------------------------------------------------------------ */

export function StackLedger({ intro, groups, designSystem }) {
  return (
    <>
      <Intro>{intro}</Intro>
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2">
        {groups.map((group) => (
          <Reveal key={group.label}>
            <Subhead>{group.label}</Subhead>
            <dl className="mt-3 border-t border-line">
              {group.items.map(([name, version, use]) => (
                <div key={name} className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-3 border-b border-line py-3">
                  <dt className="text-sm font-medium text-text">{name}</dt>
                  <dd className="font-mono text-xs text-accent-ink">{version}</dd>
                  <dd className="col-span-2 mt-1 text-sm leading-relaxed text-muted">{use}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        ))}
      </div>

      {designSystem && (
        <>
          <Subhead className="mt-12">{designSystem.title}</Subhead>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted measure">{designSystem.body}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {designSystem.themes.map((theme) => (
              <div key={theme.name} className="rounded-md border border-line bg-surface-1 p-4">
                <p className="label-mono text-faint">{theme.name}</p>
                <ul className="mt-3 flex flex-col gap-2">
                  {theme.tokens.map(([name, hex]) => (
                    <li key={name} className="flex items-center gap-2.5 text-sm text-muted">
                      {/* The app's own colours, not this site's: they are the content. */}
                      <span
                        aria-hidden="true"
                        className="size-5 shrink-0 rounded-sm border border-line"
                        style={{ background: hex }}
                      />
                      <span className="flex-1">{name}</span>
                      <span className="font-mono text-xs text-faint">{hex}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
