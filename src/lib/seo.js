import { site } from "@/data/site";

/**
 * Resolves the canonical site origin.
 *
 * `site.seo.url` ships as a placeholder string, and `new URL("[YOUR SITE URL]")`
 * throws — which would break the build before you have had a chance to fill it
 * in. This returns null for anything that is not a real absolute URL so the
 * metadata layer can simply omit the fields that require one.
 *
 * Vercel's system env var is used as a fallback on preview deployments.
 */
export function getSiteUrl() {
  const configured = site.seo.url?.trim();

  if (configured && !configured.startsWith("[")) {
    try {
      return new URL(configured).origin;
    } catch {
      // fall through to the environment fallback
    }
  }

  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL;
  if (vercel) return `https://${vercel}`;

  return null;
}

/** True once a real URL is configured — gates sitemap and canonical output. */
export const hasSiteUrl = () => getSiteUrl() !== null;

/**
 * Person + WebSite structured data.
 *
 * Fields that are still placeholders are stripped rather than published:
 * search engines penalise structured data that contradicts page content, and
 * "[YOUR NAME]" in a Person schema is worse than no Person schema.
 */
export function buildPersonJsonLd() {
  const url = getSiteUrl();
  const isReal = (value) =>
    typeof value === "string" && value.length > 0 && !value.startsWith("[");

  const sameAs = [site.links.github, site.links.linkedin, site.links.twitter]
    .filter(isReal);

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    jobTitle: site.role,
    description: site.seo.description,
    knowsAbout: [
      "Frontend Development",
      "React",
      "Next.js",
      "TypeScript",
      "Web Accessibility",
      "Web Performance",
    ],
  };

  if (isReal(site.name)) person.name = site.name;
  if (isReal(site.email)) person.email = `mailto:${site.email}`;
  if (isReal(site.location)) {
    person.address = { "@type": "PostalAddress", addressLocality: site.location };
  }
  if (url) person.url = url;
  if (sameAs.length) person.sameAs = sameAs;

  return person;
}
