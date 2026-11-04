"use client";

import { useEffect, useRef, useState } from "react";

/**
 * How a UI is built, shown as the thing itself: one small app screen drawn
 * five times, once per layer of its construction, stacked in 3D.
 *
 *   00 Structure    the semantic HTML — landmarks, headings, list, button
 *   01 Layout       the grid and the spacing scale the blocks sit on
 *   02 Tokens       colour, type and radius as variables, painted on
 *   03 Components   the composed controls and content
 *   04 States       hover, focus, loading, tooltip — the drawn-on-purpose bits
 *
 * At rest the five planes coincide and read as one finished screen. Hover
 * anywhere on the frame and the stack tilts and separates, each plane
 * becoming a sheet with its number; the legend beside it names and
 * describes every layer. Hover (or focus, or tap) a legend entry and that
 * layer is singled out, the others fading back. Drag turns the stack.
 *
 * The five versions of the screen are the SAME component rendered in five
 * modes (`Screen`), so every block lands in exactly the same place on every
 * plane and the alignment can never drift — which is also, not by accident,
 * the point being made: one structure, progressively dressed.
 *
 * DOM and CSS 3D, no WebGL: text stays crisp at every angle, it is all in
 * the server-rendered HTML, and the legend is real buttons for keyboard and
 * assistive tech. Motion is one rAF loop writing four custom properties on
 * the root (`--ex`, `--rx`, `--ry`, `--rz`); React state changes only when a
 * legend entry is activated. Reduced motion applies targets without easing;
 * the CSS floor removes the rest.
 */

const LAYERS = [
  {
    id: "structure",
    title: "Structure",
    body: "Semantic HTML first — landmarks, a heading, a list, a real button — so the screen reads in order before any CSS arrives.",
  },
  {
    id: "layout",
    title: "Layout",
    body: "A column grid and a 4px spacing scale. Every gap is a step on the scale; nothing is nudged by eye.",
  },
  {
    id: "tokens",
    title: "Tokens",
    body: "Colour, type and radius as variables. Change one value and every surface follows — it is how this site's themes work.",
  },
  {
    id: "components",
    title: "Components",
    body: "Buttons, tabs, cards and list rows composed from the tokens. Built once, reused everywhere.",
  },
  {
    id: "states",
    title: "States",
    body: "Hover, focus, loading and tooltips drawn on purpose, with motion that steps aside under reduced-motion.",
  },
];

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const lerp = (a, b, t) => a + (b - a) * t;
/* Frame-rate independent easing factor for a rate per second. */
const damp = (rate, dt) => 1 - Math.exp(-rate * dt);

export function UILayers() {
  const rootRef = useRef(null);
  const kickRef = useRef(null);
  // Which layer the legend is pointing at, if any.
  const [active, setActive] = useState(null);
  // A tapped legend entry keeps the stack open (touch has no hover).
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const area = root.closest("section") ?? root;

    let rect = root.getBoundingClientRect();
    const measure = () => {
      rect = root.getBoundingClientRect();
    };
    const resize = new ResizeObserver(measure);
    resize.observe(root);
    window.addEventListener("scroll", measure, { passive: true });

    const target = { hover: 0, tx: 0, ty: 0 };
    /* Touch starts fully exploded and stays there — see `exTarget` below — so
       the first frame writes the open pose rather than easing into it. */
    const s = {
      ex: fine ? 0 : 1,
      tx: 0,
      ty: 0,
      yaw: 0,
      pitch: 0,
      vyaw: 0,
      vpitch: 0,
    };
    let dragging = false;
    let pending = false;
    let dragged = false;
    let visible = false;
    // Opens once on arrival so the depth is seen before anyone hovers —
    // and so a touch visitor learns there is something to open.
    let intro = !reduce;
    let introTimer = 0;
    let raf = 0;
    let last = 0;

    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;

      /* A coarse pointer holds the stack open permanently.
         The closed pose exists so that hovering the frame is a reveal — but a
         phone has no hover, so the only states it could reach were "flat" and
         "flat, plus whichever layer you happened to tap". The piece is a 3D
         exploded diagram and a touch visitor was getting a flat rectangle: five
         planes coinciding, with the layer surfaces at `opacity: var(--ex)` and
         therefore invisible, and the "Drag to rotate" hint hidden under
         `(hover: none)`. Nothing on screen suggested there was anything to open.
         Held open, it costs no more than the closed state: `exTarget` matches
         the settled `s.ex`, so `busy` is false and the rAF loop never starts.
         This is not the sway that used to run here — that was a 60fps loop for
         as long as the section was visible, and it is not coming back. */
      const exTarget =
        !fine || root.dataset.pinned === "true" || target.hover || intro
          ? 1
          : 0;

      if (reduce) {
        s.ex = exTarget;
      } else {
        s.ex = lerp(s.ex, exTarget, damp(4.5, dt));
        s.tx = lerp(s.tx, target.tx, damp(8, dt));
        s.ty = lerp(s.ty, target.ty, damp(8, dt));
        if (!dragging) {
          // Coast on the release velocity. Open, the turn is kept (drifting
          // slowly home) so the angle can be looked at; closed, it rights
          // itself quickly.
          const home = exTarget ? 0.25 : 2.2;
          s.yaw += s.vyaw * dt;
          s.pitch += s.vpitch * dt;
          s.vyaw *= Math.exp(-3 * dt);
          s.vpitch *= Math.exp(-3 * dt);
          s.yaw = lerp(s.yaw, 0, damp(home, dt));
          s.pitch = lerp(s.pitch, 0, damp(home, dt));
        }
      }

      // The open pose is the classic exploded-diagram view: tipped back
      // and swung a little, so the separation reads as height.
      const rx = s.ty * 4 + s.ex * 42 + s.pitch;
      const rz = s.ex * -9;
      const ry = s.tx * 6 + s.yaw;

      root.style.setProperty("--ex", s.ex.toFixed(4));
      root.style.setProperty("--rx", `${rx.toFixed(3)}deg`);
      root.style.setProperty("--rz", `${rz.toFixed(3)}deg`);
      root.style.setProperty("--ry", `${ry.toFixed(3)}deg`);

      /* The loop runs only while something is actually moving, and stops the
         moment the stack has settled.
         It used to be held open forever on touch devices — `!fine` was part of
         this condition, to drive a permanent sway — which meant a phone ran a
         60fps rAF writing four custom properties onto a 3D subtree for as long
         as the hero was on screen, competing with the scroll for the main
         thread and never letting the radio or the CPU idle. The intro
         animation already shows a touch visitor that the stack opens, so the
         sway was buying a depth cue that had already been delivered. */
      const busy =
        dragging ||
        Math.abs(exTarget - s.ex) > 0.002 ||
        Math.abs(target.tx - s.tx) > 0.002 ||
        Math.abs(target.ty - s.ty) > 0.002 ||
        Math.abs(s.yaw) > 0.05 ||
        Math.abs(s.pitch) > 0.05 ||
        Math.abs(s.vyaw) > 0.5;
      raf = busy && visible ? requestAnimationFrame(tick) : 0;
    };

    const kick = () => {
      if (raf || !visible) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    kickRef.current = kick;

    // Tilt follows the pointer anywhere over the hero, not only over the
    // frame — reacting inside the box alone reads as a hover state.
    const onAreaMove = (event) => {
      if (!fine) return;
      target.tx = clamp((event.clientX - (rect.left + rect.width / 2)) / rect.width, -1, 1);
      target.ty = clamp((event.clientY - (rect.top + rect.height / 2)) / rect.height, -1, 1);
      kick();
    };
    const onAreaLeave = () => {
      target.tx = 0;
      target.ty = 0;
      kick();
    };

    const onEnter = () => {
      if (!fine) return;
      target.hover = 1;
      intro = false;
      kick();
    };
    const onLeave = () => {
      if (dragging) return;
      target.hover = 0;
      kick();
    };

    // Drag. Capture is taken only once the pointer has actually moved, so
    // a plain tap on a legend entry still reaches the entry.
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;
    let lastT = 0;
    let pointerId = null;

    const onDown = (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      if (event.target.closest("[data-no-drag]")) return;
      pending = true;
      dragged = false;
      pointerId = event.pointerId;
      startX = lastX = event.clientX;
      startY = lastY = event.clientY;
      lastT = performance.now();
    };
    const onMove = (event) => {
      if ((!pending && !dragging) || event.pointerId !== pointerId) return;
      if (!dragging) {
        if (Math.hypot(event.clientX - startX, event.clientY - startY) < 6) return;
        dragging = true;
        dragged = true;
        pending = false;
        intro = false;
        s.vyaw = 0;
        s.vpitch = 0;
        root.dataset.dragging = "true";
        root.setPointerCapture?.(pointerId);
      }
      const now = performance.now();
      const dt = Math.max(1, now - lastT) / 1000;
      const dyaw = (event.clientX - lastX) * 0.35;
      const dpitch = (event.clientY - lastY) * -0.2;
      s.yaw = clamp(s.yaw + dyaw, -60, 60);
      s.pitch = clamp(s.pitch + dpitch, -30, 24);
      s.vyaw = clamp(dyaw / dt, -400, 400);
      s.vpitch = clamp(dpitch / dt, -220, 220);
      lastX = event.clientX;
      lastY = event.clientY;
      lastT = now;
      kick();
    };
    const onUp = (event) => {
      pending = false;
      if (!dragging || event.pointerId !== pointerId) return;
      dragging = false;
      root.dataset.dragging = "false";
      root.releasePointerCapture?.(pointerId);
      if (fine && !root.matches(":hover")) target.hover = 0;
      kick();
    };
    // A drag that ended over a legend entry must not activate it.
    const onClickCapture = (event) => {
      if (!dragged) return;
      dragged = false;
      event.preventDefault();
      event.stopPropagation();
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        return;
      }
      if (intro && !introTimer) {
        introTimer = window.setTimeout(() => {
          intro = false;
          kick();
        }, 2800);
      }
      kick();
    });
    observer.observe(root);

    area.addEventListener("pointermove", onAreaMove, { passive: true });
    area.addEventListener("pointerleave", onAreaLeave);
    root.addEventListener("pointerenter", onEnter);
    root.addEventListener("pointerleave", onLeave);
    root.addEventListener("pointerdown", onDown);
    root.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerup", onUp);
    root.addEventListener("pointercancel", onUp);
    root.addEventListener("click", onClickCapture, true);

    return () => {
      area.removeEventListener("pointermove", onAreaMove);
      area.removeEventListener("pointerleave", onAreaLeave);
      root.removeEventListener("pointerenter", onEnter);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("pointerdown", onDown);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerup", onUp);
      root.removeEventListener("pointercancel", onUp);
      root.removeEventListener("click", onClickCapture, true);
      window.removeEventListener("scroll", measure);
      resize.disconnect();
      observer.disconnect();
      window.clearTimeout(introTimer);
      if (raf) cancelAnimationFrame(raf);
      kickRef.current = null;
    };
  }, []);

  // The pin changes a data attribute the loop reads; wake it.
  useEffect(() => {
    kickRef.current?.();
  }, [pinned]);

  const activeLayer = active === null ? null : LAYERS[active];

  return (
    <div
      ref={rootRef}
      role="group"
      aria-label="How a user interface is built: one app screen separated into its five layers — structure, layout, tokens, components and states — each described in the legend."
      data-pinned={pinned}
      className="ui-stack"
    >
      <div aria-hidden="true" className="dot-grid mask-fade-edges absolute inset-0 opacity-60" />

      {/* The 3D stack. Decorative: everything it says is in the legend. */}
      <div aria-hidden="true" className="ui-scene">
        <div className="ui-stage">
          {LAYERS.map((layer, i) => (
            <div
              key={layer.id}
              className="ui-layer"
              data-mode={layer.id}
              data-dim={active !== null && active !== i}
              data-lit={active === i}
              style={{ "--i": i }}
            >
              <span className="ui-layer-tag">
                {String(i).padStart(2, "0")} {layer.title}
              </span>
              <Screen mode={layer.id} />
            </div>
          ))}
        </div>

        <span className="ui-hint label-mono">Drag to rotate</span>
      </div>

      {/* The legend: the description of every layer, always readable. */}
      <div className="ui-legend" data-no-drag>
        <p className="ui-legend-kicker label-mono">05 layers</p>
        <h3 className="ui-legend-title">How I build a UI</h3>

        <ol className="ui-legend-list" onPointerLeave={() => setActive(null)}>
          {LAYERS.map((layer, i) => (
            <li key={layer.id}>
              <button
                type="button"
                data-cursor="link"
                aria-pressed={active === i}
                className="ui-legend-item"
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") setActive(i);
                }}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                onClick={() => {
                  // Tap: single the layer out and keep the stack open;
                  // tap the same one again to let go.
                  if (active === i && pinned) {
                    setActive(null);
                    setPinned(false);
                  } else {
                    setActive(i);
                    setPinned(true);
                  }
                }}
              >
                <span className="ui-legend-num">{String(i).padStart(2, "0")}</span>
                <span className="ui-legend-text">
                  <span className="ui-legend-name">{layer.title}</span>
                  <span className="ui-legend-body">{layer.body}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>

        {/* Screen-reader confirmation of what is singled out. */}
        <span className="sr-only" aria-live="polite">
          {activeLayer ? `Showing the ${activeLayer.title} layer.` : ""}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */

/**
 * The app screen, in one of five modes. The block sequence is identical in
 * every mode — bar, tabs, card, three list rows — so the planes line up.
 * What each block *shows* is the layer's concern: its tag, its grid
 * position, its surface, its content, or its state.
 */
function Screen({ mode }) {
  const M = mode;
  return (
    <div className="ui-screen">
      {M === "layout" && <span className="ui-grid-cols" />}
      {M === "structure" && <Tag>{"<main>"}</Tag>}

      {/* Bar */}
      <div className="ui-blk ui-blk-bar">
        {M === "structure" && <Tag>{"<header>"}</Tag>}
        {M === "layout" && <Gap>16</Gap>}
        {M === "components" && (
          <>
            <span className="ui-back" />
            <span className="ui-title">Projects</span>
            <span className="ui-avatar" />
          </>
        )}
      </div>

      {/* Tabs */}
      <div className="ui-blk ui-blk-tabs">
        {M === "structure" && <Tag>{"<nav>"}</Tag>}
        {M === "layout" && <Gap>8</Gap>}
        {M === "components" && (
          <>
            <span className="ui-tab" data-on="true">
              Active
            </span>
            <span className="ui-tab">Archived</span>
          </>
        )}
      </div>

      {/* Card */}
      <div className="ui-blk ui-blk-card">
        {M === "structure" && (
          <>
            <Tag>{"<article>"}</Tag>
            <span className="ui-wire ui-wire-h2">
              <Tag>{"<h2>"}</Tag>
            </span>
            <span className="ui-wire ui-wire-p" />
            <span className="ui-wire ui-wire-btn">
              <Tag>{"<button>"}</Tag>
            </span>
          </>
        )}
        {M === "layout" && <Gap>24</Gap>}
        {M === "tokens" && (
          <span className="ui-token-strip">
            <span className="ui-token-dot" style={{ background: "var(--accent)" }} />
            <span className="ui-token-dot" style={{ background: "var(--surface-3)" }} />
            <span className="ui-token-dot" style={{ background: "var(--text)" }} />
            <span className="ui-token-type">Aa</span>
            <span className="ui-token-mono">16 / 13 / 11</span>
            <span className="ui-token-radius" />
          </span>
        )}
        {M === "components" && (
          <>
            <span className="ui-card-title">Design system</span>
            <span className="ui-card-text">
              Tokens, components and patterns for the product suite.
            </span>
            <span className="ui-btn">Open</span>
          </>
        )}
        {M === "states" && (
          <>
            <span className="ui-focus" />
            <span className="ui-tooltip">Opens in this tab</span>
            <span className="ui-cursor" />
          </>
        )}
      </div>

      {/* Rows */}
      {["Buttons", "Forms", "Navigation"].map((name, i) => (
        <div key={name} className="ui-blk ui-blk-row" data-row={i}>
          {M === "structure" && <Tag>{i === 0 ? "<ul> <li>" : "<li>"}</Tag>}
          {M === "layout" && i === 0 && <Gap>12</Gap>}
          {M === "components" && (
            <>
              <span className="ui-row-icon" />
              <span className="ui-row-text">
                <span className="ui-row-name">{name}</span>
                <span className="ui-row-sub">Component set</span>
              </span>
              <span className="ui-toggle" data-on={i !== 1} />
            </>
          )}
          {M === "states" && i === 1 && <span className="ui-hover" />}
          {M === "states" && i === 2 && <span className="ui-skeleton" />}
        </div>
      ))}
    </div>
  );
}

function Tag({ children }) {
  return <span className="ui-tag">{children}</span>;
}

/* A spacing-scale label sitting on the block's top edge. */
function Gap({ children }) {
  return <span className="ui-gap">{children}</span>;
}
