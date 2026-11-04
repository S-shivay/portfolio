/**
 * ============================================================================
 * ABOUT — capabilities and product thinking
 * ============================================================================
 *
 * Unlike the other data files, this one is NOT placeholder content. These are
 * statements about how you work, taken from the brief's own list. Read them
 * and edit anything that does not describe you — but nothing here claims a
 * job, a metric or a company, so nothing here is fabricated.
 *
 * `icon` values are lucide-react export names, resolved in
 * `components/ui/Icon.jsx`.
 * `span` controls the bento grid footprint: "wide" | "tall" | "default".
 */

export const aboutHeading = "More than just writing components.";

export const aboutIntro =
  "Four years in, most of the job stopped being about making things appear on screen. It became about the decisions underneath — how state moves, what happens on a slow connection, whether six portals can share one codebase without it branching everywhere, and whether the next developer can extend it without rewriting it.";

export const capabilities = [
  {
    id: "architecture",
    icon: "Layers",
    title: "Scalable frontend architecture",
    body: "Structuring applications so that adding the tenth feature is no harder than adding the second. Clear module boundaries, predictable data flow, no circular dependencies.",
    detail: "Composition over configuration",
    span: "wide",
  },
  {
    id: "ux",
    icon: "MousePointerClick",
    title: "User experience",
    body: "Interfaces judged by whether people finish what they came to do — not by how they look in a screenshot.",
    detail: "Flows, not screens",
    span: "default",
  },
  {
    id: "maintainable",
    icon: "FileCode",
    title: "Maintainable code",
    body: "Code written to be read. Honest names, small surfaces, and comments that explain why rather than what.",
    detail: "Optimised for the reader",
    span: "default",
  },
  {
    id: "performance",
    icon: "Gauge",
    title: "Performance optimisation",
    body: "Measuring before changing. Bundle budgets, render profiling, and an image and font strategy decided at the start rather than bolted on.",
    detail: "Measure, then cut",
    span: "default",
  },
  {
    id: "responsive",
    icon: "Smartphone",
    title: "Responsive design",
    body: "Intentional layouts at every breakpoint. A phone gets a design made for a phone, not a desktop grid squeezed into 375px.",
    detail: "320px to ultrawide",
    span: "default",
  },
  {
    id: "a11y",
    icon: "Accessibility",
    title: "Accessibility",
    body: "Semantic markup, real focus management, and keyboard paths through every interaction. Treated as a definition of done, not a final-week audit.",
    detail: "WCAG AA baseline",
    span: "wide",
  },
  {
    id: "design-systems",
    icon: "Component",
    title: "Design systems",
    body: "Tokens, primitives and component APIs that let a team ship consistent UI without a designer reviewing every pixel.",
    detail: "Tokens to components",
    span: "default",
  },
  {
    id: "api",
    icon: "Plug",
    title: "API integration",
    body: "A typed service layer that normalises errors, handles loading and empty states properly, and keeps network concerns out of components.",
    detail: "REST · JWT-secured",
    span: "default",
  },
  {
    id: "cross-browser",
    icon: "Globe",
    title: "Cross-browser compatibility",
    body: "Progressive enhancement, feature detection, and verification on real devices rather than one resized window.",
    detail: "Tested where it ships",
    span: "default",
  },
  {
    id: "collaboration",
    icon: "Users",
    title: "Collaboration",
    body: "Working closely with designers, backend engineers and product. Asking about the constraint behind the request before writing the ticket.",
    detail: "Design · Backend · Product",
    span: "wide",
  },
];

/**
 * "Beyond the Code" — shown in the Signals band.
 */
export const beyondTheCode = [
  {
    id: "ux-thinking",
    icon: "Route",
    title: "UX thinking",
    body: "Reading a design for its intent, then flagging the state nobody drew — the empty list, the failed request, the 400-character name.",
  },
  {
    id: "product-thinking",
    icon: "Target",
    title: "Product thinking",
    body: "Understanding what the feature is for, so the implementation can be simpler than the spec when that serves the user better.",
  },
  {
    id: "performance",
    icon: "Zap",
    title: "Performance",
    body: "Treating speed as a feature with a budget, tracked in CI, rather than an optimisation pass that never gets scheduled.",
  },
  {
    id: "accessibility",
    icon: "Accessibility",
    title: "Accessibility",
    body: "Building for keyboards and screen readers from the first commit, because retrofitting it costs several times more.",
  },
  {
    id: "collaboration",
    icon: "MessagesSquare",
    title: "Collaboration",
    body: "Clear pull requests, useful review comments, and written decisions so context outlives the conversation.",
  },
  {
    id: "problem-solving",
    icon: "Lightbulb",
    title: "Problem solving",
    body: "Reproducing before theorising. Reading the source of a dependency when the docs run out.",
  },
  {
    id: "design-systems",
    icon: "Boxes",
    title: "Design systems",
    body: "Building the shared layer that stops five teams from writing five different buttons.",
  },
  {
    id: "learning",
    icon: "BookOpen",
    title: "Continuous learning",
    body: "Keeping up with the platform itself — not just frameworks — because that knowledge does not expire every two years.",
  },
];
