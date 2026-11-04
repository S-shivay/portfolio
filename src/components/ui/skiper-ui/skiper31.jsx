"use client";

import { useRef } from "react";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * AssembleText — Skiper UI 31 (ScrollAnimation_002, CharacterV1), adapted.
 *
 * The letters of a heading start scattered: pushed sideways in proportion to
 * their distance from the middle of the line and tipped back in 3D. As the
 * heading scrolls up into view they slide and rotate into place, and the
 * sentence assembles itself exactly as the reader arrives at it.
 *
 * Changes from the registry version:
 *
 *  - Real text. The registry split one hard-coded string into motion spans,
 *    so a screen reader heard every letter separately and the heading had no
 *    readable name. Here the sentence is one visually-hidden text node and
 *    the animated letters are `aria-hidden`.
 *  - Words stay whole. Letters are grouped per word in `nowrap` spans, so a
 *    line can only break between words — the registry's flat list of letters
 *    wrapped mid-word at any width narrower than its demo.
 *  - Driven by the heading's own entry (`start end` → `center 60%`) rather
 *    than a 210vh demo section, so it needs no extra scroll height.
 *  - Opacity joins the transform, so the scatter reads as arriving rather than
 *    as a jumble sitting on the page.
 *  - Reduced motion renders the finished sentence.
 *
 * Attribution: Skiper UI (free tier requires credit; see the site footer).
 */

export function AssembleText({
  text,
  as: Tag = "h2",
  spread = 34,
  tilt = 42,
  className,
  ...props
}) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center 60%"],
  });

  const chars = [...text];
  const centre = (chars.length - 1) / 2;

  /* Index of every letter in the whole string, carried through the word
     grouping so the spread is measured across the full line. */
  const parts = text.split(" ");
  const words = parts.map((word, w) => ({
    word,
    start: parts.slice(0, w).reduce((sum, part) => sum + part.length + 1, 0),
  }));

  return (
    <Tag ref={ref} className={className} {...props}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map(({ word, start }, w) => (
          /* `perspective` acts on direct children only, so it sits on each
             word — the parent of the letters that tip in 3D. */
          <span key={w} className="inline-block whitespace-nowrap [perspective:600px]">
            {[...word].map((char, i) => (
              <Char
                key={i}
                char={char}
                distance={start + i - centre}
                progress={scrollYProgress}
                spread={spread}
                tilt={tilt}
                still={reduceMotion}
              />
            ))}
            {w < words.length - 1 && <span className="inline-block">&nbsp;</span>}
          </span>
        ))}
      </span>
    </Tag>
  );
}

function Char({ char, distance, progress, spread, tilt, still }) {
  const x = useTransform(progress, [0, 1], [distance * spread, 0]);
  const rotateX = useTransform(progress, [0, 1], [Math.abs(distance) * tilt * 0.12 + tilt, 0]);
  const opacity = useTransform(progress, [0, 0.6], [0.15, 1]);

  return (
    <m.span
      className="inline-block will-change-transform"
      style={still ? undefined : { x, rotateX, opacity }}
    >
      {char}
    </m.span>
  );
}
