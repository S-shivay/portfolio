"use client";

import { useEffect, useRef } from "react";
import { usePointerFine } from "@/hooks/useActiveSection";

/**
 * Hero backdrop: the sun.
 *
 * A vermilion disc rising behind the headline, ringed by emerald orbit lines,
 * over faint column rules like the grid of a printed page. It answers the
 * pointer with a slow counter-drift (the rings more than the disc, so they
 * read as nearer), and as the hero scrolls away the whole assembly sets —
 * sinking and swelling like a sun going down (scroll-driven CSS, "HERO SUN"
 * in globals.css).
 *
 * The pointer position is written to two custom properties inside one rAF
 * loop; nothing re-renders while the mouse moves. On touch and under reduced
 * motion the loop never starts and the sun simply stands where it is.
 */
export function HeroBackdrop() {
  const ref = useRef(null);
  const pointerFine = usePointerFine();

  useEffect(() => {
    if (!pointerFine) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const node = ref.current;
    if (!node) return;

    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let frame = 0;

    const onMove = (event) => {
      // -1 at the left/top edge of the window, 1 at the right/bottom.
      targetX = (event.clientX / window.innerWidth) * 2 - 1;
      targetY = (event.clientY / window.innerHeight) * 2 - 1;
    };

    const tick = () => {
      x += (targetX - x) * 0.05;
      y += (targetY - y) * 0.05;
      node.style.setProperty("--px", x.toFixed(4));
      node.style.setProperty("--py", y.toFixed(4));
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [pointerFine]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ "--px": 0, "--py": 0 }}
    >
      {/* Column rules — the page grid, dissolving toward the edges. */}
      <div className="hero-rules absolute inset-0" />

      {/* The sun and its orbits. The outer wrapper carries the scroll-driven
          set; the layers inside carry the pointer drift. */}
      <div className="hero-sun-wrap">
        <div className="hero-orbit hero-orbit-b">
          <span className="hero-orbit-dot" />
        </div>
        <div className="hero-orbit hero-orbit-a" />
        <div className="hero-sun" />
      </div>

      {/* Bottom fade into the ticker below. */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />
    </div>
  );
}
