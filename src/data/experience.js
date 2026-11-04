/**
 * ============================================================================
 * PROFESSIONAL EXPERIENCE
 * ============================================================================
 *
 * Populated from Sarang's CV. Every number below appears on the CV — nothing
 * here is estimated or rounded up.
 *
 * The `impact` metric on each card is the single strongest measured result for
 * that role; the rest are in `highlights`. If you ever add a role with no
 * measured number, set `impact.value: null` and the UI will render the
 * qualitative label on its own rather than inventing a figure.
 */

export const experience = [
  {
    id: "sigma-staffing",
    company: "Sigma Staffing Solutions Pvt. Ltd.",
    title: "Frontend Developer",
    start: "Nov 2024",
    end: null, // null renders as "Present"
    location: "Kanpur, U.P.",
    type: "Full-time",
    summary:
      "Building and maintaining scalable Angular single-page applications — recruitment and HR platforms serving over 10,000 active users.",
    impact: {
      value: "35%",
      label: "improvement in application performance",
    },
    highlights: [
      "Developed and maintained scalable single-page applications with Angular, TypeScript, NgRx and RxJS — improving application performance by 35% and cutting page load time by 2.5 seconds.",
      "Built reusable UI components and responsive dashboards with cross-functional teams, increasing development efficiency by 30% across multiple projects.",
      "Integrated RESTful APIs and optimised frontend-backend communication, reducing API response handling errors by 40%.",
      "Designed and delivered dynamic web applications supporting over 10,000 active users.",
    ],
    stack: [
      "Angular",
      "TypeScript",
      "NgRx",
      "RxJS",
      "HTML5",
      "CSS3",
      "Bootstrap",
      "REST APIs",
    ],
  },
  {
    id: "shokone",
    company: "Shokone Enterprises Pvt. Ltd.",
    title: "Application Developer",
    start: "Mar 2022",
    end: "Nov 2024",
    location: "Kanpur, U.P.",
    type: "Full-time",
    summary:
      "Application development across web platforms, with a focus on responsive UI, cross-browser reliability and reducing duplicated frontend work.",
    impact: {
      value: "45%",
      label: "reduction in bug resolution time",
    },
    highlights: [
      "Improved UI responsiveness and browser compatibility across desktop and mobile, increasing customer satisfaction scores by 20%.",
      "Worked directly with backend and QA teams to troubleshoot production issues, reducing bug resolution time by 45%.",
      "Developed reusable modules and form validation features that cut duplicate development effort by 30% and improved code maintainability.",
      "Supported deployment, testing and performance tuning activities, contributing to 99.5% application uptime.",
    ],
    stack: [
      "Angular",
      "JavaScript",
      "TypeScript",
      "HTML5",
      "CSS3",
      "REST APIs",
      "MySQL",
    ],
  },
];
