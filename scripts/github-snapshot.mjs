/**
 * Regenerates src/data/github-snapshot.json from the public GitHub API.
 *
 *   npm run github:snapshot
 *
 * The site reads GitHub live, so this file is only the fallback: what the
 * section shows when the API cannot be reached at build or request time —
 * offline, or past the unauthenticated rate limit. It is real data captured on
 * a real date, and the UI labels it as a snapshot rather than passing it off as
 * live, so the numbers are never wrong, only occasionally old.
 *
 * Re-run it whenever you want the fallback refreshed. Nothing breaks if you
 * forget: the live path is what renders in normal operation.
 */

import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { fetchGithubStats } from "../src/lib/github-derive.mjs";
import { github } from "../src/data/github.mjs";

const OUT = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "src",
  "data",
  "github-snapshot.json",
);

const stats = await fetchGithubStats(github.handle);

const snapshot = {
  capturedAt: new Date().toISOString(),
  ...stats,
};

await writeFile(OUT, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");

console.log(
  `Wrote ${OUT}\n  ${stats.publicRepos} public repositories · ` +
    `${stats.languages.length} languages · @${stats.handle}`,
);
