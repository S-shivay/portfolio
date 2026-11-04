import { experience } from "@/data/experience";
import { site } from "@/data/site";
import { Section } from "@/components/layout/Section";
import { ExperienceTimeline } from "@/components/sections/ExperienceTimeline";

export function Experience() {
  if (experience.length === 0) return null;

  return (
    <Section
      id="experience"
      surface="ink"
      eyebrow="Experience"
      heading="Where the work happened."
      intro={`${site.yearsExperience} years across product teams. Each role below expands into the outcomes it produced and the stack it ran on.`}
    >
      <ExperienceTimeline roles={experience} />
    </Section>
  );
}
