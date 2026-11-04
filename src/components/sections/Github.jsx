import Image from "next/image";

import { github, languageColor } from "@/data/github.mjs";
import { getGithubStats } from "@/lib/github";

import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { Icon, GithubIcon } from "@/components/ui/Icon";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { GithubLanguages } from "@/components/sections/GithubLanguages";

/* Fixed locale and timezone: the same string has to come out of the server
   render and the client hydration, and "December 2021" must not become
   "November 2021" for a visitor west of UTC. */
const monthYear = (iso) =>
  new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));

const shortDate = (iso) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));

/**
 * GitHub.
 *
 * An async server component: the profile and repository list are fetched from
 * GitHub's public API while the page renders, cached for six hours, and
 * derived into the counts shown here. Nothing on this panel is a hand-typed
 * number — which is the only honest way to put statistics about your own code
 * on a portfolio, and incidentally the only version that stays true next month.
 *
 * The grid is the account's own work, not the case studies: Job24, the HRMS
 * and the client projects are private company repositories and have no public
 * code to link to. What it shows instead are the builds that do exist here,
 * chosen rather than dumped — a profile read straight out of the API would
 * list every interview exercise on the account and bury the six worth opening.
 */
export async function Github() {
  const stats = await getGithubStats();

  return (
    <Section
      id="github"
      eyebrow={github.eyebrow}
      heading={github.heading}
      intro={github.intro}
    >
      <div className="grid gap-3 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <ProfileCard stats={stats} />
        </Reveal>

        <Reveal delay={0.06} className="lg:col-span-7">
          <div className="h-full rounded-md card-accent border bg-surface-1 p-6 shadow-e1 sm:p-7">
            <GithubLanguages
              languages={stats.languages}
              repoCount={stats.languageRepos}
              title={github.languagesTitle}
              note={github.languagesNote}
            />
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.04} className="mt-3">
        <RepoIndex stats={stats} />
      </Reveal>
    </Section>
  );
}

/**
 * The identity card. Everything on it — avatar, handle, join date, repository
 * count — comes from the API response, including the image, which is why the
 * avatar can never go stale against the real profile.
 */
function ProfileCard({ stats }) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-md card-accent border bg-surface-1 p-6 shadow-e1 sm:p-7">
      <div
        aria-hidden="true"
        className="dot-grid mask-fade-edges pointer-events-none absolute inset-0 opacity-60"
      />

      <div className="relative flex items-start justify-between gap-4">
        <span className="relative grid size-16 shrink-0 place-items-center rounded-full bg-accent-soft ring-1 ring-line-accent">
          <Image
            src={stats.avatarUrl}
            alt=""
            width={64}
            height={64}
            className="size-16 rounded-full object-cover"
            /* Decorative: the handle beside it is the accessible name, and an
               avatar described twice is noise in a screen reader. */
            aria-hidden="true"
            unoptimized
          />
        </span>

        <SourceBadge live={stats.live} capturedAt={stats.capturedAt} />
      </div>

      <p className="relative mt-5 font-mono text-[1.0625rem] text-text">
        @{stats.handle}
      </p>
      <p className="relative mt-1 text-sm text-muted">
        github.com/{stats.handle}
      </p>

      {/* The three numbers, straight from the API. */}
      {/* "Repos" rather than "Repositories": at 390px the three labels share
          about 90px each, and the longer word is the one that collides. */}
      <dl className="relative mt-7 grid grid-cols-3 gap-4 border-t border-line pt-6">
        <Stat label="Repos" value={stats.publicRepos} />
        <Stat label="Languages" value={stats.languages.length} />
        <Stat label="Since" value={monthYear(stats.joined).split(" ")[0].slice(0, 3)} sub={monthYear(stats.joined).split(" ")[1]} />
      </dl>

      <p className="relative mt-6 text-sm leading-relaxed text-muted">
        {stats.forkedRepos > 0
          ? `${stats.authoredRepos} written from scratch, ${stats.forkedRepos} forked to read.`
          : `${stats.authoredRepos} written from scratch.`}{" "}
        {github.profileNote}
      </p>

      <div className="relative mt-auto pt-7">
        <Button
          href={stats.profileUrl}
          variant="secondary"
          icon="ArrowUpRight"
          data-cursor="link"
          className="w-full sm:w-auto"
        >
          <GithubIcon size={16} />
          Open the profile
        </Button>
      </div>
    </div>
  );
}

function Stat({ label, value, sub }) {
  return (
    <div>
      <dt className="label-mono text-faint">{label}</dt>
      <dd className="mt-2 font-display text-[1.5rem] font-medium leading-none tracking-tight text-text tabular-nums">
        {value}
        {sub && (
          <span className="ml-1 align-baseline text-[0.8125rem] font-normal text-muted">
            {sub}
          </span>
        )}
      </dd>
    </div>
  );
}

/**
 * Says where the numbers came from.
 *
 * A live read and a cached snapshot are both honest; passing the second off as
 * the first is not. The badge costs one line and removes the question.
 */
function SourceBadge({ live, capturedAt }) {
  if (live) {
    return (
      <span className="label-mono inline-flex items-center gap-2 rounded-full border border-line-accent bg-accent-soft px-3 py-1.5 text-accent-ink">
        <span
          aria-hidden="true"
          className="size-1.5 rounded-full bg-accent"
          style={{ animation: "blink 2.4s var(--ease-in-out) infinite" }}
        />
        Live from the API
      </span>
    );
  }

  return (
    <span className="label-mono inline-flex items-center gap-2 rounded-full border border-line bg-surface-2 px-3 py-1.5 text-faint">
      <Icon name="Clock" size={11} />
      As of {shortDate(capturedAt)}
    </span>
  );
}

/**
 * The repository grid.
 *
 * Hand-picked builds, but never hand-written links: each card names the
 * repositories it belongs to and those names are resolved against the live API
 * response. A repository that has been renamed, deleted or made private drops
 * out of the grid instead of leaving a 404 on the page, and the language and
 * demo URL on every card are whatever GitHub says they are today.
 */
function RepoIndex({ stats }) {
  const byName = new Map(stats.repos?.map((repo) => [repo.name, repo]) ?? []);

  const cards = github.featuredRepos
    .map((entry) => ({
      ...entry,
      /* Drop any repository the API did not return, then drop the whole card
         if that leaves it with nothing to link to. */
      resolved: entry.repos
        .map((repo) => ({ ...repo, ...byName.get(repo.name) }))
        .filter((repo) => repo.url),
    }))
    .filter((entry) => entry.resolved.length > 0);

  return (
    <div className="rounded-md card-accent border bg-surface-1 p-6 shadow-e1 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div className="min-w-0">
          <h3 className="flex items-center gap-2.5 text-[1.0625rem] font-medium tracking-tight text-text">
            <GithubIcon size={17} className="shrink-0 text-muted" />
            {github.reposTitle}
          </h3>
          <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-muted">
            {github.reposNote}
          </p>
        </div>

        <span className="label-mono shrink-0 rounded-full border border-line bg-surface-2 px-3 py-1.5 text-faint tabular-nums">
          {cards.length} of {stats.authoredRepos}
        </span>
      </div>

      <Stagger step={0.05} as="ul" className="mt-6 grid gap-3 lg:grid-cols-2">
        {cards.map((card) => (
          <StaggerItem key={card.id} as="li" className="h-full">
            <RepoCard card={card} />
          </StaggerItem>
        ))}
      </Stagger>

      <p className="mt-3 flex items-start gap-3 rounded-md border border-dashed border-line bg-surface-2/40 p-5 text-sm leading-relaxed text-faint">
        <Icon name="Lock" size={15} className="mt-0.5 shrink-0" />
        <span className="max-w-[72ch]">{github.privateNote}</span>
      </p>
    </div>
  );
}

function RepoCard({ card }) {
  const [primary] = card.resolved;
  /* The deployed demo, wherever it is declared. On a split build it is the
     client repository that carries it, but the API is the source either way. */
  const demo = card.resolved.find((repo) => repo.homepage)?.homepage;

  return (
    <div
      data-spotlight=""
      className="relative flex h-full flex-col rounded-md border border-line bg-surface-2/50 p-5 transition-colors duration-200 hover:border-line-accent sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <h4 className="text-[1.0625rem] font-medium leading-snug tracking-tight text-text">
          {card.title}
        </h4>

        {primary.language && (
          <span className="label-mono inline-flex shrink-0 items-center gap-2 text-faint">
            <span
              aria-hidden="true"
              className="size-2.5 rounded-full"
              style={{ background: languageColor(primary.language) }}
            />
            {primary.language}
          </span>
        )}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted">{card.blurb}</p>

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {card.tags.map((tag) => (
          <li
            key={tag}
            className="label-mono rounded-full border border-line bg-surface-1 px-2.5 py-1 text-faint"
          >
            {tag}
          </li>
        ))}
      </ul>

      {/* Links last, and pinned to the bottom so two cards side by side line
          their actions up however long the blurbs above them run. */}
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
        {card.resolved.map((repo) => (
          <a
            key={repo.url}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="link"
            className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border border-line bg-surface-1 px-3.5 py-2 text-[0.8125rem] text-text transition-colors duration-200 hover:border-line-accent hover:text-accent-ink"
          >
            <GithubIcon size={13} className="shrink-0" />
            <span className="font-mono">{repo.name}</span>
            {/* The role is what tells the two halves of a split build apart,
                but at phone width the repository name alone already fills the
                chip — and a chip that wraps onto two lines reads as broken. */}
            {card.resolved.length > 1 && (
              <span className="hidden text-faint sm:inline">{repo.role}</span>
            )}
            <Icon name="ArrowUpRight" size={12} className="shrink-0" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        ))}

        {demo && (
          <a
            href={demo}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="link"
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line-accent bg-accent-soft px-3.5 py-2 text-[0.8125rem] text-accent-ink transition-colors duration-200 hover:bg-accent hover:text-accent-fg"
          >
            <Icon name="Globe" size={13} className="shrink-0" />
            Live demo
            <Icon name="ArrowUpRight" size={12} className="shrink-0" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        )}
      </div>
    </div>
  );
}
