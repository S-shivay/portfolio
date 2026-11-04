/**
 * ============================================================================
 * JOB24: THE LONG VERSION
 * ============================================================================
 *
 * Everything on the Job24 case study that goes beyond the shared fields in
 * `projects.js`: the feature atlas, the working command palette, the architecture,
 * the route map and the counts. All of it comes from Sarang's own write-up of the
 * codebase, and the figures were counted from the source tree.
 *
 * Kept out of `projects.js` on purpose. That file is imported by the site-wide
 * command palette, so whatever it holds ships to the browser on every page; this
 * is only ever imported by the case study, a server component.
 */

export const job24Detail = {
  pipeline: {
    stages: ["Applied", "Viewed", "Shortlisted", "Interview", "Offered", "Hired", "Rejected"],
    caption: "The seven application statuses the console filters and reports on.",
    /* Only shown beside the ribbon, which phones do not draw. */
    ribbonNote: "The ribbon comes from the product's own landing page.",
  },

  featuresIntro:
    "Each entry is labelled with its route in the app. Admin screens appear only for people holding the matching permission.",

  features: [
    {
      route: "/admin/home/dashboard",
      title: "Operations dashboard",
      icon: "Gauge",
      wide: true,
      lead: "Six headline metrics count up on load: total candidates, active jobs, organizations, platform admins, admin-sourced candidates and self-registered candidates.",
      points: [
        "Candidate growth chart with Today, 7 Days, 30 Days, 12 Months and All Time ranges. Changing the range refetches because the bucket size changes. Switching between total, self and admin stays in the browser because every bucket already holds all three.",
        "Charts are hand-built from HTML and SVG with no chart library. The “hiring velocity” wave converts bucket totals into a smooth cubic Bézier path.",
        "Four rule-based insight cards are computed in the browser: signup momentum, source mix, candidates per active job and peak intake.",
        "A status badge tells apart three states: no internet, API unreachable and online. It re-syncs automatically when the connection returns.",
      ],
    },
    {
      route: "/admin/home/jobs",
      title: "Job posting",
      icon: "Briefcase",
      wide: true,
      lead: "A multi-step form with 35 configured fields, a final review, and the same screen reused for editing.",
      steps: ["Job Details", "Compensation & Perks", "Location & Contact", "Interview Mode", "Review"],
      points: [
        "Dropdown data loads per step, so a new posting doesn't fire every API at once. Edit mode loads all steps up front so saved values show as labels.",
        "Searchable, debounced selects for skills and job titles. Job titles are scoped to the chosen industries, and country, state and city cascade.",
        "A “Pan India” option covers roles open across all locations. Salary and contact details can each be marked as disclosed or hidden.",
      ],
      table: {
        caption: "What each interview mode makes required",
        head: ["Interview mode", "Fields that become required"],
        rows: [
          ["Online", "Platform, start date, end date"],
          ["In person", "Location, start date, end date"],
          ["Telephonic", "Start date, end date"],
          ["Hybrid", "Platform, location, start date, end date"],
          ["Walk-in", "Start and end dates, venue, time from, time to"],
        ],
      },
    },
    {
      route: "/admin/job-info/job-module",
      title: "Per-job workspace",
      icon: "Workflow",
      points: [
        "Screening questions: a repeatable question builder with six types (text, number, yes or no, file upload, single choice and multiple choice). Each question has a required flag, a preferred answer and an automatic sort order.",
        "Candidates applied: counts per status, sorting by apply date, match score or profile update, and a minimum match score filter. Each candidate opens into a full detail view.",
      ],
    },
    {
      route: "/admin/home/applications",
      title: "All applications",
      icon: "FileText",
      lead: "One list of applications across every organization, with debounced search, status chips, an organization filter, three sort orders, pagination and a detail page.",
    },
    {
      route: "/admin/home/candidates",
      title: "Candidate records",
      icon: "Users",
      lead: "Recruiters can create a candidate and maintain a full record. Each section has its own form route and view route.",
      tags: ["Account", "Profile", "Address", "Education", "Certificates", "Languages", "Assets", "Experience", "Skills"],
      note: "Education validation covers percentage and CGPA formats, and date of birth enforces a minimum age of 16.",
    },
    {
      route: "/admin/home/candidates/bulk",
      title: "Bulk candidate import",
      icon: "Download",
      points: [
        "Download a .zip template, then upload through drag and drop or a file picker. Non-zip files are rejected before anything is sent.",
        "A batch list tracks each upload as queued, processing, completed or failed, with total, created and failed counts and who uploaded it.",
        "The batch detail page separates created records, errors and warnings. Errors point to the exact sheet, row and reference ID so a recruiter can fix the source file.",
      ],
    },
    {
      route: "/admin/home/settings",
      title: "Notification settings",
      icon: "Send",
      lead: "One form serves two scopes: global defaults for super admins and per-organization overrides.",
      points: [
        "Channels: email, in-app and push, under a master switch.",
        "Recipients: the job poster, organization emails, both, or specific addresses entered as validated, de-duplicated chips.",
        "Frequency: immediately, every N applications (1 to 1000) or a daily summary.",
        "Minimum score: an optional 0 to 100 threshold. Fields become required only when the selected options need them.",
      ],
    },
    {
      route: "/admin/home/organizations",
      title: "Organizations and owners",
      icon: "Network",
      lead: "Companies and their owners are managed in separate lists, each with permission-gated create, edit and deactivate actions.",
    },
    {
      route: "/admin/home/masters",
      title: "Master data",
      icon: "Database",
      lead: "Admins maintain the reference data behind the app's dropdowns: general types such as job type, work mode and salary currency, plus education hierarchies and skills.",
    },
    {
      route: "/admin/home/admin",
      title: "Team and access",
      icon: "ShieldCheck",
      lead: "Create, view and edit admin accounts and assign each one a set of permissions. Every admin also has a personal profile page.",
    },
    {
      route: "/superadmin-login · /forgot-password",
      title: "Sign-in and account recovery",
      icon: "Lock",
      lead: "Password recovery runs in three steps, with a resend timer on the code.",
      steps: ["Email", "6-digit OTP", "New password"],
      note: "New passwords must be 8 to 16 characters with an uppercase letter, a lowercase letter, a digit and a symbol.",
    },
    {
      route: "/",
      title: "Public landing page",
      icon: "Sparkles",
      lead: "A motion-led marketing page with an animated SVG ribbon, pointer parallax, scroll reveals through IntersectionObserver and counters driven by requestAnimationFrame. Employers go to the console, and job seekers go to the app store.",
    },
    {
      route: "/job/:id",
      title: "Shareable job links",
      icon: "Smartphone",
      wide: true,
      lead: "A shared job link opens the job directly in the mobile app. On Android it uses an intent:// URL, so it also works inside WebViews such as WhatsApp, Telegram and Gmail. If the app isn't installed, it falls back to the Play Store and passes the job ID as a referrer. An App Store link covers iOS.",
    },
  ],

  /* The app's real commands, search keywords and permission rules. */
  palette: {
    intro:
      "In the console, Ctrl K opens keyboard-first navigation from anywhere. This working copy uses the app's real commands, search keywords and permission rules. Turn permissions off and watch commands disappear.",
    keys: ["SUPER_ADMIN", "job.view", "job.create", "candidate.view", "organization.view", "admin.view", "master.view"],
    presets: [
      { id: "all", label: "All permissions", keys: null },
      { id: "jobs", label: "Jobs only", keys: ["job.view", "job.create"] },
      { id: "candidates", label: "Candidates only", keys: ["candidate.view"] },
    ],
    commands: [
      { id: "nav-dashboard", label: "Dashboard", group: "Navigate", icon: "Gauge", keywords: "home overview", superAdminOnly: true, route: "/admin/home/dashboard" },
      { id: "nav-jobs", label: "Jobs", group: "Navigate", icon: "Briefcase", keywords: "postings vacancies", permission: "job.view", route: "/admin/home/jobs" },
      { id: "nav-candidates", label: "Candidates", group: "Navigate", icon: "Users", keywords: "applicants talent", permission: "candidate.view", route: "/admin/home/candidates" },
      { id: "nav-orgs", label: "Organizations", group: "Navigate", icon: "Network", keywords: "companies employers", permission: "organization.view", route: "/admin/home/organizations" },
      { id: "nav-org-owners", label: "Organization Owners", group: "Navigate", icon: "BadgeCheck", keywords: "owners contacts", permission: "organization.view", route: "/admin/home/organizations-owner" },
      { id: "nav-admins", label: "Admins", group: "Navigate", icon: "ShieldCheck", keywords: "users team roles", permission: "admin.view", route: "/admin/home/admin" },
      { id: "nav-masters", label: "Masters", group: "Navigate", icon: "Layers", keywords: "settings config", permission: "master.view", route: "/admin/home/masters" },
      { id: "nav-edu", label: "Education Masters", group: "Navigate", icon: "BookOpen", keywords: "degree board", permission: "master.view", route: "/admin/home/masters-education" },
      { id: "nav-skill", label: "Skill Masters", group: "Navigate", icon: "Target", keywords: "skills", permission: "master.view", route: "/admin/home/masters-skill" },
      { id: "nav-profile", label: "My Profile", group: "Navigate", icon: "Focus", keywords: "account me", route: "/admin/home/profile" },
      { id: "act-post-job", label: "Post a Job", group: "Actions", icon: "Plus", keywords: "create new job add", permission: "job.create", route: "/admin/home/jobs/add" },
      { id: "act-theme", label: "Toggle Light / Dark Theme", group: "Actions", icon: "Palette", keywords: "theme appearance mode color", theme: true },
    ],
  },

  architecture: {
    intro:
      "A module-based Angular app, split by responsibility, with feature areas loaded only when someone navigates to them.",
    modules: [
      { name: "CoreModule", loaded: "Up front", holds: "HTTP services, guards, interceptors, directives, constants and validators" },
      { name: "SharedModule", loaded: "Up front", holds: "23 reusable components: form controls, tables, dialogs, loader, toast, theme toggle, command palette" },
      { name: "LayoutModule", loaded: "With feature areas", holds: "12 shells: sidebar, navbar, nav dock, and list, detail, card, wrapper, full-form and stepper-form layouts" },
      { name: "LoginModule", loaded: "Up front", holds: "Sign-in and forgot-password screens and services" },
      { name: "CommonPagesModule", loaded: "Lazy", holds: "Landing page" },
      { name: "AdminModule", loaded: "Lazy, guarded by canMatch", holds: "Dashboard, jobs, applications, organizations, masters, admins and settings" },
      { name: "CandidateModule", loaded: "Lazy, inside admin", holds: "Candidate records and bulk import" },
      { name: "JobInfoModule", loaded: "Lazy, inside admin", holds: "Per-job questions and applied candidates" },
    ],
    request: {
      title: "How an API call travels",
      chain: [
        { name: "Component" },
        { name: "Feature service" },
        { name: "SuperadminApi" },
        { name: "HttpApi" },
        { name: "Loading interceptor", note: "shows loader" },
        { name: "Auth interceptor", note: "adds Bearer token", hot: true },
        { name: "REST API" },
      ],
      outcomes: [
        { tag: "440", steps: ["Refresh token", "Retry with new token"] },
        { tag: "401", steps: ["Log out", "Redirect to sign-in"] },
        { tag: "Other errors", steps: ["ErrorHandle", "Toast message"] },
      ],
      caption:
        "Components never touch HttpClient directly. An unauthorized response (401) ends the session, while an expired token (440) is refreshed and the request retried, so people aren't logged out just because a token aged out. Successful responses return to the component unchanged.",
    },
    forms: {
      title: "Forms built from configuration",
      body: "Forms are described as arrays of field objects. FormGroupService turns the array into controls and validators, and a shared layout picks the right component for each of the 16 field types. A new form usually needs a config, with no new template.",
      code: `const fields: IFormLayoutAttributes[] = [
  {
    label: 'Job Type',
    formControlName: 'job_type_id',
    type: InputTypeEnum.SELECT,
    validation: {
      validators: [Validators.required],
    },
  },
  {
    label: 'Total Vacancies',
    formControlName: 'total_vacancies',
    type: InputTypeEnum.NUMBER,
  },
];`,
    },
  },

  access: {
    intro: "Every route in the app and what it takes to reach it.",
    actions: ["view", "create", "edit", "deactivate"],
    resources: ["admin", "candidate", "job", "master", "organization"],
    extraKeys: ["dashboard.view", "notification.settings.manage", "candidate.bulk.create", "candidate.bulk.view_all"],
    extraNote: "Global settings use a separate SUPER_ADMIN role check.",
    routes: [
      {
        group: "Public",
        rows: [
          ["/", "Landing page", "None"],
          ["/superadmin-login", "Sign-in", "Signed out (loginGuard)"],
          ["/forgot-password", "Password recovery", "None"],
          ["/job/:id", "Job link handoff", "None"],
          ["**", "Page not found", "None"],
        ],
      },
      {
        group: "Admin console: /admin/home",
        rows: [
          ["dashboard", "Dashboard", "dashboard.view"],
          ["profile", "My profile", "Signed in"],
          ["applications, applications/:application_id", "Applications and detail", "job.view"],
          ["settings/global", "Global notifications", "SUPER_ADMIN role"],
          ["settings/organization", "Organization notifications", "notification.settings.manage"],
          ["masters, masters-education, masters-skill", "Master data", "master.view"],
          ["admin, admin/:user_id", "Admin list and detail", "admin.view"],
          ["admin/add", "Add admin", "admin.create"],
          ["admin/update/:user_id", "Edit admin", "admin.edit"],
          ["organizations, organizations-owner", "Organizations and owners", "organization.view"],
          ["jobs, jobs/:job_id", "Job list and detail", "job.view"],
          ["jobs/add", "Post a job", "job.create"],
          ["jobs/update/:job_id", "Edit a job", "job.edit"],
        ],
      },
      {
        group: "Per-job workspace: /admin/job-info/job-module",
        rows: [
          ["candidates-applied, candidates-applied/:candidate_id", "Applied candidates and detail", "job.view"],
          ["questions, questions/add", "Screening questions", "job.view"],
        ],
      },
      {
        group: "Candidates: /admin/home/candidates",
        rows: [
          ["/", "Candidate list", "candidate.view"],
          ["bulk", "Bulk upload", "candidate.bulk.create"],
          ["bulk-status, bulk-status/:batch_id", "Batches and batch detail", "Either bulk key"],
          ["add-candidate", "New candidate", "candidate.create"],
          ["update/:user_id, add-profile/:user_id, add-address/:user_id, add-skill/:user_id", "Account, profile, address and skill forms", "candidate.edit"],
          ["add-education, add-certificate, add-language, add-asset, add-experience (/:user_id)", "Add a record", "candidate.create"],
          ["The same five routes with a record ID (/:user_id/:id)", "Edit a record", "candidate.edit"],
          ["view-candidate, view-profile, view-address, view-education, view-certificate, view-language, view-assets, view-experiences, view-skills (/:user_id)", "Read-only record sections", "candidate.view"],
        ],
      },
    ],
  },

  numbers: {
    intro: "Counted directly from the source tree.",
    charts: [
      {
        title: "Components by area",
        unit: "components",
        rows: [
          ["Candidates", 24],
          ["Shared", 23],
          ["Admin", 20],
          ["Layout", 12],
          ["Per-job", 5],
          ["Login", 2],
          ["Public pages", 2],
          ["Root", 2],
        ],
      },
      {
        title: "Lines of code by language",
        unit: "lines",
        rows: [
          ["TypeScript", 19712],
          ["SCSS", 9185],
          ["HTML", 5410],
        ],
      },
    ],
    blocks: [
      ["Lazy-loaded route entries", 4],
      ["Services", 34],
      ["Interface files", 27],
      ["Form field types", 16],
      ["Custom validators", 7],
      ["Angular Material modules", 20],
    ],
  },

  stackIntro:
    "Versions are the ranges declared in the project's package.json. The backend is a separate REST service and isn't part of this codebase.",

  stack: [
    {
      label: "Core framework",
      items: [
        ["Angular", "^20.1", "NgModule architecture, with new built-in control flow (@if, @for) throughout the templates."],
        ["TypeScript", "~5.8", "Application language, with typed interfaces for API models and form configs."],
        ["Angular Signals", "core", "signal, computed, effect and signal inputs for local UI state and list queries."],
        ["RxJS", "~7.8", "HTTP streams, debounced search, token refresh and retry."],
        ["Zone.js", "~0.15", "Change detection runtime."],
        ["tslib", "^2.3", "TypeScript runtime helpers."],
      ],
    },
    {
      label: "Angular packages",
      items: [
        ["Router", "^20.1", "Nested and lazy-loaded routes, plus canActivate and canMatch guards."],
        ["Reactive Forms", "^20.1", "FormBuilder, FormArray, and built-in and custom validators."],
        ["HttpClient", "^20.1", "Functional interceptors for auth, token refresh and the global loader."],
        ["Animations", "^20.3", "Animation providers for Material and toasts."],
        ["Component Dev Kit", "^20.2", "Foundation for Angular Material's overlays and behaviours."],
        ["Platform Browser", "^20.1", "Browser bootstrap, including platform-browser-dynamic (^20.3)."],
      ],
    },
    {
      label: "UI and styling",
      items: [
        ["Angular Material", "^20.2", "20 modules, including table, paginator, sort, dialog, datepicker, select, chips and sidenav, on the azure-blue theme."],
        ["ngx-toastr", "^19.1", "Notifications with a custom toast component."],
        ["SCSS", "per component", "Component styles and shared partials."],
        ["CSS custom properties", "theming", "Light and dark token sets switched by a data-theme attribute."],
        ["Inline SVG and CSS", "no chart lib", "Dashboard charts and landing page motion."],
        ["Material Icons", "icon font", "Icons across navigation, tables and the command palette."],
        ["Fonts", "5 families", "Inter, Instrument Serif, JetBrains Mono, Roboto, and self-hosted Poppins."],
      ],
    },
    {
      label: "Build and tooling",
      items: [
        ["Angular CLI", "^20.1", "Serve, build, test and scaffolding."],
        ["@angular/build", "^20.1", "Application builder, with production budgets and output hashing."],
        ["@angular/compiler-cli", "^20.1", "Ahead-of-time template compilation."],
        ["Prettier config", "angular parser", "Formatting rules for Angular HTML templates."],
        ["EditorConfig", "2 spaces", "Consistent formatting across editors."],
        ["VS Code config", "tasks, launch", "Shared debug and task setup."],
      ],
    },
    {
      label: "Unit test tooling",
      items: [
        ["Karma", "~6.4", "Test runner, with the Chrome launcher (~3.2)."],
        ["Jasmine", "~5.8", "Test framework, with @types/jasmine (~5.1)."],
        ["Karma reporters", "~2.2, ~2.1", "Coverage reporting and the HTML reporter, with the Jasmine adapter (~5.1)."],
      ],
    },
    {
      label: "Browser and platform",
      items: [
        ["REST API", "/api/v1", "Bearer tokens plus credentialed requests."],
        ["Web Storage", "2 stores", "sessionStorage for permissions, and localStorage for theme and recent commands."],
        ["Observer and animation APIs", "native", "IntersectionObserver and requestAnimationFrame."],
        ["File APIs", "native", "Drag and drop, FormData and Blob downloads."],
        ["Network status events", "native", "online and offline drive the dashboard badge."],
        ["Android intents", "job24://", "Deep links into the mobile app, with Play Store and App Store fallbacks."],
      ],
    },
  ],

  designSystem: {
    title: "Design system",
    body: "The app defines its colors as tokens with a separate light and dark set, and defaults to light until a user chooses otherwise. Motion is reduced for people who ask for it through prefers-reduced-motion.",
    themes: [
      {
        name: "Light theme",
        tokens: [
          ["Background", "#f8fafc"],
          ["Card", "#ffffff"],
          ["Text", "#0f172a"],
          ["Violet accent", "#7c3aed"],
          ["Pink accent", "#ec4899"],
        ],
      },
      {
        name: "Dark theme",
        tokens: [
          ["Background", "#0b1220"],
          ["Card", "#111827"],
          ["Text", "#f8fafc"],
          ["Violet accent", "#7c3aed"],
          ["Pink accent", "#ec4899"],
        ],
      },
    ],
  },
};
