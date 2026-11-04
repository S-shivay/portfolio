import { Section } from "@/components/layout/Section";
import { PlaygroundGrid } from "@/components/sections/PlaygroundGrid";

export function Playground() {
  return (
    <Section
      id="playground"
      surface="ink"
      eyebrow="The lab"
      heading="Let's play with the interface."
      intro="Reading that someone cares about loading states, focus order and micro-interactions is not the same as using them. Two of these are the components this site actually runs on."
      /* The one heading on the page that gets the RGB split. This is the
         experimental block, so it is the only place where the type misbehaving
         reads as intent rather than as a rendering bug. */
      headingClassName="text-split"
      extraWash
    >
      <PlaygroundGrid />
    </Section>
  );
}
