import { Hero } from "@/components/sections/Hero";
import { TechTicker } from "@/components/sections/TechTicker";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Github } from "@/components/sections/Github";
import { Skills } from "@/components/sections/Skills";
import { Engineering } from "@/components/sections/Engineering";
import { Playground } from "@/components/sections/Playground";
import { CertificatesSection } from "@/components/certificates/CertificatesSection";
import { Signals } from "@/components/sections/Signals";
import { Contact } from "@/components/sections/Contact";
import { PageTransition } from "@/components/motion/PageTransition";

/**
 * Home page.
 *
 * A server component composing section server components. Interactivity lives
 * in small "use client" leaves (hero backdrop, reveals, timeline, skills
 * panel, playground, command palette), so the page's HTML is complete and its
 * JavaScript budget stays small.
 *
 * Order follows the recruiter scan path: who, what I've built, where I did it,
 * then the supporting detail, then how to get in touch.
 */
export default function Home() {
  return (
    <PageTransition>
      <Hero />
      <TechTicker />
      <About />
      <Experience />
      <Projects />
      <Github />
      <Skills />
      <Engineering />
      <Playground />
      <CertificatesSection />
      <Signals />
      <Contact />
    </PageTransition>
  );
}
