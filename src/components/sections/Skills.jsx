import { skillCategories } from "@/data/skills";
import { projects } from "@/data/projects";
import { Section } from "@/components/layout/Section";
import { SkillsExplorer } from "@/components/sections/SkillsExplorer";

/**
 * Skills.
 *
 * The project lookup is built here, on the server, and passed down as a plain
 * object — the client component never imports the projects module, so the full
 * case-study text never reaches the browser bundle.
 */
export function Skills() {
  const projectIndex = Object.fromEntries(
    projects.map((project) => [
      project.slug,
      { name: project.name, slug: project.slug },
    ]),
  );

  return (
    <Section
      id="skills"
      surface="ink"
      eyebrow="Skills"
      heading="What I actually work with."
      intro="Grouped by where they sit in the stack. Select any technology to see how I use it and where."
    >
      <SkillsExplorer
        categories={skillCategories}
        projectIndex={projectIndex}
      />
    </Section>
  );
}
