/**
 * ============================================================================
 * ENGINEERING — process and architecture
 * ============================================================================
 *
 * Like `about.js`, this is real content rather than placeholders: it describes
 * how you work, not where you worked. Edit anything that does not match your
 * actual process.
 */

export const processHeading = "From idea to production.";

export const processIntro =
  "The same six steps whether it is a landing page or a multi-year product. The order matters more than the ceremony.";

export const processSteps = [
  {
    step: "01",
    title: "Understand",
    summary: "Understand the product, users, requirements and constraints.",
    detail:
      "Before any component exists: who uses this, what are they trying to finish, what does the API actually return, and what is the real constraint — a deadline, a legacy system, a browser we still support?",
    icon: "Search",
  },
  {
    step: "02",
    title: "Architect",
    summary: "Plan component structure, state management, data flow and scalability.",
    detail:
      "Decide what is server state and what is client state, where the boundaries sit, and which parts are likely to change. The goal is that the shape of the code matches the shape of the problem.",
    icon: "Waypoints",
  },
  {
    step: "03",
    title: "Build",
    summary: "Develop reusable, maintainable and accessible components.",
    detail:
      "Semantic markup first, then behaviour, then styling. Components get a small, honest API — and keyboard support at the moment they are written, not later.",
    icon: "Blocks",
  },
  {
    step: "04",
    title: "Polish",
    summary: "Focus on animations, responsive behaviour, edge cases and UX.",
    detail:
      "The long tail: loading, empty, error and offline states, long strings, small screens, and motion that clarifies a transition instead of decorating it.",
    icon: "Sparkles",
  },
  {
    step: "05",
    title: "Optimise",
    summary: "Improve performance, accessibility, SEO and Core Web Vitals.",
    detail:
      "Profile the real bundle and the real render. Cut what is not needed on first paint, fix what the audit finds, and set a budget so it stays fixed.",
    icon: "Gauge",
  },
  {
    step: "06",
    title: "Ship",
    summary: "Test, review, deploy and continuously improve.",
    detail:
      "Automated checks in CI, a reviewable pull request, a deploy that can be rolled back, and monitoring that tells you when something regressed.",
    icon: "Rocket",
  },
];

export const architectureHeading = "I care about what happens behind the UI.";

export const architectureIntro =
  "A structure that stays legible as it grows. Each layer has one job, and dependencies point in one direction.";

/**
 * Architecture tree. `depth` drives indentation; `note` renders as a dimmed
 * mono annotation to the right on wide screens.
 */
export const architectureTree = [
  { label: "App", depth: 0, note: "entry, routing, layout", accent: true },
  { label: "Pages", depth: 1, note: "routes and data loading" },
  { label: "Components", depth: 1, note: "presentation", accent: true },
  { label: "UI", depth: 2, note: "primitives — no business logic" },
  { label: "Forms", depth: 2, note: "inputs, validation, states" },
  { label: "Layout", depth: 2, note: "structure and composition" },
  { label: "Hooks", depth: 1, note: "reusable stateful behaviour" },
  { label: "Services", depth: 1, note: "API abstraction layer", accent: true },
  { label: "State", depth: 1, note: "client store, clear boundaries" },
  { label: "Utils", depth: 1, note: "pure functions, easy to test" },
  { label: "Types", depth: 1, note: "the shared contract" },
];

export const architecturePrinciples = [
  {
    id: "reusable",
    title: "Reusable components",
    body: "A primitive layer with no business logic, composed upward. One button, not eleven.",
    icon: "Component",
  },
  {
    id: "separation",
    title: "Separation of concerns",
    body: "Components render. Hooks hold behaviour. Services talk to the network. Crossing those lines is the bug.",
    icon: "Columns2",
  },
  {
    id: "types",
    title: "Type safety",
    body: "Types at the API boundary so a backend change becomes a build error instead of a production incident.",
    icon: "ShieldCheck",
  },
  {
    id: "scalable",
    title: "Scalable structure",
    body: "Feature folders that can be deleted in one piece. Dependencies point downward only.",
    icon: "Network",
  },
  {
    id: "state",
    title: "Clean state management",
    body: "Server state cached and invalidated properly; client state kept local until it genuinely needs to be shared.",
    icon: "Database",
  },
  {
    id: "api",
    title: "API abstraction",
    body: "One place that knows the endpoint shape, so components never parse a response.",
    icon: "Plug",
  },
  {
    id: "errors",
    title: "Error handling",
    body: "Boundaries that fail to something useful, and messages that tell the user what to do next.",
    icon: "TriangleAlert",
  },
  {
    id: "loading",
    title: "Loading states",
    body: "Reserved space and skeletons that match the final layout, so nothing shifts when data lands.",
    icon: "LoaderCircle",
  },
  {
    id: "a11y",
    title: "Accessibility",
    body: "Semantics, focus order and labels designed in, verified with a keyboard and a screen reader.",
    icon: "Accessibility",
  },
];
