"use client";

import { useRef } from "react";
import { m, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

/**
 * Magnetic hover wrapper.
 *
 * The element drifts a few pixels toward the pointer, then springs back. Two
 * constraints keep this from becoming a gimmick:
 *
 *  1. `strength` is capped low (default 0.22 of the distance to centre) so the
 *     control never leaves its own hit area — the visual and the clickable
 *     region stay in agreement.
 *  2. It is inert under `prefers-reduced-motion` and on coarse pointers, where
 *     there is no hover to respond to.
 *
 * Position is driven by motion values, so pointer movement never triggers a
 * React re-render.
 */
export function Magnetic({
  children,
  strength = 0.22,
  radius = 90,
  className,
}) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 180, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 180, damping: 18, mass: 0.4 });

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const handlePointerMove = (event) => {
    // Ignore touch and pen: there is no hover state to preview.
    if (event.pointerType !== "mouse") return;

    const node = ref.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    const deltaX = event.clientX - (rect.left + rect.width / 2);
    const deltaY = event.clientY - (rect.top + rect.height / 2);

    const distance = Math.hypot(deltaX, deltaY);
    // Falls off with distance so the pull is strongest at the edge of the control.
    const falloff = Math.max(0, 1 - distance / (radius + rect.width / 2));

    x.set(deltaX * strength * falloff);
    y.set(deltaY * strength * falloff);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <m.div
      ref={ref}
      className={cn("inline-block", className)}
      style={{ x: springX, y: springY }}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      // Keyboard users never trigger the magnet, so make sure focus leaving
      // a previously-hovered control still settles it back to centre.
      onBlurCapture={reset}
    >
      {children}
    </m.div>
  );
}
