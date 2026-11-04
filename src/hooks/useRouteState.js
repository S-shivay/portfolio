"use client";

import { useState } from "react";

const remembered = new Map();

/**
 * `useState` that outlives the page it belongs to.
 *
 * A route change unmounts the page, so without this, coming Back to the home
 * page would collapse the role that was open and reset the filters: not only
 * different from how it was left, but a different height, so the remembered
 * scroll position would no longer point at the same thing.
 *
 * Held in memory, not storage: a first load always renders exactly what the
 * server sent, so hydration can never mismatch.
 */
export function useRouteState(key, initial) {
  const [value, setValue] = useState(() =>
    remembered.has(key) ? remembered.get(key) : initial,
  );

  const set = (next) => {
    remembered.set(key, next);
    setValue(next);
  };

  return [value, set];
}
