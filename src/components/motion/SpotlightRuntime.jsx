"use client";

import { useEffect } from "react";

/**
 * Drives the cursor spotlight on every `[data-spotlight]` card.
 *
 * One pointermove listener for the whole document rather than one per card:
 * it finds the card under the pointer and writes two custom properties on it,
 * at most once per frame. The glow itself is CSS (globals.css), so cards stay
 * server components and nothing re-renders.
 *
 * Fine pointers only; under reduced motion the glow still follows (it is a
 * highlight, not movement), but touch never runs this at all.
 *
 * `[data-pointer]` gets the same coordinates without the glow — the case
 * study's next-project reveal grows from them. Both also get `--spot-px` /
 * `--spot-py`, the position as a 0–1 fraction of the box, which is what the
 * `[data-tilt]` cards lean by.
 */
export function SpotlightRuntime() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let frame = 0;
    let event = null;

    const apply = () => {
      frame = 0;
      const card = event?.target instanceof Element
        ? event.target.closest("[data-spotlight], [data-pointer]")
        : null;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      card.style.setProperty("--spot-x", `${x}px`);
      card.style.setProperty("--spot-y", `${y}px`);
      card.style.setProperty("--spot-px", (x / rect.width).toFixed(3));
      card.style.setProperty("--spot-py", (y / rect.height).toFixed(3));
    };

    const onMove = (next) => {
      event = next;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
