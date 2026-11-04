/**
 * ============================================================================
 * GITHUB SECTION — handle, copy and the project ↔ repository map
 * ============================================================================
 *
 * The numbers in this section are NOT here. They are fetched live from the
 * GitHub API (see src/lib/github.js) so there is nothing in this file to keep
 * in sync and nothing to exaggerate. What lives here is the writing, and the
 * mapping from a portfolio project to the public repository that actually
 * holds its code.
 *
 * `.mjs` so `scripts/github-snapshot.mjs` can read the handle from the same
 * place the site does, instead of it being typed in two files that drift apart.
 */

export const github = {
  handle: "S-shivay",
  profileUrl: "https://github.com/S-shivay",

  eyebrow: "On GitHub",
  heading: "The code behind the case studies.",
  intro:
    "The company work — Job24, the HRMS, the client sites — is in private repositories that are not mine to publish. What is public is everything I build on my own time: full-stack applications, Angular architecture I wanted to try properly, and the small apps I write to learn something. Every figure on this panel is read from the GitHub API when the page renders — none of it is typed in by hand.",

  /**
   * One line under the counters. Describes what is actually in those
   * repositories — Angular and React clients, Express APIs, and the plain
   * HTML/CSS/JS builds — so the numbers land as range rather than as volume.
   * Edit freely; it is the one sentence here that is not machine-generated.
   */
  profileNote:
    "Angular and React clients, Express and Mongo APIs, and plain HTML, CSS and JavaScript underneath both.",

  /** Heading and caption for the language breakdown. */
  languagesTitle: "What the public code is written in",
  languagesNote:
    "By the primary language GitHub detects per repository. Forks and empty repositories are left out — a fork is someone else's code sitting in my account.",

  /** Heading and caption for the repository grid. */
  reposTitle: "Selected repositories",
  reposNote:
    "Picked for what there is to read in them, not to make the list longer. Every one is public — the name opens the code on GitHub.",

  /**
   * Why the case-study projects are not in the grid. Worth stating plainly: a
   * recruiter who sees a portfolio with no public code for its biggest
   * projects assumes the worst unless you tell them, and "it belongs to my
   * employer" is the answer every senior engineer expects to hear.
   */
  privateNote:
    "Job24, the HRMS and the client projects are company code in private repositories, so they are not here. The case studies are the closest thing to a walkthrough of that work, and I am glad to talk through any decision in them.",

  /**
   * The repositories the grid shows, in order.
   *
   * `repos[].name` is matched against the live API response, so the URL, the
   * language and the deployed demo address are never written down here — only
   * the name and the description. Rename or delete a repository on GitHub and
   * its card disappears rather than turning into a dead link.
   *
   * Every blurb below was written after reading the repository: its
   * package.json, its routes and its component tree. Nothing here describes a
   * feature the code does not contain. Keep it that way — an interviewer who
   * opens a repo and cannot find what the card promised has learned something
   * much worse than "this project is small".
   *
   * Worth adding later if you want a longer grid, all real and all yours:
   *   sigma                     Angular core/shared/pages layering, json-server
   *   Sigma2                    Angular auth flow with guards and a navbar shell
   *   Conversely-MERN-CRUD-*    blog CRUD, React client + Express API
   *   AtDrive-Weather-Show      Angular weather app over a public API
   *   HTML-CSS-JS-Calculator    plain-JS calculator, deployed
   */
  featuredRepos: [
    {
      id: "job-portal",
      title: "Full-stack job portal",
      blurb:
        "Recruiters post roles and candidates register and apply. A React client with a service layer over Axios, and an Express API behind it — JWT auth middleware, bcrypt-hashed credentials and Mongoose models for users and jobs.",
      tags: ["React", "Express", "MongoDB", "JWT"],
      repos: [
        { name: "JobPortal-Frontend", role: "React client" },
        { name: "JobPortal", role: "Express API" },
      ],
    },
    {
      id: "quizzes",
      title: "Quiz platform with analytics",
      blurb:
        "Build a quiz, share it, then read how people answered. A React dashboard with a create-quiz form and an analytics view, over an Express API with JWT auth and Mongoose quiz and user models.",
      tags: ["React", "Express", "MongoDB", "Analytics"],
      repos: [
        { name: "Quizzes-Frontend", role: "React client" },
        { name: "Quizzes-Backend", role: "Express API" },
      ],
    },
    {
      id: "myadmin",
      title: "Role-based admin console",
      blurb:
        "Five roles — superadmin, admin, HR, employee and creator — out of one Angular 19 standalone application. A route guard decides what resolves, an HTTP interceptor carries the token, and Angular Material sits over a navbar and sidebar shell.",
      tags: ["Angular 19", "Standalone", "Guards", "Interceptor", "Material"],
      repos: [{ name: "MyAdmin", role: "Angular app" }],
    },
    {
      id: "jyoti",
      title: "E-commerce with a seller portal",
      blurb:
        "Two sides of a shop in one Angular app: the storefront, and a seller area to add and update products. Guarded seller routes, typed data models, and product and seller services over the API.",
      tags: ["Angular", "TypeScript", "Route guards", "ng-bootstrap"],
      repos: [{ name: "jyoti", role: "Angular app" }],
    },
    {
      id: "dashboard-ngrx",
      title: "NgRx dashboard",
      blurb:
        "The state pattern from the day job, at the smallest size that still justifies it: an Angular dashboard reading from an @ngrx/store rather than from component state.",
      tags: ["Angular", "NgRx", "RxJS"],
      repos: [{ name: "Dashboard-App", role: "Angular app" }],
    },
    {
      id: "super-app",
      title: "Multi-screen React app",
      blurb:
        "Browse, selection, detail and not-found views wired through react-router, with presentational components kept apart from the pages that compose them.",
      tags: ["React", "React Router", "Vite"],
      repos: [{ name: "React-Super-App", role: "React app" }],
    },
  ],
};

/**
 * GitHub's own language colours (Linguist), so the bar reads as the same
 * spectrum someone sees on the profile itself rather than an invented palette.
 * A language not listed falls back to the muted grey.
 */
export const LANGUAGE_COLORS = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  HTML: "#e34c26",
  CSS: "#663399",
  Java: "#b07219",
  Python: "#3572a5",
  Shell: "#89e051",
  SCSS: "#c6538c",
  Vue: "#41b883",
  Dart: "#00b4ab",
};

export const LANGUAGE_FALLBACK = "#8b949e";

export const languageColor = (name) =>
  LANGUAGE_COLORS[name] ?? LANGUAGE_FALLBACK;
