/**
 * ============================================================================
 * SKILLS
 * ============================================================================
 *
 * Built strictly from the CV — nothing here is a technology Sarang has not
 * listed or shipped. Anything from the original generic brief that the CV did
 * not mention (GraphQL, TanStack Query, Zustand, Webpack, Sass, CSS Modules)
 * has been removed rather than left in to pad the list.
 *
 * `years` is only filled in where the CV supports it:
 *   - Angular and the core web languages span both roles (Mar 2022 – present).
 *   - React, Next.js and Node are listed as known and used on one project, so
 *     they carry no year claim. `null` hides the line entirely — which is the
 *     honest answer, and far safer than a number you have to defend in an
 *     interview.
 */

export const skillCategories = [
  {
    id: "core",
    label: "Core Frontend",
    description: "The languages and framework I work in every day.",
    skills: [
      {
        name: "Angular",
        years: "4+ years",
        note: "Versions 12 through 20. Building scalable single-page applications with lazy-loaded feature modules, route guards and a reusable component layer shared across products.",
        projects: ["job24", "hrms", "crypto-payment-portal"],
        primary: true,
      },
      {
        name: "TypeScript",
        years: "4+ years",
        note: "Typed models across the API boundary and strongly-typed component inputs, so a contract change surfaces at compile time instead of in production.",
        projects: ["job24", "hrms", "sports-turf-booking-platform", "crypto-payment-portal"],
        primary: true,
      },
      {
        name: "JavaScript",
        years: "4+ years",
        note: "ES6+ throughout — async flows, DOM performance and module structure, including plain-JavaScript builds where no framework was warranted.",
        projects: ["jewellery-ecommerce", "winstar-appliances"],
        primary: true,
      },
      {
        name: "HTML5",
        years: "4+ years",
        note: "Semantic structure and native form validation before reaching for JavaScript — the foundation that makes accessibility work rather than something bolted on later.",
        projects: [],
        primary: false,
      },
      {
        name: "CSS3",
        years: "4+ years",
        note: "Flexbox and Grid layouts, custom properties for theming, and responsive behaviour designed per breakpoint rather than scaled down from desktop.",
        projects: [],
        primary: false,
      },
    ],
  },
  {
    id: "angular",
    label: "Angular Ecosystem",
    description:
      "The parts of Angular that decide whether an application scales or stalls.",
    skills: [
      {
        name: "RxJS",
        years: "4+ years",
        note: "Reactive data flows for real-time listings and dashboards — composing streams and managing subscription lifecycles so components stay leak-free.",
        projects: ["job24"],
        primary: true,
      },
      {
        name: "NgRx",
        years: null,
        note: "Predictable state for applications large enough to need it, keeping component state local everywhere it does not.",
        projects: [],
        primary: true,
      },
      {
        name: "Angular Material",
        years: null,
        note: "Component library used as a base layer, themed to match the product rather than shipped with default styling.",
        projects: ["job24", "hrms"],
        primary: false,
      },
      {
        name: "Route Guards",
        years: null,
        note: "Role-based access control at the routing layer — one set of guards per login type across the six portals of a single HRMS codebase.",
        projects: ["hrms"],
        primary: false,
      },
      {
        name: "Forms & Validation",
        years: null,
        note: "Reusable form and validation modules that cut duplicated frontend work by 30% across a product suite.",
        projects: ["hrms"],
        primary: false,
      },
      {
        name: "Lazy Loading",
        years: null,
        note: "Route-level code splitting so a large application only ships the feature the user actually opened.",
        projects: ["job24"],
        primary: false,
      },
    ],
  },
  {
    id: "ui",
    label: "UI & Styling",
    description: "Turning design intent into resilient, responsive interfaces.",
    skills: [
      {
        name: "Responsive Design",
        years: "4+ years",
        note: "Intentional layouts at every breakpoint, verified on real devices. Improved cross-device responsiveness enough to move customer satisfaction scores by 20%.",
        projects: ["sports-turf-booking-platform", "krishna-motor-showroom", "winstar-appliances"],
        primary: true,
      },
      {
        name: "Component Architecture",
        years: null,
        note: "Reusable component libraries shared across projects — the single change that raised team development efficiency by 30%.",
        projects: ["hrms", "job24"],
        primary: true,
      },
      {
        name: "Tailwind CSS",
        years: null,
        note: "Utility-first styling driven by design tokens. This portfolio is built with it — the entire colour, type and spacing system lives in one @theme block.",
        projects: ["sports-turf-booking-platform"],
        primary: false,
      },
      {
        name: "Bootstrap",
        years: null,
        note: "Grid and component base for admin-heavy interfaces where delivery speed mattered more than a bespoke visual system.",
        projects: ["crypto-payment-portal"],
        primary: false,
      },
      {
        name: "UI/UX Development",
        years: null,
        note: "Working from design intent rather than pixel handoff — flagging the states nobody drew: the empty list, the failed request, the very long name.",
        projects: [],
        primary: false,
      },
    ],
  },
  {
    id: "react",
    label: "React & Full-stack",
    description:
      "Where I work outside Angular. Real but less deep than the Angular column — stated that way deliberately.",
    skills: [
      {
        name: "React.js",
        years: null,
        note: "Component-driven UI for a full-stack job portal and a turf booking platform, and the library this portfolio runs on. Comfortable, though Angular is where the depth is.",
        projects: ["sports-turf-booking-platform", "job-portal-react"],
        primary: true,
      },
      {
        name: "Next.js",
        years: null,
        note: "App Router, server components and per-route rendering strategy — used to build this site and a full-stack turf booking platform with payments, auth and an owner ledger.",
        projects: ["sports-turf-booking-platform"],
        primary: true,
      },
      {
        name: "Redux",
        years: null,
        note: "Centralised client state, applied where the store genuinely earns its complexity.",
        projects: [],
        primary: false,
      },
      {
        name: "Node.js",
        years: null,
        note: "Backend services behind full-stack projects — enough to build and debug the API my frontend consumes.",
        projects: ["sports-turf-booking-platform", "job-portal-react"],
        primary: false,
      },
      {
        name: "Express.js",
        years: null,
        note: "REST endpoints, middleware and JWT-secured routes for full-stack applications.",
        projects: ["job-portal-react"],
        primary: false,
      },
      {
        name: "MongoDB",
        years: null,
        note: "Document modelling for job and application data in a MERN-stack build.",
        projects: ["job-portal-react"],
        primary: false,
      },
    ],
  },
  {
    id: "data",
    label: "Data & Integration",
    description: "Getting data in and out without it leaking into components.",
    skills: [
      {
        name: "REST APIs",
        years: "4+ years",
        note: "A service layer that owns endpoint shape and error normalisation. Optimising this reduced API response handling errors by 40%.",
        projects: ["job24", "hrms", "sports-turf-booking-platform", "crypto-payment-portal"],
        primary: true,
      },
      {
        name: "JWT Authentication",
        years: null,
        note: "Token-based auth with role-aware routing.",
        projects: ["job24", "sports-turf-booking-platform", "crypto-payment-portal"],
        primary: false,
      },
      {
        name: "Axios",
        years: null,
        note: "HTTP client with interceptors for auth headers and centralised error handling.",
        projects: ["job-portal-react"],
        primary: false,
      },
      {
        name: "MySQL",
        years: null,
        note: "Relational data behind service-management and dealership platforms.",
        projects: ["winstar-appliances", "krishna-motor-showroom"],
        primary: false,
      },
    ],
  },
  {
    id: "tools",
    label: "Tools & Testing",
    description: "The workflow around the code.",
    skills: [
      {
        name: "Git & GitHub",
        years: "4+ years",
        note: "Branch-based workflow with reviewable pull requests, used for version control and Agile delivery across teams.",
        projects: ["job24", "hrms"],
        primary: false,
      },
      {
        name: "Jest",
        years: null,
        note: "Unit testing for logic and utilities, run as part of the delivery pipeline.",
        projects: [],
        primary: false,
      },
      {
        name: "Karma & Jasmine",
        years: null,
        note: "Angular's default test stack — component and service specs against real browser behaviour.",
        projects: [],
        primary: false,
      },
      {
        name: "Vite",
        years: null,
        note: "Fast local builds and bundling outside the Angular CLI.",
        projects: [],
        primary: false,
      },
      {
        name: "npm & yarn",
        years: null,
        note: "Dependency management and scripting, with lockfiles treated as part of the review.",
        projects: [],
        primary: false,
      },
      {
        name: "CI/CD",
        years: null,
        note: "Automated checks on the way to deploy — part of what held one platform at 99.5% uptime.",
        projects: [],
        primary: false,
      },
    ],
  },
  {
    id: "quality",
    label: "Quality & Practice",
    description: "The work that happens after it renders correctly.",
    skills: [
      {
        name: "Performance Optimisation",
        years: null,
        note: "Lazy loading, bundle discipline and render profiling. Measured results: 35% faster application performance and 2.5 seconds off page load.",
        projects: ["job24"],
        primary: true,
      },
      {
        name: "Cross-browser Compatibility",
        years: null,
        note: "Progressive enhancement and verification on real desktop and mobile browsers, not one resized window.",
        projects: [],
        primary: false,
      },
      {
        name: "Unit Testing",
        years: null,
        note: "Testing the layers where regressions actually hurt — services, guards and shared components.",
        projects: ["sports-turf-booking-platform"],
        primary: false,
      },
      {
        name: "Agile Development",
        years: "4+ years",
        note: "Sprint delivery with cross-functional teams — design, backend and QA in the same loop rather than a handoff chain.",
        projects: [],
        primary: false,
      },
      {
        name: "Accessibility",
        years: null,
        note: "Semantic markup, keyboard paths and visible focus. Actively deepening this — every interactive component on this site is keyboard-operable and screen-reader labelled.",
        projects: ["sports-turf-booking-platform"],
        primary: false,
      },
    ],
  },
];

/** Flat list — used by the hero tech strip. */
export const primarySkills = skillCategories
  .flatMap((category) => category.skills)
  .filter((skill) => skill.primary);

export const allSkills = skillCategories.flatMap((category) => category.skills);
