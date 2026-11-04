/**
 * ============================================================================
 * CERTIFICATES — the one file to edit when you earn a new one.
 * ============================================================================
 *
 * Adding a certificate takes two steps:
 *
 *   1. Drop the file into `public/certificates/`. PDF, PNG, JPG/JPEG, WebP,
 *      AVIF, GIF and SVG all work. Portrait, landscape, scans and phone photos
 *      are all fine: the section reads each file's real dimensions and EXIF
 *      rotation when the page builds, so nothing is ever cropped or stretched.
 *
 *   2. Add an object to the array below. Only `id`, `title` and `issuer` are
 *      required. Every other field is optional. Leave out what you don't
 *      know rather than writing "N/A": a missing field is simply not shown.
 *
 * Everything else updates on its own: the counts in the header, the category
 * filters, search, the viewer's previous/next order and the timeline.
 *
 * Every entry here comes from the CV or from the certificate itself. Nothing
 * was added to fill space. Where a file exists, the title, date and credential
 * ID were copied off the document, so they read exactly as printed — which is
 * why some titles differ from the CV's shorthand ("Introduction to MERN Stack",
 * not "MERN Stack Developer").
 *
 * Each PDF has a WebP of its first page beside it. The card shows the WebP
 * (fast, no pdf.js); the viewer opens the PDF (sharp at any zoom). Regenerate
 * the WebP whenever a PDF is replaced.
 *
 * ---------------------------------------------------------------------------
 * FIELDS
 * ---------------------------------------------------------------------------
 *
 * @typedef {Object} Certificate
 * @property {string}   id              Unique, URL-safe. Never shown.
 * @property {string}   title           The certificate or course name.
 * @property {string}   issuer          The issuing organisation.
 * @property {string}   [issuerLogo]    Path under /public, e.g. "/certificates/logos/pro5.svg".
 *                                      Without one, the card shows the issuer's initials.
 * @property {string}   [issueDate]     ISO: "2024", "2024-04" or "2024-04-18".
 * @property {string}   [expirationDate] Same format.
 * @property {string}   [credentialId]  Exactly as printed on the certificate.
 * @property {string}   [credentialUrl] Public page for the credential (Credly, Coursera…).
 * @property {string}   [verificationUrl] Issuer's verification page. Preferred over
 *                                      `credentialUrl` for the Verify link when both exist.
 * @property {boolean}  [verified]      Set to true ONLY after you have opened the
 *                                      verification link yourself and it confirms the
 *                                      credential. A URL existing is not verification, so
 *                                      without this the link reads "View credential"
 *                                      rather than claiming "Verified".
 * @property {string}   [description]   One to three sentences on what it covered.
 * @property {string[]} [skills]        Shown as tags and searchable.
 * @property {string}   [category]      Drives the filter chips. Use a small, consistent set.
 * @property {string}   [level]         e.g. "Beginner", "Professional".
 * @property {string}   [duration]      e.g. "40 hours", "6 weeks".
 * @property {string}   [distinction]   A grade, score or rank printed on the certificate
 *                                      ("Top 5%", "Grade A", "92%").
 * @property {string}   [certificateImage] Path under /public. The preview, and the viewer's
 *                                      document when there is no PDF.
 * @property {string}   [certificatePdf] Path under /public. Opened in the viewer when present.
 *                                      Add an image as well if you can: the card then shows
 *                                      the image instead of rendering the PDF, which is faster.
 * @property {string}   [alt]           Overrides the generated alt text.
 * @property {boolean}  [featured]      Promotes the card to a larger, accented tile at the
 *                                      front, in the order written here. Two is the number
 *                                      the layout is built for: side by side on a wide
 *                                      screen, with the rest in a row of four beneath.
 */

/** @type {Certificate[]} */
export const certificates = [
  {
    id: "angular-pro5",
    title: "Front End Engineer in Angular",
    issuer: "Pro5",
    issueDate: "2024-04",
    distinction: "Top 5%",
    credentialId: "11989092711",
    category: "Frontend",
    description:
      "Awarded for passing Pro5's Front End Engineer in Angular assessment, placing in the top 5% of professionals tested.",
    skills: ["Angular", "Frontend engineering"],
    featured: true,
    certificateImage: "/certificates/angular-pro5.webp",
    certificatePdf: "/certificates/angular-pro5.pdf",
  },
  {
    id: "genai-foundations",
    title: "Generative AI Foundations",
    issuer: "upGrad",
    issueDate: "2026-09-21",
    credentialId: "gbnWLJB4X1coKp6g",
    category: "AI",
    description:
      "upGrad's certificate program run in collaboration with Microsoft. Completed all six modules, from prompt engineering to using generative AI for research, analysis, problem-solving and automation.",
    skills: [
      "Generative AI",
      "Prompt engineering",
      "AI for analysis",
      "AI for automation",
      "Microsoft",
    ],
    featured: true,
    certificateImage: "/certificates/genai-foundations-upgrad.webp",
    certificatePdf: "/certificates/genai-foundations-upgrad.pdf",
  },
  {
    id: "mern",
    title: "Introduction to MERN Stack",
    issuer: "SkillUp by Simplilearn",
    issueDate: "2024-09-13",
    credentialId: "7370852",
    category: "Full-stack",
    description:
      "Full-stack web development across MongoDB, Express.js, React.js and Node.js.",
    skills: ["MongoDB", "Express.js", "React.js", "Node.js"],
    certificateImage: "/certificates/mern-stack-simplilearn.webp",
    certificatePdf: "/certificates/mern-stack-simplilearn.pdf",
  },
  {
    id: "html-css",
    title: "HTML5 and CSS3",
    issuer: "Pirple.com",
    issueDate: "2021-12-28",
    credentialId: "oenf8sjrs2",
    category: "Frontend",
    description:
      "Document structure and semantic elements, then CSS from selectors and specificity through the box model to responsive web design.",
    skills: ["HTML5", "CSS3", "Specificity", "Responsive design"],
    certificateImage: "/certificates/html5-css3-pirple.webp",
    certificatePdf: "/certificates/html5-css3-pirple.pdf",
  },
  {
    id: "javascript",
    title: "JavaScript for Beginners",
    issuer: "SkillUp by Simplilearn",
    issueDate: "2022-01-08",
    credentialId: "3158598",
    category: "Frontend",
    description:
      "JavaScript fundamentals, DOM manipulation and interactive web development.",
    skills: ["JavaScript", "DOM manipulation"],
    certificateImage: "/certificates/javascript-simplilearn.webp",
    certificatePdf: "/certificates/javascript-simplilearn.pdf",
  },
  {
    id: "java",
    title: "Java Certification Course",
    issuer: "SkillUp by Simplilearn",
    issueDate: "2021-12-23",
    credentialId: "3121878",
    category: "Programming",
    description:
      "Object-oriented programming, exception handling and application logic in Java.",
    skills: ["Java", "OOP", "Exception handling"],
    certificateImage: "/certificates/java-simplilearn.webp",
    certificatePdf: "/certificates/java-simplilearn.pdf",
  },
  {
    id: "java-vocational",
    title: "Vocational Training in Java",
    issuer: "RMAR Technologies",
    category: "Programming",
    description: "Hands-on core Java programming and application development.",
    skills: ["Core Java"],
  },
  {
    id: "cyber-security",
    title: "Cyber Security Workshop",
    issuer: "AKTU & U.P. Police",
    category: "Security",
    description: "Cybersecurity awareness and digital security best practices.",
    skills: ["Cybersecurity awareness"],
  },
  {
    id: "dainik-jagran-honor",
    title: "Certificate of Honor",
    issuer: "Dainik Jagran",
    category: "Recognition",
    description: "Awarded for academic excellence in high school.",
  },
];
