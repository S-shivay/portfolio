/**
 * The hue each project wears, by its position in the list.
 *
 * Shared by the stacked card on the home page and the case study it opens, so
 * a project keeps its colour across the page transition: a vermilion card
 * grows into a vermilion case study. Each name is a `[data-tone]` in
 * globals.css, where the accent and its contrast-solved ink are defined per
 * theme. The palette has two hues, so the projects alternate.
 */
export const PROJECT_TONES = ["emerald", "vermilion"];

export const projectTone = (index) =>
  PROJECT_TONES[((index % PROJECT_TONES.length) + PROJECT_TONES.length) % PROJECT_TONES.length];
