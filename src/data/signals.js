/**
 * ============================================================================
 * SIGNALS — testimonials and the resume panel
 * ============================================================================
 *
 * The GitHub and testimonial blocks degrade gracefully: if you have nothing
 * real to show, leave the arrays empty and the components render a clearly
 * labelled "not connected yet" panel instead of inventing stars or quotes.
 */

/* -------------------------------------------------------------------------- */
/* CERTIFICATIONS — moved                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Certifications, and the Dainik Jagran Certificate of Honor that used to sit
 * here as an award, now live in src/data/certificates.js and render in their
 * own section with the certificate files themselves.
 */

/* -------------------------------------------------------------------------- */
/* GITHUB — moved                                                             */
/* -------------------------------------------------------------------------- */

/**
 * GitHub is no longer a panel in this band. It has its own section
 * (src/components/sections/Github.jsx), and it is wired to the live API rather
 * than to a hand-maintained list: the handle and the copy live in
 * src/data/github.mjs, the fetching and derivation in src/lib/github*.
 */

/* -------------------------------------------------------------------------- */
/* TESTIMONIALS                                                               */
/* -------------------------------------------------------------------------- */

/**
 * ONLY real, attributable quotes. A LinkedIn recommendation you already have
 * counts — a manager at Sigma or Shokone, or a client from one of the
 * on-site projects.
 *
 * `avatar` is optional; without one the component renders initials in a styled
 * monogram rather than a stock photo.
 */
export const testimonials = [
  // {
  //   id: "t1",
  //   quote: "[The actual thing they said. Two or three sentences at most.]",
  //   name: "[THEIR NAME]",
  //   role: "[THEIR ROLE]",
  //   company: "[THEIR COMPANY]",
  //   avatar: null,
  //   source: "",
  // },
];

/* -------------------------------------------------------------------------- */
/* RESUME                                                                     */
/* -------------------------------------------------------------------------- */

export const resume = {
  heading: "Want the short version?",
  body: "The full CV — experience, projects, certifications and technical background — in two pages.",
  updated: "[MONTH YYYY]",
};
