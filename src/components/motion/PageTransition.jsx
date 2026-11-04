import { ViewTransition } from "react";

/**
 * Route transition for a whole page.
 *
 * Next.js runs every navigation as a React transition, so a `<ViewTransition>`
 * around the page animates on its own; this only says *which* animation. The
 * links decide the direction: a link into a case study carries
 * `transitionTypes={["nav-forward"]}`, a link back out carries `nav-back`, and
 * the keyframes in globals.css read those as "deeper" (the new page wipes up
 * over the old one) and "back out" (it wipes down).
 *
 * `default: "nav-pop"`: the browser's back and forward buttons carry no type,
 * because the router starts those transitions itself. They get a short, soft
 * crossfade, its direction read from `data-nav-dir` on <html>, which
 * lib/route-history sets when the traversal begins (and sets to "none" where
 * the browser is already animating a swipe). Deliberately not the wipes the
 * links use: those clip a full-page snapshot from one edge, which only reads
 * well when the page lands at its top, and a Back lands anywhere.
 *
 * One wrapping element, deliberately. Without it React names every top-level
 * section separately and the browser snapshots twelve layers instead of one.
 * And an opaque one: the snapshot of a transparent wrapper is see-through, so
 * mid-wipe the outgoing page's text showed through the incoming page's and
 * the two headlines tangled. With the page colour behind it, the wipe covers
 * what it replaces.
 *
 * The shared-element morph of a project cover into its case-study header is
 * separate: see `ProjectCover`.
 */
const DIRECTIONS = {
  "nav-forward": "nav-forward",
  "nav-back": "nav-back",
  default: "nav-pop",
};

export function PageTransition({ children }) {
  return (
    <ViewTransition enter={DIRECTIONS} exit={DIRECTIONS} default="none">
      <div className="bg-bg">{children}</div>
    </ViewTransition>
  );
}
