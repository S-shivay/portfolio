"use client";

import { useCallback, useLayoutEffect, useSyncExternalStore } from "react";

export const THEME_STORAGE_KEY = "portfolio-theme";
export const DEFAULT_THEME = "light";

/**
 * The script injected into <head> by the root layout.
 *
 * It runs synchronously during HTML parsing — before the browser paints and
 * long before React hydrates — so a returning visitor who chose dark mode
 * never sees a flash of the light default.
 *
 * It also sets `data-motion="on"`, which gates the on-mount entrance
 * animations (`[data-enter]`). Those are plain keyframes that complete on their
 * own, so it is safe to start them before first paint — and necessary, since
 * starting them after hydration would replay the hero's entrance seconds late.
 *
 * It deliberately does NOT arm the scroll reveals. Those depend on an
 * IntersectionObserver to become visible again, so hiding them from here would
 * blank the page's content for the entire gap before hydration. That attribute
 * is set by RevealRuntime, which explains the ordering in full.
 *
 * Finally it decides whether the intro curtain plays: once per browser
 * session, never under reduced motion. The curtain is pure CSS on a fixed
 * timer (~1.9s) and lifts whether or not React ever hydrates, so it never
 * gates content on JavaScript; with scripting off it never appears at all.
 * The attribute is removed once the curtain is long gone, so `--intro-delay`
 * cannot hold back entrances on pages reached later by client navigation.
 */
export const INTRO_STORAGE_KEY = "portfolio-intro-seen";

export const themeInitScript = `(function(){var d=document.documentElement;try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(t==="light"||t==="dark"){d.setAttribute("data-theme",t)}}catch(e){}d.setAttribute("data-motion","on");try{if(!sessionStorage.getItem(${JSON.stringify(
  INTRO_STORAGE_KEY,
)})&&!matchMedia("(prefers-reduced-motion: reduce)").matches){sessionStorage.setItem(${JSON.stringify(
  INTRO_STORAGE_KEY,
)},"1");d.setAttribute("data-intro","on");setTimeout(function(){d.removeAttribute("data-intro")},4200)}}catch(e){}})()`;

/* -------------------------------------------------------------------------- */
/* External store                                                             */
/* -------------------------------------------------------------------------- */

/**
 * The `data-theme` attribute on <html> is the single source of truth, not
 * React state. The inline script sets it before React exists, so React has to
 * *read* it rather than own it.
 *
 * `useSyncExternalStore` is the right tool for exactly this: subscribing to a
 * value that lives outside React, with a separate server snapshot so SSR and
 * hydration agree. It also avoids the setState-in-effect pattern that causes
 * a cascading render on every mount.
 */

const listeners = new Set();

function emit() {
  for (const listener of listeners) listener();
}

function readStoredTheme() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    // localStorage throws in private browsing / blocked-cookie contexts.
    return null;
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

/** Keeps open tabs in sync when the preference changes in another one. */
function handleStorage(event) {
  if (event.key !== THEME_STORAGE_KEY) return;
  applyTheme(
    event.newValue === "light" || event.newValue === "dark"
      ? event.newValue
      : DEFAULT_THEME,
  );
  emit();
}

function subscribe(onStoreChange) {
  if (listeners.size === 0) {
    window.addEventListener("storage", handleStorage);
  }
  listeners.add(onStoreChange);

  return () => {
    listeners.delete(onStoreChange);
    if (listeners.size === 0) {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

/* Returns a string, so React's referential comparison is a value comparison —
   no risk of an infinite re-subscribe loop. */
function getSnapshot() {
  return document.documentElement.getAttribute("data-theme") || DEFAULT_THEME;
}

function getServerSnapshot() {
  return DEFAULT_THEME;
}

/* -------------------------------------------------------------------------- */

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  /**
   * Re-applies the stored preference after React's Strict Mode dev remount,
   * which resets attributes on <html> that React did not itself render — and
   * would otherwise discard what the inline script set. A DOM write only, no
   * state update, and a no-op in production.
   */
  useLayoutEffect(() => {
    const stored = readStoredTheme();
    if (stored && stored !== document.documentElement.getAttribute("data-theme")) {
      applyTheme(stored);
      emit();
    }
  }, []);

  const setTheme = useCallback((next) => {
    applyTheme(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Preference will not persist; the UI still works for this session.
    }
    emit();
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(getSnapshot() === "dark" ? "light" : "dark");
  }, [setTheme]);

  return { theme, setTheme, toggleTheme };
}
