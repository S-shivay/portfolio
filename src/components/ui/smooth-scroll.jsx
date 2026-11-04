"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Smooth scroll — Vengeance UI `smooth-scroll`, adapted.
 *
 * The registry version starts Lenis unconditionally and drives it with its own
 * rAF loop. On this site that would fight four existing systems, so it is
 * wired to fit them:
 *
 *  - Opt-in by capability. Only a fine pointer without reduced motion gets
 *    Lenis. Touch keeps native momentum scrolling (Lenis would only re-create
 *    it, worse), and reduced motion means no inertia at all.
 *  - Same-page `#id` links are not handled by Lenis's `anchors` option: they
 *    have to become history entries on touch devices too, so lib/route-history
 *    takes them and calls `scrollToTarget`, with the same 96px clearance as the
 *    CSS `scroll-padding-top`.
 *  - Every dialog on the site locks the page with `body { overflow: hidden }`.
 *    Lenis scrolls the window programmatically, which ignores that, so the
 *    body's style is watched and Lenis stopped while a dialog is open.
 *  - Scrollable regions inside dialogs (the resume, a certificate, the
 *    command list) scroll natively via `allowNestedScroll`.
 *
 * Framer Motion's `useScroll` and the CSS scroll-driven animations both read
 * the real scroll position, which Lenis still writes, so they need no changes.
 */

const NAV_CLEARANCE = 96;

let instance = null;

/** Scrolls to an element or `#id`, smoothly when Lenis is running. */
export function scrollToTarget(target) {
  const element =
    typeof target === "string" ? document.querySelector(target) : target;
  if (!element) return;

  if (instance) {
    instance.scrollTo(element, { offset: -NAV_CLEARANCE, force: true });
  } else {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/** Glides to a scroll position: a Back within one page. */
export function smoothScrollToY(y) {
  if (instance) instance.scrollTo(y, { duration: 0.9, force: true });
  else window.scrollTo({ top: y, behavior: "smooth" });
}

/**
 * Drops any momentum and re-measures. Without it, inertia still running when
 * Back is pressed writes its own position over the restored one, frame by frame.
 */
export function resetSmoothScroll() {
  instance?.reset();
  instance?.resize();
}

/** Back to the top of the page, smoothly when Lenis is running. */
export function scrollToTop() {
  if (instance) instance.scrollTo(0);
  else window.scrollTo({ top: 0, behavior: "smooth" });
}

export function SmoothScroll() {
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      allowNestedScroll: true,
      stopInertiaOnNavigate: true,
    });
    instance = lenis;

    const syncLock = () => {
      if (document.body.style.overflow === "hidden") lenis.stop();
      else lenis.start();
    };
    const observer = new MutationObserver(syncLock);
    observer.observe(document.body, { attributes: true, attributeFilter: ["style"] });

    return () => {
      observer.disconnect();
      lenis.destroy();
      instance = null;
    };
  }, []);

  return null;
}

export default SmoothScroll;
