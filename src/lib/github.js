import {
  GITHUB_REVALIDATE,
  fetchGithubStats,
} from "@/lib/github-derive.mjs";
import { github } from "@/data/github.mjs";
import snapshot from "@/data/github-snapshot.json";

/**
 * Server-side entry point for the GitHub section.
 *
 * Live first: the request is cached for six hours by Next's data cache, so a
 * busy page makes one API call per revalidation window rather than one per
 * visitor, and the numbers stay current without a redeploy.
 *
 * If that call fails — offline during development, or past the 60-per-hour
 * unauthenticated limit — it falls back to the committed snapshot rather than
 * dropping the section or rendering zeroes. The result carries `live: false`
 * and the capture date so the UI can say which it is showing. Regenerate the
 * snapshot with `npm run github:snapshot`.
 */
export async function getGithubStats() {
  try {
    const stats = await fetchGithubStats(github.handle, {
      /* A token is optional. Set GITHUB_TOKEN in .env.local for a higher rate
         limit; it is read on the server and never sent to the browser. */
      token: process.env.GITHUB_TOKEN,
      init: { next: { revalidate: GITHUB_REVALIDATE } },
    });

    return { ...stats, live: true, capturedAt: null };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[github] Live fetch failed (${error.message}) — using the snapshot from ${snapshot.capturedAt}.`,
      );
    }

    return { ...snapshot, live: false };
  }
}
