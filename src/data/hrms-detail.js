/**
 * ============================================================================
 * SIGMAHRMS: THE LONG VERSION
 * ============================================================================
 *
 * Everything on the HRMS case study that goes beyond the shared fields in
 * `projects.js`. All of it comes from Sarang's write-up of the codebase; figures
 * were counted from the source on 4 November 2026. Customer data, API addresses
 * and source code stay out.
 *
 * Kept out of `projects.js` for the same reason as `job24-detail.js`: that file
 * reaches the browser on every page, and this only the case study needs.
 */

/* Shared by the manager and employee menus, as it is in the app. */
const BIODATA = [
  "Employee Address",
  "National Id Information",
  "Formal Education",
  "Family Details",
  "Nominee Details",
  "Bank Detail",
  "Emergency Contact",
  "Language Skills",
  "Previous Employment",
  "Awards",
  "Certification",
  "Community",
  "Employee Tour",
  "Internal Work Experience",
  "Leadership Expertise",
  "Previous Year Rating",
  "Professional Membership",
  "Special Assignment",
  "Salary",
];

export const hrmsDetail = {
  journey: {
    title: "One employee record, from REQUISITION_RAISED to EXITED",
    caption: "One example path through the 11 lifecycle event categories.",
    stages: [
      ["Hiring", "REQUISITION_RAISED"],
      ["Joining", "JOINED"],
      ["Letters", "APPOINTMENT_LETTER_ISSUED"],
      ["Salary", "SALARY_SET"],
      ["Payroll", "PAYSLIP_PUBLISHED"],
      ["Leave", "LONG_LEAVE_APPROVED"],
      ["Attendance", "SHOW_CAUSE_ISSUED"],
      ["Position", "TRANSFERRED"],
      ["Manual", "WARNING_WRITTEN"],
      ["Status", "NOTICE_PERIOD_STARTED"],
      ["Separation", "EXITED"],
    ],
  },

  record: [
    ["Product", 'Process Pulse, "Complete HR Solution". The codebase is SigmaHRMS.'],
    ["What it is", "A multi-company HR management system. One platform hosts many companies, and each company has one or more legal entities with their own masters, employees and payroll."],
    ["This codebase", "The browser client: a single Angular application with one lazy-loaded module per login type."],
    ["Connected systems", "A FastAPI REST backend and a companion mobile app, both in separate codebases. Employees submit tax declarations and proofs in the mobile app."],
    ["Built for", "Indian employment rules: TDS and old and new tax regimes, EPF Form 11, CIBIL checks, national ID records and state-wise holidays."],
    ["Users", "Platform owners, company admins, HR teams, reporting managers, employees, read-only observers and pre-joining candidates."],
  ],

  portals: {
    intro:
      "Each login type has its own URL space, guard, lazy module and sidebar. Managers and employees share one portal, and the sidebar changes with their role. Pick a role below to see its real menu, then switch company features off to watch items disappear.",
    flags: {
      payroll: "Payroll",
      onsite: "Onsite tracker",
      cibil: "CIBIL",
      review: "Review form",
      form11: "EPF Form 11",
      evaluation: "Evaluation",
    },
    /* An item is a name, or { name, flag, adminLevel, items }. */
    roles: [
      {
        id: "hr",
        name: "HR",
        description: "Runs daily operations for one legal entity: people, positions, attendance, payroll, tax and exits.",
        menu: [
          "Dashboard",
          { name: "Position Management", items: ["Position Structure", "Position Restructure", "Close/Open Positions"] },
          "Employee Profile",
          "Manager Profile",
          { name: "Employee Lifecycle", items: ["Lifecycle Events", "Lifecycle Event Types"] },
          { name: "Candidate", items: ["Profile", "Requisition"] },
          { name: "Cibil Questions", flag: "cibil" },
          "OnBoarding Policy",
          { name: "Attendance", items: ["Attendance Report", "P & A Report", "Employee Reports"] },
          { name: "Form 11", flag: "form11" },
          "Payroll Action",
          { name: "Tax Declarations", flag: "payroll" },
          { name: "Proof Verification", flag: "payroll" },
          { name: "Payroll TDS", flag: "payroll" },
          { name: "Salary Tax Heads", flag: "payroll" },
          "Payslip Configuration",
          { name: "Employee Promotion", items: ["Employee Transfer", "Transfer Detail"] },
          { name: "Review", flag: "review", items: ["Review Cycle", "Employee Review List", "Manager Review List"] },
          { name: "Onsite", flag: "onsite", items: ["Onsite Expense", "Onsite Report", "Onsite Day Wise"] },
          "Action",
          "Downloads",
          "Downloads Template",
        ],
      },
      {
        id: "admin",
        name: "Admin",
        description: "Configures each legal entity: all masters, positions, people, tax setup, bulk uploads and dashboard definitions.",
        menu: [
          "Dashboard",
          {
            name: "Master",
            items: [
              "Designation",
              "Grade",
              "Division",
              "Sub Division",
              "Business Unit",
              "Function",
              "Department",
              "Section",
              "Cost Center",
              "Benefits Type",
              "Benefits",
              "Position Engagement",
              "Job Band",
              "Job Role",
              "Hiring Reason",
              "Dues Declaration",
              "Employee Class",
              "Holiday State Wise",
              "Work Schedule",
              "National Id Info",
              "Time Profile",
              "Tax Applicability",
              "Approval Cycle",
              "Pay Group",
              "Pay Range",
              "Leave Policy",
              "Leave Type",
              "Salary Component",
              "Escalation",
              "Shift Detail",
              "Approved H C",
              "Letter Template",
              "Letter Head",
              "Qualification Type",
              { name: "Evaluation Cycle", flag: "evaluation" },
              { name: "Evaluation KRA's", flag: "evaluation" },
              "Generic HR",
              "Company Signature",
              { name: "Cibil Questions", flag: "cibil" },
              "OnBoarding Policy",
              "Announcement",
              "Event",
              "Submission Window",
              "Lifecycle Events",
              "Lifecycle Event Types",
              { name: "Salary Tax Heads", flag: "payroll" },
            ],
          },
          { name: "Position Management", items: ["Position Structure", "Position Restructure"] },
          "Employee Profile",
          "Manager Profile",
          "Candidate Profile",
          "Candidate Requisition",
          { name: "Tax Declarations", flag: "payroll" },
          { name: "Proof Verification", flag: "payroll" },
          { name: "Payroll TDS", flag: "payroll" },
          "Daily Employee Links",
          "Download Links",
          "Downloads Template",
          { name: "Upload Excel", adminLevel: true },
          { name: "Company Settings", adminLevel: true },
          { name: "Entity Settings", adminLevel: true },
          { name: "Review Cycle", flag: "review", adminLevel: true },
          { name: "Employee Review List", flag: "review" },
          { name: "Manager Review List", flag: "review" },
          { name: "Observer", adminLevel: true },
          { name: "Dashboard Master", items: ["Card Master", "Filter Master", "Chart Master"] },
        ],
      },
      {
        id: "superadmin",
        name: "SuperAdmin",
        description: "Runs the platform: companies, users, proposals, email settings and the tax rules every company uses.",
        menu: [
          "Dashboard",
          "Users",
          "Company",
          "Tax Master",
          "Tax Regime",
          "Tax Rules",
          "Proposals",
          "SMTP Settings",
          { name: "Master", items: ["Company type", "Industry"] },
        ],
      },
      {
        id: "manager",
        name: "Manager",
        description: "Uses the employee login with team tools added: approvals, attendance, reviews, resignations and requisitions.",
        menu: [
          "Dashboard",
          "My Journey",
          "Position Management",
          "Candidate Profile",
          {
            name: "My Team",
            items: [
              "Team Profile",
              "Leave Request",
              "Regularisation List",
              "Evaluation Center",
              "Attendance Report",
              "Tour Approval",
              { name: "Review Form", flag: "review" },
              { name: "Onsite Expense", flag: "onsite" },
              { name: "Onsite Report", flag: "onsite" },
              { name: "Onsite Day Wise", flag: "onsite" },
              "Resignation List",
              "Revoke List",
            ],
          },
          { name: "Requisition", items: ["Raised", "Approval"] },
          { name: "Biodata", items: BIODATA },
        ],
      },
      {
        id: "employee",
        name: "Employee",
        description: "Sees their own dashboard, lifecycle history and biodata. Most other employee tasks happen in the mobile app.",
        menu: ["Dashboard", "My Journey", { name: "Biodata", items: BIODATA }],
      },
      {
        id: "observer",
        name: "Observer",
        description: "Has read-only oversight across assigned legal entities, with dashboards and employee records.",
        menu: ["Dashboard", "Employee"],
      },
      {
        id: "candidate",
        name: "Candidate",
        description: "Completes pre-joining details and accepts the onboarding policy before becoming an employee.",
        menu: [
          "Dashboard",
          "Personal Information",
          "Salary",
          "Candidate Address",
          "Certification",
          "National Id Information",
          "Formal Education",
          "Emergency Contact",
          "Language Skills",
          "Family Details",
          "Leadership Expertise",
          "Previous Employment",
          "Bank Detail",
          "Onboarding Policy Concern",
        ],
      },
    ],
  },

  features: [
    {
      title: "Platform administration",
      icon: "Network",
      lead: "The SuperAdmin portal manages companies, users, proposals, SMTP settings, company types and industries. A guarded first-run page collects company settings once, then blocks itself after setup.",
    },
    {
      title: "Position management",
      icon: "Workflow",
      lead: "Position Structure, Position Restructure with downloads, bulk Close/Open Positions, and approved headcount. Reporting lines come from the position tree, so manager access follows it.",
    },
    {
      title: "Masters",
      icon: "Layers",
      wide: true,
      lead: "46 configuration screens feed every other module.",
      groups: [
        ["Structure", ["Designation", "Grade", "Division", "Sub Division", "Business Unit", "Function", "Department", "Section", "Cost Center", "Job Band", "Job Role", "Employee Class", "Position Engagement", "Approved Headcount", "Qualification Type"]],
        ["Pay", ["Pay Group", "Pay Range", "Salary Component", "Salary Tax Heads", "Tax Applicability", "Benefits Type", "Benefits"]],
        ["Time", ["Holiday State Wise", "Work Schedule", "Time Profile", "Shift Detail", "Leave Policy", "Leave Type"]],
        ["Process", ["Approval Cycle", "Escalation", "Hiring Reason", "Dues Declaration", "Generic HR", "Onboarding Policy", "CIBIL Questions", "Evaluation Cycle", "Evaluation KRAs", "Submission Window", "Lifecycle Events", "Lifecycle Event Types"]],
        ["Documents and news", ["Letter Template", "Letter Head", "Company Signature", "Announcement", "Event", "National ID Info"]],
      ],
    },
    {
      title: "Hiring and candidates",
      icon: "Users",
      lead: "Managers raise requisitions and approvers act on them. HR then works the candidate profile: personal data, education, documents, necessary approvals, CIBIL questions, salary structure, offer letter with PDF preview, and onboarding policy consent. Candidates complete 13 record sections in their own pre-joining portal.",
    },
    {
      title: "Employee records",
      icon: "FileText",
      lead: "A profile wrapper holds 28 record sections, including address, national ID, education, family, nominee, bank details, emergency contacts, languages, previous employment, awards, certifications, internal experience, ratings, memberships, leave balance, salary and documents. Managers and employees reach the same sections through their own routes.",
    },
    {
      title: "Attendance and leave",
      icon: "Clock",
      lead: "Attendance Report, P&A Report, date-wise views, absconding reports and Excel attendance upload. Managers approve leave requests and regularisations for their team.",
    },
    {
      title: "Onsite tracker",
      icon: "MapPin",
      lead: "For field staff, behind a company feature flag: expense reports, check-ins by day and date range, and a viewer for check-in photos and expense receipts.",
    },
    {
      title: "Payroll",
      icon: "Database",
      lead: "Payroll Action covers manual payroll attendance, payroll runs, versions and final payroll. Runs show TDS warnings before finalizing, and HR configures the payslip layout.",
    },
    {
      title: "Income tax (IPSF)",
      icon: "ShieldCheck",
      lead: "Tax rules by financial year, submission windows, employee declarations, proof verification and a monthly TDS ledger. The tax year section shows the full flow.",
    },
    {
      title: "Lifecycle timeline",
      icon: "GitBranch",
      lead: "One chronological history per person, with HR-defined event types, audited corrections and salary redaction. See the lifecycle section.",
    },
    {
      title: "Transfers",
      icon: "Route",
      lead: "Employee Transfer and Transfer Detail, with downloadable transfer records.",
    },
    {
      title: "Separation",
      icon: "CornerDownLeft",
      lead: "Resignation and revoke lists for managers. HR can block or unblock resignation, finalize resignations and exit employees. Removing an exit takes a reason, and the employee sees it on their timeline.",
    },
    {
      title: "Performance",
      icon: "Target",
      lead: "Review cycles, employee and manager review lists with Excel export, a manager review form, evaluation cycles, KRAs, an evaluation center and evaluation question links.",
    },
    {
      title: "Dashboards",
      icon: "Gauge",
      lead: "Admins define the cards, filters and charts through Card, Filter and Chart masters. A shared shell then renders KPI cards, a filter rail and 2D or draggable 3D charts for each portal.",
    },
    {
      title: "Letters and communication",
      icon: "Mail",
      lead: "Rich-text letter templates, letter heads, company signatures, announcements and company events.",
    },
    {
      title: "Bulk data",
      icon: "Download",
      lead: "Excel uploads for employees, appointments, attendance and admin payroll actions, with download templates, report download links and daily employee links.",
    },
    {
      title: "Compliance",
      icon: "BadgeCheck",
      lead: "An EPF Form 11 screen with downloads behind a feature flag, CIBIL verification questions, national ID masters and tax applicability rules.",
    },
  ],

  lifecycle: {
    intro:
      "An employee's history would otherwise sit across many screens. The timeline merges it into one record per person, written automatically by requisitions, offers, letters, transfers, payslips, leave approvals, resignations and nightly jobs. The server sends rows newest first, and the client groups them by month without re-sorting.",
    categoriesTitle: "11 categories and their system events",
    categories: [
      ["Hiring", ["REQUISITION_RAISED", "REQUISITION_APPROVED", "REQUISITION_REJECTED", "CANDIDATE_CREATED", "BACKGROUND_CHECK_PASSED", "BACKGROUND_CHECK_FAILED", "OFFER_GENERATED", "OFFER_SENT", "OFFER_ACCEPTED", "CANDIDATE_REJECTED", "JOINING_CONFIRMED", "CONVERTED_TO_EMPLOYEE"]],
      ["Joining", ["JOINED", "PROFILES_LINKED"]],
      ["Letters", ["APPOINTMENT_LETTER_ISSUED", "LETTER_ISSUED", "REVISED_OFFER_ISSUED", "REVISED_APPOINTMENT_ISSUED", "LETTER_ACKNOWLEDGED"]],
      ["Position", ["TRANSFERRED", "POSITION_RESTRUCTURED", "REPORTING_MANAGER_CHANGED", "POSITION_CLOSED"]],
      ["Status", ["EMPLOYMENT_TYPE_CHANGED", "NOTICE_PERIOD_STARTED", "NOTICE_PERIOD_ENDED", "RESIGNATION_BLOCKED", "RESIGNATION_UNBLOCKED", "DEACTIVATED", "REACTIVATED"]],
      ["Separation", ["RESIGNATION_SUBMITTED", "RESIGNATION_CANCELLED", "RESIGNATION_REJECTED", "RESIGNATION_ACCEPTED", "WITHDRAWAL_REQUESTED", "WITHDRAWAL_REJECTED", "WITHDRAWAL_APPROVED", "TERMINATION_RECORDED", "LWD_FINALIZED", "EXIT_RECORDED", "EXIT_REVERSED", "EXIT_UPDATED", "EXITED"]],
      ["Salary", ["SALARY_SET", "SALARY_REVISED"]],
      ["Payroll", ["PAYSLIP_PUBLISHED"]],
      ["Leave", ["LONG_LEAVE_APPROVED"]],
      ["Attendance", ["SHOW_CAUSE_ISSUED"]],
      ["Manual", ["EVENT_REVERSED"], "plus any code HR defines, such as WARNING_WRITTEN"],
    ],
    notes: [
      {
        title: "HR builds its own event types",
        icon: "Component",
        body: 'A form builder defines up to 30 fields per type across 8 field types: text, long text, number, date, dropdown, multi-select, checkbox and file. Each type sets its document requirement, its visibility to the employee, whether it sends an email, and how the employee responds: nothing, an "I acknowledge" click, or OTP acceptance of a full letter. Recorded events keep a snapshot of the form, so later type edits never rewrite history.',
      },
      {
        title: "Corrections leave a trail",
        icon: "FileCode",
        body: "Admins can edit, soft-delete, restore, reverse or hide an event, and each action requires a written reason. A separate history view shows old values, new values, the reason and who acted. Reversal adds a new event and strikes through the original, and the confirm step says plainly that the real-world change is not undone.",
      },
      {
        title: "Rehires stay one person",
        icon: "Users",
        body: "HR links an exited profile to a new one. The timeline then shows divider rows between employments, and chips that jump the date filter to any single job.",
      },
      {
        title: "Salary stays locked",
        icon: "Lock",
        body: "Pay amounts need a separate salary password for everyone except the employee viewing their own pay. Without it the list still loads, amounts are left out, and a banner asks for the password.",
      },
    ],
    access: {
      title: "Who sees what",
      head: ["Rule", "Admin", "HR", "Manager", "Employee"],
      rows: [
        ["Scope", "Any entity", "Own entity", "Current reportees at any depth", "Own record, all employments"],
        ["Salary and payroll events", "With password", "With password", "Never", "Own pay, always"],
        ["Events hidden from employee", "Yes", "Yes", "Yes", "No"],
        ["Deleted events", "On request", "No", "No", "No"],
        ["Record events, manage types", "Yes", "Yes", "No", "No"],
        ["Corrections", "Yes", "No", "No", "No"],
        ["Change history", "Yes", "Yes", "No", "No"],
        ["Link rehires", "Link and unlink", "Link", "No", "No"],
        ["Acknowledge", "No", "No", "No", "Own pending events"],
      ],
    },
  },

  taxYear: {
    intro:
      "IPSF is the income tax module. It carries one financial year from national rules down to each employee's monthly TDS, and it crosses four kinds of user and two client apps.",
    lanes: ["SuperAdmin", "Admin", "Employee (mobile app)", "HR"],
    /* `lane` indexes `lanes`. Order is the order things happen in. */
    steps: [
      { lane: 0, title: "Publish the tax year", note: "regimes, slabs, rules, proofs" },
      { lane: 1, title: "Open submission windows", note: "declaration and proof dates" },
      { lane: 1, title: "Confirm salary tax heads", note: "10 heads, suggested first" },
      { lane: 2, title: "Declare investments", note: "inside the declaration window", external: true },
      { lane: 3, title: "Review declarations", note: "regime, lock, reopen, estimate" },
      { lane: 2, title: "Submit proofs", note: "inside the proof window", external: true },
      { lane: 3, title: "Verify proofs", note: "approve, partly or reject" },
      { lane: 3, title: "Set monthly TDS", note: "ledger edits or Excel dry run" },
      { lane: 3, title: "Run and finalize payroll", note: "TDS warnings, then locks", key: true },
    ],
    caption:
      "The tax year runs from platform rules down to payroll. Dashed steps happen in the mobile app, outside this codebase. Admins also get the Declarations, Proof Verification and Payroll TDS screens for their entity.",
    ledger: [
      ["Tax master", "SuperAdmin creates, validates, publishes and removes a financial year. Each year holds old and new regimes with settings, slab ladders and surcharge bands, plus sections, items and accepted proof documents."],
      ["Submission windows", "Admins create, view, lock, unlock and delete declaration and proof windows, and each has a history. HR sees the live window state on its dashboard."],
      ["Declarations", "HR and Admin can see a summary and a filtered list, view a declaration, set the regime, lock, unlock or reopen, read its history and open a tax estimate. Actions that change a declaration require a reason."],
      ["Proof verification", "A queue by proof status leads to a review screen with a logged file viewer. HR records approve, partly approve or reject per item, then sends all decisions in one call. HR can also act for an employee: enter paid amounts, upload or delete a proof, and send it for review."],
      ["Payroll TDS", "A monthly ledger per employee supports enter, change and remove. Bulk changes use a downloadable template and a dry run before anything is saved. Finalizing payroll locks the regime, and an admin can un-finalize."],
    ],
  },

  architecture: {
    request: {
      title: "How a request travels",
      chain: [
        { name: "Route", note: "canMatch guard" },
        { name: "Lazy module", note: "one per portal" },
        { name: "Component", note: "signals, reactive forms" },
        { name: "HttpApiService", note: "cookies on every call" },
        { name: "Interceptors", note: "13 in one chain", hot: true },
        { name: "REST API", note: "2 base URLs" },
      ],
      outcomesLabel: "When the API answers",
      outcomes: [
        { tag: "440 expired", steps: ["Refresh the session once. Parallel calls wait, then all replay through the chain."] },
        { tag: "401 stale CSRF", steps: ["Mint a new token and replay once through the chain, marked to prevent a loop."] },
        { tag: "401 or 406", steps: ["Show the server's message and open the right login page."] },
      ],
      caption:
        "Most session failures never reach the user. Without a valid session, canMatch stops the portal's code from downloading at all.",
    },
    tree: {
      title: "Source layout",
      code: `src/app/
├─ core/
│  ├─ guards/         one set per login type
│  ├─ intercepters/   auth, CSRF, loader
│  ├─ services/       HTTP, sessions, errors
│  └─ directives, pipes, utills
├─ features/login/    six login screens
├─ layout/            page layouts, sidebar
├─ shared/            tables, inputs, dashboards
└─ pages/
   ├─ superadmin/
   ├─ admin/
   ├─ legal-entity/
   ├─ hr-module/
   ├─ employee-module/
   ├─ employee-management/
   ├─ candidate/
   ├─ candidate-module/
   ├─ observer-module/
   └─ common-pages/`,
    },
    conventions: {
      title: "Conventions",
      items: [
        ["Modules", "NgModule components throughout, with lazy feature modules."],
        ["State", "Signals and computed values in components, RxJS for HTTP. No global store library."],
        ["Route guards", "7 canMatch, 9 canActivate, 4 canActivateChild, plus 3 resolvers."],
        ["Auth", "Cookie sessions, an X-CSRF header and an X-Token-Type header naming the login type."],
        ["Shared UI", "List layout and data table used by 126 templates, 6 form inputs, 6 page layouts."],
        ["Type safety", "TypeScript strict mode and strict Angular templates."],
      ],
    },
    interceptors: {
      title: "The 13 interceptors, in order",
      names: ["Loading", "SuperAdmin CSRF", "SuperAdmin session", "Admin CSRF", "Admin login type", "Employee", "Candidate", "Unauthenticated recovery", "HR", "Attendance", "Dashboard", "Observer", "Payroll"],
      note: "Most check the request URL, so each acts only on its own part of the API.",
    },
  },

  numbers: {
    intro: "Counted from the source code on 4 November 2026.",
    charts: [
      {
        title: "Components by area",
        unit: "components",
        total: 339,
        rows: [
          ["Legal entity (Admin)", 92],
          ["Employee management", 60],
          ["HR", 50],
          ["Candidate records", 34],
          ["Employee and manager", 27],
          ["SuperAdmin", 19],
          ["Admin home", 10],
          ["Observer", 4],
          ["Candidate login area", 4],
          ["Common pages", 2],
        ],
      },
      {
        title: "Services by area",
        unit: "services",
        total: 168,
        rows: [
          ["Legal entity (Admin)", 59],
          ["Employee management", 25],
          ["HR", 14],
          ["Candidate records", 20],
          ["Employee and manager", 12],
          ["SuperAdmin", 11],
          ["Admin home", 4],
          ["Observer", 0],
          ["Candidate login area", 1],
          ["Common pages", 0],
        ],
      },
    ],
    blocksTitle: "Codebase size",
    blocks: [
      ["Lines of code", 136083],
      ["TypeScript lines", 103449],
      ["HTML template lines", 18807],
      ["SCSS lines", 13827],
      ["TypeScript files", 752],
      ["Components", 339],
      ["Services", 168],
      ["NgModules", 26],
      ["Active route definitions", 554],
      ["Lazy-loaded route entries", 11],
      ["Components using signals", 297],
      ["Components using reactive forms", 196],
    ],
  },

  stack: [
    {
      label: "Framework and language",
      items: [
        ["Angular", "19.0.5", "Application framework, with NgModules and signals."],
        ["TypeScript", "5.6.3", "All application code, in strict mode."],
        ["RxJS", "7.8.1", "HTTP streams, token refresh and request replay."],
        ["Zone.js", "0.15.0", "Angular change detection."],
        ["Angular Router", "19.0.5", "Routes, lazy loading, guards and resolvers."],
        ["Angular Reactive Forms", "19.0.5", "Forms and custom validators."],
        ["Angular HttpClient", "19.0.5", "API calls and functional interceptors."],
      ],
    },
    {
      label: "Interface",
      items: [
        ["Angular Material", "19.0.4", "Tables, paginators, sorting, dialogs, datepickers, selects, tooltips, Azure Blue theme."],
        ["Angular CDK", "19.0.4", "Foundation for Material components."],
        ["Angular Animations", "19.0.5", "Material and interface transitions."],
        ["SCSS (Sass)", "1.80.7", "Component and global styles."],
        ["ngx-toastr", "19.0.0", "Success and error notifications."],
        ["Roboto, Material Icons", "Google Fonts", "Typeface and icon set."],
      ],
    },
    {
      label: "Charts, files and documents",
      items: [
        ["Apache ECharts", "5.5.1", "Line, pie and bar dashboards."],
        ["ECharts GL", "2.0.9", "Draggable 3D bar charts."],
        ["SheetJS (xlsx)", "0.18.5", "Excel exports for attendance and review reports."],
        ["FileSaver.js", "2.0.5", "File downloads, imported in 18 source files."],
        ["Angular Editor (@kolkov)", "3.0.0-beta.2", "Rich text for letters, announcements and events."],
      ],
    },
    {
      label: "Build and quality",
      items: [
        ["Angular CLI", "19.0.6", "Scaffolding, serving and builds."],
        ["esbuild", "0.24.0", "Production bundling through the Angular application builder."],
        ["Vite", "5.4.11", "Development server through the Angular CLI."],
        ["Karma, Jasmine", "6.4.4, 5.4.0", "Unit test runner and framework."],
        ["Git, EditorConfig", "n/a", "Version control and shared formatting settings."],
      ],
    },
    {
      label: "Browser platform",
      items: [
        ["Blob and Object URLs", "n/a", "Authenticated viewing of protected files."],
        ["sessionStorage", "n/a", "Login type, profile data and company settings per tab."],
        ["ResizeObserver", "n/a", "Responsive chart sizing."],
      ],
    },
    {
      label: "Connected systems (separate codebases)",
      items: [
        ["FastAPI", "n/a", "REST backend, with JSON and multipart requests."],
        ["Mobile app", "n/a", "Employee self-service, including tax declarations and proofs."],
      ],
    },
  ],
};
