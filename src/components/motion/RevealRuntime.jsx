"use client";

import { useEffect } from "react";

/**
 * The one piece of JavaScript behind every scroll reveal on the site, and the
 * one that stops off-screen decoration from animating.
 *
 * Mounted once from the root layout. It watches `[data-reveal]` elements and
 * `[data-reveal-step]` stagger groups with a single IntersectionObserver, sets
 * one attribute when each arrives, and unobserves it. Everything visible —
 * the fade, the travel, the easing, the reduced-motion behaviour — is in the
 * stylesheet.
 *
 * A second observer tracks `[data-ambient]` subtrees and marks them
 * `data-offscreen`, which pauses every animation inside them. See the rule in
 * globals.css for what that is worth.
 *
 * The alternative was an animation component per element — 112 on the home page.
 * Replacing them cut cold-cache long tasks from 7 (429ms) to 3 (~180ms) on a
 * throttled mobile profile, and the animation looks identical either way.
 *
 * `threshold: 0` rather than a fraction of the element is also a correctness
 * fix. "25% of this element visible" never becomes true for an element taller
 * than the viewport, so on a small screen a tall block could stay hidden
 * permanently. Entering the viewport at all is a condition every element can
 * meet at every size.
 *
 * ── Why this component arms the hidden state, instead of the head script ──
 *
 * The stylesheet hides `[data-reveal]` only under `html[data-reveals="armed"]`,
 * and this effect is what sets that attribute. So the order on every page load
 * is: server-rendered content is visible → this runs → content below the fold
 * is hidden → the observer reveals it on scroll.
 *
 * Arming it any earlier — from the inline head script, or from the stylesheet
 * unconditionally — makes the page's entire content invisible for the whole gap
 * between first paint and hydration, and permanently invisible if the bundle
 * never arrives. That gap is milliseconds on a desktop over localhost. It is
 * seconds on a phone over wi-fi, and it is what "the content is not showing"
 * actually describes.
 */
export function RevealRuntime() {
  useEffect(() => {
    const root = document.documentElement;

    /* Reduced motion: nothing is hidden in the first place, so there is
       nothing to observe and no reason to keep a MutationObserver running for
       the life of the page. Note this returns *without* arming, so the
       stylesheet's hidden rule never applies at all. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const SELECTOR =
      "[data-reveal]:not([data-shown]), [data-reveal-step]:not([data-shown])";

    /* Everything already on screen is marked shown before arming, so no pixel
       a reader is currently looking at gets hidden and re-animated. The cost is
       one synchronous layout read over a few dozen already-laid-out elements,
       once per page load.
       The trade is that `[data-reveal]` blocks inside the first viewport do not
       animate in on a cold load. In this layout that is close to nothing: the
       hero's entrance is `[data-enter]`, a plain keyframe that needs no
       observer, and the first reveal targets begin below the fold. */
    const fold = window.innerHeight;
    for (const element of document.querySelectorAll(
      "[data-reveal], [data-reveal-step]",
    )) {
      if (element.getBoundingClientRect().top < fold) {
        element.dataset.shown = "true";
      }
    }

    root.dataset.reveals = "armed";

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          const element = entry.target;
          observer.unobserve(element);

          const step = Number(element.dataset.revealStep);
          if (!step) {
            element.dataset.shown = "true";
            continue;
          }

          const base = Number(element.dataset.revealDelay) || 0;
          const children = element.querySelectorAll(":scope > [data-reveal]");
          children.forEach((child, index) => {
            child.style.setProperty(
              "--reveal-delay",
              `${base + index * step}ms`,
            );
            child.dataset.shown = "true";
          });
        }
      },
      {
        /* Fire a little before the element reaches the bottom edge, so the
           movement is finishing as it arrives rather than starting there. */
        rootMargin: "0px 0px -8% 0px",
        threshold: 0,
      },
    );

    /* Second observer: pauses continuous decorative animation in whatever is
       off screen. Separate from the reveal observer because it is the opposite
       kind of watch — the reveal observer fires once per element and lets go,
       this one has to keep tracking every subtree for the life of the page, in
       both directions. Sharing one observer would mean giving up the unobserve
       that keeps the first one cheap. */
    const ambient = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            delete entry.target.dataset.offscreen;
          } else {
            entry.target.dataset.offscreen = "";
          }
        }
      },
      /* A margin of one screen in each direction: a wash resumes drifting just
         before it can be seen, never in view of the reader. */
      { rootMargin: "100% 0px", threshold: 0 },
    );

    const scan = (node) => {
      if (node.nodeType !== 1) return;
      if (node.matches(SELECTOR)) observer.observe(node);
      for (const el of node.querySelectorAll(SELECTOR)) observer.observe(el);
      if (node.matches("[data-ambient]")) ambient.observe(node);
      for (const el of node.querySelectorAll("[data-ambient]")) ambient.observe(el);
    };

    scan(document.body);

    /* Anything React renders later — an expanded archive, a case study, a
       dialog, the whole of the page after a route change — is picked up without
       those components having to know this system exists. */
    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) scan(node);
      }
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
      ambient.disconnect();
      /* Disarm. Leaving the attribute set with the observers gone would hide
         every unrevealed element with nothing left alive to reveal it — the
         exact failure this arming order exists to prevent. */
      delete root.dataset.reveals;
    };
  }, []);

  return null;
}
