/**
 * Scroll reveal.
 *
 * Deliberately restrained: 12px of travel over 320ms, fired once. Anything
 * larger reads as a page that is fighting the user's scroll.
 *
 * ---------------------------------------------------------------------------
 * Why this is markup and not an animation library
 * ---------------------------------------------------------------------------
 *
 * This was a framer-motion component per element, and on a phone it was the
 * most expensive thing the site did. Measured on a 4x-throttled mobile profile
 * against the production build: the work section scrolled at 45fps and the
 * hero at 23fps; with the JS animations removed both held 58-60fps with no
 * dropped frames. Nothing else moved the number — not the images, not the
 * oversized ghost numerals, not the drifting background washes.
 *
 * The cause was volume rather than any one animation. A single project row
 * mounts seven of these and the page mounts hundreds; each was a client
 * component with its own observer and its own per-frame JavaScript writing
 * styles on the main thread — the thread the browser also needs for scrolling.
 *
 * What replaces it costs nothing per element. These are plain server
 * components now: no hooks, no client bundle, no hydration. They render an
 * element with `data-reveal`, the stylesheet hides it and declares the
 * transition, and one global observer (RevealRuntime) shows it. The
 * compositor runs opacity and transform off the main thread, so React does no
 * work at all while the page scrolls.
 *
 * The visual result is unchanged, which is the point: the phone gets the same
 * animation the desktop gets rather than having it taken away to make the page
 * usable.
 */

const toMs = (seconds) => `${Math.round(seconds * 1000)}ms`;

export function Reveal({
  children,
  delay = 0,
  y = 12,
  x = 0,
  duration = 0.32,
  as: Tag = "div",
  className,
}) {
  return (
    <Tag
      data-reveal=""
      className={className}
      style={{
        "--reveal-y": `${y}px`,
        "--reveal-x": `${x}px`,
        "--reveal-delay": toMs(delay),
        "--reveal-dur": toMs(duration),
      }}
    >
      {children}
    </Tag>
  );
}

/**
 * Stagger container. Children rendered through <StaggerItem> animate in
 * sequence off the container's own intersection, so a grid of twelve cards
 * costs one observer entry rather than twelve.
 *
 * The container is observed but never hidden itself — only its children carry
 * `data-reveal`. Their delays are written by the runtime at the moment the
 * group is revealed, which keeps the sequence correct however many children
 * there turn out to be.
 */
export function Stagger({
  children,
  delay = 0,
  step = 0.06,
  as: Tag = "div",
  className,
}) {
  return (
    <Tag
      data-reveal-step={Math.round(step * 1000)}
      data-reveal-delay={Math.round(delay * 1000)}
      className={className}
    >
      {children}
    </Tag>
  );
}

/** Child of <Stagger>. Its delay is written by the container on reveal. */
export function StaggerItem({ children, y = 14, as: Tag = "div", className, ...rest }) {
  return (
    <Tag
      {...rest}
      data-reveal=""
      className={className}
      style={{ "--reveal-y": `${y}px`, "--reveal-dur": "360ms" }}
    >
      {children}
    </Tag>
  );
}
