/**
 * ============================================================================
 * PROJECTS + CASE STUDIES
 * ============================================================================
 *
 * Built from the seven projects on Sarang's CV, plus the Sports Turf Booking
 * Platform (from its own portfolio brief). Five are featured as full case
 * studies; three are listed in the archive below the showcase. Array order is
 * display order — the turf platform sits third on purpose.
 *
 * WHAT IS FACT vs WHAT NEEDS YOU
 * ------------------------------
 * Overviews, stacks, features and roles come straight from the CV and are
 * accurate. Where the CV did not state something — the business problem behind
 * a project, the alternative you rejected when choosing a pattern, the hard
 * bug you actually fixed — it is left as a marked [PLACEHOLDER] rather than
 * invented. Those are the paragraphs a senior interviewer will press on, so
 * they are worth writing in your own words.
 *
 * `job24` is COMPLETE — problem, challenges, decisions, result and five real
 * screenshots, all from Sarang's own account of the work and write-up of the
 * codebase. Its longer sections (features, routes, counts) are in
 * `job24-detail.js`. Use it as the shape the other three should grow into.
 *
 * ⚠ ONE THING TO CHECK: your CV attributes "35% performance improvement",
 * "2.5s faster page load" and "10,000+ active users" to the Sigma ROLE, not to
 * a named project. They are recorded in `experience.js` where they belong. If
 * a specific number belongs to a specific project, move it into that project's
 * `performance.metrics` — otherwise leave the array empty.
 *
 * IMAGES
 * ------
 * `cover.src: null` renders a generated blueprint wireframe rather than a
 * broken image. To use a real screenshot: drop the file in `public/projects/`,
 * set `src: "/projects/your-file.png"` (1600x1000 works best), and write an
 * `alt` describing what the interface shows.
 */

export const projects = [
  /* ======================================================================== */
  {
    slug: "job24",
    featured: true,
    name: "Job24",
    tagline:
      "The web console behind Job24's hiring pipeline: platform teams post jobs, manage candidates and organizations, and track applications, while shared job links hand people over to the mobile app.",
    year: "2026",
    kind: "Sigma Staffing Solutions",
    role: "Frontend Developer",

    seo: {
      title: "Job24 — Angular 20 Admin Console Case Study",
      description:
        "The web frontend of the Job24 job platform, built with Angular 20, TypeScript, Angular Material, RxJS and SCSS: an admin console, a public landing page and job links that hand people over to the mobile app.",
    },

    cover: {
      src: "/projects/job24/landing.png",
      alt: "The Job24 marketing site: a large headline reading 'Hire the top 1% talent at the speed of now' over a light gradient, with product navigation and a Hire now call to action.",
      width: 1366,
      height: 607,
    },

    stack: [
      "Angular 20",
      "TypeScript",
      "Angular Material",
      "RxJS",
      "Angular Signals",
      "SCSS",
      "Reactive Forms",
      "REST APIs",
    ],

    features: [
      "Operations dashboard with charts hand-built from HTML and SVG",
      "Multi-step job posting form with 35 configured fields",
      "Route guards, nav dock and command palette on one set of permission keys",
      "Bulk candidate import with errors traced to the exact sheet and row",
      "Job links that open the mobile app, even inside WhatsApp and Gmail",
    ],

    links: { live: "https://job24.co.in", github: "" },

    caseStudy: {
      overview:
        "Job24 is a job platform with Android and iOS apps. This is its web frontend: an admin console where platform teams post jobs, manage candidates and organizations, and track applications, plus the public landing page and the job links that hand people over to the mobile app.\n\nThe console follows every application through seven statuses, from Applied to Hired or Rejected, and shows each person only the screens their permissions allow.",

      problem:
        "Recruitment ran on manual resume handling. CVs arrived as files and attachments, were stored and sorted by hand, and every search back through them was somebody re-reading documents they had already read. That made the core job — finding the right candidate for the right role — slow and unreliable, because matching depended on whoever happened to remember a resume rather than on anything queryable.\n\nCandidates had the mirror-image problem. They had no way to see what was open, so a suitable person and a suitable role could sit on either side of the same agency and never meet. Job24 closes both gaps: job seekers find roles and apply through the Android and iOS apps, and this console gives the team behind them a structured record of every candidate, job and application.",

      myRole: {
        summary:
          "I designed, architected and fully developed the frontend, and led it end to end — from the interface design and the module architecture through to the permission model, the dashboard and the settings system. The screens in this case study are the shipped product.",
        responsibilities: [
          "Designed the interface across the admin console and the public landing page, on a design system with separate light and dark token sets",
          "Architected the module-based Angular app, split by responsibility, with feature areas loaded only when someone navigates to them",
          "Built the permission model that the route guards, nav dock and command palette all read from",
          "Built the operations dashboard, with its charts hand-built from HTML and SVG",
          "Built the multi-step job posting form and the configuration-driven form system behind it",
          "Built bulk candidate import, notification settings and the job-link handoff to the mobile app",
          "Led frontend delivery — technical direction, code review and release readiness",
        ],
      },

      decisions: [
        {
          title: "Access rules live on the route",
          reasoning:
            "Each admin route declares what it needs in data, as one key or a list where any key is enough. A per-route fallback stops the dashboard from redirecting to itself when someone can't view it.",
        },
        {
          title: "One permission model everywhere",
          reasoning:
            "The route guards, nav dock and command palette all read the same permission keys, so people don't see links to pages they can't open.",
        },
        {
          title: "Load data when a step needs it",
          reasoning:
            "The job form fetches dropdown options as each step opens. This cuts requests on load and avoids a burst of error toasts if the API has a problem.",
        },
        {
          title: "Signal-driven list pages",
          reasoning:
            "List screens keep page, sort and filters in a signal-based query store, and an effect refetches when it changes. Search input is debounced by 500 ms.",
        },
        {
          title: "Opt out of the global loader",
          reasoning:
            "The loading interceptor covers every request by default. Any call can opt out by adding a skip_loading parameter, without changing the HTTP layer.",
        },
        {
          title: "Shared layouts over one-off pages",
          reasoning:
            "Twelve layout components handle lists, details, cards, tabs and stepper forms, so new screens inherit consistent behaviour and styling.",
        },
      ],

      challenges: [
        {
          title:
            "One job form, five interview modes, and a different set of required fields for each",
          solution:
            "A Telephonic interview needs only start and end dates, while a Walk-in also needs a venue and a time range. The form runs on the same configuration-driven system as the rest of the console, with 35 configured fields across its steps, and the same screen is reused for editing. Dropdown data loads per step so a new posting doesn't fire every API at once, while edit mode loads all steps up front so saved values show as labels.",
        },
        {
          title: "Not logging people out just because a token aged out",
          solution:
            "Every call passes through one HTTP layer, and components never touch HttpClient directly. The auth interceptor adds the Bearer token and tells the failures apart: a 401 ends the session and redirects to sign-in, a 440 refreshes the token and retries the request, and other errors become toast messages. Successful responses return to the component unchanged.",
        },
        {
          title:
            "A shared job link has to open the app, even inside WhatsApp, Telegram and Gmail",
          solution:
            "On Android the link uses an intent:// URL, which also works inside those apps' WebViews. If the app isn't installed, it falls back to the Play Store and passes the job ID as a referrer, and an App Store link covers iOS.",
        },
        {
          title: "Bulk imports where some rows succeed and others don't",
          solution:
            "Non-zip files are rejected before anything is sent. Each upload then becomes a batch tracked as queued, processing, completed or failed, with total, created and failed counts. The batch detail page separates created records, errors and warnings, and errors point to the exact sheet, row and reference ID so a recruiter can fix the source file.",
        },
      ],

      performance: {
        summary:
          "Most of the work here is about not doing things early. Feature areas load only when someone navigates to them, the job form fetches dropdown options as each step opens, search waits 500 ms before asking the API, and the dashboard's charts need no library at all.",
        /**
         * `techniques` describe engineering that was actually done, so they are
         * safe to state. `metrics` are claims about *measured* outcomes and
         * stay empty until real numbers exist — README explains how to capture
         * them. An estimated before/after is the one thing an interviewer can
         * disprove on the spot.
         */
        techniques: [
          {
            icon: "Blocks",
            label: "Lazy-loaded feature areas",
            detail:
              "The landing page, admin console, candidate records and per-job workspace are separate modules behind four lazy-loaded route entries.",
            effect: "A feature area is only fetched when someone navigates to it.",
          },
          {
            icon: "Waypoints",
            label: "Dropdown data loaded per step",
            detail:
              "The job form fetches its options as each step opens. Edit mode is the exception, loading all steps up front so saved values show as labels.",
            effect: "Fewer requests on load, and no burst of error toasts if the API has a problem.",
          },
          {
            icon: "Search",
            label: "Debounced search on signal-driven lists",
            detail:
              "List screens keep page, sort and filters in a signal-based query store, and an effect refetches when it changes. Search input is debounced by 500 ms.",
            effect: "Typing doesn't send a request on every keystroke.",
          },
          {
            icon: "Gauge",
            label: "Charts with no chart library",
            detail:
              "Dashboard charts are hand-built from HTML and SVG. The hiring velocity wave converts bucket totals into a smooth cubic Bézier path.",
            effect: "The dashboard's charts add no charting dependency.",
          },
          {
            icon: "Database",
            label: "Refetching only when the data changes",
            detail:
              "Changing the chart's range refetches because the bucket size changes. Switching between total, self and admin stays in the browser because every bucket already holds all three.",
            effect: "Changing the breakdown costs no request.",
          },
          {
            icon: "Zap",
            label: "Production budgets and output hashing",
            detail:
              "The application builder runs with production budgets and output hashing, and templates are compiled ahead of time.",
            effect: "Bundle size is checked at build time.",
          },
        ],
        metrics: [],
      },

      result:
        "Job24's web frontend is shipped and live at job24.co.in. Manual resume handling is gone: candidate records live in a structured system instead of a folder of documents, and the team behind the platform runs postings, applications, organizations and their own access from one console.\n\nUnderneath, it comes to 90 components, 61 routed views and 34,307 lines of TypeScript, HTML and SCSS, held together by one permission model and one configuration-driven form system.",

      stats: [
        { value: "90", label: "components" },
        { value: "61", label: "routed views" },
        { value: "24", label: "permission keys" },
        { value: "47", label: "API endpoint constants" },
        { value: "34,307", label: "lines of TS, HTML and SCSS" },
      ],
      statsNote: "Counted directly from the source tree.",

      /**
       * Interface mosaic. `size` drives the tile geometry — see TILE in
       * ProjectGallery.jsx. Order matters: the grid places tiles in sequence,
       * and `tall` is what the two `wide` tiles after it sit beside.
       *
       *   feature  full width, the focal point
       *   tall     narrow column spanning two rows
       *   wide     two-thirds width
       *   half     half width
       *
       * Tiles are a designed crop; every one opens uncropped in the lightbox.
       */
      gallery: [
        {
          src: "/projects/job24/dashboard.png",
          size: "feature",
          label: "Analytics dashboard",
          alt: "Job24 analytics dashboard: six stat cards showing 371 total candidates, 567 active jobs, 6 organisations, 8 platform admins, 13 admin-sourced and 358 self-registered, above a bar chart of candidate signups per hour and an area chart of signup flow.",
          width: 1366,
          height: 607,
          caption:
            "Six headline metrics above a growth chart and the hiring velocity wave, both hand-built from HTML and SVG with no chart library. Changing the range refetches because the bucket size changes; changing the breakdown stays in the browser.",
        },
        {
          src: "/projects/job24/permissions.png",
          size: "tall",
          label: "Permission matrix",
          alt: "Job24 admin profile page showing a radar chart of permission distribution across eight modules, cards for each active module with its granted actions, and a full permission matrix table of modules against create, view, edit, deactivate, manage and view_all.",
          width: 1366,
          height: 2044,
          caption:
            "An admin's personal profile page, with their permissions shown as a radar, as module cards and as a matrix. The route guards, nav dock and command palette all read the same permission keys, so people don't see links to pages they can't open.",
        },
        {
          src: "/projects/job24/job-postings.png",
          size: "wide",
          label: "Job postings",
          alt: "Job24 job postings list with a search field, organisation filter, and status tabs for All, Draft, Active, Paused, Closed and Expired, above cards for Enterprise Cloud Architect, Enterprise Architect and Java Developer showing experience range, employment type and work mode.",
          width: 1366,
          height: 607,
          caption:
            "List screens keep page, sort and filters in a signal-based query store, and an effect refetches when they change. Search input is debounced by 500 ms.",
        },
        {
          src: "/projects/job24/add-job-wizard.png",
          size: "wide",
          label: "Job posting wizard",
          alt: "Step one of the Job24 add-job wizard, titled Job Details, with a five-step progress indicator and fields for organisation, industry, job title, job type, employment type, work mode and preferred shift.",
          width: 1366,
          height: 607,
          caption:
            "Step one of five, from a form of 35 configured fields. Dropdown options load as each step opens, so a new posting doesn't fire every API at once.",
        },
        {
          src: "/projects/job24/login.png",
          size: "half",
          label: "Sign in",
          alt: "Job24 sign-in screen: a purple gradient panel reading 'Where talent meets opportunity' beside a white card with username and password fields and a Sign In button.",
          width: 1366,
          height: 607,
          caption:
            "Sign-in at /superadmin-login, kept to signed-out visitors by loginGuard. Password recovery runs in three steps: email, a 6-digit OTP with a resend timer, then a new password.",
        },
        {
          src: "/projects/job24/landing.png",
          size: "half",
          label: "Marketing site",
          alt: "The Job24 marketing site: a large headline reading 'Hire the top 1% talent at the speed of now' over a light gradient, with product navigation and a Hire now call to action.",
          width: 1366,
          height: 607,
          caption:
            "The public landing page: an animated SVG ribbon, pointer parallax, scroll reveals and counters. Employers go to the console, and job seekers go to the app store.",
        },
      ],
    },
  },

  /* ======================================================================== */
  {
    slug: "hrms",
    featured: true,
    name: "SigmaHRMS",
    tagline:
      "One employee record from requisition to exit: a multi-company HR and payroll platform built for Indian employment rules, with six portals, income tax and a full lifecycle timeline.",
    year: "2025",
    kind: "Sigma Staffing Solutions",
    role: "Frontend Developer",

    seo: {
      title: "SigmaHRMS — Angular 19 HR and Payroll Case Study",
      description:
        "The web frontend of SigmaHRMS, branded as Process Pulse: 136,083 lines of Angular serving six portals, covering hiring, employee records, attendance, leave, payroll, income tax and exits for companies with several legal entities.",
    },

    cover: {
      src: "/projects/hrms/login.png",
      alt: "The HRMS sign-in screen: a white card on a lavender background reading 'Sign In As Admin', with Company ID, Username and Password fields, a Sign In Now button, and links to continue as HR or as Manager.",
      width: 1366,
      height: 607,
    },

    stack: [
      "Angular 19",
      "TypeScript",
      "Angular Material",
      "RxJS",
      "Reactive Forms",
      "Apache ECharts",
      "ECharts GL",
      "SCSS",
    ],

    features: [
      "Six portals, each with its own guard, lazy module and sidebar",
      "One lifecycle timeline per person, with audited corrections",
      "Income tax from national rules down to monthly TDS",
      "Payroll runs and versions, with TDS warnings before finalizing",
      "Company feature flags that reshape the navigation",
    ],

    links: { live: "", github: "" },

    caseStudy: {
      overview:
        "SigmaHRMS, branded as Process Pulse, runs HR for companies with several legal entities: hiring, employee records, attendance, leave, payroll, income tax and exits.\n\nThis page covers its web frontend. 136,083 lines of code serve six separate portals through 339 components, 168 services and 554 routes.",

      problem:
        "One platform has to host many companies, and each company has one or more legal entities with their own masters, employees and payroll. It has to follow Indian employment rules: TDS and old and new tax regimes, EPF Form 11, CIBIL checks, national ID records and state-wise holidays.\n\nThe people using it want very different things from the same data. Platform owners, company admins, HR teams, reporting managers, employees, read-only observers and pre-joining candidates all log in, and each company turns on only the features it uses. And an employee's history would otherwise sit across many screens, with no one place that says what has happened to a person from requisition to exit.",

      myRole: {
        summary:
          "Frontend architecture and development of the portal — the portals and their access rules, the feature modules, the dashboards and the API integration.",
        responsibilities: [
          "Built modules across the employee lifecycle: hiring, employee records, attendance, leave, payroll, income tax and separation",
          "Built the session layer: cookie sessions, CSRF handling, and silent recovery when a session expires mid-request",
          "Built the lifecycle timeline, including HR-defined event types, audited corrections and salary redaction",
          "Built the dashboards with Apache ECharts and ECharts GL, rendered through one shared shell for each portal",
          "Built shared UI used across the portals: a list layout and data table, form inputs and page layouts",
          "Maintained a scalable, reusable frontend architecture as the module count grew",
        ],
      },

      decisions: [
        {
          title: "One lazy-loaded module per login type",
          reasoning:
            "Each login type has its own URL space, guard, lazy module and sidebar. Without a valid session, canMatch stops the portal's code from downloading at all.",
        },
        {
          title: "Signals in components, RxJS for HTTP, and no store",
          reasoning:
            "Signals and computed values hold state in components, with RxJS for HTTP and no global store library. 297 of the 339 components use signals.",
        },
        {
          title: "Cookie sessions with explicit headers",
          reasoning:
            "Auth runs on cookie sessions, an X-CSRF header and an X-Token-Type header naming the login type, so the API can tell which of the portals a call belongs to.",
        },
        {
          title: "Interceptors that know their own territory",
          reasoning:
            "Thirteen interceptors run in one chain. Most check the request URL, so each acts only on its own part of the API.",
        },
        {
          title: "Shared UI over one-off screens",
          reasoning:
            "A list layout and data table are used by 126 templates, alongside 6 form inputs and 6 page layouts.",
        },
        {
          title: "Dashboards defined as data",
          reasoning:
            "Admins define the cards, filters and charts through Card, Filter and Chart masters. A shared shell then renders KPI cards, a filter rail and 2D or draggable 3D charts for each portal.",
        },
      ],

      challenges: [
        {
          title: "Silent session recovery",
          solution:
            "When a dashboard fires many calls and the session expires, every call fails at once. The first 440 starts one refresh, the rest wait on a shared BehaviorSubject, and all of them replay. A stale CSRF token gets one retry, guarded by an X-CSRF-Retry marker so it can't loop.",
        },
        {
          title: "3D charts blank in clean builds",
          solution:
            "ECharts GL registered its 3D series on a second copy of ECharts, and esbuild tree-shook the bare side-effect import. Importing the same CommonJS dist file that GL requires, through a referenced namespace import, keeps one instance and keeps the registration.",
        },
        {
          title: "One screen, several logins",
          solution:
            "HR, Admin and managers share screens but differ in entity source and permissions. Admins take the entity from the route and other logins take it from their session. A small viewer helper picks the buttons, and the server still decides the data scope.",
        },
        {
          title: "Redaction as a state",
          solution:
            "A missing salary password is a normal response with amounts removed, so it can't go through error handling. The page shows a password banner, tells a wrong password apart from a first visit, refetches with the password, and passes it on to file requests for pay events.",
        },
        {
          title: "Protected files and popup blockers",
          solution:
            "Event files need credentials and a CSRF header, so a plain link can't open them. The new tab opens on the click, before the fetch, so blockers allow it. The blob then loads into it, the object URL is revoked after 60 seconds, and a failed fetch closes the empty tab.",
        },
        {
          title: "Errors hidden inside blobs",
          solution:
            "A failed download returns its error body as a Blob, which hides the server's title and message. The auth interceptor reads and parses the Blob first, so a forced logout during a download still explains itself.",
        },
        {
          title: "Feature flags in navigation",
          solution:
            "Each company turns on payroll, onsite tracking, CIBIL, reviews, evaluation and Form 11 separately. Sidebars are built from the company settings in the session, and fetch them when the session has none.",
        },
        {
          title: "Server rules, caught early",
          solution:
            "The event type editor checks the same combinations the server refuses, such as OTP acceptance without a required document. Users fix them before saving. Filters also send repeated query values as ?category=A&category=B, the form FastAPI reads.",
        },
      ],

      performance: {
        summary:
          "At 136,083 lines across six portals, the main job is making sure nobody pays for the parts they will never open. Each login type is its own lazy module behind a guard, a burst of failed calls costs one session refresh, and work the server has already done isn't repeated in the browser.",
        /**
         * Same rule as Job24: `techniques` describe engineering that was
         * actually done and are safe to state. `metrics` are claims about
         * *measured* outcomes and stay empty until real numbers exist.
         */
        techniques: [
          {
            icon: "Blocks",
            label: "Portal code behind the guard",
            detail:
              "The app has 11 lazy-loaded route entries, with one lazy module per login type, and canMatch guards in front of them.",
            effect: "Without a valid session, a portal's code doesn't download at all.",
          },
          {
            icon: "Waypoints",
            label: "One refresh for a burst of failures",
            detail:
              "When many calls fail at once on an expired session, the first 440 starts one refresh, the rest wait on a shared BehaviorSubject, and all of them replay.",
            effect: "Many failed calls cost one refresh, and most session failures never reach the user.",
          },
          {
            icon: "Clock",
            label: "No re-sorting of the timeline",
            detail:
              "The server sends lifecycle rows newest first, and the client groups them by month without re-sorting.",
            effect: "The browser doesn't repeat an ordering the server already did.",
          },
          {
            icon: "Gauge",
            label: "Charts sized by ResizeObserver",
            detail:
              "Dashboard charts use ResizeObserver for responsive sizing, through a shared shell that renders each portal's KPI cards, filter rail and charts.",
            effect: "Charts follow the size of their container.",
          },
        ],
        metrics: [],
      },

      result:
        "The reusable component and validation layer built here contributed to a 30% increase in development efficiency across projects at Sigma.\n\nOne platform carries hiring, employee records, attendance, leave, payroll, income tax and exits for companies with several legal entities. An employee's history is one timeline from requisition to exit instead of something spread across many screens, corrections leave a trail, and rehires stay one person across employments.\n\nEach company turns on only the features it uses, and the navigation follows. Underneath, it comes to 339 components, 168 services and 554 routes serving six portals.",

      stats: [
        { value: "136,083", label: "lines of code" },
        { value: "6", label: "separate portals" },
        { value: "339", label: "components" },
        { value: "168", label: "services" },
        { value: "554", label: "routes" },
      ],
      statsNote: "Counted from the source code on 4 November 2026.",
      /**
       * Interface mosaic. `size` drives the tile geometry — see TILE in
       * ProjectGallery.jsx. Every shot here is a 1366×607 browser window, so
       * this gallery uses the landscape tile set rather than Job24's `tall`
       * column, which would crop a wide app frame down to a sliver.
       *
       *   feature  full width, the focal point
       *   major    seven of twelve columns
       *   minor    five of twelve columns — pairs with `major` to fill a row
       *   third    four of twelve columns, shorter — a trio across
       *
       * Order matters: the grid places tiles in sequence, and each band must
       * add up to twelve columns or the row leaves a hole.
       */
      gallery: [
        {
          src: "/projects/hrms/employee-directory.png",
          size: "feature",
          label: "Employee directory",
          alt: "The HRMS employee directory: a left sidebar branded Sigma Staffing with Master, Position Management, Employee Profile, Manager Profile, Candidate Profile, Candidate Requisition, Upload Excel, Company Settings and Review Cycle, beside a table of employees showing title, name, employee code, position code and role, with per-row info, activation and exit controls.",
          width: 1366,
          height: 607,
          caption:
            "The Admin portal's employee list, inside its own sidebar. Sidebars are built from the company settings in the session, so each company sees only the features it has turned on.",
        },
        {
          src: "/projects/hrms/employee-profile.png",
          size: "major",
          label: "Employee record",
          alt: "An HRMS employee profile page showing an avatar, an Update Exit Detail button and an edit control, over fields for employee code, name, role, date of joining, Aadhar card, mobile, business phone, personal and professional email, PF number, UAN number, ESIC number, notice period, probation period and reporting manager.",
          width: 1366,
          height: 607,
          caption:
            "An employee profile. The wrapper holds 28 record sections, including address, national ID, bank details and salary, and managers and employees reach the same sections through their own routes.",
        },
        {
          src: "/projects/hrms/leave-requests.png",
          size: "minor",
          label: "Leave approvals",
          alt: "The HRMS manager view of employee leave lists, showing a pending maternity leave request from Akshat Tripathi with its date range and reason, and Accept and Reject buttons.",
          width: 1366,
          height: 607,
          caption:
            "Managers approve leave requests and regularisations for their team. Reporting lines come from the position tree, so manager access follows it.",
        },
        {
          src: "/projects/hrms/company-settings.png",
          size: "minor",
          label: "Company preferences",
          alt: "The HRMS Set Company Preferences screen with toggles for Enable CIBIL, Leave Balance Maintenance, Enable On Site Tracker, Enable Extra Info Form and Enable Employee Review Form, followed by minimum service days and minimum removal percentage fields revealed by the review toggle.",
          width: 1366,
          height: 607,
          caption:
            "Each company turns on its own features here, and the sidebars follow. Payroll, onsite tracking, CIBIL, reviews, evaluation and Form 11 are all switched separately.",
        },
        {
          src: "/projects/hrms/attendance-report.png",
          size: "major",
          label: "Attendance report",
          alt: "The HRMS attendance report: search, period, image-inclusion and date-range filters above a horizontally scrollable table of employee details covering designation, department, business unit, joining date, state, city, attendance status, check in, check out and address, with a paginator.",
          width: 1366,
          height: 607,
          caption:
            "The Attendance Report, alongside the P&A Report, date-wise views, absconding reports and Excel attendance upload.",
        },
        {
          src: "/projects/hrms/payroll-versions.png",
          size: "third",
          label: "Payroll sheet versions",
          alt: "The HRMS payroll sheet versions screen for July 2026, with Upload Sheet and Re-Run Payroll actions, tabs for version 2 and version 1, and a draft payslip sheet showing payroll month, version number, status, source, original filename and row count.",
          width: 1366,
          height: 607,
          caption:
            "Payroll Action covers manual payroll attendance, payroll runs, versions and final payroll. Runs show TDS warnings before finalizing.",
        },
        {
          src: "/projects/hrms/position-form.png",
          size: "third",
          label: "Position management",
          alt: "The HRMS Add Position Management form with fields for position name, start and end date, job code, job title, job level, position band, maximum age, age validation, division, sub division, business unit and function.",
          width: 1366,
          height: 607,
          caption:
            "Adding a position. Position Management also covers Position Structure, Position Restructure and bulk Close/Open Positions, and reporting lines come from the position tree.",
        },
        {
          src: "/projects/hrms/login.png",
          size: "third",
          label: "Role-based sign in",
          alt: "The HRMS sign-in card reading 'Sign In As Admin' with Company ID, Username and Password fields, a Sign In Now button, and links to continue as HR or as Manager.",
          width: 1366,
          height: 607,
          caption:
            "One of six login screens. Each login type has its own URL space, guard, lazy module and sidebar.",
        },
      ],
    },
  },

  /* ======================================================================== */
  /*
   * Sourced entirely from the project's portfolio brief (compiled 3 Nov 2026
   * from the repository and the live deployment). Its rules carry over here:
   * nothing outside the brief, no technology it does not list, and the live
   * site is a DEMO — Razorpay test keys, Google sign-in limited to listed test
   * users. Never imply it has taken real customer money or has real traffic.
   * The performance figures are targets, not measured percentiles.
   */
  {
    slug: "sports-turf-booking-platform",
    featured: true,
    name: "Sports Turf Booking Platform",
    tagline:
      "A full-stack turf booking platform with live slot availability, Razorpay payments and an owner ledger.",
    year: "2026",
    kind: "Boundary Box, Kanpur",
    role: "Full-stack Developer",

    seo: {
      title: "Sports Turf Booking Platform — Full-Stack Next.js Case Study",
      description:
        "A full-stack sports turf booking platform built with Next.js 16, Prisma and Razorpay — live slot availability, webhook-verified payments, concurrency-safe booking and an owner ledger with Excel export.",
    },

    cover: {
      src: "/projects/turf-booking/home-desktop.png",
      alt: "The Boundary Box homepage: a large headline reading 'Play more. Book smarter.' beside a hand-drawn turf scene with a cricket bat, a football and a badminton racket.",
      width: 1280,
      height: 860,
    },

    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "PostgreSQL",
      "Prisma 7",
      "Razorpay",
      "Auth.js v5",
      "Tailwind CSS v4",
      "Neon",
      "Zod 4",
      "Resend",
      "ExcelJS",
      "Vitest",
      "Playwright",
      "Vercel",
    ],

    features: [
      "Live seven-day slot grid, re-polled every ten seconds",
      "Payments confirmed only by a signature-verified Razorpay webhook",
      "Owner ledger with URL-driven filters and a styled Excel export",
      "Self-service cancel and reschedule up to 24 hours before the game",
      "Automatic refunds for payments that land after a hold expires",
    ],

    links: {
      live: "https://turf-booking-eosin.vercel.app",
      github: "",
      liveNote:
        "The live site is a fully working demo: Razorpay runs on test keys and Google sign-in is limited to listed test users, so no real money moves through it.",
    },

    caseStudy: {
      overview:
        "A booking platform for a single sports turf — Boundary Box, in Ashok Nagar, Kanpur — built end to end: data model, APIs, UI and deployment. Customers browse a live seven-day grid of thirty-minute slots, choose how many are playing, sign in with Google and pay through Razorpay. The slot is held for fifteen minutes while payment is in flight, and only a signature-verified webhook from the gateway can confirm a booking — never the browser.\n\nThe owner side is a complete ledger: every booking with customer detail, URL-driven filters, income and refund totals, free owner bookings, rescheduling and a styled Excel export. It covers the whole product — a Postgres schema, thirteen REST endpoints, eleven pages and a deployment runbook — and is deployed to Vercel.",

      problem:
        "Getting a game together tends to die in a group chat: someone suggests playing, ten messages later nobody knows whether the ground is free, and the plan quietly falls apart. The turf needed a booking you could finish on a phone before that conversation moved on — live availability, a price, and a confirmed slot.\n\nThe hard part is that this is a booking that takes money for a time slot. Two people can tap the same slot at the same moment, on stateless serverless instances that share nothing. A gateway webhook can be late, fail, or never arrive. Someone can pay in the last seconds of a hold, after the slot has already been released. And the host runs in UTC while the turf runs on IST, with a business day from 6:00 AM to 1:00 AM the next day. Each of those, handled naively, ends in either a double booking or money kept for a slot that cannot be delivered.",

      myRole: {
        summary:
          "Sole developer — data model, backend, frontend and deployment. Built solo over two weeks in September 2026.",
        responsibilities: [
          "Designed the PostgreSQL schema in Prisma ORM 7, across five SQL migrations on Neon serverless Postgres",
          "Built thirteen REST endpoints, validated with Zod, including order creation, the Razorpay webhook and the owner ledger",
          "Integrated Razorpay Orders, Checkout and Webhooks, with HMAC SHA-256 verification over the raw request body",
          "Implemented Google OAuth 2.0 sign-in with Auth.js v5 and JWT sessions, preserving the customer's selection through the round trip",
          "Built eleven pages and 24 React components mobile-first in Tailwind CSS v4 — inline SVG and CSS keyframes, no UI library",
          "Built the owner ledger: URL-driven filters, totals, three refund routes, free bookings, rescheduling and a styled ExcelJS export",
          "Wired transactional email through Resend and daily hold expiry through Vercel Cron",
          "Deployed to Vercel with a per-request nonce CSP, HSTS and full security headers; 41 unit tests in Vitest, plus Playwright",
        ],
      },

      featureGroups: [
        {
          title: "Customer",
          icon: "Smartphone",
          items: [
            "Animated marketing homepage with FAQ and JSON-LD structured data",
            "Seven-day strip and a live slot grid, re-polled every ten seconds",
            "Five slot states, each shown as colour and icon and word",
            "Player stepper from 2 to 14 with server-recalculated pricing",
            "Google sign-in that keeps the selection through the OAuth round trip",
            "Razorpay Checkout with a fifteen-minute hold",
            "Status page that polls until the payment settles",
            "My bookings, with full receipts and refund state",
            "Self-service cancel and reschedule up to 24 hours before the game",
          ],
        },
        {
          title: "Owner",
          icon: "Briefcase",
          items: [
            "Owner-only desk, gated server-side, returning 404 rather than 403",
            "Lifetime ledger with customer name, email and phone",
            "Filters, date presets, status and pagination entirely in the URL",
            "Totals over the whole filter, not the page, with blocked time valued apart from income",
            "Cancel with three refund routes: gateway, manual with UTR, or none with a note",
            "Free owner bookings, and moving any customer's booking",
            "Styled Excel export with self-sizing columns and ₹ as a real number format",
          ],
        },
        {
          title: "Platform",
          icon: "ShieldCheck",
          items: [
            "Unpaid holds expire inline and by a daily cron",
            "Payments arriving after expiry are refunded automatically",
            "Transactional email on confirm, move, cancel and late refund",
            "Per-page metadata, sitemap, robots and generated Open Graph images",
            "Per-request nonce CSP and full security headers",
            "Privacy, Terms and Cancellation pages that match what the code does",
          ],
        },
      ],

      approach:
        "The customer flow is deliberately short. A mobile-first homepage leads to one booking screen with a seven-day strip and a live grid of thirty-minute slots that re-polls every ten seconds. Choosing a window and a number of players produces a server-calculated price — the browser's figure is display-only — and Google sign-in carries the selection through in the URL, so nothing is lost on the way back. Razorpay Checkout opens, and the slot is held for fifteen minutes.\n\nThe interesting work is what happens after that. Every rule that decides who gets a slot or what happens to money lives on the server or in the database, never in the client: the browser can name a booking, but it can never assert an outcome.",

      decisions: [
        {
          title: "The browser is never allowed to confirm a payment",
          reasoning:
            "Checkout's success handler does nothing but navigate. Confirmation comes only from a Razorpay webhook whose HMAC signature is verified over the raw body with a timing-safe comparison, or from the server independently asking Razorpay about the order. A client may name a booking id; it may never assert an outcome — because a browser redirect is something a client could forge.",
        },
        {
          title: "Timezone is explicit, because the host is not in India",
          reasoning:
            "Vercel runs UTC and the turf runs on IST. The business day is 6:00 AM to 1:00 AM the next day, so the midnight slots belong to the previous business date. All of it is computed in Asia/Kolkata explicitly, and Date#getHours() is banned from business logic.",
        },
        {
          title: "Money is integer paise, never a float",
          reasoning:
            "Prices are recomputed server-side on every request and stored as integers, so the owner's income totals and the Excel export add up exactly.",
        },
        {
          title: "State lives in the URL",
          reasoning:
            "The ledger's filters, date range, status and page are URL parameters parsed by one pure, unit-tested module. A view can be bookmarked or shared, and the Excel download inherits the identical query, so what is on screen and what is exported cannot diverge.",
        },
      ],

      challenges: [
        {
          title:
            "Two people tapping the same slot at the same moment, across stateless serverless instances",
          solution:
            "Double-booking is prevented by the database, not by code. A @@unique([turfId, slotStart]) constraint means two simultaneous requests for the same slot cannot both succeed, regardless of application logic or how many serverless instances are running. The loser gets a 409 naming exactly which times were taken, and the client drops those and keeps the rest of the selection.",
        },
        {
          title:
            "A customer paying in the final seconds of a hold, after the slot has been released",
          solution:
            "Keeping money for a slot that cannot be delivered was treated as the one unacceptable failure mode. Reconciliation therefore inspects bookings that are already cancelled, records the late payment and issues a gateway refund automatically.",
        },
        {
          title:
            "A webhook that is late, fails, or never arrives — and a payment stuck at authorized",
          solution:
            "There is a second confirmation path: the server asks Razorpay directly about the order and runs the identical confirm logic, so a lost webhook does not mean a lost booking. On an account without auto-capture a payment can sit at authorized — paid, but not yet the turf's — so both the webhook and the reconcile path capture explicitly instead of assuming.",
        },
        {
          title: "Rescheduling without ever refunding money or stranding a slot",
          solution:
            "Moving a booking creates a linked replacement instead of mutating the original. The original keeps its times until the replacement confirms, so an abandoned move costs nothing; slots the two share stay with the original, so a half-finished move cannot strand a slot; and the swap happens in one transaction. It also forced a useful distinction: a booking's total is a price, not a receipt, so refunds walk the reschedule chain for the cash actually taken.",
        },
      ],

      performance: {
        summary:
          "Each endpoint is held to a latency budget in the project's own guide, sized to how often it runs — the slot grid is polled every ten seconds, so it carries the tightest one. These are targets, not measured production percentiles: the live site has not been load-tested. The work that does show up on screen is mobile-first by enforcement rather than by assumption — designed at 360 px and verified at 320, 375, 390, 414 and 430.",
        techniques: [
          {
            icon: "Clock",
            label: "A live grid on a short poll",
            detail:
              "Availability re-polls every ten seconds, and the slot endpoint is held to the tightest budget in the system because it is the one that runs constantly.",
            effect: "What the customer sees as free is genuinely free.",
          },
          {
            icon: "Database",
            label: "Prices recomputed on the server",
            detail:
              "The browser's price is display-only. The server recalculates it on every request and stores it as integer paise.",
            effect: "Totals and the Excel export add up exactly.",
          },
          {
            icon: "FileText",
            label: "An export sized from its own data",
            detail:
              "Excel column widths are measured from the real data as rows stream past, wrapping values that still will not fit.",
            effect: "An export nobody has to resize.",
          },
          {
            icon: "Smartphone",
            label: "Tap targets audited by script",
            detail:
              "A script flagged every interactive element under 44 px. Testing on a real phone over Wi-Fi caught three production bugs, including security headers that broke every script on the page when served over plain HTTP.",
            effect: "Mobile-first was checked, not assumed.",
          },
        ],
        budgets: [
          { label: "GET /api/slots, polled every 10 s", target: "< 150 ms" },
          { label: "POST /api/bookings, hold plus gateway order", target: "< 400 ms" },
          { label: "Razorpay webhook", target: "< 300 ms" },
          { label: "Owner ledger reads", target: "< 250 ms" },
        ],
        budgetsNote:
          "Targets each endpoint is held to in the project guide — not measured percentiles.",
        metrics: [],
      },

      result:
        "Built solo in two weeks and live as a fully working demo at turf-booking-eosin.vercel.app — Razorpay in test mode, Google sign-in limited to listed test users. About 15,200 lines of TypeScript, TSX and CSS, with 41 unit tests passing.\n\nThe customer side is a booking you can finish on a phone in three taps. The owner side is a lifetime ledger with totals, refunds, rescheduling and an export that matches the screen. Underneath both, the rules that matter when money is involved are enforced where they cannot be bypassed: the database decides who gets a slot, the gateway decides whether a payment happened, and a payment that cannot be honoured is given back automatically.",

      stats: [
        { value: "15,200", label: "lines of TS / TSX / CSS" },
        { value: "13", label: "REST endpoints" },
        { value: "11", label: "pages" },
        { value: "41", label: "unit tests, all passing" },
        { value: "24", label: "React components" },
        { value: "5", label: "database migrations" },
        { value: "38", label: "bookable slots a day" },
        { value: "2 wk", label: "solo build" },
      ],
      statsNote: "Counted from the repository on 3 Nov 2026 — not estimated.",

      stackGroups: [
        {
          label: "Framework & language",
          items: ["Next.js 16.3", "App Router", "React 19.2", "React Server Components", "TypeScript 5 strict"],
        },
        {
          label: "Styling",
          items: ["Tailwind CSS v4", "Inline SVG", "CSS keyframes", "No UI library"],
        },
        {
          label: "Database",
          items: ["PostgreSQL", "Neon serverless", "Prisma ORM 7", "@prisma/adapter-pg", "5 SQL migrations"],
        },
        {
          label: "Auth",
          items: ["Auth.js / NextAuth v5", "Google OAuth 2.0", "JWT sessions"],
        },
        {
          label: "Payments",
          items: ["Razorpay Orders", "Razorpay Checkout", "Razorpay Webhooks", "HMAC SHA-256"],
        },
        {
          label: "Services & data",
          items: ["Resend", "ExcelJS", "Zod 4", "date-fns-tz", "server-only"],
        },
        {
          label: "Testing",
          items: ["Vitest 5", "Playwright"],
        },
        {
          label: "Hosting & ops",
          items: ["Vercel (sin1)", "Vercel Cron", "CSP with nonce", "HSTS"],
        },
      ],

      /**
       * Captured from the live site on 3 Nov 2026: desktop at 1280px, phones
       * at 390px @2x. The booking grid is a full-page capture, so it names a
       * `position` to frame the day strip and slot grid rather than the hero.
       * Phone shots carry `displayWidth` so the lightbox draws them at device
       * width. Bands: feature / three phones (4+4+4) / half+half / half+half.
       */
      gallery: [
        {
          src: "/projects/turf-booking/book-grid-desktop.png",
          size: "feature",
          position: "50% 19%",
          label: "Booking page",
          alt: "The Boundary Box booking page: a seven-day strip, a colour-coded grid of thirty-minute slots grouped into morning, afternoon, evening and night with a five-state legend, and a booking panel with a player stepper and a sign-in button.",
          width: 1280,
          height: 3640,
          caption:
            "The signature screen. Seven-day strip, the live slot grid with its five-state legend, the player stepper and the price panel. The grid re-polls every ten seconds, and the price shown here is display-only — the server recalculates it.",
        },
        {
          src: "/projects/turf-booking/book-grid-mobile.png",
          size: "tall",
          label: "Slot grid · phone",
          alt: "The slot grid on a phone: a legend of five states — free, selected, being booked, booked and gone — then morning, afternoon and evening slots in three columns.",
          width: 780,
          height: 2000,
          displayWidth: 390,
          caption:
            "Every state carries colour, an icon and a word — never colour alone. Tap targets were audited by a script that flags anything under 44 px.",
        },
        {
          src: "/projects/turf-booking/book-mobile.png",
          size: "tall",
          label: "Booking page · phone",
          alt: "The booking page on a phone, showing the live availability label, the headline 'Book your turf slot at Boundary Box' and the start of the seven-day strip.",
          width: 780,
          height: 1688,
          displayWidth: 390,
          caption:
            "Most visitors book on a phone. The day strip and booking panel stack to one column, designed at 360 px and verified from 320 to 430.",
        },
        {
          src: "/projects/turf-booking/home-mobile.png",
          size: "tall",
          label: "Homepage · phone",
          alt: "The homepage on a phone with a hamburger drawer, a compact Book button and the headline 'Play more. Book smarter.'",
          width: 780,
          height: 1688,
          displayWidth: 390,
          caption: "Drawer navigation and a compact, persistent book button.",
        },
        {
          src: "/projects/turf-booking/home-desktop.png",
          size: "half",
          label: "Homepage",
          alt: "The homepage hero: large type reading 'Play more. Book smarter.' beside an illustrated turf with a cricket bat, a football and a badminton racket.",
          width: 1280,
          height: 860,
          caption:
            "A hand-drawn SVG scene — no illustration library, and no UI library anywhere in the project.",
        },
        {
          src: "/projects/turf-booking/book-desktop.png",
          size: "half",
          label: "Booking page, above the fold",
          alt: "The top of the booking page: a live availability label, the headline 'Book your turf slot at Boundary Box', and chips for instant online confirmation, UPI, card and netbanking, and 2 to 14 players per booking.",
          width: 1280,
          height: 860,
          caption: "Live availability, instant confirmation and the payment methods, before the first scroll.",
        },
        {
          src: "/projects/turf-booking/about-desktop.png",
          size: "half",
          label: "About",
          alt: "The About Boundary Box page, with a section titled 'Why this ground exists'.",
          width: 1280,
          height: 860,
          caption: "Ground spec, facilities and house rules.",
        },
        {
          src: "/projects/turf-booking/contact-desktop.png",
          size: "half",
          label: "Contact",
          alt: "The Contact Boundary Box page with Call the turf and WhatsApp us buttons, the phone number and a map.",
          width: 1280,
          height: 860,
          caption: "Call, WhatsApp and a map — deliberately no message form.",
        },
      ],
    },
  },

  /* ======================================================================== */
  {
    slug: "crypto-payment-portal",
    featured: true,
    name: "Crypto Payment Portal",
    tagline:
      "A secure cryptocurrency payment platform handling real-time transactions and token swapping across multiple currencies.",
    year: "2022 – 2024",
    kind: "Client project",
    role: "Frontend Developer",

    cover: {
      src: null,
      alt: "[Describe the payment portal interface — e.g. the transaction screen showing live rates and a token swap form]",
      width: 1600,
      height: 1000,
    },

    stack: [
      "Angular",
      "TypeScript",
      "Cryptocurrency APIs",
      "JWT",
      "Bootstrap",
    ],

    features: [
      "Multiple cryptocurrency payment options",
      "Real-time transaction processing",
      "Token swapping",
      "Security-focused transaction flow",
    ],

    links: { live: "", github: "" },

    caseStudy: {
      overview:
        "A cryptocurrency payment portal enabling digital asset transactions and token swapping. The interface handles multiple currencies, processes transactions in real time, and is built around the security expectations that come with moving money rather than data.",

      problem:
        "[What did this enable that was not possible before? e.g. a merchant needed to accept crypto alongside conventional payment, or existing tools had a checkout flow users abandoned. Describe the real driver.]",

      myRole: {
        summary:
          "Frontend development of the payment experience — the transaction interface, live rate handling, the swap flow, and the security-facing parts of the UI.",
        responsibilities: [
          "Designed an interface for managing crypto payments and viewing transaction state",
          "Integrated multiple cryptocurrency payment options",
          "Built real-time transaction processing and status feedback",
          "Implemented token swapping functionality",
          "Optimised the platform for performance and scale",
        ],
      },

      approach:
        "Financial interfaces fail differently from content interfaces: a stale price or an ambiguous pending state is a real loss, not a cosmetic bug. The transaction flow is therefore built around explicit state — pending, confirming, confirmed, failed — with live rate data driving the UI rather than a value captured once at page load, and every irreversible action gated behind a confirmation the user cannot trigger by accident.",

      decisions: [
        {
          title: "Explicit transaction state machine in the UI",
          reasoning:
            "[Confirm and expand: how did you represent pending vs confirmed vs failed, and what did the user see during each? This is the most interesting engineering story in a payments UI — worth writing properly.]",
        },
        {
          title: "Live rate data rather than a value fetched once",
          reasoning:
            "[Why, and how did you handle a rate moving between quote and confirmation? Even a short answer here demonstrates you understood the domain.]",
        },
        {
          title: "JWT-secured session handling",
          reasoning:
            "[Why JWT here, and what did you do about token expiry mid-transaction?]",
        },
      ],

      challenges: [
        {
          title:
            "[The hardest part — e.g. keeping rates current without hammering the API, handling a transaction that succeeds on-chain but times out in the UI, or supporting several currencies with different confirmation times]",
          solution: "[How you actually solved it.]",
        },
      ],

      performance: {
        summary:
          "[What you optimised for performance and scalability on this project.]",
        metrics: [],
      },

      result:
        "[What the platform achieved — transaction volume, currencies supported, or the qualitative outcome for the client.]",

      gallery: [],
    },
  },

  /* ======================================================================== */
  {
    slug: "job-portal-react",
    featured: true,
    name: "Job Portal — Full Stack",
    tagline:
      "A MERN-stack recruitment application built end to end: React frontend, Express API, MongoDB, and JWT authentication.",
    year: "Personal project",
    kind: "Full-stack build",
    role: "Full-stack Developer",

    cover: {
      src: null,
      alt: "[Describe the interface — e.g. the employer dashboard listing posted jobs and incoming applications]",
      width: 1600,
      height: 1000,
    },

    stack: [
      "React.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "JWT",
      "bcrypt",
      "Axios",
    ],

    features: [
      "Recruiter job posting and employer dashboards",
      "Candidate profile management and applications",
      "JWT + bcrypt authentication",
      "RESTful API built from scratch",
    ],

    links: { live: "", github: "" },

    caseStudy: {
      overview:
        "A full-stack job portal built end to end — React on the frontend, an Express REST API and MongoDB behind it. Recruiters post roles and manage applications from an employer dashboard; candidates maintain a profile and apply. Authentication uses JWT with bcrypt-hashed credentials.",

      problem:
        "Building the same product surface I work on professionally in Angular, but from the other side of the API and in a different framework. The goal was to understand the whole request path — what the frontend asks for, why the backend shapes a response the way it does, and where the boundary between them should actually sit.",

      myRole: {
        summary:
          "Everything — data model, API, authentication and frontend. Built solo.",
        responsibilities: [
          "Built responsive React components for the candidate and recruiter experiences",
          "Implemented authentication with JWT and bcrypt password hashing",
          "Developed employer dashboards and employee profile management",
          "Designed and built RESTful API endpoints for job operations",
          "Modelled and integrated MongoDB for job, application and user data",
        ],
      },

      approach:
        "Owning both sides let me design the API around what the interface actually needed instead of adapting to a contract handed over. Data fetching sits behind an Axios client with interceptors handling auth headers and error normalisation centrally, so components deal in data and state rather than HTTP.",

      decisions: [
        {
          title: "Building the API rather than mocking it",
          reasoning:
            "Working against a real backend surfaced the questions a mock hides — pagination shape, error contracts, what belongs in a token versus a request. That understanding transfers directly to the Angular work, where I consume APIs I did not design.",
        },
        {
          title: "JWT with bcrypt-hashed credentials",
          reasoning:
            "Stateless auth that scales horizontally, with passwords never stored recoverably. bcrypt's deliberate slowness is the point — it is what makes an offline attack on a leaked database expensive.",
        },
        {
          title: "Axios interceptors for the HTTP layer",
          reasoning:
            "Auth headers and error handling belong in one place. Without interceptors, every component ends up re-implementing the same token attachment and the same 401 handling, slightly differently each time.",
        },
      ],

      challenges: [
        {
          title:
            "[What was genuinely hard here — coming from Angular's structured conventions to React's freedom is a common one, and an honest answer that shows self-awareness reads well]",
          solution: "[How you worked through it.]",
        },
      ],

      performance: {
        summary:
          "[What you optimised, if anything. It is fine to say this was a learning build where correctness came before optimisation — that is a more credible answer than an invented metric.]",
        metrics: [],
      },

      result:
        "[What you took away from it, and what you would do differently now. For a personal project this is more valuable than a usage number.]",

      gallery: [],
    },
  },

  /* ===================== ARCHIVE (not featured) ============================ */

  {
    slug: "krishna-motor-showroom",
    featured: false,
    name: "Krishna Motor Showroom",
    tagline:
      "A dealership website for motorcycle and tractor showrooms with WooCommerce-backed inventory and online sales.",
    year: "2022 – 2024",
    kind: "Client project",
    role: "Web Developer",

    cover: { src: null, alt: "Krishna Motor Showroom website", width: 1600, height: 1000 },

    stack: ["WordPress", "WooCommerce", "HTML5", "CSS3", "MySQL"],

    features: [
      "WooCommerce inventory and payment processing",
      "Dealer location mapping",
      "Responsive product showcase",
    ],

    links: { live: "https://krishnamotorshowroom.com", github: "" },

    caseStudy: {
      overview:
        "A responsive dealership website for motorcycle and tractor showrooms, with customised themes and product management. WooCommerce handles online sales, inventory and payment processing, and the site improves engagement through responsive design, dealer location mapping and optimised product showcase pages.",
      problem: "[What did the dealership need that they did not have?]",
      myRole: {
        summary:
          "Built the site end to end — theme customisation, WooCommerce configuration, responsive layout and product pages.",
        responsibilities: [
          "Customised themes and product management functionality",
          "Integrated WooCommerce for sales, inventory and payments",
          "Built dealer location mapping and responsive showcase pages",
        ],
      },
      approach: "[How you approached it.]",
      decisions: [],
      challenges: [],
      performance: { summary: "[What you optimised.]", metrics: [] },
      result: "[The outcome for the dealership.]",
      gallery: [],
    },
  },

  {
    slug: "jewellery-ecommerce",
    featured: false,
    name: "Jewellery E-Commerce Store",
    tagline:
      "An online jewellery shop with a custom cryptocurrency payment gateway alongside conventional checkout.",
    year: "2022 – 2024",
    kind: "Client project",
    role: "Frontend Developer",

    cover: { src: null, alt: "Jewellery e-commerce storefront", width: 1600, height: 1000 },

    stack: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "Payment Gateway",
      "Cryptocurrency Gateway",
    ],

    features: [
      "Multiple payment options including crypto",
      "SSL-based security measures",
      "Responsive storefront and checkout",
    ],

    links: { live: "", github: "" },

    caseStudy: {
      overview:
        "An e-commerce jewellery platform with secure online shopping and multiple payment options, including a custom cryptocurrency payment gateway. Built with a responsive UI, SSL-based security and a checkout flow designed to reduce abandonment.",
      problem: "[What did the client need?]",
      myRole: {
        summary:
          "Frontend build — the storefront, the responsive UI and the checkout experience, including the crypto payment path.",
        responsibilities: [
          "Implemented a responsive storefront UI",
          "Built checkout with multiple payment options including a crypto gateway",
          "Applied SSL-based security measures",
        ],
      },
      approach: "[How you approached it.]",
      decisions: [],
      challenges: [],
      performance: { summary: "[What you optimised.]", metrics: [] },
      result: "[The outcome.]",
      gallery: [],
    },
  },

  {
    slug: "winstar-appliances",
    featured: false,
    name: "Winstar Appliances",
    tagline:
      "A service-management site for electrical appliance repair, with appointment booking and online payment.",
    year: "2022 – 2024",
    kind: "Client project",
    role: "Web Developer",

    cover: { src: null, alt: "Winstar Appliances website", width: 1600, height: 1000 },

    stack: ["HTML5", "CSS3", "JavaScript", "MySQL"],

    features: [
      "Appointment booking",
      "Online payment",
      "Responsive service pages",
    ],

    links: { live: "https://winstarappliances.com", github: "" },

    caseStudy: {
      overview:
        "A dynamic website for electrical appliance service management, with appointment booking and online payment. Built responsively and around the customer's actual task — booking a repair — to improve operational efficiency and service accessibility across devices.",
      problem: "[What was the booking process before this?]",
      myRole: {
        summary:
          "Designed and developed the site — booking flow, payment integration and responsive layout.",
        responsibilities: [
          "Built the appointment booking flow",
          "Integrated online payment",
          "Implemented responsive, customer-focused UI",
        ],
      },
      approach: "[How you approached it.]",
      decisions: [],
      challenges: [],
      performance: { summary: "[What you optimised.]", metrics: [] },
      result: "[The outcome for the business.]",
      gallery: [],
    },
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

/** Smaller builds, shown as a compact list under the main showcase. */
export const archiveProjects = projects.filter((p) => !p.featured);

export const getProject = (slug) => projects.find((p) => p.slug === slug);
