"use client";

import { LazyMotion, domAnimation, MotionConfig } from "framer-motion";

/**
 * Animation runtime for the whole site.
 *
 * `LazyMotion` + `domAnimation` loads only the DOM animation feature set
 * instead of framer-motion's full bundle — roughly half the JavaScript. The
 * tradeoff is that components must use `m.*` rather than `motion.*`;
 * `strict` turns that into a build-time error instead of a silent regression.
 *
 * `MotionConfig reducedMotion="user"` makes every animation in the tree honour
 * the OS preference automatically, on top of the CSS floor in globals.css.
 *
 * This is a client component that takes `children`, so the server components
 * it wraps are still rendered on the server and streamed through it.
 */
export function MotionProvider({ children }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
