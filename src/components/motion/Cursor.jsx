"use client";

import { useEffect, useRef, useState } from "react";
import { usePointerFine } from "@/hooks/useActiveSection";

/**
 * Custom cursor: a ring, a dot, and a short colour trail behind them.
 *
 * Opt in from any element with a data attribute:
 *   data-cursor="link"                     → the ring expands
 *   data-cursor="view" data-cursor-label=… → the ring becomes a labelled disc
 *   data-cursor="text"                     → the ring becomes a caret bar
 *
 * Three rules keep this from becoming an accessibility problem, and they are
 * the reason it is safe to ship at all:
 *
 *  1. It never hides the real cursor. The native pointer stays visible and this
 *     rides alongside it. A custom cursor that replaces the system one is a
 *     genuine usability regression for anyone with low vision or a tremor, and
 *     it is the single most common way these designs fail their users.
 *  2. It only mounts on `(pointer: fine)` — never on touch.
 *  3. It is disabled entirely under `prefers-reduced-motion`.
 *
 * Every position is written straight to an element's transform inside one rAF
 * loop, so pointer movement causes no React renders at all. Only the *variant*
 * is state, and that changes at most once per hover.
 *
 * The trail is two small dots, emerald then vermilion, each lerping at a
 * slower rate toward the pointer. That difference in follow speed is the whole
 * effect — they string out behind fast movement and collapse into the ring when
 * the pointer stops, with no per-dot history buffer to maintain.
 */

/* Slower lerp = further behind. */
const TRAIL = [
  { ease: 0.14, color: "var(--brand-jade)", size: 5 },
  { ease: 0.09, color: "var(--brand-vermilion)", size: 4 },
];

export function Cursor() {
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const trailRefs = useRef([]);
  const pointerFine = usePointerFine();

  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState("default");
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (!pointerFine) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEnabled(!motionQuery.matches);

    sync();
    motionQuery.addEventListener("change", sync);
    return () => motionQuery.removeEventListener("change", sync);
  }, [pointerFine]);

  useEffect(() => {
    if (!enabled) return;

    let targetX = -100;
    let targetY = -100;

    // The ring lags slightly; the dot tracks almost exactly.
    const ring = { x: -100, y: -100 };
    const dot = { x: -100, y: -100 };
    const trail = TRAIL.map(() => ({ x: -100, y: -100 }));

    let seen = false;
    let frame = 0;

    const onMove = (event) => {
      targetX = event.clientX;
      targetY = event.clientY;

      if (!seen) {
        seen = true;
        setVisible(true);
      }

      // Walk up from the event target to the nearest opt-in ancestor.
      const hit =
        event.target instanceof Element
          ? event.target.closest("[data-cursor]")
          : null;

      if (!hit) {
        setVariant("default");
        setLabel("");
        return;
      }

      setVariant(hit.getAttribute("data-cursor") ?? "default");
      setLabel(hit.getAttribute("data-cursor-label") ?? "");
    };

    const onLeave = () => setVisible(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    const place = (node, point) => {
      if (node) {
        node.style.transform = `translate3d(${point.x.toFixed(2)}px, ${point.y.toFixed(2)}px, 0) translate(-50%, -50%)`;
      }
    };

    const tick = () => {
      ring.x += (targetX - ring.x) * 0.19;
      ring.y += (targetY - ring.y) * 0.19;
      dot.x += (targetX - dot.x) * 0.42;
      dot.y += (targetY - dot.y) * 0.42;

      for (let i = 0; i < trail.length; i++) {
        trail[i].x += (targetX - trail[i].x) * TRAIL[i].ease;
        trail[i].y += (targetY - trail[i].y) * TRAIL[i].ease;
        place(trailRefs.current[i], trail[i]);
      }

      place(ringRef.current, ring);
      place(dotRef.current, dot);

      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, [enabled]);

  if (!enabled) return null;

  const isView = variant === "view" && label;
  const isLink = variant === "link";
  const isText = variant === "text";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[95] hidden lg:block"
    >
      {/* Trail. Sits under the ring so the ring always reads as the head. */}
      {TRAIL.map((item, index) => (
        <span
          key={index}
          ref={(node) => {
            trailRefs.current[index] = node;
          }}
          className="absolute left-0 top-0 rounded-full transition-opacity duration-200"
          style={{
            width: item.size,
            height: item.size,
            backgroundColor: item.color,
            // The trail is a distraction while reading a label, so it fades out
            // whenever the cursor is doing something more explicit.
            opacity: visible && !isView ? 0.7 - index * 0.2 : 0,
            willChange: "transform",
          }}
        />
      ))}

      {/* Ring — the element that changes shape. */}
      <div
        ref={ringRef}
        className={[
          "absolute left-0 top-0 grid place-items-center rounded-full",
          "transition-[width,height,background-color,border-color,opacity,border-radius] duration-200 ease-[var(--ease-out)]",
          visible ? "opacity-100" : "opacity-0",
          isView
            ? "size-[7rem] border-0 bg-vermilion shadow-[0_18px_40px_-18px_var(--brand-vermilion)]"
            : isText
              ? "h-8 w-[3px] rounded-none bg-vermilion"
              : isLink
                ? "size-14 border border-vermilion bg-[color-mix(in_oklab,var(--brand-vermilion)_14%,transparent)]"
                : "size-9 border border-[color-mix(in_oklab,var(--text)_45%,transparent)] bg-transparent",
        ].join(" ")}
        style={{
          willChange: "transform",
          scale: pressed ? 0.82 : 1,
          transitionDuration: "380ms",
          transitionProperty:
            "width,height,background-color,border-color,opacity,border-radius,scale",
        }}
      >
        {isView && (
          <span className="font-display w-[5.25rem] text-center text-[0.875rem] italic leading-[1.1] text-[#170a05]">
            {label}
          </span>
        )}
      </div>

      {/* Dot — the precise point, hidden when the ring has taken over. */}
      <div
        ref={dotRef}
        className={[
          "absolute left-0 top-0 size-2 rounded-full bg-vermilion transition-opacity duration-200",
          visible && !isView && !isText ? "opacity-100" : "opacity-0",
        ].join(" ")}
        style={{ willChange: "transform" }}
      />
    </div>
  );
}
