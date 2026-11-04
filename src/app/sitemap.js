import { projects } from "@/data/projects";
import { getSiteUrl } from "@/lib/seo";

/**
 * Sitemap.
 *
 * Returns an empty sitemap until a real site URL is configured — a sitemap
 * full of "[YOUR SITE URL]/work/..." entries is worse than none at all.
 */
export default function sitemap() {
  const siteUrl = getSiteUrl();
  if (!siteUrl) return [];

  const lastModified = new Date();

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...projects.map((project) => ({
      url: `${siteUrl}/work/${project.slug}`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.8,
    })),
  ];
}
