import {
  resetSmoothScroll,
  scrollToTarget,
  smoothScrollToY,
} from "@/components/ui/smooth-scroll";

/**
 * The one owner of the browser history. Browser-only; installed once by
 * `RouteMemory` from the root layout.
 *
 * What the back button has to do on this site, and why the browser and the
 * router cannot do it alone:
 *
 *  - Return to the exact scroll position. Native restoration runs when the
 *    traversal happens, not when React has committed the page it leads to, so
 *    it lands against whichever page happens to be in the DOM, and Lenis's
 *    momentum can then overwrite it. Here every entry has an id, its position is
 *    remembered against that id, and it is applied in a layout effect of the
 *    same commit as the page swap (see `commitRoute`): the first painted frame,
 *    and the view transition's snapshot of it, are already in the right place.
 *
 *  - Step back through in-page jumps. A plain `<a href="#x">` creates an entry
 *    with no router state, which Next's popstate handler ignores outright.
 *    Same-page anchor clicks are intercepted and pushed through the router's
 *    patched `pushState` instead, so every entry can be returned to.
 *
 *  - Close an overlay rather than leave the site. An open dialog looks like a
 *    place to the person looking at it, so it gets a history entry of its own:
 *    Back closes it, and closing it any other way removes that entry again.
 *
 * Cross-document traversals (a reload, returning from another site) are left to
 * the browser, which restores earlier than hydration ever could:
 * `scrollRestoration` is flipped to "auto" on `pagehide` and "manual" on the way
 * back in, and the remembered position is applied afterwards only as a fallback.
 */

const STORE_KEY = "portfolio-route-memory";
const MAX_ENTRIES = 150;
/* How long a Back that animates within one page may take before scroll saving
   resumes regardless. */
const SMOOTH_RESTORE_MS = 1400;
const SETTLE_MS = 1500;

let prepared = false;
let positions = {};
/* The stack as far as this tab has walked it: { id, index, path, overlay }. */
let trail = [];
let current = null;
let renderedPath = null;
/* A cross-route Back in flight, waiting for its commit. */
let pending = null;
/* While true, scroll events are the restoration's own, not the reader's. */
let restoring = false;
let cancelRestore = null;
let saveTimer = 0;

const overlays = [];
let releaseTimer = null;
let navigatingUntil = 0;

const newId = () => Math.random().toString(36).slice(2, 10);

/* ---- Persistence --------------------------------------------------------- */

function load() {
  try {
    const stored = JSON.parse(sessionStorage.getItem(STORE_KEY) ?? "null");
    if (stored) {
      positions = stored.positions ?? {};
      trail = stored.trail ?? [];
    }
  } catch {
    // Private mode or a corrupt value: start empty, in-memory still works.
  }
}

function save() {
  saveTimer = 0;
  try {
    sessionStorage.setItem(STORE_KEY, JSON.stringify({ positions, trail }));
  } catch {
    // Storage full or unavailable: positions survive for this document anyway.
  }
}

function scheduleSave() {
  if (!saveTimer) saveTimer = setTimeout(save, 200);
}

function remember(entry, overlay = false, path = location.pathname) {
  trail = trail.filter((item) => item.index < entry.index);
  trail.push({ id: entry.id, index: entry.index, path, overlay });

  if (trail.length > MAX_ENTRIES) {
    const dropped = trail.splice(0, trail.length - MAX_ENTRIES);
    for (const item of dropped) delete positions[item.id];
  }
  scheduleSave();
}

/* ---- Restoring ----------------------------------------------------------- */

const jumpTo = (y) => window.scrollTo({ top: y, behavior: "instant" });

function finishRestore() {
  restoring = false;
  cancelRestore = null;
  if (current) positions[current.id] = Math.round(window.scrollY);
  scheduleSave();
}

/**
 * Holds the page at `y` until it stays there: content arriving late (a font, a
 * lazily sized block) can make the page tall enough only after the first jump.
 * Lets go at once if the reader touches anything.
 */
function settleAt(y) {
  cancelRestore?.();
  restoring = true;

  const started = performance.now();
  let steady = 0;
  let frame = 0;

  const stop = () => {
    cancelAnimationFrame(frame);
    finishRestore();
  };

  const tick = () => {
    const elapsed = performance.now() - started;
    if (Math.abs(window.scrollY - y) > 1.5) {
      steady = 0;
      jumpTo(y);
    } else {
      steady += 1;
    }
    if (elapsed > SETTLE_MS || (steady > 8 && elapsed > 200)) {
      stop();
      return;
    }
    frame = requestAnimationFrame(tick);
  };

  cancelRestore = stop;
  frame = requestAnimationFrame(tick);
}

/** Back within one page: glide there, as the jump that created the entry did. */
function glideTo(y) {
  cancelRestore?.();

  if (Math.abs(window.scrollY - y) <= 2) {
    restoring = false;
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    jumpTo(y);
    settleAt(y);
    return;
  }

  restoring = true;
  const started = performance.now();
  let frame = 0;

  const stop = () => {
    cancelAnimationFrame(frame);
    finishRestore();
  };

  const tick = () => {
    const arrived = Math.abs(window.scrollY - y) <= 1.5;
    if (arrived || performance.now() - started > SMOOTH_RESTORE_MS) {
      stop();
      return;
    }
    frame = requestAnimationFrame(tick);
  };

  cancelRestore = stop;
  smoothScrollToY(y);
  frame = requestAnimationFrame(tick);
}

/**
 * A page coming back is not arriving: everything already passed or on screen
 * is simply there, with no reveal or entrance replaying on the way. Runs in the
 * commit, so nothing is ever painted in its hidden state. `data-restoring`
 * suppresses the reveal transitions for the two frames this takes.
 */
function settleRevealsInstantly() {
  const root = document.documentElement;
  root.dataset.restoring = "";

  for (const element of document.querySelectorAll("[data-enter]")) {
    element.style.animation = "none";
  }

  const fold = window.innerHeight;
  for (const element of document.querySelectorAll(
    "[data-reveal]:not([data-shown]), [data-reveal-step]:not([data-shown])",
  )) {
    if (element.getBoundingClientRect().top < fold) {
      element.dataset.shown = "true";
      element.dataset.instant = "";
    }
  }

  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      delete root.dataset.restoring;
    }),
  );
}

function resolveY({ y, hash }) {
  if (y !== undefined) return y;
  const target = hash && document.getElementById(decodeURIComponent(hash.slice(1)));
  if (!target) return 0;
  const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  return Math.max(0, target.getBoundingClientRect().top + window.scrollY - padding);
}

/**
 * Called from a layout effect whenever the rendered route changes, in the same
 * commit as the swap. This is the moment a cross-route Back lands.
 */
export function commitRoute(pathname) {
  if (pathname === renderedPath) return;
  renderedPath = pathname;

  if (!pending || location.pathname !== pathname) return;

  const y = resolveY(pending);
  pending = null;

  resetSmoothScroll();
  jumpTo(y);
  settleRevealsInstantly();
  settleAt(y);
}

/* ---- Overlays ------------------------------------------------------------ */

/**
 * Gives an open overlay its own history entry; `close` runs if Back is pressed.
 * If another overlay was vacated in this same commit (the palette opening the
 * resume viewer), its entry is reused rather than popped and pushed — the two
 * would race, and the pop would land after the push and close the new one.
 */
export function registerOverlay(close) {
  const id = newId();

  if (releaseTimer !== null) {
    clearTimeout(releaseTimer);
    releaseTimer = null;
    history.replaceState({ ...history.state, __overlay: id }, "", location.href);
  } else {
    history.pushState({ ...history.state, __overlay: id }, "", location.href);
  }

  overlays.push({ id, close });
  return id;
}

/** The overlay closed. Unless it closed because of Back, remove its entry. */
export function releaseOverlay(id) {
  const index = overlays.findIndex((overlay) => overlay.id === id);
  if (index === -1) return;
  overlays.splice(index, 1);

  if (history.state?.__overlay !== id) return;
  if (performance.now() < navigatingUntil) return;

  releaseTimer = setTimeout(() => {
    releaseTimer = null;
    if (history.state?.__overlay === id) history.back();
  }, 0);
}

/**
 * The overlay closing right now is doing so because a link inside it was
 * followed. Popping its entry would cancel that navigation (the router discards
 * a pending navigate when a restore arrives), so the entry stays underneath and
 * is stepped over when Back reaches it.
 */
export function markNavigating() {
  navigatingUntil = performance.now() + 400;
}

/* ---- In-page jumps ------------------------------------------------------- */

/** Jumps to a section on this page, as a history step. */
export function goToHash(hash, { focus = false } = {}) {
  const target = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (!target) return false;

  if (hash !== location.hash) history.pushState({}, "", hash);

  /* Two frames: a menu closing in this same tick releases its scroll lock, and
     Lenis is stopped until that has happened. */
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      scrollToTarget(target);
      if (focus) {
        /* preventDefault cost the browser's own fragment focus. Restored for
           keyboard activation, so the next Tab continues from the section. */
        target.setAttribute("tabindex", "-1");
        target.style.outline = "none";
        target.focus({ preventScroll: true });
      }
    }),
  );
  return true;
}

function findReturnDelta(path) {
  for (let i = trail.length - 1; i >= 0; i--) {
    const item = trail[i];
    if (item.index < current.index && item.path === path && !item.overlay) {
      return item.index - current.index;
    }
  }
  return 0;
}

function onClick(event) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
  if (!anchor) return;
  if ((anchor.target && anchor.target !== "_self") || anchor.hasAttribute("download")) return;

  const url = new URL(anchor.href, location.href);
  if (url.origin !== location.origin) return;

  if (overlays.length > 0) markNavigating();

  /* A link that means "go back to that list": if the list is behind us in this
     tab, really go back to it, card and all, instead of pushing a second copy
     that Back would then bounce out of. */
  const returnTo = anchor.dataset.returnTo;
  if (returnTo) {
    const delta = findReturnDelta(returnTo);
    if (delta !== 0) {
      event.preventDefault();
      history.go(delta);
      return;
    }
  }

  if (url.pathname === location.pathname && url.search === location.search && url.hash) {
    /* In the capture phase on window: the preventDefault here is what next/link
       checks before navigating, and the link's own onClick still runs. */
    if (goToHash(url.hash, { focus: event.detail === 0 })) event.preventDefault();
  }
}

/* ---- Traversal ----------------------------------------------------------- */

function onPopState(event) {
  const leaving = current;
  if (!restoring && leaving) positions[leaving.id] = Math.round(window.scrollY);

  const state = event.state;
  const entry = state?.__route;
  current = entry ?? { id: newId(), index: leaving ? leaving.index : 0 };

  const backwards = leaving ? current.index < leaving.index : true;

  /* Whatever overlay is above the entry we arrived at is no longer open. */
  while (overlays.length > 0 && overlays[overlays.length - 1].id !== state?.__overlay) {
    overlays.pop().close();
  }

  /* A browser's own swipe animation (iOS, Android gesture nav) has already
     shown the move, and a second one on top of it reads as a glitch. */
  document.documentElement.dataset.navDir = event.hasUAVisualTransition
    ? "none"
    : backwards
      ? "back"
      : "forward";

  resetSmoothScroll();

  const target = { y: positions[current.id], hash: location.hash };

  /* An entry left behind by an overlay that is already shut (one closed by
     following a link, or a forward step onto one closed earlier). It is not a
     place, so keep travelling in the same direction. It holds the position of
     the page beneath it (see pushState below), so if this step is what changes
     the route, the page still lands in place, and the next step has nowhere
     to go. */
  if (state?.__overlay && !overlays.some((overlay) => overlay.id === state.__overlay)) {
    if (location.pathname !== renderedPath) {
      cancelRestore?.();
      restoring = true;
      pending = target;
    }
    const hasLater = trail.some((item) => item.index > current.index);
    if (backwards || !hasLater) history.back();
    else history.forward();
    return;
  }

  if (location.pathname !== renderedPath) {
    cancelRestore?.();
    restoring = true;
    pending = target;
    return;
  }

  pending = null;
  glideTo(resolveY(target));
}

/* ---- Install ------------------------------------------------------------- */

/**
 * Patched once per document and never taken back out. Next's own patches sit on
 * top of these and capture them, so undoing this in an effect cleanup and
 * redoing it (Strict Mode does exactly that in development) wraps the wrapper:
 * every push then counts twice, and `history.go` overshoots off the site.
 */
function patchHistory() {
  const nativePush = history.pushState;
  const nativeReplace = history.replaceState;

  history.pushState = function pushState(state, title, url) {
    const entry = { id: newId(), index: (current?.index ?? 0) + 1 };
    const path = url ? new URL(url, location.href).pathname : location.pathname;

    /* An overlay locks the page, so no scroll event will ever record where its
       entry sits: it is wherever the page beneath it is. */
    if (state?.__overlay) positions[entry.id] = Math.round(window.scrollY);

    current = entry;
    remember(entry, Boolean(state?.__overlay), path);
    delete document.documentElement.dataset.navDir;
    resetSmoothScroll();

    return nativePush.call(history, { ...state, __route: entry }, title, url);
  };

  history.replaceState = function replaceState(state, title, url) {
    /* The router rewrites entries without knowing about our id; keep it. */
    const entry = state?.__route ?? current;
    return nativeReplace.call(history, { ...state, __route: entry }, title, url);
  };
}

/** Everything that happens once per document, however often the effect runs. */
function prepareDocument() {
  load();
  history.scrollRestoration = "manual";
  patchHistory();

  const adopted = history.state?.__route;
  const navigation = performance.getEntriesByType("navigation")[0]?.type;

  if (adopted) {
    current = adopted;
    if (!trail.some((item) => item.id === adopted.id)) remember(adopted);
  } else {
    /* A brand new document: whatever was remembered lies behind a page we
       cannot count, so its steps cannot be trusted for `history.go`. */
    current = { id: newId(), index: 0 };
    trail = [];
    remember(current);
    history.replaceState({ ...history.state, __route: current }, "", location.href);
  }

  /* Reloaded on an overlay's entry: the overlay is gone, the entry should be. */
  if (history.state?.__overlay) history.back();

  const saved = positions[current.id];
  if (adopted && saved !== undefined && (navigation === "reload" || navigation === "back_forward")) {
    settleAt(saved);
  }
}

export function installRouteHistory() {
  if (!prepared) {
    prepared = true;
    prepareDocument();
  }

  const onScroll = () => {
    if (restoring || !current) return;
    positions[current.id] = Math.round(window.scrollY);
    scheduleSave();
  };

  /* The reader takes over from any restoration still running. */
  const onInput = () => cancelRestore?.();

  const onPageHide = () => {
    history.scrollRestoration = "auto";
    if (saveTimer) clearTimeout(saveTimer);
    save();
  };

  const onPageShow = () => {
    history.scrollRestoration = "manual";
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("popstate", onPopState);
  window.addEventListener("click", onClick, { capture: true });
  window.addEventListener("pagehide", onPageHide);
  window.addEventListener("pageshow", onPageShow);
  for (const type of ["wheel", "touchstart", "keydown", "pointerdown"]) {
    window.addEventListener(type, onInput, { passive: true });
  }

  return () => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("popstate", onPopState);
    window.removeEventListener("click", onClick, { capture: true });
    window.removeEventListener("pagehide", onPageHide);
    window.removeEventListener("pageshow", onPageShow);
    for (const type of ["wheel", "touchstart", "keydown", "pointerdown"]) {
      window.removeEventListener(type, onInput);
    }
  };
}
