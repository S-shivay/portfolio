/**
 * ============================================================================
 * SITE CONFIGURATION — Single source of truth for identity, contact and SEO.
 * ============================================================================
 *
 * Populated from Sarang's CV (S_shivay_resume.pdf).
 *
 * Anything still wrapped in [SQUARE BRACKETS] was NOT in the CV and needs to
 * be supplied. Search `src/data` for `[` to find every remaining gap.
 */

export const site = {
  // --- Identity -------------------------------------------------------------
  name: "Sarang Shivay Prajapati",
  shortName: "Sarang",
  role: "Frontend Developer",
  yearsExperience: "4+",

  /** Shown in the hero eyebrow. */
  eyebrow: "FRONTEND DEVELOPER · ANGULAR · 4+ YEARS EXPERIENCE",

  /** The one line a recruiter reads first. */
  headline: "I build interfaces that feel as good as they perform.",

  /**
   * The same headline, broken into display lines. Line breaks are authored
   * rather than left to the browser so the ragged edge is deliberate at every
   * width, and so the reveal animation can stagger per line without splitting
   * the text node (which would break screen readers and text selection).
   */
  headlineLines: ["I build interfaces", "that feel as good", "as they perform."],

  /** Supporting paragraph under the headline. */
  intro:
    "Frontend developer specialising in Angular, Next.js and TypeScript. I build scalable single-page applications, reusable component architectures and responsive dashboards — the kind that stay fast and maintainable after the third product team starts using them.",

  /** Availability indicator in the nav + hero. Set `available: false` to hide. */
  available: true,
  availabilityLabel: "Available for opportunities",

  // --- Contact --------------------------------------------------------------
  email: "sarangprajapati06@gmail.com",
  location: "Kanpur, Uttar Pradesh, India",
  timezone: "IST (UTC+5:30)",

  /**
   * Phone is on the CV but hidden on the site by default. A phone number on a
   * public page gets scraped by bots within days; recruiters who have your CV
   * already have it. Flip `showPhone` to true if you would rather show it.
   */
  phone: "+91 7881101987",
  showPhone: false,

  // --- Links ----------------------------------------------------------------
  links: {
    /* Supplied directly. Stored as the canonical `www.linkedin.com/in/<slug>`
       form — that is the one LinkedIn itself serves and the one that belongs in
       the Person schema's `sameAs`, where a redirecting variant is a weaker
       signal that the two identities are the same. */
    linkedin: "https://www.linkedin.com/in/sarangshivayprajapati",
    /* Supplied directly. The GitHub section reads the handle from
       src/data/github.mjs and everything it displays from the live API. */
    github: "https://github.com/S-shivay",
    /* Served from public/resume.pdf. Replace that file to update the resume —
       the Download buttons and the in-page viewer both read this path. */
    resume: "/resume.pdf",
    twitter: "", // optional — leave empty to hide
  },

  githubHandle: "S-shivay",

  // --- Education ------------------------------------------------------------
  education: [
    {
      institution: "Dr. Virendra Swarup Institute of Computer Studies",
      qualification: "B.C.A, Computer Applications",
      year: "2019",
    },
    {
      institution: "St. Francis Xavier's Inter College",
      qualification: "Intermediate",
      year: "2016",
    },
  ],

  languages: ["English", "Hindi"],

  // --- SEO ------------------------------------------------------------------
  seo: {
    /** No trailing slash. Required for canonical URLs, sitemap and OG images. */
    url: "[YOUR SITE URL]", // e.g. "https://sarangprajapati.dev"
    title: "Sarang Shivay Prajapati — Frontend Developer",
    titleTemplate: "%s — Sarang Shivay Prajapati",
    description:
      "Frontend developer with 4+ years building scalable Angular, Next.js and TypeScript applications — reusable component architectures, responsive dashboards and REST API integrations serving 10,000+ users. Based in Kanpur, India.",
    /* Ordered by how the market actually searches: the specialism first, the
       generic terms after, location last. */
    keywords: [
      "Angular Developer",
      "Frontend Developer",
      "Angular Developer Portfolio",
      "TypeScript Developer",
      "Next.js Developer",
      "Associate Frontend Developer",
      "RxJS NgRx Developer",
      "Frontend Engineer",
      "React Developer",
      "Angular Developer Kanpur",
      "Frontend Developer India",
      "Sarang Shivay Prajapati",
    ],
  },
};

/**
 * Navigation. `id` must match the `id` attribute on the corresponding
 * <section> so the scroll-spy can track it.
 */
export const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "playground", label: "Playground" },
  { id: "contact", label: "Contact" },
];

/**
 * Section register — drives the mono "01 / 10" numbering in the blueprint
 * motif. Order here is the order on the page.
 */
export const sectionRegister = [
  "home",
  "stack",
  "about",
  "experience",
  "work",
  "github",
  "skills",
  "engineering",
  "playground",
  "certifications",
  "signals",
  "contact",
];

export const sectionNumber = (id) => {
  const index = sectionRegister.indexOf(id);
  if (index === -1) return "";
  return String(index).padStart(2, "0");
};
