"use client";

import { useEffect, useRef } from "react";

const DURATION = 1400;

/**
 * A figure that counts up from zero the first time it scrolls into view.
 *
 * The server renders the real value, and it stays the real value unless the
 * figure is below the fold at hydration — nothing a reader can already see is
 * ever reset to zero, and with JavaScript off it is simply the number. Only the
 * leading digits animate ("15,200", "2 wk"); anything that does not start with
 * a number is left alone.
 *
 * The animated text is `aria-hidden` with the real value beside it for screen
 * readers, so nobody hears "1,204… 3,977… 15,200". It writes the text node
 * directly rather than through state: sixty re-renders a second for a counter
 * is work React does not need to do.
 */
export function CountUp({ value, className }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    const match = /^([\d,]+)(.*)$/.exec(value);
    if (!node || !match) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (node.getBoundingClientRect().top < window.innerHeight) return;

    const target = Number(match[1].replace(/,/g, ""));
    const suffix = match[2];
    const format = (n) => n.toLocaleString("en-US") + suffix;

    let frame = 0;
    node.textContent = format(0);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - start) / DURATION);
          node.textContent = format(Math.round(target * (1 - Math.pow(1 - t, 4))));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      node.textContent = value;
    };
  }, [value]);

  return (
    <>
      <span ref={ref} aria-hidden="true" className={className}>
        {value}
      </span>
      <span className="sr-only">{value}</span>
    </>
  );
}
