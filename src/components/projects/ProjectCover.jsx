import { ViewTransition } from "react";

/**
 * Marks a project's cover as the same object on both pages.
 *
 * Rendered around the cover in the project list and around the cover at the
 * top of the case study, with the same name. When a navigation goes from one
 * to the other the browser animates the cover between its two boxes instead
 * of letting it vanish and reappear: the reader watches the thing they
 * clicked grow into the page about it.
 *
 * `share="morph"` with `default="none"`: the pair morphs, and the cover does
 * nothing at all during any other transition on the page.
 */
export function ProjectCover({ slug, children }) {
  return (
    <ViewTransition name={`project-cover-${slug}`} share="morph" default="none">
      {children}
    </ViewTransition>
  );
}
