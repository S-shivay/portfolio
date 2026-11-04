"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Scroll spy for the navigation.
 *
 * Uses one IntersectionObserver across all sections rather than a scroll
 * listener doing getBoundingClientRect() per frame — the observer work happens
 * off the main thread and produces no layout thrash.
 *
 * `rootMargin` biases the detection band toward the upper third of the
 * viewport so the indicator changes when a section *feels* current, rather
 * than the instant one pixel of it appears.
 *
 * Returns `[activeId, activate]`. Call `activate(id)` from a nav link's click:
 * it marks that section current at once and holds it until the resulting
 * scroll settles, so the indicator never trails a click by a section, and
 * never flickers through the sections a smooth scroll passes on the way.
 */
export function useActiveSection(ids, { rootMargin = "-30% 0px -60% 0px" } = {}) {
  const [activeId, setActiveId] = useState(ids[0] ?? null);
  /* The nav outlives the page. A route change replaces every section element,
     so the observer below has to be rebuilt or it keeps watching detached
     nodes and the indicator freezes for the rest of the visit. */
  const pathname = usePathname();

  // While a click-driven scroll is in flight the observer keeps tracking but
  // stops writing state. `release` is owned by the effect, which is where the
  // tracked state lives; the ref lets `activate` reach it.
  const locked = useRef(false);
  const releaseRef = useRef(null);
  const fallbackTimer = useRef(undefined);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (elements.length === 0) return;

    // Track intersection state per id across callbacks. Picking from the
    // callback entries alone is unreliable, because a scroll that leaves one
    // section and enters another fires with only partial info.
    const visible = new Map();

    // Of the sections touching the band, the *last* in page order wins — the
    // one whose top most recently crossed the band's lower edge. Preferring
    // the first would hand the indicator back to the previous section
    // whenever its bottom edge still grazes the band, which is exactly what
    // happens right after a click on a short viewport.
    const pick = () => {
      let current = null;
      for (const id of ids) if (visible.get(id)) current = id;
      if (current && !locked.current) setActiveId(current);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible.set(entry.target.id, entry.isIntersecting);
        }
        pick();
      },
      { rootMargin, threshold: 0 },
    );

    for (const element of elements) observer.observe(element);

    // Release the click lock once scrolling has been quiet for a beat. A
    // debounced scroll listener rather than `scrollend`, which is still
    // missing in some browsers; the callback does no layout work.
    let settleTimer;
    const release = () => {
      clearTimeout(settleTimer);
      clearTimeout(fallbackTimer.current);
      locked.current = false;
      pick();
    };
    releaseRef.current = release;

    const onScroll = () => {
      if (!locked.current) return;
      clearTimeout(settleTimer);
      settleTimer = setTimeout(release, 150);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      clearTimeout(settleTimer);
      releaseRef.current = null;
    };
  }, [ids, rootMargin, pathname]);

  const activate = useCallback((id) => {
    locked.current = true;
    setActiveId(id);

    // A click on the section already in view scrolls nothing, so no scroll
    // event would ever release the lock. Longer than any smooth scroll.
    clearTimeout(fallbackTimer.current);
    fallbackTimer.current = setTimeout(() => releaseRef.current?.(), 1200);
  }, []);

  useEffect(() => () => clearTimeout(fallbackTimer.current), []);

  return [activeId, activate];
}

/**
 * True when the page has scrolled past `threshold`. Drives the nav's
 * transparent → blurred transition.
 */
export function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}

/**
 * True on devices with a precise pointer (mouse / trackpad). Gates the custom
 * cursor and magnetic effects so touch users are never given hover-only
 * affordances.
 */
export function usePointerFine() {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(pointer: fine)");
    const update = () => setFine(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return fine;
}
