/**
 * ============================================================================
 * GITHUB — fetching and derivation
 * ============================================================================
 *
 * Every figure the GitHub section displays is computed here, from GitHub's own
 * public REST API. Nothing in the section is a number typed by hand, which is
 * the point: a portfolio claim about your own code is the easiest thing in the
 * world to inflate and the easiest thing for an interviewer to check.
 *
 * Two unauthenticated requests — the profile and the repository list. No token
 * is required; the unauthenticated limit is 60 requests an hour per IP, which a
 * six-hour cache is comfortably inside. If you ever want a token anyway (higher
 * limits, or private repository counts), read it from process.env on the server
 * and pass it as `token` — it never reaches the browser.
 *
 * `.mjs` rather than `.js` so `scripts/github-snapshot.mjs` can import the same
 * derivation Next uses. Without a `"type": "module"` in package.json, Node
 * would read a bare `.js` as CommonJS and refuse the `export` below.
 */

const API = "https://api.github.com";

/** How long a page holds the fetched data before revalidating. Six hours. */
export const GITHUB_REVALIDATE = 21600;

/**
 * The set the language breakdown is computed over.
 *
 * Forks are excluded because a fork is somebody else's code sitting in your
 * account — counting it as your JavaScript would be the first small lie. Repos
 * with no detected language (empty ones) are excluded because GitHub has
 * nothing to report on them, not because they are inconvenient.
 */
const authored = (repos) => repos.filter((repo) => !repo.fork);

/**
 * Turns the two API responses into exactly what the UI renders.
 *
 * Kept pure and separate from the fetch so the snapshot script produces a file
 * in precisely the shape the live path returns — the fallback can never drift
 * into a different contract from the thing it is standing in for.
 */
export function deriveGithubStats(user, repos) {
  const own = authored(repos);
  const counted = own.filter((repo) => repo.language);

  const tally = new Map();
  for (const repo of counted) {
    tally.set(repo.language, (tally.get(repo.language) ?? 0) + 1);
  }

  const languages = [...tally.entries()]
    .map(([name, count]) => ({
      name,
      count,
      /* Share of the repositories that have a detected language — not of all
         29 — so the segments add up to the number stated beside the bar. */
      share: counted.length ? count / counted.length : 0,
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  return {
    handle: user.login,
    profileUrl: user.html_url,
    avatarUrl: user.avatar_url,
    /** Account creation date — the honest answer to "how long has this existed". */
    joined: user.created_at,
    /** GitHub's own count, which includes forks and empty repositories. */
    publicRepos: user.public_repos,
    authoredRepos: own.length,
    forkedRepos: repos.length - own.length,
    languageRepos: counted.length,
    languages,

    /**
     * Every authored repository, trimmed to the fields the UI uses.
     *
     * The section shows a hand-picked few, but it picks them *from this list*
     * by name rather than from hard-coded URLs: a repository that is renamed,
     * made private or deleted simply stops appearing, instead of leaving a
     * dead link on the page. The live URL, language and demo address always
     * come from GitHub, never from the data file.
     */
    repos: own.map((repo) => ({
      name: repo.name,
      url: repo.html_url,
      language: repo.language,
      /* GitHub's "website" field — the deployed demo where one exists. */
      homepage: repo.homepage || null,
      stars: repo.stargazers_count,
      pushedAt: repo.pushed_at,
    })),
  };
}

/**
 * Fetches and derives. `init` is spread into both requests, which is how the
 * caller passes Next's `next: { revalidate }` in the app and nothing at all in
 * the snapshot script.
 */
export async function fetchGithubStats(handle, { token, init = {} } = {}) {
  const headers = {
    Accept: "application/vnd.github+json",
    /* GitHub rejects unidentified clients, so this is required rather than
       polite. */
    "User-Agent": `portfolio-${handle}`,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const [userResponse, reposResponse] = await Promise.all([
    fetch(`${API}/users/${handle}`, { headers, ...init }),
    fetch(`${API}/users/${handle}/repos?per_page=100&sort=pushed`, {
      headers,
      ...init,
    }),
  ]);

  if (!userResponse.ok || !reposResponse.ok) {
    throw new Error(
      `GitHub API returned ${userResponse.status} / ${reposResponse.status}`,
    );
  }

  const [user, repos] = await Promise.all([
    userResponse.json(),
    reposResponse.json(),
  ]);

  return deriveGithubStats(user, repos);
}
