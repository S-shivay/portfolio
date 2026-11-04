import { notFound } from "next/navigation";

import { projects, getProject } from "@/data/projects";
import { site } from "@/data/site";
import { getSiteUrl } from "@/lib/seo";
import { CaseStudy } from "@/components/projects/CaseStudy";
import { PageTransition } from "@/components/motion/PageTransition";

/**
 * Case study route.
 *
 * Every project in `src/data/projects.js` becomes a statically generated page
 * here — no component changes needed to add one. `dynamicParams = false` makes
 * any other slug a 404 rather than an on-demand render.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) return {};

  const siteUrl = getSiteUrl();
  const isPlaceholder = (value) =>
    !value || typeof value !== "string" || value.startsWith("[");

  const title = !isPlaceholder(project.seo?.title)
    ? project.seo.title
    : isPlaceholder(project.name)
      ? `Case study — ${site.role}`
      : project.name;

  const description = !isPlaceholder(project.seo?.description)
    ? project.seo.description
    : isPlaceholder(project.tagline)
      ? site.seo.description
      : project.tagline;

  return {
    title,
    description,
    ...(siteUrl ? { alternates: { canonical: `/work/${slug}` } } : {}),
    openGraph: {
      type: "article",
      title,
      description,
      ...(siteUrl ? { url: `${siteUrl}/work/${slug}` } : {}),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CaseStudyPage({ params }) {
  const { slug } = await params;

  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  // Wraps around, so the last case study leads back to the first.
  const nextIndex = (index + 1) % projects.length;
  const next = projects[nextIndex];

  return (
    <PageTransition>
      <CaseStudy
        project={project}
        index={index}
        next={next.slug === project.slug ? null : next}
        nextIndex={nextIndex}
      />
    </PageTransition>
  );
}
